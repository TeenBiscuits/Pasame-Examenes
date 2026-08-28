import { createLazyFileRoute } from "@tanstack/react-router";
import ExamSimulation, { ExamSimulationPending } from "../pages/ExamSimulation";

export const Route = createLazyFileRoute("/$lang/$subjectId_/exam/$examId")({
	component: ExamSimulation,
	pendingComponent: ExamSimulationPending,
});
