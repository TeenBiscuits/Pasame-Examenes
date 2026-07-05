import type { Lang } from "../i18n/context";

function buildLangPath(lang: Lang, path: string): string {
  if (path === "/") return `/${lang}`;
  return `/${lang}${path}`;
}

export function replaceLangInPath(pathname: string, newLang: Lang): string {
  const langPattern = /^\/(en|es|gl)(\/|$)/;
  const match = pathname.match(langPattern);
  if (match) {
    const rest = pathname.slice(match[0].length - (match[2] === "/" ? 1 : 0));
    return buildLangPath(newLang, rest || "/");
  }
  return buildLangPath(newLang, pathname === "/" ? "/" : pathname);
}
