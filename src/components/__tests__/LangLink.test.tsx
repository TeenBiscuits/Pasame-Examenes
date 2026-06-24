import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "../../i18n/context";
import { LangLink } from "../../lib/lang-link";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter initialEntries={["/en"]}>
      <I18nProvider>{ui}</I18nProvider>
    </MemoryRouter>,
  );
}

describe("LangLink", () => {
  it("renders a link with lang-prefixed href", () => {
    renderWithProviders(<LangLink to="/test">Click</LangLink>);
    const link = screen.getByText("Click");
    expect(link.getAttribute("href")).toBe("/en/test");
  });

  it("renders with custom className", () => {
    renderWithProviders(
      <LangLink to="/path" className="my-class">
        Link
      </LangLink>,
    );
    const link = screen.getByText("Link");
    expect(link.className).toContain("my-class");
  });
});
