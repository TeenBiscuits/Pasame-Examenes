import { use } from "react";
import { ThemeContext } from "./context";

export function useTheme() {
  return use(ThemeContext);
}
