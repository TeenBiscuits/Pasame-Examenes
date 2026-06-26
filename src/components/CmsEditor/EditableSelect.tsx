import { useState } from "react";

interface EditableSelectProps {
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  label?: string;
}

export default function EditableSelect({
  value,
  options,
  onChange,
  label,
}: EditableSelectProps) {
  const [editing, setEditing] = useState(false);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div>
      {label && (
        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 block mb-1">
          {label}
        </span>
      )}
      {!editing ? (
        <button
          type="button"
          className="w-full text-left cursor-pointer rounded-md border border-dashed border-transparent hover:border-amber-400/60 hover:bg-amber-50/30 px-1 py-0.5 -mx-1 -my-0.5 transition-all text-sm"
          onClick={() => setEditing(true)}
          aria-label={`Edit ${label ?? "selection"}`}
        >
          {selectedOption ? (
            <span>{selectedOption.label}</span>
          ) : (
            <span className="italic text-fg-muted">{value || "(unset)"}</span>
          )}
        </button>
      ) : (
        <select
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setEditing(false);
          }}
          onBlur={() => setEditing(false)}
          className="w-full p-2 text-sm rounded-md border-2 border-amber-400 bg-surface focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
          aria-label={label}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
