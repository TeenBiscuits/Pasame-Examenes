import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { setEnabled } from "cuelume";
import { SoundContext } from "./context-value";

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("soundEnabled");
      return stored !== "false"; // default to true
    } catch {
      return true;
    }
  });

  useEffect(() => {
    setEnabled(soundEnabled);
    try {
      localStorage.setItem("soundEnabled", String(soundEnabled));
    } catch {
      /* localStorage unavailable */
    }
  }, [soundEnabled]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ soundEnabled, setSoundEnabled, toggleSound }),
    [soundEnabled, setSoundEnabled, toggleSound],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}
