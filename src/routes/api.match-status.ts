import { createFileRoute } from "@tanstack/react-router";

const BLOCKED_LIST_URL = "https://hayahora.futbol/estado/blocked-any.txt";
const UPSTREAM_TIMEOUT_MS = 5000;

function hasBlockedEntries(content: string): boolean {
	return content.split(/\r?\n/).some((line) => line.trim().length > 0);
}

export const Route = createFileRoute("/api/match-status")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const response = await fetch(BLOCKED_LIST_URL, {
						cache: "no-store",
						headers: { Accept: "text/plain" },
						signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
					});
					if (!response.ok) throw new Error(`HTTP ${response.status}`);

					return Response.json(
						{ blocked: hasBlockedEntries(await response.text()) },
						{
							headers: { "Cache-Control": "no-store" },
						},
					);
				} catch {
					return new Response(null, {
						status: 502,
						headers: { "Cache-Control": "no-store" },
					});
				}
			},
		},
	},
});
