/* eslint-disable react-refresh/only-export-components */
import { useCallback } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { useLang } from "../i18n/hooks";
import type { Lang } from "../i18n/context";

export function useLangTo() {
  const { lang } = useLang();
  return useCallback(
    (path: string) => {
      if (path === "/") return `/${lang}`;
      return `/${lang}${path}`;
    },
    [lang],
  );
}

export function buildLangPath(lang: Lang, path: string): string {
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

export function LangLink(props: LinkProps) {
  const { lang } = useLang();
  const to = typeof props.to === "string" ? `/${lang}${props.to}` : props.to;
  return <Link {...props} to={to} />;
}
