import { createFileRoute } from "@tanstack/react-router";
import PracticeTopic from "../pages/PracticeTopic";

export const Route = createFileRoute("/$lang/$subjectId_/practice_/$topic")({
  component: PracticeTopic,
});
