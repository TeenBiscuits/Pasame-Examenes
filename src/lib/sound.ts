import { play } from "cuelume";

export function playSound(name?: Parameters<typeof play>[0]) {
  play(name);
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
