import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { imagetools } from "vite-imagetools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    imagetools({
      defaultDirectives: () =>
        new URLSearchParams("w=400;800;1200&format=avif;webp;png"),
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules/react-dom")) return "vendor";
          if (id.includes("node_modules/react/")) return "vendor";
          if (id.includes("node_modules/@tanstack/")) return "router";
          if (id.includes("node_modules/katex/")) return "katex";
          if (
            id.includes("node_modules/react-syntax-highlighter/") ||
            id.includes("node_modules/refractor/") ||
            id.includes("node_modules/prismjs/")
          )
            return "syntax-highlighter";
        },
      },
    },
  },
});
