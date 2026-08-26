import type { Hotkey } from "@tanstack/react-hotkeys";
import {
	HotkeysProvider,
	useHotkeySequences,
	useHotkeys,
} from "@tanstack/react-hotkeys";
import { useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	COMMANDS,
	type CommandAssignment,
	type CommandId,
	type CommandScope,
	cloneAssignment,
	DEFAULT_COMMAND_ASSIGNMENTS,
	isCommandAssignment,
	isCommandId,
} from "./commands";
import {
	findCommandConflicts,
	getCommandScope,
} from "./keyboard-command-utils";

const STORAGE_KEY = "keyboard-command-assignments:v1";

const LEGACY_COMMAND_ALIASES: Record<string, CommandId> = {
	"submit-practice": "submit-session",
	"submit-exam": "submit-session",
	"previous-exam-question": "previous-question",
	"next-exam-question": "next-question",
	"first-exam-question": "first-question",
	"last-exam-question": "last-question",
	"exam-answer-a": "answer-a",
	"exam-answer-b": "answer-b",
	"exam-answer-c": "answer-c",
	"exam-answer-d": "answer-d",
	"exam-answer-e": "answer-e",
};

export type CommandHandler = () => void;
export type CommandHandlers = Partial<
	Record<CommandId, CommandHandler | undefined>
>;

interface CommandModuleRecord {
	getHandlers: () => CommandHandlers;
	availableCommandIds: ReadonlySet<CommandId>;
}

interface KeyboardCommandsContextValue {
	assignments: Record<CommandId, CommandAssignment>;
	conflicts: ReadonlyMap<CommandId, ReadonlySet<CommandId>>;
	registryVersion: number;
	setAssignment: (commandId: CommandId, assignment: CommandAssignment) => void;
	resetAssignment: (commandId: CommandId) => void;
	resetAllAssignments: () => void;
	registerModule: (
		moduleId: string,
		getHandlers: () => CommandHandlers,
		availableCommandIds: ReadonlySet<CommandId>,
	) => () => void;
	getCommandHandler: (commandId: CommandId) => CommandHandler | undefined;
	invokeCommand: (commandId: CommandId) => boolean;
}

const KeyboardCommandsContext = createContext<
	KeyboardCommandsContextValue | undefined
>(undefined);

function cloneAssignments(
	assignments: Record<CommandId, CommandAssignment>,
): Record<CommandId, CommandAssignment> {
	return Object.fromEntries(
		COMMANDS.map((command) => [
			command.id,
			cloneAssignment(assignments[command.id]),
		]),
	) as Record<CommandId, CommandAssignment>;
}

function readStoredAssignments(): Record<CommandId, CommandAssignment> {
	const assignments = cloneAssignments(DEFAULT_COMMAND_ASSIGNMENTS);

	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return assignments;

		const stored = JSON.parse(raw) as unknown;
		if (!stored || typeof stored !== "object") return assignments;

		const importedCommandIds = new Set<CommandId>();
		for (const [commandId, assignment] of Object.entries(stored)) {
			const currentCommandId = isCommandId(commandId)
				? commandId
				: LEGACY_COMMAND_ALIASES[commandId];
			if (!currentCommandId || !isCommandAssignment(assignment)) continue;
			if (!isCommandId(commandId) && importedCommandIds.has(currentCommandId)) {
				continue;
			}
			assignments[currentCommandId] = cloneAssignment(assignment);
			importedCommandIds.add(currentCommandId);
		}
	} catch {
		/* localStorage unavailable or contains invalid JSON */
	}

	return assignments;
}

function persistAssignments(
	assignments: Record<CommandId, CommandAssignment>,
): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
	} catch {
		/* localStorage unavailable */
	}
}

function isCommandActiveInScope(
	commandScope: CommandScope,
	activeScope: Exclude<CommandScope, "practice-exam">,
): boolean {
	if (commandScope === "global") return true;
	if (commandScope === "practice-exam") {
		return activeScope === "practice" || activeScope === "exam";
	}
	return commandScope === activeScope;
}

export function useKeyboardCommands(): KeyboardCommandsContextValue {
	const context = useContext(KeyboardCommandsContext);
	if (!context) {
		throw new Error(
			"useKeyboardCommands must be used inside KeyboardCommandProvider",
		);
	}
	return context;
}

/** Register the actions owned by a portable feature module. */
export function useCommandHandlers(
	moduleId: string,
	handlers: CommandHandlers,
): void {
	const { registerModule } = useKeyboardCommands();
	const handlersRef = useRef(handlers);

	useEffect(() => {
		handlersRef.current = handlers;
	});

	const availableCommandKey = Object.entries(handlers)
		.reduce<string[]>((commandIds, [commandId, handler]) => {
			if (isCommandId(commandId) && typeof handler === "function") {
				commandIds.push(commandId);
			}
			return commandIds;
		}, [])
		.sort()
		.join("|");
	const availableCommandIds = useMemo(
		() => new Set(availableCommandKey.split("|").filter(isCommandId)),
		[availableCommandKey],
	);

	useEffect(() => {
		return registerModule(
			moduleId,
			() => handlersRef.current,
			availableCommandIds,
		);
	}, [availableCommandIds, moduleId, registerModule]);
}

function KeyboardBindingsRuntime() {
	const { assignments, conflicts, getCommandHandler, invokeCommand } =
		useKeyboardCommands();
	const location = useLocation();
	const activeScope = getCommandScope(location.pathname);

	const { hotkeys, sequences } = (() => {
		const activeCommandIds = new Set<CommandId>();
		for (const command of COMMANDS) {
			if (!isCommandActiveInScope(command.scope, activeScope)) continue;
			if (!getCommandHandler(command.id)) continue;
			activeCommandIds.add(command.id);
		}
		const hotkeys: Array<{
			hotkey: Hotkey;
			callback: CommandHandler;
			options: {
				ignoreInputs: boolean;
				meta: { name: string; description: string };
				conflictBehavior: "error";
			};
		}> = [];
		const sequences: Array<{
			sequence: Array<Hotkey>;
			callback: CommandHandler;
			options: {
				ignoreInputs: boolean;
				meta: { name: string; description: string };
				conflictBehavior: "error";
			};
		}> = [];

		for (const command of COMMANDS) {
			if (!isCommandActiveInScope(command.scope, activeScope)) {
				continue;
			}
			const hasActiveConflict = [...(conflicts.get(command.id) ?? [])].some(
				(conflictingCommandId) => activeCommandIds.has(conflictingCommandId),
			);
			if (hasActiveConflict || !getCommandHandler(command.id)) {
				continue;
			}

			const assignment = assignments[command.id];
			const callback = () => {
				invokeCommand(command.id);
			};
			const options = {
				ignoreInputs: command.ignoreInputs,
				meta: {
					name: command.id,
					description: `${command.scope} command`,
				},
				conflictBehavior: "error" as const,
			};

			if (assignment.type === "hotkeys") {
				const seenHotkeys = new Set<string>();
				for (const hotkey of assignment.hotkeys) {
					if (!hotkey || seenHotkeys.has(hotkey)) continue;
					seenHotkeys.add(hotkey);
					hotkeys.push({ hotkey, callback, options });
				}
			} else if (assignment.sequence.length > 0) {
				sequences.push({
					sequence: [...assignment.sequence],
					callback,
					options,
				});
			}
		}

		return { hotkeys, sequences };
	})();

	useHotkeys(hotkeys);
	useHotkeySequences(sequences, { timeout: 750 });

	return null;
}

export function KeyboardCommandProvider({ children }: { children: ReactNode }) {
	const [assignments, setAssignments] = useState(readStoredAssignments);
	const [registryVersion, setRegistryVersion] = useState(0);
	const modulesRef = useRef(new Map<string, CommandModuleRecord>());

	useEffect(() => {
		persistAssignments(assignments);
	}, [assignments]);

	const conflicts = useMemo(
		() => findCommandConflicts(assignments),
		[assignments],
	);

	const setAssignment = useCallback(
		(commandId: CommandId, assignment: CommandAssignment) => {
			setAssignments((previous) => {
				return {
					...previous,
					[commandId]: cloneAssignment(assignment),
				};
			});
		},
		[],
	);

	const resetAssignment = useCallback((commandId: CommandId) => {
		setAssignments((previous) => {
			return {
				...previous,
				[commandId]: cloneAssignment(DEFAULT_COMMAND_ASSIGNMENTS[commandId]),
			};
		});
	}, []);

	const resetAllAssignments = useCallback(() => {
		setAssignments(cloneAssignments(DEFAULT_COMMAND_ASSIGNMENTS));
	}, []);

	const registerModule = useCallback(
		(
			moduleId: string,
			getHandlers: () => CommandHandlers,
			availableCommandIds: ReadonlySet<CommandId>,
		) => {
			const record: CommandModuleRecord = {
				getHandlers,
				availableCommandIds,
			};
			modulesRef.current.set(moduleId, record);
			setRegistryVersion((version) => version + 1);

			return () => {
				if (modulesRef.current.get(moduleId) !== record) return;
				modulesRef.current.delete(moduleId);
				setRegistryVersion((version) => version + 1);
			};
		},
		[],
	);

	const getCommandHandler = useCallback((commandId: CommandId) => {
		for (const module of modulesRef.current.values()) {
			if (!module.availableCommandIds.has(commandId)) continue;
			const handler = module.getHandlers()[commandId];
			if (handler) return handler;
		}
		return undefined;
	}, []);

	const invokeCommand = useCallback(
		(commandId: CommandId) => {
			const handler = getCommandHandler(commandId);
			if (!handler) return false;
			handler();
			return true;
		},
		[getCommandHandler],
	);

	const value = useMemo(
		() => ({
			assignments,
			conflicts,
			registryVersion,
			setAssignment,
			resetAssignment,
			resetAllAssignments,
			registerModule,
			getCommandHandler,
			invokeCommand,
		}),
		[
			assignments,
			conflicts,
			getCommandHandler,
			invokeCommand,
			registerModule,
			registryVersion,
			resetAllAssignments,
			resetAssignment,
			setAssignment,
		],
	);

	return (
		<KeyboardCommandsContext.Provider value={value}>
			<HotkeysProvider
				defaultOptions={{
					hotkey: {
						preventDefault: true,
						stopPropagation: true,
					},
					hotkeySequence: {
						preventDefault: true,
						stopPropagation: true,
					},
				}}
			>
				<KeyboardBindingsRuntime />
				{children}
			</HotkeysProvider>
		</KeyboardCommandsContext.Provider>
	);
}
