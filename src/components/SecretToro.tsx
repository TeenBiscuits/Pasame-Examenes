import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { useLang } from "../i18n/hooks";
import { playSound } from "../lib/sound";
import { track } from "../lib/umami";

const RUN_SPEED = 1.8;

function toroTransform(x: number, direction: -1 | 1): string {
	return `translateX(${x}px) scaleX(${direction === -1 ? 1 : -1})`;
}

export default function SecretToro() {
	const containerRef = useRef<HTMLDivElement>(null);
	const toroRef = useRef<HTMLButtonElement>(null);
	const xRef = useRef(0);
	const directionRef = useRef<-1 | 1>(-1);
	const clickCountRef = useRef(0);
	const runningRef = useRef(false);
	const animationFrameRef = useRef<number | null>(null);
	const navigate = useNavigate();
	const { lang } = useLang();

	useEffect(() => {
		const container = containerRef.current;
		const toro = toroRef.current;
		if (!container || !toro) return;

		const placeAtRight = () => {
			xRef.current = Math.max(0, container.clientWidth - toro.offsetWidth);
			toro.style.transform = toroTransform(xRef.current, directionRef.current);
		};

		placeAtRight();
		window.addEventListener("resize", placeAtRight);
		return () => window.removeEventListener("resize", placeAtRight);
	}, []);

	function moveToro() {
		const container = containerRef.current;
		const toro = toroRef.current;
		if (!container || !toro) return;

		const width = toro.offsetWidth;
		let nextX = xRef.current + directionRef.current * RUN_SPEED;

		if (nextX + width < 0) {
			nextX = container.clientWidth;
			playSound("droplet");
		}
		if (nextX > container.clientWidth) {
			nextX = -width;
			playSound("droplet");
		}

		xRef.current = nextX;
		toro.style.transform = toroTransform(nextX, directionRef.current);
		animationFrameRef.current = requestAnimationFrame(moveToro);
	}

	const setToroElement = useCallback((element: HTMLButtonElement | null) => {
		if (element === null) {
			runningRef.current = false;
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
		}
		toroRef.current = element;
	}, []);

	function startToroRunning() {
		if (runningRef.current) return;
		runningRef.current = true;
		animationFrameRef.current = requestAnimationFrame(moveToro);
	}

	function handleToroClick() {
		const nextClickCount = clickCountRef.current + 1;
		clickCountRef.current = nextClickCount;
		const wasRunning = runningRef.current;
		directionRef.current = wasRunning
			? directionRef.current === -1
				? 1
				: -1
			: -1;
		if (toroRef.current) {
			toroRef.current.style.transform = toroTransform(
				xRef.current,
				directionRef.current,
			);
		}
		startToroRunning();

		playSound("press");
		if (wasRunning) playSound("tick");
		track("secret_toro_click", { count: nextClickCount });
		if (nextClickCount >= 3) {
			navigate({ to: `/${lang}/espain` as never });
		}
	}

	function handlePointerEnter() {
		if (runningRef.current) return;
		startToroRunning();
		playSound("chime");
	}

	return (
		<div
			ref={containerRef}
			className="pointer-events-none absolute inset-x-0 bottom-[-1.25rem] z-10 h-16 overflow-hidden"
			aria-hidden="false"
		>
			<button
				ref={setToroElement}
				type="button"
				aria-label="Toro de Osborne"
				title="Toro de Osborne"
				onPointerEnter={handlePointerEnter}
				onClick={handleToroClick}
				className="focus-visible:ring-accent pointer-events-auto absolute bottom-5 left-0 h-7 w-9 cursor-pointer touch-none rounded-full p-0 select-none focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none"
			>
				<span
					aria-hidden="true"
					className="pointer-events-none block size-full"
					style={{
						backgroundColor: "var(--color-border)",
						mask: "url('/toro.svg') center / contain no-repeat",
						WebkitMask: "url('/toro.svg') center / contain no-repeat",
					}}
				/>
			</button>
		</div>
	);
}
