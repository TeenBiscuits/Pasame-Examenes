import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SubjectMeta, Topic } from "../data/types";
import { useT } from "../i18n/hooks";
import { startPracticeTour } from "../lib/tour";
import { useLangTo } from "../lib/useLangTo";
import { useKeyboardNav } from "./useKeyboardNav";

interface UsePracticeTopicNavigationOptions {
	subject: SubjectMeta | undefined;
	topic: string | undefined;
	topicInfo: Topic | undefined;
	questionsLength: number;
	currentIndex: number;
	setCurrentIndex: (index: number) => void;
}

export function usePracticeTopicNavigation({
	subject,
	topic,
	topicInfo,
	questionsLength,
	currentIndex,
	setCurrentIndex,
}: UsePracticeTopicNavigationOptions) {
	const navigate = useNavigate();
	const t = useT();
	const langTo = useLangTo();
	const [navState, setNavState] = useState({
		direction: undefined as "next" | "prev" | undefined,
		showLeftFade: false,
		showRightFade: false,
	});
	const { direction, showLeftFade, showRightFade } = navState;
	const setDirection = useCallback(
		(nextDirection: typeof navState.direction) =>
			setNavState((prev) => ({ ...prev, direction: nextDirection })),
		[],
	);
	const navRef = useRef<HTMLDivElement>(null);
	const currentIndexRef = useRef(currentIndex);

	const scrollToNav = useCallback((index: number) => {
		const container = navRef.current;
		if (!container) return;
		const button = container.children[index] as HTMLElement | undefined;
		if (!button) return;
		requestAnimationFrame(() => {
			const containerRect = container.getBoundingClientRect();
			const buttonRect = button.getBoundingClientRect();
			const step = 108;
			if (buttonRect.right > containerRect.right - 84) {
				container.scrollBy({ left: step, behavior: "smooth" });
			} else if (buttonRect.left < containerRect.left + 84) {
				container.scrollBy({ left: -step, behavior: "smooth" });
			}
		});
	}, []);

	useEffect(() => {
		currentIndexRef.current = currentIndex;
	});

	const subjectReadyRef = useRef(false);
	const scrollToHeaderRef = useRef<() => void>(() => {});
	useEffect(() => {
		subjectReadyRef.current = !!subject;
	}, [subject]);

	const navEventData = useCallback(
		() => ({ subjectId: subject?.id || "", topic: topic || "" }),
		[subject?.id, topic],
	);

	useKeyboardNav({
		enabledRef: subjectReadyRef,
		questionsLength,
		currentIndexRef,
		setCurrentIndex,
		scrollToNav,
		setDirection,
		eventName: "practice_navigate",
		eventData: navEventData,
		onKeyPress: () => {
			scrollToHeaderRef.current();
		},
	});

	useEffect(() => {
		if (!subject || !topicInfo) {
			navigate({ to: langTo("/") as never, replace: true });
		}
	}, [subject, topicInfo, navigate, langTo]);

	useEffect(() => {
		const element = navRef.current;
		if (!element) return;
		const check = () => {
			setNavState((prev) => ({
				...prev,
				showLeftFade: element.scrollLeft > 4,
				showRightFade:
					element.scrollLeft + element.clientWidth < element.scrollWidth - 4,
			}));
		};
		check();
		element.addEventListener("scroll", check, { passive: true });
		const resizeObserver = new ResizeObserver(check);
		resizeObserver.observe(element);
		return () => {
			element.removeEventListener("scroll", check);
			resizeObserver.disconnect();
		};
	}, []);

	useEffect(() => {
		if (questionsLength === 0) return;
		const timer = setTimeout(() => {
			startPracticeTour(
				[
					{
						element: '[data-tour="practice-back"]',
						popover: {
							title: t.tour.practice.step1Title,
							description: t.tour.practice.step1Desc,
							side: "bottom",
						},
					},
					{
						element: '[data-tour="practice-nav"]',
						popover: {
							title: t.tour.practice.step2Title,
							description: t.tour.practice.step2Desc,
							side: "bottom",
						},
					},
					{
						element: '[data-tour="practice-card"]',
						popover: {
							title: t.tour.practice.step3Title,
							description: t.tour.practice.step3Desc,
							side: "top",
						},
					},
					{
						element: '[data-tour="practice-actions"]',
						popover: {
							title: t.tour.practice.step4Title,
							description: t.tour.practice.step4Desc,
							side: "top",
						},
					},
					{
						element: '[data-tour="practice-nav-btns"]',
						popover: {
							title: t.tour.practice.step5Title,
							description: t.tour.practice.step5Desc,
							side: "top",
						},
					},
					{
						element: '[data-tour="report-issue"]',
						popover: {
							title: t.tour.reportIssueTitle,
							description: t.tour.reportIssueDesc,
							side: "top",
						},
					},
				],
				{
					next: t.tour.next,
					previous: t.tour.previous,
					done: t.tour.done,
				},
			);
		}, 500);
		return () => clearTimeout(timer);
	}, [questionsLength, t]);

	return {
		direction,
		showLeftFade,
		showRightFade,
		setDirection,
		navRef,
		scrollToNav,
		scrollToHeaderRef,
	};
}
