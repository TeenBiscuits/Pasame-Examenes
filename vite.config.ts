import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { imagetools } from "vite-imagetools";

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    tailwindcss(),
    imagetools({
      defaultDirectives: () =>
        new URLSearchParams("w=400;800;1200&format=avif;webp;png"),
    }),
  ],
  define: {
    __VERCEL_PRODUCTION__: JSON.stringify(
      process.env.VERCEL_ENV === "production",
    ),
  },
  build: {
    rollupOptions: {
      input: isSsrBuild ? "src/entry-server.tsx" : undefined,
      output: isSsrBuild
        ? undefined
        : {
            manualChunks(id: string) {
              if (id.includes("node_modules/react-dom")) return "vendor";
              if (id.includes("node_modules/react/")) return "vendor";
              if (id.includes("node_modules/react-router-dom"))
                return "router";
              if (id.includes("node_modules/react-router/")) return "router";
            },
          },
    },
  },
}));
