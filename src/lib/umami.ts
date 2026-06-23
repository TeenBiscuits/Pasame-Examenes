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
        idOrData: string | Record<string, string | number | boolean>,
        data?: Record<string, string | number | boolean>,
      ) => void;
    };
  }
}

export function trackPageView() {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track();
  }
}

export function track(
  eventName: string,
  eventData?: Record<string, string | number | boolean>,
) {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track(eventName, eventData);
  }
}

export function identify(
  data: Record<string, string | number | boolean>,
) {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.identify(data);
  }
}
