import { createLazyFileRoute } from "@tanstack/react-router";
import PracticeTopic, { PracticeTopicPending } from "../pages/PracticeTopic";

export const Route = createLazyFileRoute("/$lang/$subjectId_/practice_/$topic")(
	{
		component: PracticeTopic,
		pendingComponent: PracticeTopicPending,
	},
);
