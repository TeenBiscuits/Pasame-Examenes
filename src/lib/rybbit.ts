type RybbitValue = string | number | boolean | undefined | null;
type RybbitData = Record<string, RybbitValue>;
type RybbitCleanData = Record<string, string | number | boolean>;

function clean(data?: RybbitData): RybbitCleanData | undefined {
  if (!data) return undefined;
  const out: RybbitCleanData = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function safeRun(fn: () => void) {
  if (typeof window === "undefined" || !window.rybbit) return;
  try {
    fn();
  } catch {
    /* analytics must never break app interactions */
  }
}

export function track(eventName: string, eventData?: RybbitData): void {
  const cleaned = clean(eventData);
  safeRun(() => window.rybbit!.event(eventName, cleaned));
}

export function identify(data: RybbitData & { id?: string }): void {
  const { id, ...traits } = data;
  const cleaned = clean(traits);
  const userId = id ?? "";
  if (!userId) return;
  safeRun(() => window.rybbit!.identify(userId, cleaned));
}

export function setSessionData(data: RybbitData): void {
  const cleaned = clean(data);
  if (!cleaned) return;
  safeRun(() => window.rybbit!.setTraits(cleaned));
}

const RYBBIT_UID_KEY = "rybbit_uid";

export function getDistinctId(): string {
  if (typeof localStorage === "undefined") return "";
  let id: string;
  try {
    id = localStorage.getItem(RYBBIT_UID_KEY) || "";
  } catch {
    return "";
  }
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      localStorage.setItem(RYBBIT_UID_KEY, id);
    } catch {
      /* localStorage unavailable */
    }
  }
  return id;
}
