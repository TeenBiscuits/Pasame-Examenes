import { useCms } from "../../lib/cms-context";

export default function CmsToggle() {
  const { isEditing, toggleEditing } = useCms();

  if (!import.meta.env.DEV) return null;

  return (
    <button
      type="button"
      onClick={toggleEditing}
      aria-label="Toggle CMS editor (Ctrl+Shift+E)"
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg border-2 transition-all duration-200 flex items-center justify-center text-lg ${
        isEditing
          ? "bg-amber-500 border-amber-600 text-white scale-110"
          : "bg-surface border-border text-fg-muted hover:border-amber-400 hover:text-amber-600"
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
  );
}
