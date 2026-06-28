import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [
    imagetools({
      defaultDirectives: () =>
        new URLSearchParams("w=400;800;1200&format=avif;webp;png"),
    }),
    tailwindcss(),
    reactRouter(),
  ],
  define: {
    __VERCEL_PRODUCTION__: JSON.stringify(
      process.env.VERCEL_ENV === "production",
    ),
  },
});
