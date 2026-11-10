import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import type { ReviewSummary } from "@/lib/repositories/reviews";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "./Stars";

const date = (iso: string) =>
  new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Lima" }).format(new Date(iso));

/** Average + count, e.g. "4.9 ★★★★★ · 12 opiniones verificadas". */
export function ReviewsSummary({ summary }: { summary: ReviewSummary }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-display text-5xl font-extrabold leading-none tracking-tight">{summary.average.toFixed(1)}</span>
      <span>
        <Stars value={summary.average} />
        <span className="mt-1 block text-sm text-on-surface-variant">
          {summary.count} {summary.count === 1 ? "opinión verificada" : "opiniones verificadas"}
        </span>
      </span>
    </div>
  );
}

export function ReviewCards({ summary, limit }: { summary: ReviewSummary; limit?: number }) {
  const items = limit ? summary.items.slice(0, limit) : summary.items;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((review) => (
        <li key={review.id} className="glass flex flex-col rounded-3xl p-6">
          <Stars value={review.rating} size="sm" />
          {review.comment ? (
            <p className="mt-4 flex-1 leading-relaxed text-on-surface">“{review.comment}”</p>
          ) : (
            <p className="mt-4 flex-1 text-on-surface-variant">Calificó su compra con {review.rating} de 5 estrellas.</p>
          )}
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="font-semibold">{review.author}</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-on-surface-variant">
              <BadgeCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
              <span className="font-semibold text-primary">Compra verificada</span>
              {review.city ? <span>· {review.city}</span> : null}
              <span>· {date(review.date)}</span>
            </p>
            {review.laptop ? <p className="mt-1 line-clamp-1 text-xs text-on-surface-variant">{review.laptop}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Home section: shows only once there is at least one review. */
export function ReviewsSection({ summary }: { summary: ReviewSummary }) {
  if (!summary.count) return null;
  const limit = 6;
  return (
    <section id="opiniones" aria-labelledby="opiniones-title" className="scroll-mt-28 space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-2">
          <h2 id="opiniones-title" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg leading-relaxed text-on-surface-variant">
            Solo opinan quienes compraron: cada cliente recibe un código único en su caja.
          </p>
        </div>
        <ReviewsSummary summary={summary} />
      </div>
      <ReviewCards summary={summary} limit={limit} />
      {summary.count > limit ? (
        <Link
          href="/opiniones"
          className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
        >
          Ver las {summary.count} opiniones <Icon name="arrow" />
        </Link>
      ) : null}
    </section>
  );
}
