import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{$INDEXNOW_KEY}.txt")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				const configuredKey = process.env.INDEXNOW_KEY?.trim();
				const requestedKey = params.INDEXNOW_KEY;

				if (!configuredKey || requestedKey !== configuredKey) {
					return new Response("Not Found", {
						status: 404,
						headers: { "Content-Type": "text/plain; charset=utf-8" },
					});
				}

				return new Response(configuredKey, {
					headers: {
						"Cache-Control": "public, max-age=300",
						"Content-Type": "text/plain; charset=utf-8",
					},
				});
			},
		},
	},
});
