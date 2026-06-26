import { useState, useRef } from "react";

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "textarea" | "number";
  label?: string;
  className?: string;
  placeholder?: string;
}

export default function EditableField({
  value,
  onChange,
  type = "text",
  label,
  className = "",
  placeholder,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState("");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const startEditing = () => {
    setLocal(value);
    setEditing(true);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) {
        el.focus();
        if (type !== "textarea") {
          (el as HTMLInputElement).select();
        }
      }
    });
  };

  const save = () => {
    setEditing(false);
    if (local !== value) {
      onChange(local);
    }
  };

  const cancel = () => {
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      cancel();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      save();
    }
  };

  if (!editing) {
    return (
      <button
        type="button"
        className={`w-full text-left cursor-pointer rounded-md border border-dashed border-transparent hover:border-amber-400/60 hover:bg-amber-50/30 px-1 py-0.5 -mx-1 -my-0.5 transition-all ${className}`}
        onClick={startEditing}
        aria-label={`Edit ${label ?? "field"}`}
      >
        {label && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 block mb-0.5">
            {label}
          </span>
        )}
        <span className="whitespace-pre-wrap text-sm">
          {value || (
            <span className="italic text-fg-muted">
              {placeholder || "(empty)"}
            </span>
          )}
        </span>
      </button>
    );
  }

  const InputComponent = type === "textarea" ? "textarea" : "input";

  return (
    <div>
      {label && (
        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 block mb-1">
          {label}
        </span>
      )}
      <InputComponent
        ref={inputRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
        value={local}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => setLocal(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
        className={`w-full p-2 text-sm rounded-md border-2 border-amber-400 bg-surface focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 focus:outline-none ${className} ${type === "textarea" ? "resize-y min-h-[80px]" : ""}`}
        rows={type === "textarea" ? 4 : undefined}
        placeholder={placeholder}
        type={type === "number" ? "number" : "text"}
      />
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] text-amber-600">
          Ctrl+Enter to save &middot; Esc to cancel
        </span>
      </div>
    </div>
  );
}
