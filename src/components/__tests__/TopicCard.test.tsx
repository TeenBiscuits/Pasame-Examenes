import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "../../i18n/context";
import TopicCard from "../TopicCard";

const topic = {
  key: "neural-networks",
  label: "Neural Networks",
  icon: "🧠",
  color: "blue",
};

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter initialEntries={["/en"]}>
      <I18nProvider>{ui}</I18nProvider>
    </MemoryRouter>,
  );
}

describe("TopicCard", () => {
  it("renders topic label", () => {
    renderWithProviders(
      <TopicCard
        subjectId="ml"
        topic={topic}
        questionCount={10}
        pointsCount={50}
      />,
    );
    expect(screen.getByText("Neural Networks")).toBeTruthy();
  });

  it("renders icon", () => {
    renderWithProviders(
      <TopicCard
        subjectId="ml"
        topic={topic}
        questionCount={10}
        pointsCount={50}
      />,
    );
    expect(screen.getByText("🧠")).toBeTruthy();
  });

  it("renders question and points count", () => {
    renderWithProviders(
      <TopicCard
        subjectId="ml"
        topic={topic}
        questionCount={10}
        pointsCount={50}
      />,
    );
    const text = screen.getByText(/10.*questions.*50.*points/);
    expect(text).toBeTruthy();
  });

  it("links to correct practice path", () => {
    renderWithProviders(
      <TopicCard
        subjectId="ml"
        topic={topic}
        questionCount={5}
        pointsCount={20}
      />,
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/en/ml/practice/neural-networks");
  });

  it("renders progress bar when progress is provided", () => {
    renderWithProviders(
      <TopicCard
        subjectId="ml"
        topic={topic}
        questionCount={10}
        pointsCount={50}
        progress={60}
      />,
    );
    // Progress bar should exist
    const progressBar = document.querySelector(".bg-accent");
    expect(progressBar).toBeTruthy();
  });

  it("does not render progress bar when progress is undefined", () => {
    renderWithProviders(
      <TopicCard
        subjectId="ml"
        topic={{ ...topic, color: "red" }}
        questionCount={10}
        pointsCount={50}
      />,
    );
    // No progress bar
    const progressBar = document.querySelector(".bg-accent");
    expect(progressBar).toBeNull();
  });

  it("uses fallback color class for unknown color", () => {
    renderWithProviders(
      <TopicCard
        subjectId="ml"
        topic={{ ...topic, color: "unknown" }}
        questionCount={10}
        pointsCount={50}
      />,
    );
    const link = screen.getByRole("link");
    // Should fall back to blue classes
    expect(link.className).toContain("border-t-blue-border");
  });

  it("applies matching color class", () => {
    renderWithProviders(
      <TopicCard
        subjectId="ml"
        topic={{ ...topic, color: "green" }}
        questionCount={10}
        pointsCount={50}
      />,
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("border-t-green-border");
  });
});
