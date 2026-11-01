import { APP_VERSION } from "./version";

// A production Vite build can also be a Vercel preview or a local build.
export const ERROR_TRACKING_ENABLED =
	import.meta.env.PROD && import.meta.env.VERCEL_ENV === "production";

export const ERROR_TRACKING_ENVIRONMENT =
	import.meta.env.VERCEL_ENV || import.meta.env.MODE;

export const ERROR_TRACKING_RELEASE = APP_VERSION;
