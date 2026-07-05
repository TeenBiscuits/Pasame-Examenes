import { useEffect } from "react";
import { useLang } from "../i18n/hooks";
import type { Lang } from "../i18n/context";

const langMeta: Record<
  Lang,
  { locale: string; hreflang: string; alternateLocales: Lang[] }
> = {
  en: { locale: "en_US", hreflang: "en", alternateLocales: ["es", "gl"] },
  es: { locale: "es_ES", hreflang: "es", alternateLocales: ["en", "gl"] },
  gl: { locale: "gl_ES", hreflang: "gl", alternateLocales: ["en", "es"] },
};


export interface SeoPageMeta {
  title: string;
  description: string;
  pathWithoutLang: string;
  ogImage?: string;
}

export function useSeoHead(_meta: SeoPageMeta) {
  void _meta;
  const { lang } = useLang();
  const meta = langMeta[lang];

  useEffect(() => {
    document.documentElement.lang = meta.hreflang;
  }, [meta]);
}
