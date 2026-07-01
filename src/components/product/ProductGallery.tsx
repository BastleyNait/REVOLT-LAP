"use client";

import Image from "next/image";
import { useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/types/product";
import { cn } from "@/lib/utils/cn";

export function ProductGallery({
  images,
  alt,
  grade,
}: {
  images: string[];
  alt: string;
  grade?: string;
}) {
  const gallery = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const [active, setActive] = useState(0);
  const thumbs = gallery.slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <div className="glass relative aspect-[4/3] overflow-hidden rounded-3xl p-3 shadow-neo-md">
        {grade ? (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wide text-on-secondary shadow-neo-sm">
            {grade}
          </div>
        ) : null}
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-surface-container/60">
          <Image
            key={active}
            src={gallery[active]}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {gallery.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {thumbs.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver imagen ${index + 1}`}
              className={cn(
                "glass relative aspect-square overflow-hidden rounded-2xl p-1.5 transition-all hover:-translate-y-0.5",
                active === index && "ring-2 ring-primary",
              )}
            >
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image src={image} alt="" fill sizes="20vw" className="object-cover" />
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
