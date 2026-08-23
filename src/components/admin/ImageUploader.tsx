"use client";

import { useState, useRef, useCallback } from "react";
import { Icon } from "@/components/ui/Icon";

interface UploadedImage {
  url: string;
  name: string;
}

interface ImageUploaderProps {
  /** Current image URLs stored in the product (from R2 or external). */
  currentUrls: string[];
  /** Callback when the full list of URLs changes. */
  onChange: (urls: string[]) => void;
}

export function ImageUploader({ currentUrls, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newUrls, setNewUrls] = useState<string[]>([]);
  const [externalUrl, setExternalUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const allUrls = [...currentUrls, ...newUrls];

  /** Upload files to R2 via the serverless endpoint. */
  const handleUpload = useCallback(async (files: FileList) => {
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

      setNewUrls((prev) => [...prev, ...data.urls]);
      onChange([...currentUrls, ...newUrls, ...data.urls]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }, [currentUrls, newUrls, onChange]);

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
    setNewUrls((prev) => [...prev, trimmed]);
    onChange([...currentUrls, ...newUrls, trimmed]);
    setExternalUrl("");
    setError(null);
  };

  /** Remove a URL from the list. */
  const removeUrl = (url: string) => {
    const filtered = allUrls.filter((u) => u !== url);
    // Sync newUrls state too
    setNewUrls((prev) => prev.filter((u) => u !== url));
    onChange(filtered);
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        className="relative rounded-2xl border-2 border-dashed border-outline-variant/60 p-8 text-center transition-colors hover:border-primary/60"
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
            {uploading ? "Subiendo…" : "Arrastra imágenes o haz clic para seleccionar"}
          </p>
          <p className="text-xs text-on-surface/60">
            JPEG, PNG, WebP, GIF, AVIF — máx. 10 MB por imagen
          </p>
        </div>
      </div>

      {/* External URL input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="O pega una URL externa (https://…)"
          className="flex-1 rounded-xl border-2 border-outline-variant bg-surface p-3 text-sm font-medium focus:border-primary focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && addExternalUrl()}
        />
        <button
          type="button"
          onClick={addExternalUrl}
          className="rounded-xl border-2 border-outline bg-surface px-4 font-semibold text-sm hover:bg-on-background hover:text-on-surface"
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
      {allUrls.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allUrls.map((url, i) => (
            <div key={`${url}-${i}`} className="group relative overflow-hidden rounded-xl border-2 border-outline-variant/60">
              <img
                src={url}
                alt={`Imagen ${i + 1}`}
                className="aspect-[4/3] w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={() => removeUrl(url)}
                className="absolute right-2 top-2 rounded-lg bg-error p-1 text-sm font-bold text-white opacity-0 shadow-neo-sm transition-opacity group-hover:opacity-100"
                title="Eliminar imagen"
              >
                ×
              </button>
              <div className="bg-surface p-2 text-xs font-mono text-on-surface/60 truncate">
                {url.length > 50 ? url.slice(0, 50) + "…" : url}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
