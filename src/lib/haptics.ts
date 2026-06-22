import { useWebHaptics } from "web-haptics/react";
import { useCallback } from "react";

export function useHaptics() {
  const { trigger } = useWebHaptics();

  const triggerLight = useCallback(() => trigger("light"), [trigger]);
  const triggerMedium = useCallback(() => trigger("medium"), [trigger]);
  const triggerSuccess = useCallback(() => trigger("success"), [trigger]);
  const triggerError = useCallback(() => trigger("error"), [trigger]);
  const triggerSelection = useCallback(() => trigger("selection"), [trigger]);

  return {
    triggerLight,
    triggerMedium,
    triggerSuccess,
    triggerError,
    triggerSelection,
  };
}
