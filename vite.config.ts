import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { imagetools } from "vite-imagetools";
import metaMapPlugin from "vite-plugin-react-meta-map";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    imagetools({
      defaultDirectives: () =>
        new URLSearchParams("w=400;800;1200&format=avif;webp;png"),
    }),
    metaMapPlugin({
      pageMetaMapFilePath: "./src/seo/pageMetaMap.generated.ts",
      pageTemplateFilePath: "./src/seo/PageTemplate.tsx",
    }),
  ],
  define: {
    __VERCEL_PRODUCTION__: JSON.stringify(
      process.env.VERCEL_ENV === "production",
    ),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules/react-dom")) return "vendor";
          if (id.includes("node_modules/react/")) return "vendor";
          if (id.includes("node_modules/react-router-dom")) return "router";
          if (id.includes("node_modules/react-router/")) return "router";
        },
      },
    },
  },
});
