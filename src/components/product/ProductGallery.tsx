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
  const thumbs = gallery.slice(0, 3);
  const extra = gallery.length - thumbs.length;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="relative col-span-2 aspect-[4/3] border-thick border-on-background bg-surface-container-lowest p-4 shadow-neo-md">
        {grade ? (
          <div className="absolute left-2 top-2 z-10 -rotate-3 border-thick border-on-background bg-secondary-container px-2 py-1 font-display-lg text-lg font-black uppercase leading-none text-on-container shadow-neo-xs">
            {grade}
          </div>
        ) : null}
        <div className="relative h-full w-full">
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

      {thumbs.map((image, index) => (
        <button
          key={`${image}-${index}`}
          type="button"
          onClick={() => setActive(index)}
          aria-label={`View image ${index + 1}`}
          className={cn(
            "relative aspect-square border-thick border-on-background p-2 shadow-neo transition-colors hover:bg-primary-container",
            active === index ? "bg-primary-container" : "bg-surface-container-lowest",
          )}
        >
          <div className="relative h-full w-full">
            <Image src={image} alt="" fill sizes="25vw" className="object-contain" />
          </div>
        </button>
      ))}

      {extra > 0 ? (
        <div className="flex aspect-square rotate-2 items-center justify-center border-thick border-on-background bg-primary-fixed p-2 text-center font-display-xl text-3xl font-black uppercase leading-none text-on-container shadow-neo">
          +{extra}
          <br />
          MORE
        </div>
      ) : null}
    </div>
  );
}
