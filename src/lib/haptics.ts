import { WebHaptics } from "web-haptics";

const haptics = new WebHaptics({ debug: true });

export function triggerLight() {
  haptics.trigger("light");
}

export function triggerMedium() {
  haptics.trigger("medium");
}

export function triggerSuccess() {
  haptics.trigger("success");
}

export function triggerError() {
  haptics.trigger("error");
}

export function triggerSelection() {
  haptics.trigger("selection");
}
