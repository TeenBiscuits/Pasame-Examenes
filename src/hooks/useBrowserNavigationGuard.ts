import { useEffect } from "react";

const GUARD_KEY = "__studyNavigationGuard";
const SENTINEL_KEY = "__studyNavigationSentinel";

export function useBrowserNavigationGuard(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let removeListeners = () => {};
    const setupTimer = window.setTimeout(() => {
      const guardId = crypto.randomUUID();
      const originalState = window.history.state ?? {};

      window.history.replaceState(
        { ...originalState, [GUARD_KEY]: guardId },
        "",
      );
      window.history.pushState(
        { ...originalState, [SENTINEL_KEY]: guardId },
        "",
      );

      const handlePopState = (event: PopStateEvent) => {
        if (event.state?.[GUARD_KEY] === guardId) return;

        if (event.state?.[SENTINEL_KEY] === guardId) {
          window.history.back();
        } else {
          window.history.forward();
        }
      };

      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = "";
      };

      window.addEventListener("popstate", handlePopState);
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.history.back();

      removeListeners = () => {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, 0);

    return () => {
      window.clearTimeout(setupTimer);
      removeListeners();
    };
  }, [enabled]);
}
