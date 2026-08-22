import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/$subjectId_/practice")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/$lang/$subjectId",
			params,
			replace: true,
		});
	},
	component: () => null,
});
