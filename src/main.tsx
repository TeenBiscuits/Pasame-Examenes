import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import "@fontsource-variable/onest";
import "@fontsource-variable/cascadia-code";
import "./index.css";
import { router } from "./router";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("The application root element is missing");
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
