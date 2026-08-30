import { type ReactNode, useRef, useState } from "react";
import { Gear, Keyboard, Palette, Sliders, XSquare } from "reicon-react";
import { useT } from "../i18n/hooks";
import {
	closeDialog,
	showDialog,
	useDialogClose,
	useDialogDismiss,
} from "../lib/dialog";
import { useCommandHandlers } from "../lib/keyboard-commands";
import { playSound } from "../lib/sound";
import { track } from "../lib/umami";
import { APP_VERSION } from "../lib/version";
import KeyboardShortcutsSection from "./KeyboardShortcutsSection";
import { settingsModalDialogClass } from "./Modal";
import SettingsAppearancePanel from "./SettingsAppearancePanel";
import SettingsGeneralPanel from "./SettingsGeneralPanel";

type SettingsTab = "general" | "appearance" | "shortcuts";
type TabPlacement = "desktop" | "mobile";

const GITHUB_REPOSITORY_URL = "https://github.com/TeenBiscuits/Pasame-Examenes";
const tabOrder: readonly SettingsTab[] = ["general", "appearance", "shortcuts"];

function TabButton({
	tab,
	placement,
	active,
	icon,
	label,
	onSelect,
}: {
	tab: SettingsTab;
	placement: TabPlacement;
	active: boolean;
	icon: ReactNode;
	label: string;
	onSelect: (tab: SettingsTab) => void;
}) {
	function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
		if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
		event.preventDefault();
		const currentIndex = tabOrder.indexOf(tab);
		const offset = event.key === "ArrowRight" ? 1 : -1;
		const nextTab =
			tabOrder[(currentIndex + offset + tabOrder.length) % tabOrder.length];
		if (!nextTab) return;
		onSelect(nextTab);
		requestAnimationFrame(() => {
			document.getElementById(`settings-tab-${nextTab}-${placement}`)?.focus();
		});
	}

	return (
		<button
			type="button"
			id={`settings-tab-${tab}-${placement}`}
			role="tab"
			aria-selected={active}
			aria-controls={`settings-panel-${tab}`}
			tabIndex={active ? 0 : -1}
			onClick={() => onSelect(tab)}
			onKeyDown={handleKeyDown}
			className={`focus-visible:ring-accent flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-[background-color,color,scale] duration-150 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] ${placement === "mobile" ? "min-w-0 flex-1 justify-center" : ""} ${active ? "bg-accent-light text-accent-fg font-semibold" : "text-fg-secondary hover:bg-surface hover:text-fg"}`}
		>
			<span className="shrink-0" aria-hidden="true">
				{icon}
			</span>
			<span className="min-w-0 truncate">{label}</span>
		</button>
	);
}

export default function SettingsMenu() {
	const t = useT();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const closeMethodRef = useRef<"x" | "backdrop" | "esc">("x");
	const [open, setOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<SettingsTab>("general");

	useDialogDismiss(dialogRef, (method) => {
		closeMethodRef.current = method;
		setOpen(false);
		playSound("droplet");
	});
	useDialogClose(dialogRef, () => {
		setOpen(false);
		track("modal_close", {
			modal: "settings",
			method: closeMethodRef.current,
		});
	});

	function openDialog() {
		closeMethodRef.current = "x";
		setOpen(true);
		showDialog(dialogRef.current);
		track("modal_open", { modal: "settings" });
	}

	useCommandHandlers("settings", {
		"open-settings": openDialog,
	});

	function requestClose(method: "x" | "backdrop") {
		closeMethodRef.current = method;
		setOpen(false);
		closeDialog(dialogRef.current);
	}

	function selectTab(tab: SettingsTab) {
		setActiveTab(tab);
	}

	return (
		<>
			<button
				type="button"
				data-cuelume-hover="whisper"
				data-cuelume-toggle="bloom"
				className="border-border hover:bg-surface focus-visible:ring-accent text-fg-secondary inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
				onClick={openDialog}
				aria-label={t.settings.open}
				aria-haspopup="dialog"
				aria-expanded={open}
				title={t.settings.title}
			>
				<Gear size={19} aria-hidden="true" />
			</button>

			<dialog
				ref={dialogRef}
				closedby="any"
				className={settingsModalDialogClass}
				aria-labelledby="settings-modal-title"
			>
				<div className="flex h-full min-h-0 flex-col">
					<header className="border-border flex shrink-0 items-center justify-between gap-4 border-b p-4 sm:p-5">
						<div
							id="settings-modal-title"
							className="text-fg flex min-w-0 items-center gap-2 text-balance text-lg leading-tight font-semibold"
						>
							<Gear size={21} aria-hidden="true" />
							{t.settings.title}
						</div>
						<button
							type="button"
							data-cuelume-press="droplet"
							onClick={() => requestClose("x")}
							className="text-fg-muted hover:bg-surface hover:text-fg focus-visible:ring-accent inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-[color,background-color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
							aria-label={t.settings.close}
						>
							<XSquare className="size-5" aria-hidden="true" />
						</button>
					</header>

					<div className="flex min-h-0 flex-1 flex-col sm:flex-row">
						<aside className="border-border hidden w-56 shrink-0 flex-col border-e bg-surface-alt sm:flex">
							<div
								className="flex flex-1 flex-col gap-1.5 p-3"
								role="tablist"
								aria-label={t.settings.menuNavigation}
								aria-orientation="vertical"
							>
								<TabButton
									tab="general"
									placement="desktop"
									active={activeTab === "general"}
									icon={<Sliders size={18} />}
									label={t.settings.general}
									onSelect={selectTab}
								/>
								<TabButton
									tab="appearance"
									placement="desktop"
									active={activeTab === "appearance"}
									icon={<Palette size={18} />}
									label={t.settings.appearance}
									onSelect={selectTab}
								/>
								<TabButton
									tab="shortcuts"
									placement="desktop"
									active={activeTab === "shortcuts"}
									icon={<Keyboard size={18} />}
									label={t.settings.keyboardShortcuts}
									onSelect={selectTab}
								/>
							</div>
							<div className="border-border mt-auto flex items-center justify-between gap-3 border-t p-3">
								<p className="text-center text-fg-muted min-w-0 truncate whitespace-nowrap text-[0.68rem] font-semibold tracking-wide uppercase">
									{t.settings.version}
								</p>
								<a
									href={GITHUB_REPOSITORY_URL}
									target="_blank"
									rel="noopener noreferrer"
									data-cuelume-hover="whisper"
									data-cuelume-press="sparkle"
									className="bg-code text-fg-secondary hover:bg-surface hover:text-fg focus-visible:ring-accent inline-flex shrink-0 cursor-pointer items-center rounded-md px-2 py-1 font-mono text-xs transition-[background-color,color,scale] duration-150 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
									aria-label={`${t.settings.openRepository}: ${APP_VERSION}`}
									title={t.settings.openRepository}
									onClick={() => track("version_repository_open")}
								>
									{APP_VERSION}
								</a>
							</div>
						</aside>

						<div className="settings-menu__scroll min-h-0 min-w-0 flex-1">
							<div
								id={`settings-panel-${activeTab}`}
								role="tabpanel"
								aria-labelledby={
									activeTab === "general"
										? "settings-general-title"
										: activeTab === "appearance"
											? "settings-appearance-title"
											: "settings-shortcuts-title"
								}
								className="min-h-full p-5 outline-none sm:p-8"
							>
								{activeTab === "general" ? (
									<SettingsGeneralPanel />
								) : activeTab === "appearance" ? (
									<SettingsAppearancePanel />
								) : (
									<KeyboardShortcutsSection />
								)}
							</div>
						</div>

						<div
							className="border-border flex shrink-0 gap-2 border-t bg-surface-alt p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:hidden"
							role="tablist"
							aria-label={t.settings.menuNavigation}
						>
							<TabButton
								tab="general"
								placement="mobile"
								active={activeTab === "general"}
								icon={<Sliders size={18} />}
								label={t.settings.general}
								onSelect={selectTab}
							/>
							<TabButton
								tab="appearance"
								placement="mobile"
								active={activeTab === "appearance"}
								icon={<Palette size={18} />}
								label={t.settings.appearance}
								onSelect={selectTab}
							/>
							<TabButton
								tab="shortcuts"
								placement="mobile"
								active={activeTab === "shortcuts"}
								icon={<Keyboard size={18} />}
								label={t.settings.keyboardShortcuts}
								onSelect={selectTab}
							/>
						</div>
					</div>
				</div>
			</dialog>
		</>
	);
}
