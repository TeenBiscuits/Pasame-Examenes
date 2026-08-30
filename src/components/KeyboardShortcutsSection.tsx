import {
  formatForDisplay,
  useHeldKeys,
  useHotkeyRecorder,
  useHotkeySequenceRecorder,
} from "@tanstack/react-hotkeys";
import { useRef, useState } from "react";
import { Keyboard, Restart, TriangleWarning } from "reicon-react";
import { useT } from "../i18n/hooks";
import {
  COMMAND_MODULES,
  COMMANDS,
  type CommandAssignment,
  type CommandId,
  DEFAULT_COMMAND_ASSIGNMENTS,
} from "../lib/commands";
import { useKeyboardCommands } from "../lib/keyboard-commands";
import { track } from "../lib/umami";

function getAssignmentKeys(assignment: CommandAssignment): readonly string[] {
  return assignment.type === "hotkeys"
    ? assignment.hotkeys
    : assignment.sequence;
}

function getKeyedValues(values: readonly string[]) {
  const occurrences = new Map<string, number>();

  return values.map((value) => {
    const occurrence = occurrences.get(value) ?? 0;
    occurrences.set(value, occurrence + 1);
    return { id: `${value}-${occurrence}`, value };
  });
}

function HotkeyKeycaps({ hotkey }: { hotkey: string }) {
  const displayKeys = getKeyedValues(
    formatForDisplay(hotkey).split(/\s+/).filter(Boolean),
  );

  return (
    <span className="inline-flex items-center gap-1">
      {displayKeys.map(({ id, value: key }, displayKeyIndex) => (
        <span key={id} className="inline-flex items-center gap-1">
          <kbd className="border-border bg-code text-fg-secondary inline-flex min-h-8 items-center rounded-md border px-2 font-mono text-s leading-none font-medium shadow-[0_1px_0_var(--color-border)]">
            {key}
          </kbd>
          {displayKeyIndex < displayKeys.length - 1 && (
            <span className="text-fg-muted text-[0.65rem]" aria-hidden="true">
              +
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

function AssignmentKeycaps({ assignment }: { assignment: CommandAssignment }) {
  const keys = getAssignmentKeys(assignment);
  const separator = assignment.type === "hotkeys" ? "/" : "·";

  return (
    <span className="flex min-w-0 flex-wrap items-center justify-end gap-1.5">
      {getKeyedValues(keys).map(({ id, value: hotkey }, index) => (
        <span key={id} className="inline-flex items-center gap-1.5">
          {index > 0 && (
            <span className="text-fg-muted text-[0.65rem]" aria-hidden="true">
              {separator}
            </span>
          )}
          <HotkeyKeycaps hotkey={hotkey} />
        </span>
      ))}
    </span>
  );
}

function isSameAssignment(
  left: CommandAssignment,
  right: CommandAssignment,
): boolean {
  if (left.type !== right.type) return false;
  const leftKeys = left.type === "hotkeys" ? left.hotkeys : left.sequence;
  const rightKeys = right.type === "hotkeys" ? right.hotkeys : right.sequence;
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every((key, index) => key === rightKeys[index])
  );
}

function HeldKeysIndicator() {
  const t = useT();
  const heldKeys = useHeldKeys();

  if (heldKeys.length === 0) return null;

  return (
    <div
      className="border-border bg-code/50 text-fg-secondary flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"
      aria-live="polite"
    >
      <span className="font-semibold">{t.settings.heldKeys}</span>
      <span className="flex min-w-0 flex-wrap gap-1">
        {heldKeys.map((key) => (
          <kbd
            key={key}
            className="bg-surface text-fg rounded border border-current/15 px-1.5 py-0.5 font-mono text-[0.7rem]"
          >
            {formatForDisplay(key)}
          </kbd>
        ))}
      </span>
    </div>
  );
}

function ShortcutBinding({
  assignment,
  hasConflict,
  isRecording,
  recordedSteps,
  onStart,
  onCommit,
  onCancel,
}: {
  assignment: CommandAssignment;
  hasConflict: boolean;
  isRecording: boolean;
  recordedSteps: readonly string[];
  onStart: () => void;
  onCommit: () => void;
  onCancel: () => void;
}) {
  const t = useT();
  const assignmentKeys = getAssignmentKeys(assignment);
  const isSequence = assignment.type === "sequence";
  const isUnassigned = !isRecording && assignmentKeys.length === 0;

  return (
    <div className="flex shrink-0 items-stretch gap-2">
      <button
        type="button"
        onClick={onStart}
        className={`border-border bg-surface text-fg hover:border-accent hover:text-accent-fg focus-visible:ring-accent group-hover/shortcut-card:border-accent flex min-h-10 min-w-0 items-center justify-end gap-3 border border-dashed px-2 py-1.5 text-left transition-[background-color,border-color,color,scale] duration-150 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] ${hasConflict ? "rounded-se-lg rounded-ee-none" : "rounded-e-lg"} ${isRecording ? "border-accent bg-accent-light text-accent-fg" : ""}`}
        aria-label={
          isRecording ? t.settings.recording : t.settings.editShortcut
        }
      >
        {isRecording ? (
          recordedSteps.length > 0 ? (
            <span className="flex min-w-0 flex-wrap items-center justify-end gap-1.5">
              {getKeyedValues(recordedSteps).map(
                ({ id, value: hotkey }, index) => (
                  <span key={id} className="inline-flex items-center gap-1.5">
                    {index > 0 && (
                      <span
                        className="text-fg-muted text-[0.65rem]"
                        aria-hidden="true"
                      >
                        ·
                      </span>
                    )}
                    <HotkeyKeycaps hotkey={hotkey} />
                  </span>
                ),
              )}
            </span>
          ) : (
            <span className="text-fg-muted text-xs font-medium">
              {t.settings.pressKeys}
            </span>
          )
        ) : isUnassigned ? (
          <span className="text-fg-muted text-xs font-medium">
            {t.settings.shortcutUnassigned}
          </span>
        ) : (
          <AssignmentKeycaps assignment={assignment} />
        )}
      </button>
      {isRecording && isSequence && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onCommit}
            disabled={recordedSteps.length === 0}
            className="bg-accent text-on-accent hover:bg-accent-hover focus-visible:ring-accent min-h-10 rounded-lg px-3 text-xs font-semibold transition-[background-color,scale] duration-150 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.settings.saveShortcut}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent min-h-10 rounded-lg border px-3 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t.settings.cancelShortcut}
          </button>
        </div>
      )}
    </div>
  );
}

export default function KeyboardShortcutsSection() {
  const t = useT();
  const {
    assignments,
    conflicts,
    resetAllAssignments,
    resetAssignment,
    setAssignment,
  } = useKeyboardCommands();
  const [editingCommandId, setEditingCommandId] = useState<CommandId | null>(
    null,
  );
  const [recordingKind, setRecordingKind] = useState<
    "hotkeys" | "sequence" | null
  >(null);
  const editingCommandRef = useRef<CommandId | null>(null);

  function finishRecording() {
    editingCommandRef.current = null;
    setEditingCommandId(null);
    setRecordingKind(null);
  }

  const hotkeyRecorder = useHotkeyRecorder({
    onRecord: (hotkey) => {
      const commandId = editingCommandRef.current;
      if (!commandId) return;
      setAssignment(commandId, {
        type: "hotkeys",
        hotkeys: hotkey ? [hotkey] : [],
      });
      track("keyboard_shortcut_change", {
        commandId,
        bindingType: "hotkey",
      });
      finishRecording();
    },
    onClear: () => {
      const commandId = editingCommandRef.current;
      if (!commandId) return;
      setAssignment(commandId, { type: "hotkeys", hotkeys: [] });
      track("keyboard_shortcut_change", {
        commandId,
        bindingType: "hotkey-cleared",
      });
      finishRecording();
    },
    onCancel: finishRecording,
  });

  const sequenceRecorder = useHotkeySequenceRecorder({
    onRecord: (sequence) => {
      const commandId = editingCommandRef.current;
      if (!commandId) return;
      setAssignment(commandId, { type: "sequence", sequence });
      track("keyboard_shortcut_change", {
        commandId,
        bindingType: "sequence",
      });
      finishRecording();
    },
    onClear: () => {
      const commandId = editingCommandRef.current;
      if (!commandId) return;
      setAssignment(commandId, { type: "sequence", sequence: [] });
      track("keyboard_shortcut_change", {
        commandId,
        bindingType: "sequence-cleared",
      });
      finishRecording();
    },
    onCancel: finishRecording,
  });

  function startRecording(commandId: CommandId) {
    const command = COMMANDS.find((item) => item.id === commandId);
    if (!command) return;

    hotkeyRecorder.stopRecording();
    sequenceRecorder.stopRecording();
    editingCommandRef.current = commandId;
    setEditingCommandId(commandId);
    setRecordingKind(command.kind);
    if (command.kind === "sequence") sequenceRecorder.startRecording();
    else hotkeyRecorder.startRecording();
  }

  function cancelRecording() {
    hotkeyRecorder.stopRecording();
    sequenceRecorder.stopRecording();
    finishRecording();
  }

  function resetOne(commandId: CommandId) {
    if (editingCommandRef.current === commandId) cancelRecording();
    resetAssignment(commandId);
  }

  function resetAll() {
    cancelRecording();
    resetAllAssignments();
  }

  const commandsById = new Map(
    COMMANDS.map((command) => [command.id, command]),
  );
  const commandsForModules = (
    modules: ReadonlyArray<(typeof COMMAND_MODULES)[number]>,
  ) =>
    modules.flatMap((module) =>
      module.commands.flatMap((commandId) => {
        const command = commandsById.get(commandId);
        return command ? [command] : [];
      }),
    );
  const groupedCommands = [
    {
      id: "global",
      label: t.settings.shortcutScopes.global,
      commands: commandsForModules(
        COMMAND_MODULES.filter((module) => module.scope === "global"),
      ),
    },
    {
      id: "practice-exam",
      label: t.settings.shortcutScopes.practiceExam,
      commands: commandsForModules(
        COMMAND_MODULES.filter((module) => module.scope !== "global"),
      ),
    },
  ];

  return (
    <section className="space-y-5" aria-labelledby="settings-shortcuts-title">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            id="settings-shortcuts-title"
            className="text-fg text-base font-semibold"
          >
            {t.settings.keyboardShortcuts}
          </h2>
          <p className="text-fg-muted mt-1 text-xs leading-relaxed">
            {t.settings.keyboardShortcutsDescription}
          </p>
        </div>
        <button
          type="button"
          onClick={resetAll}
          className="text-accent-fg hover:text-accent-hover focus-visible:ring-accent inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <Restart size={14} aria-hidden="true" />
          {t.settings.resetShortcuts}
        </button>
      </div>

      <div className="space-y-5">
        {groupedCommands.map(({ id, label, commands }) => (
          <div key={id} className="space-y-2.5">
            <h3 className="text-fg-muted text-[0.68rem] font-bold tracking-[0.12em] uppercase">
              {label}
            </h3>
            <div className="space-y-2">
              {commands.map((command) => {
                const assignment = assignments[command.id];
                const commandConflicts = conflicts.get(command.id);
                const isRecording =
                  editingCommandId === command.id &&
                  recordingKind === command.kind;
                const isDefault = isSameAssignment(
                  assignment,
                  DEFAULT_COMMAND_ASSIGNMENTS[command.id],
                );

                return (
                  <div
                    key={command.id}
                    className="flex min-w-0 items-start gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="group/shortcut-card flex min-w-0 items-stretch">
                        <button
                          type="button"
                          onClick={() => startRecording(command.id)}
                          className={`border-e-0 min-w-0 flex-1 cursor-pointer border p-3 text-left transition-[border-color,background-color,scale] hover:border-accent focus-visible:ring-accent focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] ${commandConflicts ? "rounded-ss-lg rounded-es-none border-danger-border bg-danger-bg/40" : "rounded-s-lg border-border bg-surface"}`}
                        >
                          <div className="min-w-0">
                            <p className="text-fg text-sm font-medium">
                              {t.settings.shortcutCommands[command.id]}
                            </p>
                            <p className="text-fg-muted mt-0.5 text-[0.68rem]">
                              {command.kind === "sequence"
                                ? t.settings.sequenceHint
                                : t.settings.shortcutHint}
                            </p>
                          </div>
                        </button>
                        <ShortcutBinding
                          assignment={assignment}
                          hasConflict={Boolean(commandConflicts)}
                          isRecording={isRecording}
                          recordedSteps={
                            command.kind === "sequence"
                              ? sequenceRecorder.steps
                              : []
                          }
                          onStart={() => startRecording(command.id)}
                          onCommit={() => sequenceRecorder.commitRecording()}
                          onCancel={cancelRecording}
                        />
                      </div>
                      {commandConflicts && (
                        <p className="text-danger-fg flex items-start gap-1.5 rounded-b-lg border border-t-0 border-danger-border bg-danger-bg/40 px-3 py-2 text-xs">
                          <TriangleWarning
                            size={14}
                            aria-hidden="true"
                            className="mt-0.5 shrink-0"
                          />
                          <span>
                            {t.settings.shortcutConflict}
                            {t.settings.shortcutConflictDescription}
                          </span>
                        </p>
                      )}
                    </div>
                    {!isDefault && !isRecording && (
                      <button
                        type="button"
                        onClick={() => resetOne(command.id)}
                        className="text-fg-muted hover:text-accent-fg focus-visible:ring-accent mt-2 inline-flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
                        aria-label={t.settings.resetShortcut}
                        title={t.settings.resetShortcut}
                      >
                        <Restart size={15} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <HeldKeysIndicator />
    </section>
  );
}
