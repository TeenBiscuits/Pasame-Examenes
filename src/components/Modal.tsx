import type { ReactNode } from "react";
import { XSquare } from "reicon-react";

const modalDialogClass =
  "modal-dialog animate-dialog animate-dialog-zoom animate-dialog-duration-[240ms]";
export const compactModalDialogClass = `${modalDialogClass} modal-dialog--compact`;
export const wideModalDialogClass = `${modalDialogClass} modal-dialog--wide`;
export const settingsModalDialogClass = `${modalDialogClass} modal-dialog--settings`;

const modalTitleClass =
  "text-fg flex min-w-0 items-center gap-2 text-balance text-lg leading-tight font-semibold";

const modalCloseButtonClass =
  "text-fg-muted hover:bg-surface hover:text-fg focus-visible:ring-accent inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-[color,background-color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]";

const modalActionLinkClass =
  "flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border-2 p-3 text-left text-inherit no-underline transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:shadow-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";

const modalActionIconClass =
  "flex size-10 shrink-0 items-center justify-center rounded-lg";

export function ModalActionLink({
  href,
  icon,
  iconClassName,
  title,
  description,
  className,
  onClick,
  target,
  rel,
}: {
  href: string;
  icon: ReactNode;
  iconClassName: string;
  title: ReactNode;
  description?: ReactNode;
  className: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      data-cuelume-hover="tick"
      data-cuelume-press
      className={`${modalActionLinkClass} ${className}`}
    >
      <span className={`${modalActionIconClass} ${iconClassName}`}>{icon}</span>
      <span className="min-w-0">
        <span className="text-fg block text-sm leading-snug font-semibold">
          {title}
        </span>
        {description && (
          <span className="text-fg-muted mt-0.5 block text-xs leading-relaxed">
            {description}
          </span>
        )}
      </span>
    </a>
  );
}

export function ModalHeader({
  titleId,
  closeLabel,
  onClose,
  children,
}: {
  titleId: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-border mb-5 flex items-center justify-between gap-4 border-b pb-4">
      <div id={titleId} className={modalTitleClass}>
        {children}
      </div>
      <button
        type="button"
        data-cuelume-press="droplet"
        onClick={onClose}
        className={modalCloseButtonClass}
        aria-label={closeLabel}
      >
        <XSquare className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}
