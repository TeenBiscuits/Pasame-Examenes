#!/usr/bin/env python3
"""
Scrape a daypo.com test and export questions + correct answers as Markdown.

Usage:
    uv run daypo_scraper.py <url> [--output FILE] [--lang es|en]

Examples:
    uv run daypo_scraper.py https://www.daypo.com/xp-practica.html
    uv run daypo_scraper.py https://www.daypo.com/xp-teoria.html -o teoria.md
"""

import argparse
import http.cookiejar
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET


LABELS = {
    "es": {"question": "Pregunta", "explanation": "Explicación"},
    "en": {"question": "Question", "explanation": "Explanation"},
}


def extract_ntest(html: str) -> int | None:
    """Extract the test ID (ntest) from a daypo page."""
    m = re.search(r"ntest\s*=\s*(\d+)", html)
    return int(m.group(1)) if m else None


def fetch_xml(ntest: int, referer: str) -> bytes:
    """POST to the daypo API and return the test XML."""
    cookie_jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(cookie_jar)
    )

    # First request the page to get cookies
    req = urllib.request.Request(
        referer,
        headers={"User-Agent": "Mozilla/5.0"},
    )
    with opener.open(req) as _:
        pass

    # Then hit the API
    data = f"tes={ntest}".encode()
    req = urllib.request.Request(
        "https://www.daypo.com/asps/load.php",
        data=data,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Referer": referer,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    with opener.open(req) as resp:
        return resp.read()


def parse_correct_index(code: str) -> int:
    """Each digit maps to an option: '1' = wrong, '2' = correct."""
    for i, digit in enumerate(code):
        if digit == "2":
            return i
    return -1


def xml_to_markdown(xml_bytes: bytes, labels: dict) -> str:
    """Convert daypo test XML to Markdown."""
    root = ET.fromstring(xml_bytes)

    # Header info
    info = root.find("p")
    title = ""
    desc = ""
    author = ""
    if info is not None:
        t = info.find("t")
        d = info.find("d")
        a = info.find("a")
        if t is not None and t.text:
            title = t.text
        if d is not None and d.text:
            desc = d.text
        if a is not None and a.text:
            author = a.text

    lines = [f"# {title}", ""]
    if desc:
        lines.append(f"**Descripción:** {desc}")
        lines.append("")
    if author:
        lines.append(f"**Autor:** {author}")
        lines.append("")

    # Questions
    outer_c = root.find("c")
    if outer_c is None:
        return "\n".join(lines) + "\n*No se encontraron preguntas.*\n"

    questions = outer_c.findall("c")
    lines.append(f"**Número de preguntas:** {len(questions)}")
    lines.append("")
    lines.append("---")
    lines.append("")

    q_label = labels["question"]
    h_label = labels["explanation"]

    for idx, q in enumerate(questions, 1):
        qtext_elem = q.find("p")
        qtype_elem = q.find("t")
        code_elem = q.find("c")
        hint_elem = q.find("h")
        opts_elem = q.find("r")

        qtext = (
            qtext_elem.text.strip()
            if qtext_elem is not None and qtext_elem.text
            else ""
        )
        qtype = (
            qtype_elem.text.strip()
            if qtype_elem is not None and qtype_elem.text
            else "0"
        )
        code = (
            code_elem.text.strip()
            if code_elem is not None and code_elem.text
            else ""
        )
        hint = (
            hint_elem.text.strip()
            if hint_elem is not None and hint_elem.text
            else ""
        )

        lines.append(f"### {q_label} {idx}")
        lines.append("")
        lines.append(qtext)
        lines.append("")

        correct_idx = parse_correct_index(code)

        if opts_elem is not None:
            options = opts_elem.findall("o")
            for oi, opt in enumerate(options):
                opt_text = opt.text.strip() if opt.text else ""
                mark = "✅" if oi == correct_idx else "❌"
                lines.append(f"- {mark} **{chr(65 + oi)}.** {opt_text}")
        elif qtype == "1":
            # True/false fallback
            lines.append(
                f"- {'✅' if correct_idx == 0 else '❌'} **A.** Verdadero"
            )
            lines.append(
                f"- {'✅' if correct_idx == 1 else '❌'} **B.** Falso"
            )

        lines.append("")

        if hint:
            lines.append(f"> 💡 **{h_label}:** {hint}")
            lines.append("")

        lines.append("---")
        lines.append("")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="Scrapea un test de daypo.com y genera un archivo Markdown "
        "con preguntas y respuestas correctas."
    )
    parser.add_argument("url", help="URL del test en daypo.com")
    parser.add_argument(
        "-o", "--output", help="Archivo de salida (por defecto se infiere del título)"
    )
    parser.add_argument(
        "--lang",
        choices=["es", "en"],
        default="es",
        help="Idioma de las etiquetas (default: es)",
    )
    args = parser.parse_args()

    url = args.url.rstrip("/")
    labels = LABELS[args.lang]

    print(f"Obteniendo página: {url}")
    req = urllib.request.Request(
        url, headers={"User-Agent": "Mozilla/5.0"}
    )
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8", errors="replace")

    ntest = extract_ntest(html)
    if ntest is None:
        print("Error: no se pudo extraer el ID del test de la página.", file=sys.stderr)
        sys.exit(1)

    print(f"Descargando datos del test (ID: {ntest})...")
    xml_bytes = fetch_xml(ntest, url)

    print("Generando Markdown...")
    md = xml_to_markdown(xml_bytes, labels)

    # Determine output filename
    if args.output:
        out_path = args.output
    else:
        # Infer from URL
        slug = url.rstrip(".html").split("/")[-1]
        if not slug:
            slug = f"daypo-{ntest}"
        out_path = f"{slug}.md"

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(md)

    root = ET.fromstring(xml_bytes)
    outer_c = root.find("c")
    n = len(outer_c.findall("c")) if outer_c is not None else 0

    print(f"Listo. {n} preguntas exportadas a: {os.path.abspath(out_path)}")


if __name__ == "__main__":
    main()
