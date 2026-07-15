import { createContext } from "react";

export interface SoundContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
}

export const SoundContext = createContext<SoundContextType | null>(null);
