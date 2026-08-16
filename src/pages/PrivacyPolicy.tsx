import { ArrowRightUp } from "reicon-react";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";

export default function PrivacyPolicy() {
  const t = useT();

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <header className="border-border mb-8 space-y-3 border-b pb-6">
        <p className="text-accent-fg text-xs font-semibold tracking-[0.18em] uppercase">
          {t.footer.privacyLastUpdated}
        </p>
        <h1 className="text-fg text-3xl font-bold tracking-tight sm:text-4xl">
          {t.footer.privacyTitle}
        </h1>
        <p className="text-fg-secondary max-w-prose text-base leading-relaxed text-pretty sm:text-lg">
          {t.footer.privacySummary}
        </p>
      </header>

      <div className="text-fg-secondary space-y-8">
        {t.footer.privacySections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-fg text-xl font-semibold">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-prose leading-relaxed text-pretty">
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="marker:text-accent-fg max-w-prose list-disc space-y-2 pl-5 leading-relaxed">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="border-border space-y-4 border-t pt-8">
          <div className="space-y-2">
            <h2 className="text-fg text-xl font-semibold">
              {t.footer.privacyProvidersTitle}
            </h2>
            <p className="max-w-prose leading-relaxed text-pretty">
              {t.footer.privacyProvidersIntro}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {t.footer.privacyProviders.map((provider) => (
              <article
                key={provider.name}
                className="border-border bg-surface-alt rounded-xl border p-4"
              >
                <h3 className="text-fg font-semibold">{provider.name}</h3>
                <p className="text-fg-muted mt-1 text-sm leading-relaxed">
                  {provider.description}
                </p>
                <a
                  href={provider.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-fg focus-visible:ring-accent mt-3 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                  onClick={() =>
                    track("external_link_click", { target: provider.target })
                  }
                >
                  {provider.linkLabel}
                  <ArrowRightUp
                    weight="Filled"
                    className="size-3.5"
                    aria-hidden="true"
                  />
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
