import { en, type Translations } from "../i18n/en";
import { es } from "../i18n/es";
import { gl } from "../i18n/gl";

export const languages = ["en", "es", "gl"] as const;
export type Lang = (typeof languages)[number];

const translations: Record<Lang, Translations> = { en, es, gl };

export function isLang(value: string | undefined): value is Lang {
  return languages.some((lang) => lang === value);
}

export function getTranslations(lang: Lang): Translations {
  return translations[lang];
}

export function langPath(lang: Lang, path = "/"): string {
  const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${suffix}`;
}
