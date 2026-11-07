"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, GripVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { isAllowedImageHost } from "@/lib/config/image-hosts";

interface ImageUploaderProps {
  /** Ordered list of image URLs (R2 or external). The first one is the cover. */
  value: string[];
  /** Callback when the list changes (upload, removal or reorder). */
  onChange: (urls: string[]) => void;
}

/** Parallel uploads (one photo per request). */
const UPLOAD_CONCURRENCY = 3;
/** Longest side after resizing: plenty for the zoomable product gallery. */
const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.85;
/** Files already this small and this size are uploaded untouched. */
const KEEP_ORIGINAL_BYTES = 1.2 * 1024 * 1024;
/** Vercel's request body limit is 4.5 MB; leave room for the multipart overhead. */
const MAX_REQUEST_BYTES = 4.3 * 1024 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("no se pudo leer la imagen"));
    };
    img.src = url;
  });
}

/**
 * Shrink a photo in the browser: longest side to MAX_DIMENSION, re-encoded as
 * JPEG (EXIF rotation is applied by the browser when drawing). GIFs (may be
 * animated) and photos that are already light are left as they are. If the
 * browser can't decode the file, the original is sent.
 */
async function prepareImage(file: File): Promise<File> {
  if (file.type === "image/gif") return file;
  try {
    const img = await loadImage(file);
    const { naturalWidth: w, naturalHeight: h } = img;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(w, h));
    if (scale === 1 && file.size <= KEEP_ORIGINAL_BYTES) return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    // JPEG has no transparency: paint PNG/WebP see-through areas white.
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  }
}

/** POST one image to /api/upload and return its public URL. */
async function uploadOne(file: File): Promise<string> {
  if (file.size > MAX_REQUEST_BYTES) {
    throw new Error("la imagen pesa más de 4 MB incluso optimizada; expórtala más liviana");
  }
  const formData = new FormData();
  formData.append("images", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });

  // Errors from Vercel itself (413, 504…) come back as plain text, not JSON.
  const text = await res.text();
  let data: { urls?: string[]; error?: string } = {};
  try {
    data = JSON.parse(text);
  } catch {
    if (res.status === 413) throw new Error("la imagen es demasiado pesada para el servidor");
    throw new Error(`el servidor respondió ${res.status}${text ? `: ${text.slice(0, 80)}` : ""}`);
  }
  if (!res.ok || !data.urls?.[0]) throw new Error(data.error ?? `error ${res.status} al subir`);
  return data.urls[0];
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
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
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

  /**
   * Upload files to R2 via the serverless endpoint. Each photo is shrunk in the
   * browser first and sent in its own request: Vercel rejects request bodies
   * over 4.5 MB ("Request Entity Too Large"), which a few phone photos sent
   * together easily exceed. Order of selection is kept.
   */
  const handleUpload = useCallback(
    async (fileList: FileList) => {
      const files = Array.from(fileList);
      setUploading(true);
      setError(null);
      setProgress({ done: 0, total: files.length });

      const results: (string | null)[] = new Array(files.length).fill(null);
      const errors: string[] = [];
      let next = 0;
      let done = 0;

      const worker = async () => {
        while (next < files.length) {
          const index = next++;
          const file = files[index];
          try {
            results[index] = await uploadOne(await prepareImage(file));
          } catch (err) {
            errors.push(`${file.name}: ${(err as Error).message}`);
          } finally {
            done++;
            setProgress({ done, total: files.length });
          }
        }
      };

      try {
        await Promise.all(Array.from({ length: Math.min(UPLOAD_CONCURRENCY, files.length) }, worker));
        const urls = results.filter((url): url is string => Boolean(url));
        if (urls.length) update(append(valueRef.current, urls));
        if (errors.length) {
          setError(
            `${errors.length === files.length ? "No se pudo subir" : `Se subieron ${urls.length} de ${files.length}. Fallaron`}: ${errors.join(" · ")}`,
          );
        }
      } finally {
        setUploading(false);
        setProgress(null);
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
            {uploading
              ? progress && progress.total > 1
                ? `Subiendo ${progress.done} de ${progress.total}…`
                : "Subiendo…"
              : "Arrastra imágenes o toca para seleccionar"}
          </p>
          <p className="text-xs text-on-surface/60">
            JPEG, PNG, WebP, GIF, AVIF — puedes elegir varias; se optimizan solas antes de subir
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
                  {/* Thumbnails go through the image optimizer at thumbnail
                      size: the originals are full photos (often 1-2 MB each),
                      and a product has 9-15 of them. Hosts the optimizer
                      doesn't allow still show, as a plain lazy <img>. */}
                  {isAllowedImageHost(url) ? (
                    <div className="pointer-events-none relative aspect-[4/3] w-full select-none">
                      <Image
                        src={url}
                        alt={`Imagen ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 220px"
                        draggable={false}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt={`Imagen ${i + 1}`}
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                      className="pointer-events-none aspect-[4/3] w-full select-none object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.visibility = "hidden";
                      }}
                    />
                  )}

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
