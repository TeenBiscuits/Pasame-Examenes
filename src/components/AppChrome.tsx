import { useNavigate } from "@tanstack/react-router";
import { bind as bindCuelume } from "cuelume";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useT } from "../i18n/hooks";
import {
	KeyboardCommandProvider,
	useCommandHandlers,
} from "../lib/keyboard-commands";
import { initializeSound } from "../lib/sound";
import { track } from "../lib/umami";
import { useLangTo } from "../lib/useLangTo";
import { useTheme } from "../theme/hooks";
import AppUpdateToast from "./AppUpdateToast";
import Footer from "./Footer";
import Header from "./Header";
import SessionTracker from "./SessionTracker";
import StarPopup from "./StarPopup";

export default function AppChrome({ children }: { children: ReactNode }) {
	const t = useT();

	useEffect(() => {
		bindCuelume();
		initializeSound();
	}, []);

	return (
		<KeyboardCommandProvider>
			<GlobalCommandHandlers />
			<div className="bg-surface text-fg flex min-h-screen min-h-svh min-h-dvh flex-col font-sans">
				<SessionTracker />
				<a
					href="#main-content"
					className="focus-visible:ring-accent sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-fg focus-visible:ring-2 focus-visible:outline-none"
				>
					{t.header.skipToContent}
				</a>
				<Header />
				<main id="main-content" tabIndex={-1} className="flex-grow">
					{children}
				</main>
				<Footer />
				<AppUpdateToast />
				<StarPopup />
			</div>
		</KeyboardCommandProvider>
	);
}

function GlobalCommandHandlers() {
	const navigate = useNavigate();
	const langTo = useLangTo();
	const { cycleTheme } = useTheme();

	useCommandHandlers("global", {
		"go-home": () => {
			track("keyboard_command", { commandId: "go-home" });
			void navigate({ to: langTo("/") as never, replace: true });
		},
		"cycle-theme": () => {
			cycleTheme();
			track("keyboard_command", { commandId: "cycle-theme" });
		},
	});

	return null;
}
