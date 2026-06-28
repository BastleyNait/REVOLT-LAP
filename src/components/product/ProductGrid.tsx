"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/lib/types/product";
import { ProductCard } from "./ProductCard";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

export function ProductGrid({ products }: { products: Product[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();

    // Animate only when reduced motion is not requested. Under reduced motion the
    // handler never runs, the [data-reveal] CSS hide (scoped to no-preference)
    // never applies, and the cards stay visible.
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-anim='card']", root.current);
        gsap.set(cards, { autoAlpha: 0, y: 60 });

        // Reveal each card as it scrolls into view, batched so neighbours stagger.
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.12,
              overwrite: true,
            }),
        });
      },
      root,
    );

    return () => mm.revert();
  }, [products.length]);

  if (products.length === 0) {
    return (
      <div className="border-thick border-on-background bg-surface-container-lowest p-12 text-center shadow-neo-md">
        <p className="font-label-mono text-body-lg font-bold uppercase">{siteConfig.home.inventoryEmpty}</p>
      </div>
    );
  }

  return (
    <div ref={root} className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-gutter lg:grid-cols-3">
      {products.map((product, index) => (
        // Outer wrapper holds the scattered layout offset (untouched by GSAP);
        // the inner wrapper is what GSAP transforms during the reveal.
        <div key={product.id} className={cn(index % 3 === 1 && "md:translate-y-12")}>
          <div data-anim="card" data-reveal className="h-full">
            <ProductCard product={product} index={index} />
          </div>
        </div>
      ))}
    </div>
  );
}
