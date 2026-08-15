import { use } from "react";
import { ThemeContext } from "./context-value";

export function useTheme() {
  return use(ThemeContext);
}
