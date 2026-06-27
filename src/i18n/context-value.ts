import { createContext } from "react";
import { en, type Translations } from "./en";

export type Lang = "en" | "es" | "gl";

export interface I18nContextType {
  t: Translations;
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const I18nContext = createContext<I18nContextType>({
  t: en,
  lang: "en",
  setLang: () => {},
});
