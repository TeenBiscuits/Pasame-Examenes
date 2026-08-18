import { createFileRoute } from "@tanstack/react-router";
import ExamSimulation from "../pages/ExamSimulation";

export const Route = createFileRoute("/$lang/$subjectId_/exam/$examId")({
  component: ExamSimulation,
});
