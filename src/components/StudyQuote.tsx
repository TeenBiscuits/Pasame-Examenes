import {
	type CSSProperties,
	type KeyboardEvent,
	type PointerEvent as ReactPointerEvent,
	type RefObject,
	useRef,
	useState,
} from "react";
import { useT } from "../i18n/hooks";
import { usePresence } from "../presence/hooks";
import { useProfile } from "../profile/hooks";
import { getBlobatarColor } from "../profile/profile";
import ProfileAvatar from "./ProfileAvatar";

const quoteAvatars = [
	{ x: 10, y: 20, mobileX: 8, mobileY: 13, delay: -2.4 },
	{ x: 25, y: 77, mobileX: 12, mobileY: 84, delay: -5.1 },
	{ x: 74, y: 78, mobileX: 88, mobileY: 84, delay: -8.3 },
	{ x: 90, y: 21, mobileX: 92, mobileY: 18, delay: -1.7 },
	{ x: 9, y: 55, mobileX: 8, mobileY: 53, delay: -6.4 },
	{ x: 91, y: 57, mobileX: 92, mobileY: 55, delay: -10.2 },
	{ x: 34, y: 12, mobileX: 23, mobileY: 10, delay: -3.6 },
	{ x: 65, y: 12, mobileX: 77, mobileY: 10, delay: -9.1 },
	{ x: 18, y: 39, mobileX: 15, mobileY: 34, delay: -0.8 },
	{ x: 82, y: 39, mobileX: 85, mobileY: 35, delay: -7.2 },
	{ x: 50, y: 88, mobileX: 50, mobileY: 90, delay: -11.5 },
	{ x: 17, y: 9, mobileX: 18, mobileY: 12, delay: -4.3 },
	{ x: 42, y: 7, mobileX: 40, mobileY: 10, delay: -6.8 },
	{ x: 58, y: 7, mobileX: 60, mobileY: 10, delay: -10.7 },
	{ x: 83, y: 9, mobileX: 82, mobileY: 12, delay: -2.1 },
	{ x: 5, y: 33, mobileX: 8, mobileY: 34, delay: -8.9 },
	{ x: 95, y: 33, mobileX: 92, mobileY: 34, delay: -5.6 },
	{ x: 5, y: 72, mobileX: 8, mobileY: 71, delay: -11.1 },
	{ x: 95, y: 72, mobileX: 92, mobileY: 71, delay: -3.5 },
	{ x: 18, y: 94, mobileX: 18, mobileY: 89, delay: -7.9 },
	{ x: 38, y: 94, mobileX: 38, mobileY: 89, delay: -1.3 },
	{ x: 62, y: 94, mobileX: 62, mobileY: 89, delay: -9.6 },
	{ x: 82, y: 94, mobileX: 82, mobileY: 89, delay: -4.8 },
	{ x: 30, y: 27, mobileX: 28, mobileY: 25, delay: -12.3 },
	{ x: 70, y: 27, mobileX: 72, mobileY: 25, delay: -0.4 },
	{ x: 30, y: 66, mobileX: 28, mobileY: 67, delay: -6.1 },
	{ x: 70, y: 66, mobileX: 72, mobileY: 67, delay: -2.8 },
	{ x: 45, y: 78, mobileX: 42, mobileY: 78, delay: -10.1 },
	{ x: 55, y: 78, mobileX: 58, mobileY: 78, delay: -5.2 },
	{ x: 50, y: 21, mobileX: 50, mobileY: 21, delay: -8.1 },
] as const;

type Position = { x: number; y: number };
type DragState = {
	pointerId: number;
	offsetX: number;
	offsetY: number;
} | null;

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function getSafePosition(
	section: HTMLElement,
	avatar: HTMLElement,
	x: number,
	y: number,
): Position {
	const sectionBounds = section.getBoundingClientRect();
	const avatarBounds = avatar.getBoundingClientRect();
	const padding = 12;
	const horizontalMotion = 28;
	const verticalMotion = 14;
	const horizontalInset =
		((avatarBounds.width / 2 + padding + horizontalMotion) /
			sectionBounds.width) *
		100;
	const verticalInset =
		((avatarBounds.height / 2 + padding + verticalMotion) /
			sectionBounds.height) *
		100;

	return {
		x: clamp(x, horizontalInset, 100 - horizontalInset),
		y: clamp(y, verticalInset, 100 - verticalInset),
	};
}

function getCurrentPosition(
	section: HTMLElement,
	avatar: HTMLElement,
): Position {
	const sectionBounds = section.getBoundingClientRect();
	const avatarBounds = avatar.getBoundingClientRect();
	return {
		x:
			((avatarBounds.left + avatarBounds.width / 2 - sectionBounds.left) /
				sectionBounds.width) *
			100,
		y:
			((avatarBounds.top + avatarBounds.height / 2 - sectionBounds.top) /
				sectionBounds.height) *
			100,
	};
}

function QuoteAvatar({
	username,
	placement,
	index,
	sectionRef,
}: {
	username: string;
	placement: (typeof quoteAvatars)[number];
	index: number;
	sectionRef: RefObject<HTMLDivElement | null>;
}) {
	const t = useT();
	const avatarRef = useRef<HTMLSpanElement>(null);
	const dragRef = useRef<DragState>(null);
	const lastPositionRef = useRef<Position | null>(null);
	const [customPosition, setCustomPosition] = useState<Position | null>(null);
	const [dragging, setDragging] = useState(false);
	const tooltipId = `study-quote-${username}`;
	const tooltipBelow = (customPosition?.y ?? placement.y) < 25;

	const style = {
		"--home-quote-x": `${placement.x}%`,
		"--home-quote-y": `${placement.y}%`,
		"--home-quote-mobile-x": `${placement.mobileX}%`,
		"--home-quote-mobile-y": `${placement.mobileY}%`,
		"--home-quote-swim-x-one": `${index % 2 === 0 ? 28 : -28}px`,
		"--home-quote-swim-y-one": `${index % 3 === 0 ? -14 : 14}px`,
		"--home-quote-swim-x-two": `${index % 2 === 0 ? -23 : 23}px`,
		"--home-quote-swim-y-two": `${index % 3 === 0 ? 10 : -10}px`,
		"--home-quote-swim-x-three": `${index % 2 === 0 ? 14 : -14}px`,
		"--home-quote-swim-y-three": `${index % 3 === 0 ? -6 : 6}px`,
		"--home-quote-delay": `${placement.delay}s`,
		"--home-quote-duration": `${13 + (index % 3) * 1.4}s`,
		...(customPosition
			? { left: `${customPosition.x}%`, top: `${customPosition.y}%` }
			: {}),
	} as CSSProperties;

	function applyPosition(position: Position) {
		const avatar = avatarRef.current;
		const section = sectionRef.current;
		if (!avatar || !section) return null;
		const safePosition = getSafePosition(
			section,
			avatar,
			position.x,
			position.y,
		);
		avatar.style.left = `${safePosition.x}%`;
		avatar.style.top = `${safePosition.y}%`;
		lastPositionRef.current = safePosition;
		return safePosition;
	}

	function finishDrag() {
		if (lastPositionRef.current) setCustomPosition(lastPositionRef.current);
		dragRef.current = null;
		setDragging(false);
	}

	function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
		const avatar = avatarRef.current;
		if (!avatar) return;
		event.preventDefault();
		const bounds = avatar.getBoundingClientRect();
		dragRef.current = {
			pointerId: event.pointerId,
			offsetX: event.clientX - (bounds.left + bounds.width / 2),
			offsetY: event.clientY - (bounds.top + bounds.height / 2),
		};
		setDragging(true);
		try {
			event.currentTarget.setPointerCapture(event.pointerId);
		} catch {
			/* Pointer capture is not available in every browser. */
		}
	}

	function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
		const drag = dragRef.current;
		const section = sectionRef.current;
		if (!drag || drag.pointerId !== event.pointerId || !section) return;
		const bounds = section.getBoundingClientRect();
		event.preventDefault();
		applyPosition({
			x: ((event.clientX - drag.offsetX - bounds.left) / bounds.width) * 100,
			y: ((event.clientY - drag.offsetY - bounds.top) / bounds.height) * 100,
		});
	}

	function handlePointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
		if (dragRef.current?.pointerId !== event.pointerId) return;
		try {
			event.currentTarget.releasePointerCapture(event.pointerId);
		} catch {
			/* Pointer capture may already have been released. */
		}
		finishDrag();
	}

	function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
		const directions = {
			ArrowUp: { x: 0, y: -1 },
			ArrowDown: { x: 0, y: 1 },
			ArrowLeft: { x: -1, y: 0 },
			ArrowRight: { x: 1, y: 0 },
		} as const;
		const direction = directions[event.key as keyof typeof directions];
		const avatar = avatarRef.current;
		const section = sectionRef.current;
		if (!direction || !avatar || !section) return;

		event.preventDefault();
		const distance = event.shiftKey ? 12 : 4;
		const current = getCurrentPosition(section, avatar);
		const next = applyPosition({
			x: current.x + direction.x * distance,
			y: current.y + direction.y * distance,
		});
		if (next) setCustomPosition(next);
	}

	return (
		<span
			ref={avatarRef}
			className={`home-quote-avatar ${dragging ? "home-quote-avatar--dragging" : ""} ${tooltipBelow ? "home-quote-avatar--tooltip-below" : ""}`}
			style={style}
		>
			<button
				type="button"
				className="home-quote-avatar__swim group focus-visible:ring-accent cursor-grab touch-none rounded-full focus-visible:ring-2 focus-visible:outline-none active:cursor-grabbing"
				aria-label={`${t.presence.moveAvatar}: @${username}`}
				aria-describedby={`${tooltipId} study-quote-avatar-hint`}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={finishDrag}
				onDragStart={(event) => event.preventDefault()}
				onKeyDown={handleKeyDown}
			>
				<ProfileAvatar
					username={username}
					size={72}
					animated
					className="home-quote-avatar__face size-12 rounded-full sm:size-18"
				/>
				<span
					id={tooltipId}
					role="tooltip"
					style={{ color: getBlobatarColor(username) }}
					className="home-quote-avatar__tooltip border-border bg-surface-alt pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-md border px-2 py-1 font-mono text-[0.68rem] font-semibold whitespace-nowrap shadow-md transition-opacity duration-150"
				>
					@{username}
				</span>
			</button>
		</span>
	);
}

export default function StudyQuote({ quote }: { quote: string }) {
	const t = useT();
	const { profile } = useProfile();
	const { students: weeklyStudents } = usePresence();
	const sectionRef = useRef<HTMLDivElement>(null);
	const students = [
		...(profile.isNameShared
			? [{ username: profile.username, profileKey: "local-student" }]
			: []),
		...weeklyStudents.filter((student) => !student.isCurrentStudent),
	];

	return (
		<section className="home-quote">
			<div ref={sectionRef} className="home-quote__viewport">
				<p id="study-quote-avatar-hint" className="sr-only">
					{t.presence.moveAvatarHint}
				</p>
				<div className="home-quote-avatars">
					{quoteAvatars.map((placement, index) => {
						const student = students[index];
						if (!student) return null;
						return (
							<QuoteAvatar
								key={student.profileKey}
								username={student.username}
								placement={placement}
								index={index}
								sectionRef={sectionRef}
							/>
						);
					})}
				</div>
				<blockquote className="home-quote__text border-border bg-surface-alt/70 text-fg-secondary max-w-2xl border-b px-8 py-8 text-center text-xl font-medium italic sm:px-12 sm:py-10 sm:text-2xl">
					“{quote}”
				</blockquote>
			</div>
		</section>
	);
}
