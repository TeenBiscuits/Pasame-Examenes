// There is and issue with this library, Apple has fixed the trick that it used to produce haptics, i will leave it
// here but if you detect that it's not working it's not my fault
// https://github.com/lochie/web-haptics/issues/41

import { WebHaptics } from "web-haptics";

const haptics = new WebHaptics();

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
