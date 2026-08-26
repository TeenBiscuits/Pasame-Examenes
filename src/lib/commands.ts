import {
	type Hotkey,
	type HotkeySequence,
	normalizeRegisterableHotkey,
} from "@tanstack/react-hotkeys";

export type CommandScope = "global" | "practice-exam" | "practice" | "exam";
export type CommandAssignment =
	| { type: "hotkeys"; hotkeys: readonly Hotkey[] }
	| { type: "sequence"; sequence: readonly Hotkey[] };

export interface CommandDefinition {
	id: string;
	scope: CommandScope;
	kind: CommandAssignment["type"];
	ignoreInputs: boolean;
}

export const COMMANDS = [
	{
		id: "open-settings",
		scope: "global",
		kind: "hotkeys",
		ignoreInputs: false,
	},
	{ id: "go-home", scope: "global", kind: "hotkeys", ignoreInputs: false },
	{ id: "cycle-theme", scope: "global", kind: "hotkeys", ignoreInputs: false },
	{
		id: "previous-question",
		scope: "practice-exam",
		kind: "hotkeys",
		ignoreInputs: true,
	},
	{
		id: "next-question",
		scope: "practice-exam",
		kind: "hotkeys",
		ignoreInputs: true,
	},
	{
		id: "first-question",
		scope: "practice-exam",
		kind: "sequence",
		ignoreInputs: true,
	},
	{
		id: "last-question",
		scope: "practice-exam",
		kind: "sequence",
		ignoreInputs: true,
	},
	{
		id: "check-question",
		scope: "practice",
		kind: "hotkeys",
		ignoreInputs: false,
	},
	{
		id: "clear-answer",
		scope: "practice",
		kind: "hotkeys",
		ignoreInputs: false,
	},
	{
		id: "submit-session",
		scope: "practice-exam",
		kind: "hotkeys",
		ignoreInputs: false,
	},
	{ id: "start-exam", scope: "exam", kind: "hotkeys", ignoreInputs: true },
	{
		id: "answer-a",
		scope: "practice-exam",
		kind: "hotkeys",
		ignoreInputs: true,
	},
	{
		id: "answer-b",
		scope: "practice-exam",
		kind: "hotkeys",
		ignoreInputs: true,
	},
	{
		id: "answer-c",
		scope: "practice-exam",
		kind: "hotkeys",
		ignoreInputs: true,
	},
	{
		id: "answer-d",
		scope: "practice-exam",
		kind: "hotkeys",
		ignoreInputs: true,
	},
	{
		id: "answer-e",
		scope: "practice-exam",
		kind: "hotkeys",
		ignoreInputs: true,
	},
] as const satisfies readonly CommandDefinition[];

export type CommandId = (typeof COMMANDS)[number]["id"];

/**
 * Portable command modules describe which semantic actions a feature exposes.
 * Their bindings intentionally live in DEFAULT_COMMAND_ASSIGNMENTS and can be
 * replaced in localStorage without changing the feature code.
 */
export interface CommandModule {
	id: string;
	scope: CommandScope;
	commands: readonly CommandId[];
}

export const COMMAND_MODULES = [
	{
		id: "global",
		scope: "global",
		commands: ["open-settings", "go-home", "cycle-theme"],
	},
	{
		id: "practice-exam-player",
		scope: "practice-exam",
		commands: [
			"previous-question",
			"next-question",
			"first-question",
			"last-question",
			"submit-session",
			"answer-a",
			"answer-b",
			"answer-c",
			"answer-d",
			"answer-e",
		],
	},
	{
		id: "practice-player",
		scope: "practice",
		commands: ["check-question", "clear-answer"],
	},
	{
		id: "exam-player",
		scope: "exam",
		commands: ["start-exam"],
	},
] as const satisfies readonly CommandModule[];

export const DEFAULT_COMMAND_ASSIGNMENTS: Record<CommandId, CommandAssignment> =
	{
		"open-settings": { type: "hotkeys", hotkeys: ["Mod+,"] },
		"go-home": { type: "hotkeys", hotkeys: ["Mod+Shift+H"] },
		"cycle-theme": { type: "hotkeys", hotkeys: ["Mod+Shift+L"] },
		"previous-question": { type: "hotkeys", hotkeys: ["ArrowLeft"] },
		"next-question": { type: "hotkeys", hotkeys: ["ArrowRight"] },
		"first-question": { type: "sequence", sequence: ["G", "G"] },
		"last-question": { type: "sequence", sequence: ["G", "E"] },
		"check-question": { type: "hotkeys", hotkeys: ["Mod+Enter"] },
		"clear-answer": { type: "hotkeys", hotkeys: ["Mod+Backspace"] },
		"submit-session": {
			type: "hotkeys",
			hotkeys: ["Mod+Shift+Enter"],
		},
		"start-exam": { type: "hotkeys", hotkeys: ["Enter"] },
		"answer-a": { type: "hotkeys", hotkeys: ["A", "1"] },
		"answer-b": { type: "hotkeys", hotkeys: ["B", "2"] },
		"answer-c": { type: "hotkeys", hotkeys: ["C", "3"] },
		"answer-d": { type: "hotkeys", hotkeys: ["D", "4"] },
		"answer-e": { type: "hotkeys", hotkeys: ["E", "5"] },
	};

export function isCommandId(value: string): value is CommandId {
	return COMMANDS.some((command) => command.id === value);
}

export function isCommandAssignment(
	value: unknown,
): value is CommandAssignment {
	if (!value || typeof value !== "object") return false;
	const assignment = value as {
		type?: unknown;
		hotkeys?: unknown;
		sequence?: unknown;
	};
	if (assignment.type === "hotkeys") {
		return (
			Array.isArray(assignment.hotkeys) &&
			assignment.hotkeys.every((hotkey) => typeof hotkey === "string")
		);
	}
	if (assignment.type === "sequence") {
		return (
			Array.isArray(assignment.sequence) &&
			assignment.sequence.every((hotkey) => typeof hotkey === "string")
		);
	}
	return false;
}

export function cloneAssignment(
	assignment: CommandAssignment,
): CommandAssignment {
	return assignment.type === "hotkeys"
		? { type: "hotkeys", hotkeys: [...assignment.hotkeys] }
		: { type: "sequence", sequence: [...assignment.sequence] };
}

export function getAssignmentKeys(
	assignment: CommandAssignment,
): Array<string> {
	if (assignment.type === "hotkeys") {
		return assignment.hotkeys.reduce<Array<string>>((keys, hotkey) => {
			if (hotkey.length > 0) {
				keys.push(`hotkey:${normalizeRegisterableHotkey(hotkey)}`);
			}
			return keys;
		}, []);
	}
	if (assignment.sequence.length === 0) return [];
	return [
		`sequence:${assignment.sequence
			.map((hotkey) => normalizeRegisterableHotkey(hotkey))
			.join("|")}`,
	];
}

export type { Hotkey, HotkeySequence };
