import { AngleDown } from "reicon-react";
import { useT } from "../i18n/hooks";
import { playSound } from "../lib/sound";

export default function FaqSection() {
	const t = useT();

	return (
		<section className="mt-14 text-left" aria-labelledby="faq-title">
			<h2
				id="faq-title"
				className="text-fg mb-5 text-center text-2xl font-semibold sm:text-3xl"
			>
				{t.home.faqTitle}
			</h2>
			<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
				{t.home.faqs.map((faq) => (
					<details
						key={faq.question}
						className="faq-item border-border bg-surface-alt overflow-hidden rounded-xl border-2"
						onToggle={() => {
							playSound("toggle");
						}}
					>
						<summary className="faq-summary text-fg flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-left font-semibold sm:px-5">
							<span>{faq.question}</span>
							<AngleDown
								className="faq-chevron text-fg-muted size-5 shrink-0"
								aria-hidden="true"
							/>
						</summary>
						<div className="bg-card-footer border-card-footer-border text-fg-secondary rounded-b-[calc(0.75rem-2px)] px-4 py-4 text-sm leading-relaxed sm:px-5">
							<p>{faq.answer}</p>
						</div>
					</details>
				))}
			</div>
		</section>
	);
}
