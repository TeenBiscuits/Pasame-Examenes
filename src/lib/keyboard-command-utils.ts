import {
	COMMANDS,
	type CommandAssignment,
	type CommandId,
	type CommandScope,
	getAssignmentKeys,
} from "./commands";

export function findCommandConflicts(
	assignments: Record<CommandId, CommandAssignment>,
): ReadonlyMap<CommandId, ReadonlySet<CommandId>> {
	const conflicts = new Map<CommandId, Set<CommandId>>();

	for (let index = 0; index < COMMANDS.length; index += 1) {
		const command = COMMANDS[index];
		if (!command) continue;
		const commandKeys = new Set(getAssignmentKeys(assignments[command.id]));

		for (
			let otherIndex = index + 1;
			otherIndex < COMMANDS.length;
			otherIndex += 1
		) {
			const otherCommand = COMMANDS[otherIndex];
			if (!otherCommand || !canConflict(command.scope, otherCommand.scope)) {
				continue;
			}

			const otherKeys = getAssignmentKeys(assignments[otherCommand.id]);
			if (!otherKeys.some((bindingKey) => commandKeys.has(bindingKey))) {
				continue;
			}

			const commandConflicts = conflicts.get(command.id) ?? new Set();
			const otherConflicts = conflicts.get(otherCommand.id) ?? new Set();
			commandConflicts.add(otherCommand.id);
			otherConflicts.add(command.id);
			conflicts.set(command.id, commandConflicts);
			conflicts.set(otherCommand.id, otherConflicts);
		}
	}

	return conflicts;
}

function canConflict(
	leftScope: CommandScope,
	rightScope: CommandScope,
): boolean {
	if (leftScope === "global" || rightScope === "global") return true;
	if (leftScope === "practice-exam" || rightScope === "practice-exam") {
		return true;
	}
	return leftScope === rightScope;
}

export function getCommandScope(
	pathname: string,
): Exclude<CommandScope, "practice-exam"> {
	if (pathname.includes("/practice/")) return "practice";
	if (pathname.includes("/exam/")) return "exam";
	return "global";
}
