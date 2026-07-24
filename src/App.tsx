import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { bind as bindCuelume } from "cuelume";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useParams,
  Navigate,
  Outlet,
} from "react-router-dom";
import Header from "./components/Header";
import StarPopup from "./components/StarPopup";
import { useLang, useT } from "./i18n/hooks";
import type { Lang } from "./i18n/context";
import { track, identify, setSessionData, getDistinctId } from "./lib/umami";
import { buildLangPath } from "./lib/lang-link-utils";
import { useTheme } from "./theme/hooks";
import {
  CloseSquare2,
  MemoCheck,
  ShieldCheck,
  ArrowRightUp,
} from "reicon-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon } from "@hugeicons/core-free-icons";

const Home = lazy(() => import("./pages/Home"));
const SubjectHome = lazy(() => import("./pages/SubjectHome"));
const PracticeTopic = lazy(() => import("./pages/PracticeTopic"));
const ExamSimulation = lazy(() => import("./pages/ExamSimulation"));

function PageLoader() {
  return (
    <div
      className="flex items-center justify-center py-16"
      style={{ minHeight: "60svh" }}
    >
      <div className="border-accent size-8 animate-spin rounded-full border-2 border-t-transparent" />
    </div>
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

function detectLang(): Lang {
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "en" || stored === "es" || stored === "gl")
      return stored as Lang;
  } catch {
    /* localStorage unavailable */
  }
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("es")) return "es";
  return "en";
}

function LangRedirect() {
  const { pathname } = useLocation();
  const lang = detectLang();
  const target = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
  return <Navigate to={target} replace />;
}

function LangGuard() {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const { lang, setLang } = useLang();

  useEffect(() => {
    if (
      paramLang &&
      (paramLang === "en" || paramLang === "es" || paramLang === "gl") &&
      paramLang !== lang
    ) {
      setLang(paramLang);
    }
  }, [paramLang, lang, setLang]);

  if (!paramLang || !["en", "es", "gl"].includes(paramLang)) {
    const detected = detectLang();
    return (
      <Navigate
        to={buildLangPath(
          detected,
          location.pathname.replace(/^\/(en|es|gl)\/?/, "/") || "/",
        )}
        replace
      />
    );
  }

  return <Outlet />;
}

const modalLinkClass =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-fg-secondary hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors";
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
        <path d="M14.973 0c4.214 0 7.768 1.446 10.66 4.339C28.544 7.232 30 10.786 30 15c0 4.215-1.429 7.723-4.287 10.527C22.678 28.51 19.097 30 14.973 30c-4.072 0-7.59-1.482-10.553-4.446C1.474 22.607 0 19.09 0 15c0-4.107 1.474-7.66 4.42-10.66C7.313 1.446 10.83 0 14.973 0zM3.375 10.956c-.446 1.232-.67 2.58-.67 4.045 0 3.321 1.214 6.196 3.642 8.624 2.447 2.412 5.34 3.617 8.679 3.617 3.375 0 6.285-1.223 8.733-3.67.875-.839 1.561-1.714 2.061-2.626l-5.651-2.518a3.866 3.866 0 01-1.433 2.317c-.76.598-1.657.943-2.693 1.031v2.304h-1.74v-2.304c-1.661-.017-3.18-.615-4.554-1.794l2.063-2.089c.981.91 2.098 1.366 3.348 1.366.517 0 .96-.116 1.326-.349.366-.231.55-.615.55-1.151 0-.376-.135-.68-.402-.911l-1.447-.617-1.767-.804-2.384-1.044-7.661-3.427zm11.652-8.278c-3.41 0-6.295 1.206-8.652 3.616-.59.59-1.143 1.26-1.66 2.01l5.732 2.571a3.513 3.513 0 011.42-1.888c.695-.473 1.508-.737 2.437-.79V5.893h1.741v2.304c1.376.071 2.625.535 3.75 1.392L17.84 11.6c-.84-.59-1.697-.884-2.572-.884-.464 0-.88.09-1.245.267-.366.179-.55.483-.55.911 0 .125.045.25.134.375l1.902.858 1.313.59 2.41 1.07 7.687 3.429c.25-1.054.375-2.125.375-3.214 0-3.447-1.196-6.349-3.588-8.707-2.375-2.41-5.27-3.616-8.68-3.616z" />
      </svg>
      <svg viewBox="0 0 30 30" className="size-[1.15em] shrink-0 fill-current">
        <path d="M14.973 0c4.196 0 7.75 1.455 10.66 4.366C28.544 7.26 30 10.804 30 15c0 4.197-1.43 7.714-4.287 10.553C22.696 28.518 19.115 30 14.973 30c-4.054 0-7.571-1.473-10.553-4.42C1.474 22.634 0 19.108 0 15c0-4.088 1.474-7.633 4.42-10.633C7.33 1.455 10.848 0 14.973 0zm.054 2.706c-3.41 0-6.295 1.205-8.652 3.616-2.447 2.483-3.67 5.375-3.67 8.678 0 3.34 1.214 6.214 3.642 8.625 2.429 2.43 5.322 3.643 8.679 3.643 3.339 0 6.25-1.223 8.732-3.67 2.358-2.285 3.536-5.151 3.536-8.598 0-3.428-1.197-6.321-3.589-8.678-2.375-2.412-5.268-3.616-8.678-3.616zM8.33 12.884c.286-1.84 1.026-3.264 2.223-4.273 1.196-1.008 2.651-1.513 4.366-1.513 2.356 0 4.232.76 5.625 2.277 1.393 1.517 2.09 3.464 2.09 5.839 0 2.304-.724 4.219-2.17 5.745-1.447 1.526-3.321 2.29-5.626 2.29-1.696 0-3.16-.508-4.392-1.527-1.233-1.018-1.973-2.464-2.224-4.339H12c.09 1.822 1.187 2.733 3.295 2.733 1.053 0 1.902-.456 2.544-1.366.644-.91.965-2.126.965-3.643 0-1.59-.294-2.799-.883-3.63-.59-.83-1.437-1.245-2.545-1.245-2.001 0-3.126.884-3.375 2.651h1.098l-2.973 2.973-2.973-2.973H8.33z" />
      </svg>
    </span>
  );
}

function CloseIcon() {
  return <CloseSquare2 className="size-5" />;
}

function LicenseIcon() {
  return <MemoCheck className="size-4" />;
}

function PrivacyIcon() {
  return <ShieldCheck className="size-4" />;
}

function ExternalLinkIcon() {
  return <ArrowRightUp weight="Filled" className="size-3.5" />;
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

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    const handleClick = (event: MouseEvent) => {
      if (event.target === el) {
        el.close();
      }
    };
    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [dialogRef]);

  return (
    <dialog
      ref={dialogRef}
      className="animate-dialog bg-surface-alt m-auto max-h-[86svh] w-[min(92vw,42rem)] overflow-hidden rounded-2xl p-6 shadow-2xl backdrop:bg-black/50 backdrop:transition-[background-color,overlay,display] backdrop:duration-200"
      aria-labelledby={titleId}
    >
      <div className="border-border mb-5 flex items-center justify-between gap-4 border-b pb-4">
        <h2 id={titleId} className="text-fg text-lg font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="text-fg-muted hover:text-fg-secondary focus-visible:ring-accent cursor-pointer rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label={t.footer.close}
        >
          <CloseIcon />
        </button>
      </div>
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
          <article className="border-accent-border bg-accent-light/50 flex flex-col rounded-2xl border-2 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-accent mb-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
                  {t.footer.contentLicenseTitle.split(":")[0]}
                </p>
                <h3 className="text-fg text-base font-semibold">
                  CC BY-NC-SA 4.0
                </h3>
              </div>
              <CreativeCommonsIcons />
            </div>
            <p className="text-fg-secondary mb-4 text-xs leading-relaxed">
              {t.footer.contentLicenseDescription}
            </p>
            <div className="mt-auto">
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${modalLinkClass} w-full`}
                onClick={() =>
                  track("external_link_click", { target: "cc_by_nc_sa" })
                }
              >
                {t.footer.license}
                <ExternalLinkIcon />
              </a>
            </div>
          </article>
          <article className="border-border bg-surface/50 flex flex-col rounded-2xl border-2 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-fg-muted mb-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
                  {t.footer.softwareLicenseTitle.split(":")[0]}
                </p>
                <h3 className="text-fg text-base font-semibold">Apache 2.0</h3>
              </div>
              <span className="border-border bg-surface-alt text-fg-muted rounded-full border p-2">
                <LicenseIcon />
              </span>
            </div>
            <p className="text-fg-muted mb-4 text-xs leading-relaxed">
              {t.footer.softwareLicenseDescription}
            </p>
            <div className="mt-auto">
              <a
                href="https://www.apache.org/licenses/LICENSE-2.0"
                target="_blank"
                rel="noopener noreferrer"
                className={`${modalLinkClass} w-full`}
                onClick={() =>
                  track("external_link_click", { target: "apache_2" })
                }
              >
                {t.footer.license}
                <ExternalLinkIcon />
              </a>
            </div>
          </article>
        </div>
      </div>
    </ModalShell>
  );
}

function PrivacyModal({
  dialogRef,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  const t = useT();

  return (
    <ModalShell
      dialogRef={dialogRef}
      title={t.footer.privacyTitle}
      titleId="privacy-modal-title"
    >
      <div className="text-fg-secondary max-h-[65svh] [scrollbar-gutter:stable] space-y-5 overflow-y-auto pr-4 text-sm">
        <div className="space-y-2">
          <p className="text-fg-muted text-xs font-medium tracking-[0.18em] uppercase">
            {t.footer.privacyLastUpdated}
          </p>
          <p className="max-w-prose leading-relaxed text-pretty">
            {t.footer.privacySummary}
          </p>
        </div>

        {t.footer.privacySections.map((section) => (
          <section
            key={section.title}
            className="border-border space-y-2 border-t pt-4 first:border-t-0 first:pt-0"
          >
            <h3 className="text-fg text-base font-semibold">{section.title}</h3>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-pretty">
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="marker:text-accent list-disc space-y-1 pl-5 leading-relaxed">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="border-border space-y-3 border-t pt-4">
          <div className="space-y-2">
            <h3 className="text-fg text-base font-semibold">
              {t.footer.privacyProvidersTitle}
            </h3>
            <p className="leading-relaxed text-pretty">
              {t.footer.privacyProvidersIntro}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {t.footer.privacyProviders.map((provider) => (
              <article
                key={provider.name}
                className="border-border bg-surface/60 rounded-xl border p-3"
              >
                <h4 className="text-fg font-semibold">{provider.name}</h4>
                <p className="text-fg-muted mt-1 text-xs leading-relaxed">
                  {provider.description}
                </p>
                <a
                  href={provider.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent focus-visible:ring-accent mt-3 inline-flex items-center gap-1.5 rounded-lg text-xs font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                  onClick={() =>
                    track("external_link_click", { target: provider.target })
                  }
                >
                  {provider.linkLabel}
                  <ExternalLinkIcon />
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </ModalShell>
  );
}

function Footer() {
  const t = useT();
  const currentYear = new Date().getFullYear();
  const licensesDialogRef = useRef<HTMLDialogElement>(null);
  const privacyDialogRef = useRef<HTMLDialogElement>(null);

  return (
    <footer className="border-border bg-surface-alt text-fg-muted border-t pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <p className="max-w-3xl leading-relaxed text-pretty">
            <a
              href="https://pe.pablopl.dev"
              className="text-fg hover:text-accent focus-visible:ring-accent rounded font-semibold underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => track("external_link_click", { target: "site" })}
            >
              Pásame Exámenes
            </a>{" "}
            <span className="text-fg-muted">© {currentYear}</span> {t.footer.by}{" "}
            <a
              href="https://pablopl.dev"
              className="text-fg-secondary hover:text-accent focus-visible:ring-accent rounded underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => track("external_link_click", { target: "author" })}
            >
              Pablo Portas López
            </a>{" "}
            {t.footer.isLicensedUnder}{" "}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              className="text-fg-secondary hover:text-accent focus-visible:ring-accent rounded underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:outline-none"
              onClick={() =>
                track("external_link_click", { target: "cc_by_nc_sa" })
              }
            >
              CC BY-NC-SA 4.0
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
              onClick={() => {
                track("modal_open", { modal: "licenses" });
                if (!licensesDialogRef.current?.open) {
                  licensesDialogRef.current?.showModal();
                }
              }}
            >
              <LicenseIcon />
              {t.footer.licenses}
            </button>
            <button
              type="button"
              className={footerTextLinkClass}
              data-cuelume-hover="whisper"
              onClick={() => {
                track("modal_open", { modal: "privacy" });
                if (!privacyDialogRef.current?.open) {
                  privacyDialogRef.current?.showModal();
                }
              }}
            >
              <PrivacyIcon />
              {t.footer.privacy}
            </button>
            <a
              href="https://github.com/TeenBiscuits/Pasame-Examenes"
              target="_blank"
              rel="noopener noreferrer"
              className={footerTextLinkClass}
              data-cuelume-hover="whisper"
              onClick={() => track("external_link_click", { target: "github" })}
            >
              <HugeiconsIcon icon={Github01Icon} className="size-4" />
              <span>{t.footer.github}</span>
            </a>
          </nav>
        </div>
        <LicensesModal dialogRef={licensesDialogRef} />
        <PrivacyModal dialogRef={privacyDialogRef} />
      </div>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    bindCuelume();
  }, []);

  return (
    <BrowserRouter>
      <div className="bg-surface text-fg flex min-h-screen min-h-svh flex-col font-sans">
        <SessionTracker />
        <ScrollToTop />
        <Header />
        <StarPopup />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/:lang" element={<LangGuard />}>
                <Route index element={<Home />} />
                <Route path=":subjectId" element={<SubjectHome />} />
                <Route
                  path=":subjectId/practice"
                  element={<Navigate to=".." relative="path" replace />}
                />
                <Route
                  path=":subjectId/practice/:topic"
                  element={<PracticeTopic />}
                />
                <Route
                  path=":subjectId/exam/:year"
                  element={<ExamSimulation />}
                />
              </Route>
              <Route path="/" element={<LangRedirect />} />
              <Route path="/:subjectId" element={<LangRedirect />} />
              <Route path="/:subjectId/practice" element={<LangRedirect />} />
              <Route
                path="/:subjectId/practice/:topic"
                element={<LangRedirect />}
              />
              <Route path="/:subjectId/exam/:year" element={<LangRedirect />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
