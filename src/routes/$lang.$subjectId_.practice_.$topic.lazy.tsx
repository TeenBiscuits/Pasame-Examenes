import { createLazyFileRoute } from "@tanstack/react-router";
import PracticeTopic from "../pages/PracticeTopic";

export const Route = createLazyFileRoute("/$lang/$subjectId_/practice_/$topic")(
	{
		component: PracticeTopic,
	},
);
