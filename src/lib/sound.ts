import { play, setEnabled } from "cuelume";

let enabled = true;

export function playSound(name?: Parameters<typeof play>[0]) {
  if (enabled) play(name);
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  setEnabled(on);
}

export function playSuccess() {
  playSound("success");
}

export function playError() {
  playSound("error");
}

export function playPress() {
  playSound("press");
}
