import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { bind as bindCuelume } from "cuelume";
import { useLocation, useNavigation, Outlet } from "react-router";
import { Measurer } from "mesurer";
import Header from "./components/Header";
import StarPopup from "./components/StarPopup";
import { useLang, useT } from "./i18n/hooks";
import { track, identify, setSessionData, getDistinctId } from "./lib/umami";
import { playSound } from "./lib/sound";
import { useTheme } from "./theme/hooks";
import { MemoCheck, ShieldCheck, ArrowRightUp } from "reicon-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon } from "@hugeicons/core-free-icons";
import { closeDialog, showDialog, useDialogDismiss } from "./lib/dialog";
import { ModalHeader, wideModalDialogClass } from "./components/Modal";
import { LangLink } from "./lib/lang-link";
import { getSubject, subjects } from "./subjects";
import {
  HomeCardsSkeleton,
  HomeCardsSkeletonFixture,
  SubjectContentSkeleton,
  SubjectContentSkeletonFixture,
} from "./components/LoadingSkeletons";

export function PageLoader() {
  const location = useLocation();
  const navigation = useNavigation();
  const pathname = navigation.location?.pathname ?? location.pathname;

  return (
    <div
      className="bg-surface text-fg min-h-screen min-h-svh font-sans"
      aria-busy="true"
    >
      <header className="safe-area-top bg-surface-alt border-border border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 text-sm font-bold sm:text-lg">
            <img
              src="/favicon.svg"
              alt=""
              width={36}
              height={36}
              className="size-9"
            />
            <span>Pásame Exámenes</span>
          </div>
          <div
            className="bg-border h-8 w-24 rounded-lg opacity-70"
            aria-hidden="true"
          />
        </div>
      </header>
      <main>
        <PendingPageContent pathname={pathname} />
      </main>
    </div>
  );
}

function PendingPageContent({ pathname }: { pathname: string }) {
  const parts = pathname.split("/").filter(Boolean);
  const lang = parts[0] === "en" || parts[0] === "gl" ? parts[0] : "es";
  const subject = parts.length >= 2 ? getSubject(parts[1]) : undefined;
  const copy = {
    en: {
      subtitle:
        "Open-source platform for practicing FIC exam questions. Choose a subject below to get started.",
      loading: "Loading content…",
    },
    es: {
      subtitle:
        "Plataforma de código abierto para practicar preguntas de exámenes de la FIC. Elige una asignatura para empezar.",
      loading: "Cargando contenido…",
    },
    gl: {
      subtitle:
        "Plataforma de código aberto para practicar preguntas de exames da FIC. Elixe unha materia para comezar.",
      loading: "Cargando contido…",
    },
  }[lang];

  return (
    <>
      <section className="px-4 py-16 text-center sm:py-20">
        {subject ? (
          <>
            <p className="text-fg-muted mb-3 text-xs tracking-widest uppercase">
              {subject.courseCode} &middot; {subject.degree}
            </p>
            <h1 className="text-fg mb-3 text-4xl font-semibold sm:text-5xl lg:text-6xl">
              {subject.name}
            </h1>
            <div
              className="bg-border mx-auto mt-5 h-5 max-w-xl rounded-full opacity-70"
              aria-hidden="true"
            />
          </>
        ) : (
          <>
            <h1 className="text-fg mb-3 text-4xl font-semibold sm:text-5xl lg:text-6xl">
              Pásame Exámenes
            </h1>
            <p className="text-fg-secondary mx-auto max-w-2xl text-base sm:text-lg lg:text-xl">
              {copy.subtitle}
            </p>
          </>
        )}
      </section>
      <div className="mx-auto max-w-6xl px-4 pb-14">
        {subject ? (
          <SubjectContentSkeleton loading>
            <SubjectContentSkeletonFixture />
          </SubjectContentSkeleton>
        ) : (
          <HomeCardsSkeleton loading>
            <HomeCardsSkeletonFixture count={subjects.length + 1} />
          </HomeCardsSkeleton>
        )}
      </div>
      <span className="sr-only" role="status">
        {copy.loading}
      </span>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function SessionTracker() {
  const { lang } = useLang();
  const { theme } = useTheme();

  useEffect(() => {
    const id = getDistinctId();
    if (id) identify({ id });
  }, []);

  setSessionData({ lang, theme });

  return null;
}

const footerTextLinkClass =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-fg-muted underline-offset-4 hover:bg-surface hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors";

function CreativeCommonsIcons() {
  return (
    <span
      className="text-fg-muted inline-flex items-center gap-1 align-[-0.15em]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 30 30" className="size-[1.15em] shrink-0 fill-current">
        <path d="M14.972 0c4.196 0 7.769 1.465 10.715 4.393A14.426 14.426 0 0128.9 9.228C29.633 11.04 30 12.964 30 15c0 2.054-.363 3.978-1.085 5.772a13.77 13.77 0 01-3.2 4.754 15.417 15.417 0 01-4.983 3.322A14.932 14.932 0 0114.973 30c-1.982 0-3.88-.38-5.692-1.14a15.087 15.087 0 01-4.875-3.293c-1.437-1.437-2.531-3.058-3.281-4.862A14.71 14.71 0 010 15c0-1.982.38-3.888 1.138-5.719a15.062 15.062 0 013.308-4.915C7.303 1.456 10.812 0 14.972 0zm.055 2.706c-3.429 0-6.313 1.196-8.652 3.589a12.896 12.896 0 00-2.72 4.031 11.814 11.814 0 00-.95 4.675c0 1.607.316 3.156.95 4.646a12.428 12.428 0 002.72 3.992 12.362 12.362 0 003.99 2.679c1.483.616 3.037.924 4.662.924 1.607 0 3.164-.312 4.675-.937a12.954 12.954 0 004.084-2.705c2.339-2.286 3.508-5.152 3.508-8.6 0-1.66-.304-3.231-.91-4.713a11.994 11.994 0 00-2.651-3.965c-2.412-2.41-5.314-3.616-8.706-3.616zm-.188 9.803l-2.01 1.045c-.215-.445-.477-.758-.79-.937-.312-.178-.602-.268-.87-.268-1.34 0-2.01.884-2.01 2.652 0 .803.17 1.446.509 1.928.34.482.84.724 1.5.724.876 0 1.492-.43 1.85-1.286l1.847.937a4.407 4.407 0 01-1.634 1.728c-.696.42-1.464.63-2.303.63-1.34 0-2.42-.41-3.242-1.233-.821-.82-1.232-1.964-1.232-3.428 0-1.428.416-2.562 1.246-3.401.83-.84 1.879-1.26 3.147-1.26 1.858 0 3.188.723 3.992 2.17zm8.652 0l-1.983 1.045c-.214-.445-.478-.758-.79-.937-.313-.178-.613-.268-.897-.268-1.34 0-2.01.884-2.01 2.652 0 .803.17 1.446.51 1.928.338.482.838.724 1.5.724.874 0 1.49-.43 1.847-1.286l1.875.937a4.606 4.606 0 01-1.66 1.728c-.696.42-1.455.63-2.277.63-1.357 0-2.441-.41-3.253-1.233-.814-.82-1.22-1.964-1.22-3.428 0-1.428.415-2.562 1.246-3.401.83-.84 1.879-1.26 3.147-1.26 1.857 0 3.18.723 3.965 2.17z" />
      </svg>
      <svg viewBox="0 0 30 30" className="size-[1.15em] shrink-0 fill-current">
        <path d="M14.973 0c4.213 0 7.768 1.446 10.66 4.34C28.544 7.25 30 10.803 30 15c0 4.215-1.43 7.723-4.287 10.526C22.678 28.51 19.098 30 14.973 30c-4.054 0-7.571-1.474-10.553-4.42C1.474 22.633 0 19.107 0 15S1.474 7.34 4.42 4.34C7.313 1.446 10.83 0 14.973 0zm.054 2.706c-3.41 0-6.295 1.196-8.652 3.589-2.447 2.5-3.67 5.402-3.67 8.706 0 3.321 1.214 6.196 3.642 8.624 2.429 2.429 5.322 3.642 8.679 3.642 3.339 0 6.25-1.222 8.732-3.67 2.358-2.267 3.536-5.133 3.536-8.598 0-3.41-1.197-6.311-3.589-8.705-2.392-2.392-5.285-3.588-8.678-3.588zm4.018 8.57v6.134H17.33v7.286h-4.66V17.41h-1.714v-6.134a.93.93 0 01.28-.683.933.933 0 01.684-.281h6.161c.25 0 .474.093.67.28a.912.912 0 01.294.684zM12.91 7.42c0-1.41.696-2.116 2.09-2.116s2.09.705 2.09 2.116c0 1.393-.697 2.09-2.09 2.09-1.393 0-2.09-.697-2.09-2.09z" />
      </svg>
      <svg viewBox="0 0 30 30" className="size-[1.15em] shrink-0 fill-current">
        <path d="M14.973 0c4.196 0 7.75 1.455 10.66 4.366C28.544 7.26 30 10.804 30 15c0 4.197-1.43 7.714-4.287 10.553C22.696 28.518 19.115 30 14.973 30c-4.054 0-7.571-1.473-10.553-4.42C1.474 22.634 0 19.108 0 15c0-4.088 1.474-7.633 4.42-10.633C7.33 1.455 10.848 0 14.973 0zm.054 2.706c-3.41 0-6.295 1.205-8.652 3.616-2.447 2.483-3.67 5.375-3.67 8.678 0 3.34 1.214 6.214 3.642 8.625 2.429 2.43 5.322 3.643 8.679 3.643 3.339 0 6.25-1.223 8.732-3.67 2.358-2.285 3.536-5.151 3.536-8.598 0-3.428-1.197-6.321-3.589-8.678-2.375-2.412-5.268-3.616-8.678-3.616zM8.33 12.884c.286-1.84 1.026-3.264 2.223-4.273 1.196-1.008 2.651-1.513 4.366-1.513 2.356 0 4.232.76 5.625 2.277 1.393 1.517 2.09 3.464 2.09 5.839 0 2.304-.724 4.219-2.17 5.745-1.447 1.526-3.321 2.29-5.626 2.29-1.696 0-3.16-.508-4.392-1.527-1.233-1.018-1.973-2.464-2.224-4.339H12c.09 1.822 1.187 2.733 3.295 2.733 1.053 0 1.902-.456 2.544-1.366.644-.91.965-2.126.965-3.643 0-1.59-.294-2.799-.883-3.63-.59-.83-1.437-1.245-2.545-1.245-2.001 0-3.126.884-3.375 2.651h1.098l-2.973 2.973-2.973-2.973H8.33z" />
      </svg>
    </span>
  );
}

function LicenseIcon() {
  return <MemoCheck className="size-4" aria-hidden="true" />;
}

function PrivacyIcon() {
  return <ShieldCheck className="size-4" aria-hidden="true" />;
}

function ExternalLinkIcon() {
  return (
    <ArrowRightUp weight="Filled" className="size-3.5" aria-hidden="true" />
  );
}

function ModalShell({
  dialogRef,
  title,
  titleId,
  children,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
  titleId: string;
  children: ReactNode;
}) {
  const t = useT();

  useDialogDismiss(dialogRef, () => playSound("droplet"));

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      className={`${wideModalDialogClass} p-6`}
      aria-labelledby={titleId}
    >
      <ModalHeader
        titleId={titleId}
        closeLabel={t.footer.close}
        onClose={() => closeDialog(dialogRef.current)}
      >
        {title}
      </ModalHeader>
      {children}
    </dialog>
  );
}

function LicensesModal({
  dialogRef,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  const t = useT();

  return (
    <ModalShell
      dialogRef={dialogRef}
      title={t.footer.licenseTitle}
      titleId="licenses-modal-title"
    >
      <div className="text-fg-secondary space-y-4 text-sm">
        <p className="max-w-prose leading-relaxed text-pretty">
          {t.footer.licenseIntro}
        </p>
        <div className="grid gap-3 md:grid-cols-[1.08fr_0.92fr]">
          <a
            href="https://creativecommons.org/licenses/BY-SA/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            data-cuelume-hover="tick"
            data-cuelume-press
            className="interactive-card group focus-visible:ring-accent flex h-full min-w-0 flex-col rounded-xl text-left focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => track("external_link_click", { target: "cc_by_sa" })}
          >
            <div className="border-border bg-surface-alt flex flex-1 flex-col rounded-t-xl border-x-2 border-t-2 px-4 pt-4 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-accent-fg mb-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
                    {t.footer.contentLicenseTitle.split(":")[0]}
                  </p>
                  <div className="text-fg text-base leading-tight font-semibold">
                    CC BY-SA 4.0
                  </div>
                </div>
                <CreativeCommonsIcons />
              </div>
              <p className="text-fg-secondary mt-3 text-xs leading-relaxed">
                {t.footer.contentLicenseDescription}
              </p>
            </div>
            <div className="bg-card-footer border-card-footer-border text-fg flex items-center gap-1.5 rounded-b-xl border-x-2 border-b-2 px-4 py-2 text-sm">
              <span className="group-hover:text-accent-fg group-focus-visible:text-accent-fg inline-flex items-center gap-1.5 font-medium transition-colors">
                {t.footer.license}
                <ExternalLinkIcon />
              </span>
            </div>
          </a>
          <a
            href="https://www.apache.org/licenses/LICENSE-2.0"
            target="_blank"
            rel="noopener noreferrer"
            data-cuelume-hover="tick"
            data-cuelume-press
            className="interactive-card group focus-visible:ring-accent flex h-full min-w-0 flex-col rounded-xl text-left focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => track("external_link_click", { target: "apache_2" })}
          >
            <div className="border-border bg-surface-alt flex flex-1 flex-col rounded-t-xl border-x-2 border-t-2 px-4 pt-4 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-fg-muted mb-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
                    {t.footer.softwareLicenseTitle.split(":")[0]}
                  </p>
                  <div className="text-fg text-base leading-tight font-semibold">
                    Apache 2.0
                  </div>
                </div>
                <span className="border-border bg-surface text-fg-muted rounded-full border p-2">
                  <LicenseIcon />
                </span>
              </div>
              <p className="text-fg-muted mt-3 text-xs leading-relaxed">
                {t.footer.softwareLicenseDescription}
              </p>
            </div>
            <div className="bg-card-footer border-card-footer-border text-fg flex items-center gap-1.5 rounded-b-xl border-x-2 border-b-2 px-4 py-2 text-sm">
              <span className="group-hover:text-accent-fg group-focus-visible:text-accent-fg inline-flex items-center gap-1.5 font-medium transition-colors">
                {t.footer.license}
                <ExternalLinkIcon />
              </span>
            </div>
          </a>
        </div>
      </div>
    </ModalShell>
  );
}

function Footer() {
  const t = useT();
  const currentYear = new Date().getFullYear();
  const licensesDialogRef = useRef<HTMLDialogElement>(null);

  return (
    <footer className="border-border bg-surface-alt text-fg-muted border-t pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <p className="max-w-3xl leading-relaxed text-pretty">
            <a
              href="https://pe.pablopl.dev"
              className="text-fg hover:text-accent-fg focus-visible:ring-accent rounded font-semibold underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => track("external_link_click", { target: "site" })}
            >
              Pásame Exámenes
            </a>{" "}
            <span className="text-fg-muted">© {currentYear}</span> {t.footer.by}{" "}
            <a
              href="https://pablopl.dev"
              className="text-fg-secondary hover:text-accent-fg focus-visible:ring-accent rounded underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => track("external_link_click", { target: "author" })}
            >
              Pablo Portas López
            </a>{" "}
            {t.footer.contentIsLicensedUnder}{" "}
            <a
              href="https://creativecommons.org/licenses/BY-SA/4.0/"
              className="text-fg-secondary hover:text-accent-fg focus-visible:ring-accent rounded underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:outline-none"
              onClick={() =>
                track("external_link_click", { target: "cc_by_sa" })
              }
            >
              CC BY-SA 4.0
            </a>{" "}
            <CreativeCommonsIcons />
          </p>
          <nav
            aria-label={t.footer.linksLabel}
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:justify-end"
          >
            <button
              type="button"
              className={footerTextLinkClass}
              data-cuelume-hover="whisper"
              data-cuelume-press="bloom"
              onClick={() => {
                track("modal_open", { modal: "licenses" });
                if (!licensesDialogRef.current?.open) {
                  showDialog(licensesDialogRef.current);
                }
              }}
            >
              <LicenseIcon />
              {t.footer.licenses}
            </button>
            <LangLink
              to="/privacy"
              rel="nofollow"
              className={footerTextLinkClass}
              data-cuelume-hover="whisper"
              data-cuelume-press="bloom"
              onClick={() => track("nav_click", { target: "privacy" })}
            >
              <PrivacyIcon />
              {t.footer.privacy}
            </LangLink>
            <a
              href="https://github.com/TeenBiscuits/Pasame-Examenes"
              target="_blank"
              rel="noopener noreferrer"
              className={footerTextLinkClass}
              data-cuelume-hover="sparkle"
              data-cuelume-press="sparkle"
              onClick={() => track("external_link_click", { target: "github" })}
            >
              <HugeiconsIcon icon={Github01Icon} className="size-4" />
              <span>{t.footer.github}</span>
            </a>
          </nav>
        </div>
        <LicensesModal dialogRef={licensesDialogRef} />
      </div>
    </footer>
  );
}

export default function App() {
  const navigation = useNavigation();
  const pendingPathname = navigation.location?.pathname;

  useEffect(() => {
    bindCuelume();
  }, []);

  return (
    <div className="bg-surface text-fg flex min-h-dvh min-h-screen min-h-svh flex-col font-sans">
      <SessionTracker />
      <ScrollToTop />
      <Header />
      <StarPopup />
      <main
        className="flex-grow"
        aria-busy={pendingPathname ? true : undefined}
      >
        {pendingPathname ? (
          <PendingPageContent
            key={pendingPathname}
            pathname={pendingPathname}
          />
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
      {import.meta.env.DEV ? <Measurer /> : null}
    </div>
  );
}
