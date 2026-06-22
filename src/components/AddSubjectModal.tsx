import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddSubjectModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddSubjectModal({
  open,
  onClose,
}: AddSubjectModalProps) {
  const t = useT();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.addSubject.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <a
            href={t.addSubject.openIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("add_subject_open_issue")}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/50 hover:bg-muted hover:border-primary/30 transition-colors cursor-pointer text-left no-underline text-foreground"
          >
            <span className="text-xl">📝</span>
            <div>
              <div className="font-medium text-foreground text-sm">
                {t.addSubject.openIssue}
              </div>
              <div className="text-xs text-muted-foreground">
                {t.addSubject.openIssueDesc}
              </div>
            </div>
          </a>

          <a
            href="https://github.com/TeenBiscuits/Pasame-Examenes/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("add_subject_contribute")}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/50 hover:bg-muted hover:border-primary/30 transition-colors cursor-pointer text-left no-underline text-foreground"
          >
            <span className="text-xl">🚀</span>
            <div>
              <div className="font-medium text-foreground text-sm">
                {t.addSubject.contribute}
              </div>
              <div className="text-xs text-muted-foreground">
                {t.addSubject.contributeDesc}
              </div>
            </div>
          </a>

          <div className="pt-2 border-t border-border">
            <a
              href="mailto:pablo.portas@udc.es"
              onClick={() => track("add_subject_email")}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/50 hover:bg-muted hover:border-border transition-colors cursor-pointer text-left no-underline text-muted-foreground"
            >
              <span className="text-xl">✉️</span>
              <div>
                <div className="font-medium text-foreground text-sm">
                  {t.addSubject.email}
                </div>
                <div className="text-xs text-muted-foreground">
                  pablo.portas@udc.es
                </div>
              </div>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
