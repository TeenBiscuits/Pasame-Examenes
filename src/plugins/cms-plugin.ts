import type { Plugin } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";

interface Patches {
  meta?: Record<string, unknown>;
  questions?: Record<string, Record<string, unknown>>;
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    if (sv === undefined) continue;
    if (sv === null) {
      result[key] = null;
    } else if (
      typeof sv === "object" &&
      !Array.isArray(sv) &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key]) &&
      result[key] !== null
    ) {
      result[key] = deepMerge(
        result[key] as Record<string, unknown>,
        sv as Record<string, unknown>,
      );
    } else {
      result[key] = sv;
    }
  }
  return result;
}

function getPatchesPath(root: string, subjectId: string): string {
  return path.resolve(root, "src", "subjects", subjectId, "patches.json");
}

function getAssetsDir(root: string, subjectId: string): string {
  return path.resolve(root, "src", "subjects", subjectId, "assets");
}

async function readPatches(root: string, subjectId: string): Promise<Patches> {
  try {
    const raw = await fs.readFile(getPatchesPath(root, subjectId), "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writePatches(
  root: string,
  subjectId: string,
  patches: Patches,
): Promise<void> {
  const filePath = getPatchesPath(root, subjectId);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(patches, null, 2) + "\n", "utf-8");
}

function sendJson(res: ServerResponse, data: unknown, status = 200) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: string) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

export function cmsPlugin(): Plugin {
  return {
    name: "pasame-cms",
    apply: "serve",
    async configureServer(server) {
      const root = server.config.root;

      server.middlewares.use(
        "/api/cms",
        (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          const url = new URL(req.url ?? "/", "http://localhost");
          const pathParts = url.pathname.replace("/api/cms", "").split("/").filter(Boolean);

          if (pathParts[0] !== "patches" && pathParts[0] !== "images") {
            return next();
          }

          const subjectId = pathParts[1];
          if (!subjectId || !/^[a-z0-9-]+$/.test(subjectId)) {
            return sendJson(res, { error: "Invalid subject ID" }, 400);
          }

          void (async () => {
            try {
              if (pathParts[0] === "patches") {
                const questionId = pathParts[2];

                if (req.method === "GET") {
                  if (questionId) {
                    const patches = await readPatches(root, subjectId);
                    const qPatch = patches.questions?.[questionId] ?? {};
                    return sendJson(res, qPatch);
                  }
                  const patches = await readPatches(root, subjectId);
                  return sendJson(res, patches);
                }

                if (req.method === "PATCH") {
                  const body = await readBody(req);
                  let data: Patches;
                  try {
                    data = JSON.parse(body);
                  } catch {
                    return sendJson(res, { error: "Invalid JSON" }, 400);
                  }

                  const existing = await readPatches(root, subjectId);

                  if (questionId) {
                    const existingQ = existing.questions?.[questionId] ?? {};
                    existing.questions = {
                      ...existing.questions,
                      [questionId]: deepMerge(
                        existingQ as Record<string, unknown>,
                        data as unknown as Record<string, unknown>,
                      ) as unknown as Record<string, unknown>,
                    };
                  } else {
                    const merged = deepMerge(
                      existing as unknown as Record<string, unknown>,
                      data as unknown as Record<string, unknown>,
                    );
                    Object.assign(existing, merged);
                  }

                  await writePatches(root, subjectId, existing);
                  return sendJson(res, { ok: true });
                }

                if (req.method === "DELETE" && questionId) {
                  const existing = await readPatches(root, subjectId);
                  if (existing.questions) {
                    delete existing.questions[questionId];
                    if (Object.keys(existing.questions).length === 0) {
                      delete existing.questions;
                    }
                  }
                  await writePatches(root, subjectId, existing);
                  return sendJson(res, { ok: true });
                }
              }

              if (pathParts[0] === "images" && req.method === "GET") {
                try {
                  const assetsDir = getAssetsDir(root, subjectId);
                  const files = await fs.readdir(assetsDir);
                  const images = files.filter((f) =>
                    /\.(png|jpe?g|avif|webp|gif|svg)$/i.test(f),
                  );
                  return sendJson(res, { images });
                } catch {
                  return sendJson(res, { images: [] });
                }
              }

              return sendJson(res, { error: "Not found" }, 404);
            } catch (err) {
              console.error("[pasame-cms]", err);
              return sendJson(res, { error: "Internal error" }, 500);
            }
          })();
        },
      );
    },
  };
}
