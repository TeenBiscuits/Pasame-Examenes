import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "../../i18n/context";
import SubjectCard from "../SubjectCard";
import type { SubjectMeta } from "../../data/types";

const subject: SubjectMeta = {
  id: "machine-learning",
  name: "Machine Learning",
  university: "University of Vigo",
  courseCode: "ML101",
  icon: "🤖",
  topics: [{ key: "t1", label: "Topic 1", icon: "📌", color: "blue" }],
  exams: [
    {
      year: "2024",
      title: "2024 Exam",
      passPoints: 30,
      totalPoints: 60,
      durationMinutes: 180,
      description: "Test",
    },
  ],
};

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter initialEntries={["/en"]}>
      <I18nProvider>{ui}</I18nProvider>
    </MemoryRouter>,
  );
}

describe("SubjectCard", () => {
  it("renders subject name", () => {
    renderWithProviders(<SubjectCard subject={subject} />);
    expect(screen.getByText("Machine Learning")).toBeTruthy();
  });

  it("renders university name", () => {
    renderWithProviders(<SubjectCard subject={subject} />);
    expect(screen.getByText("University of Vigo")).toBeTruthy();
  });

  it("renders course code", () => {
    renderWithProviders(<SubjectCard subject={subject} />);
    expect(screen.getByText("ML101")).toBeTruthy();
  });

  it("renders icon", () => {
    renderWithProviders(<SubjectCard subject={subject} />);
    expect(screen.getByText("🤖")).toBeTruthy();
  });

  it("links to correct subject path", () => {
    renderWithProviders(<SubjectCard subject={subject} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/en/machine-learning");
  });

  it("shows correct topics and exams count", () => {
    renderWithProviders(<SubjectCard subject={subject} />);
    expect(screen.getByText((_, el) => el?.textContent === "1 questions")).toBeTruthy();
    expect(screen.getByText((_, el) => el?.textContent === "1 exams")).toBeTruthy();
  });
});
