import { themeSurfaceAlt } from "./types";

export const themeScript = `(function () {
  var stored;
  try {
    stored = localStorage.getItem("theme");
  } catch (_) {
    stored = null;
  }
  var theme =
    stored === "light" ||
    stored === "dark" ||
    stored === "system" ||
    stored === "princess" ||
    stored === "latte" ||
    stored === "frappe" ||
    stored === "macchiato" ||
    stored === "mocha"
      ? stored
      : "system";
  document.documentElement.setAttribute("data-theme", theme);

  var colors = ${JSON.stringify(themeSurfaceAlt)};
  var schemes = {
    light: "light",
    dark: "dark",
    princess: "light",
    latte: "light",
    frappe: "dark",
    macchiato: "dark",
    mocha: "dark"
  };
  var resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  var color = colors[resolved];
  document.documentElement.style.setProperty("--browser-chrome-color", color);
  var meta = document.getElementById("theme-color");
  if (meta) meta.setAttribute("content", color);
  var scheme = document.querySelector('meta[name="color-scheme"]');
  if (scheme) {
    scheme.setAttribute(
      "content",
      theme === "system" ? "light dark" : schemes[theme]
    );
  }
})();`;
