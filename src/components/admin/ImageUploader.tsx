"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, GripVertical, Trash2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

interface ImageUploaderProps {
  /** Ordered list of image URLs (R2 or external). The first one is the cover. */
  value: string[];
  /** Callback when the list changes (upload, removal or reorder). */
  onChange: (urls: string[]) => void;
}

/** Move the item at `from` to position `to`, returning a new array. */
function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Append URLs that aren't already in the list (keeps React keys unique). */
function append(list: string[], urls: string[]): string[] {
  const seen = new Set(list);
  return [...list, ...urls.filter((u) => !seen.has(u) && seen.add(u))];
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Latest list, so async uploads and drag handlers never work on a stale copy.
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const update = useCallback(
    (next: string[]) => {
      valueRef.current = next;
      onChange(next);
    },
    [onChange],
  );

  /** Upload files to R2 via the serverless endpoint. */
  const handleUpload = useCallback(
    async (files: FileList) => {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Error al subir imágenes");
        }

        update(append(valueRef.current, data.urls));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setUploading(false);
      }
    },
    [update],
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      handleUpload(e.target.files);
    }
    // Reset so the same file can be selected again
    e.target.value = "";
  };

  /** Add an external URL (e.g. from Google Drive, Unsplash, etc.). */
  const addExternalUrl = () => {
    const trimmed = externalUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith("http")) {
      setError("La URL debe empezar con https://");
      return;
    }
    if (valueRef.current.includes(trimmed)) {
      setError("Esa imagen ya está en la lista");
      return;
    }
    update([...valueRef.current, trimmed]);
    setExternalUrl("");
    setError(null);
  };

  /** Remove the image at `index`. Orphaned R2 files are cleaned up on save. */
  const removeAt = (index: number) => {
    update(valueRef.current.filter((_, i) => i !== index));
  };

  const moveTo = (from: number, to: number) => {
    const list = valueRef.current;
    if (to < 0 || to >= list.length || from === to) return;
    update(move(list, from, to));
  };

  /**
   * Pointer-based drag & drop (mouse, touch and pen). The drag starts from the
   * grip handle, which has `touch-action: none`, so on mobile the page still
   * scrolls normally when swiping anywhere else. Move/up are tracked on
   * `window` because reordering moves the handle's DOM node, which would
   * drop a pointer capture.
   */
  const onHandlePointerDown = (index: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setDragIndex(index);
  };

  const dragIndexRef = useRef<number | null>(null);
  dragIndexRef.current = dragIndex;
  const dragging = dragIndex !== null;

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      const from = dragIndexRef.current;
      if (from === null || !gridRef.current) return;
      const target = document
        .elementsFromPoint(e.clientX, e.clientY)
        .find((el): el is HTMLElement => el instanceof HTMLElement && el.dataset.imageIndex !== undefined);
      if (!target || !gridRef.current.contains(target)) return;
      const over = Number(target.dataset.imageIndex);
      if (over !== from) {
        moveTo(from, over);
        dragIndexRef.current = over;
        setDragIndex(over);
      }
    };
    const onEnd = () => setDragIndex(null);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
    };
    // moveTo only reads refs, so it's safe to bind once per drag
  }, [dragging]);

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        className="relative rounded-2xl border-2 border-dashed border-outline-variant/60 p-6 text-center transition-colors hover:border-primary/60 sm:p-8"
        onDragOver={(e) => e.preventDefault()}
        onDrop={async (e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) {
            await handleUpload(e.dataTransfer.files);
          }
        }}
      >
        <input
          ref={inputRef}
          id="images-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          onChange={onFileChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          disabled={uploading}
        />
        <div className="space-y-2">
          <Icon name="cloud_upload" className="mx-auto text-3xl text-on-surface/50" />
          <p className="font-semibold text-sm">
            {uploading ? "Subiendo…" : "Arrastra imágenes o toca para seleccionar"}
          </p>
          <p className="text-xs text-on-surface/60">
            JPEG, PNG, WebP, GIF, AVIF — máx. 10 MB por imagen
          </p>
        </div>
      </div>

      {/* External URL input */}
      <div className="flex gap-2">
        <input
          type="url"
          inputMode="url"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="O pega una URL externa (https://…)"
          className="min-w-0 flex-1 rounded-xl border-2 border-outline-variant bg-surface p-3 text-base font-medium focus:border-primary focus:outline-none sm:text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Don't submit the whole product form
              e.preventDefault();
              addExternalUrl();
            }
          }}
        />
        <button
          type="button"
          onClick={addExternalUrl}
          className="shrink-0 rounded-xl border-2 border-outline bg-surface px-4 font-semibold text-sm hover:bg-on-background hover:text-on-surface"
        >
          Añadir
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-2xl border border-error/40 bg-error/15 p-3 text-sm font-semibold text-error shadow-neo-sm">
          {error}
        </div>
      )}

      {/* Image preview grid */}
      {value.length > 0 && (
        <>
          <p className="text-xs text-on-surface/60">
            La primera imagen es la portada. Arrastra desde{" "}
            <GripVertical className="inline h-3.5 w-3.5 align-text-bottom" aria-hidden /> o usa las flechas para cambiar
            el orden.
          </p>
          <div ref={gridRef} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {value.map((url, i) => {
              const isDragged = dragIndex === i;
              return (
                <div
                  key={url}
                  data-image-index={i}
                  className={`relative overflow-hidden rounded-xl border-2 bg-surface transition-[transform,box-shadow] ${
                    isDragged
                      ? "z-10 scale-[1.03] border-primary opacity-80 shadow-neo"
                      : "border-outline-variant/60"
                  }`}
                >
                  <img
                    src={url}
                    alt={`Imagen ${i + 1}`}
                    draggable={false}
                    className="pointer-events-none aspect-[4/3] w-full select-none object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />

                  {i === 0 && (
                    <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-on-primary shadow-neo-sm">
                      Portada
                    </span>
                  )}

                  {/* Delete — always visible so it works on touch screens */}
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-error text-white shadow-neo-sm active:scale-95"
                    title="Eliminar imagen"
                    aria-label={`Eliminar imagen ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Controls: move earlier, drag handle, move later */}
                  <div className="flex items-center justify-between gap-1 border-t border-outline-variant/60 bg-surface p-1">
                    <button
                      type="button"
                      onClick={() => moveTo(i, i - 1)}
                      disabled={i === 0}
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-on-surface/10 disabled:opacity-30"
                      aria-label={`Mover imagen ${i + 1} antes`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onPointerDown={onHandlePointerDown(i)}
                      className={`flex h-9 flex-1 touch-none select-none items-center justify-center gap-1 rounded-lg text-xs font-semibold text-on-surface/70 hover:bg-on-surface/10 ${
                        isDragged ? "cursor-grabbing" : "cursor-grab"
                      }`}
                      aria-label={`Arrastrar imagen ${i + 1} para reordenar`}
                      title="Arrastrar para reordenar"
                    >
                      <GripVertical className="h-4 w-4" />
                      {i + 1}
                    </button>
                    <button
                      type="button"
                      onClick={() => moveTo(i, i + 1)}
                      disabled={i === value.length - 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-on-surface/10 disabled:opacity-30"
                      aria-label={`Mover imagen ${i + 1} después`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
