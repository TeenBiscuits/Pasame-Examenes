import { useState, useRef } from "react";
import { useCms } from "../../lib/cms-context";

interface EditableImageProps {
  value: string | undefined | null;
  onChange: (value: string | null) => void;
  label: string;
  subjectId: string;
}

export default function EditableImage({
  value,
  onChange,
  label,
  subjectId,
}: EditableImageProps) {
  const { availableImages } = useCms();
  const [editing, setEditing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const loadedRef = useRef(false);

  const startEditing = () => {
    setEditing(true);
    if (!loadedRef.current) {
      setLoading(true);
      availableImages(subjectId).then(({ images: imgs }) => {
        setImages(imgs);
        setLoading(false);
        loadedRef.current = true;
      });
    }
  };

  const currentFilename =
    typeof value === "string"
      ? value
      : value
        ? (value as unknown as { img?: { src?: string } })
            ?.img?.src?.split("/")
            .pop() ?? null
        : null;

  return (
    <div>
      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 block mb-1">
        {label}
      </span>
      {!editing ? (
        <button
          type="button"
          className="w-full text-left cursor-pointer rounded-md border border-dashed border-transparent hover:border-amber-400/60 hover:bg-amber-50/30 px-1 py-0.5 -mx-1 -my-0.5 transition-all"
          onClick={startEditing}
          aria-label={`Edit ${label}`}
        >
          {currentFilename ? (
            <span className="text-sm text-accent">{currentFilename}</span>
          ) : (
            <span className="text-sm italic text-fg-muted">No image</span>
          )}
        </button>
      ) : (
        <div className="rounded-md border-2 border-amber-400 bg-surface p-2">
          {loading ? (
            <span className="text-sm text-fg-muted">Loading images...</span>
          ) : images.length === 0 ? (
            <span className="text-sm text-fg-muted">
              No images found in assets folder
            </span>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                className={`text-xs p-2 rounded border text-left transition ${
                  !currentFilename
                    ? "border-amber-400 bg-amber-50"
                    : "border-border hover:border-amber-400/60"
                }`}
                onClick={() => {
                  onChange(null);
                  setEditing(false);
                }}
              >
                (none)
              </button>
              {images.map((img) => (
                <button
                  type="button"
                  key={img}
                  className={`text-xs p-2 rounded border text-left transition truncate ${
                    currentFilename === img
                      ? "border-amber-400 bg-amber-50"
                      : "border-border hover:border-amber-400/60"
                  }`}
                  onClick={() => {
                    onChange(img);
                    setEditing(false);
                  }}
                  title={img}
                >
                  {img}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            className="mt-2 text-[10px] text-amber-600 hover:text-amber-800"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
