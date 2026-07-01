declare global {
  interface Window {
    umami?: {
      track(): void;
      track(payload: Record<string, unknown>): void;
      track(eventName: string): void;
      track(
        eventName: string,
        eventData?: Record<string, string | number | boolean>,
      ): void;
      identify: (
        idOrData:
          | string
          | (Record<string, string | number | boolean | undefined | null> & {
              id?: string;
            }),
        data?: Record<string, string | number | boolean>,
      ) => void;
      setSessionData?: (
        data: Record<string, string | number | boolean>,
      ) => void;
    };
  }
}

type UmamiValue = string | number | boolean | undefined | null;
type UmamiData = Record<string, UmamiValue>;
type UmamiCleanData = Record<string, string | number | boolean>;

function clean(data?: UmamiData): UmamiCleanData | undefined {
  if (!data) return undefined;
  const out: UmamiCleanData = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function safeRun(fn: () => void) {
  if (typeof window === "undefined" || !window.umami) return;
  try {
    fn();
  } catch {
    /* analytics must never break app interactions */
  }
}

export function track(eventName: string, eventData?: UmamiData): void {
  const cleaned = clean(eventData);
  safeRun(() => window.umami!.track(eventName, cleaned));
}

export function identify(data: UmamiData & { id?: string }): void {
  safeRun(() => window.umami!.identify(clean(data) as UmamiCleanData & { id?: string }));
}

export function setSessionData(data: UmamiData): void {
  const cleaned = clean(data);
  if (!cleaned) return;
  if (window.umami?.setSessionData) {
    safeRun(() => window.umami!.setSessionData!(cleaned));
  } else {
    safeRun(() => window.umami!.identify(cleaned));
  }
}

const UMAMI_UID_KEY = "umami_uid";

export function getDistinctId(): string {
  if (typeof localStorage === "undefined") return "";
  let id: string;
  try {
    id = localStorage.getItem(UMAMI_UID_KEY) || "";
  } catch {
    return "";
  }
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      localStorage.setItem(UMAMI_UID_KEY, id);
    } catch {
      /* localStorage unavailable */
    }
  }
  return id;
}