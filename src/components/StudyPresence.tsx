import { type CSSProperties, useEffect, useState } from "react";
import { useT } from "../i18n/hooks";
import { usePresence } from "../presence/hooks";
import { useProfile } from "../profile/hooks";
import { getBlobatarColor } from "../profile/profile";
import ProfileAvatar from "./ProfileAvatar";

const VISIBLE_STUDENTS = 4;
const ROTATION_INTERVAL_MS = 12_000;

function UsernameTooltip({ username }: { username: string }) {
	return (
		<span
			role="tooltip"
			style={{ color: getBlobatarColor(username) }}
			className="border-border bg-surface-alt pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md border px-2 py-1 font-mono text-[0.68rem] font-semibold whitespace-nowrap opacity-0 shadow-md transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100"
		>
			@{username}
		</span>
	);
}

export default function StudyPresence() {
	const t = useT();
	const { studentCount, students, hasSummary } = usePresence();
	const { profile } = useProfile();
	const [rotation, setRotation] = useState(0);
	const visibleProfileStudents = students.filter(
		(student) => !student.isCurrentStudent || profile.isNameShared,
	);

	useEffect(() => {
		if (visibleProfileStudents.length <= VISIBLE_STUDENTS) {
			return;
		}
		const intervalId = window.setInterval(
			() =>
				setRotation(
					(current) =>
						(current + VISIBLE_STUDENTS) % visibleProfileStudents.length,
				),
			ROTATION_INTERVAL_MS,
		);
		return () => window.clearInterval(intervalId);
	}, [visibleProfileStudents.length]);

	if (!profile.isStudyPresenceBadgeVisible || !hasSummary) return null;

	const visibleStudents = Array.from(
		{ length: Math.min(VISIBLE_STUDENTS, visibleProfileStudents.length) },
		(_, index) =>
			visibleProfileStudents[
				(rotation + index) % visibleProfileStudents.length
			],
	).filter((student): student is (typeof students)[number] => Boolean(student));

	return (
		<aside
			className="border-border bg-surface-alt/95 fixed right-4 bottom-4 z-40 flex items-center gap-3 rounded-xl border px-3 py-2 shadow-lg backdrop-blur-sm"
			aria-label={`${studentCount} ${t.presence.studentsThisWeek}`}
		>
			<div className="flex -space-x-2" aria-hidden="true">
				{visibleStudents.map((student, index) => (
					<span
						key={`${student.profileKey}-${rotation}`}
						className="presence-card-avatar group relative"
						style={
							{
								"--presence-card-delay": `${index * 70}ms`,
							} as CSSProperties
						}
					>
						<UsernameTooltip username={student.username} />
						<ProfileAvatar
							username={student.username}
							size={26}
							animated
							className="bg-surface-alt rounded-full outline-2 outline-surface-alt"
						/>
					</span>
				))}
			</div>
			<p className="text-fg-secondary text-xs font-medium">
				<span className="text-fg font-semibold tabular-nums">
					{studentCount}
				</span>{" "}
				{t.presence.studentsThisWeek}
			</p>
			<ul className="sr-only">
				{visibleProfileStudents.map((student) => (
					<li key={student.profileKey}>@{student.username}</li>
				))}
			</ul>
		</aside>
	);
}
