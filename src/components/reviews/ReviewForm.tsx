"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Check, Loader2, Star } from "lucide-react";
import { submitReviewAction, type ReviewFormState } from "@/app/opinar/[token]/actions";
import { submitOpenReviewAction } from "@/app/opinar/clientes/actions";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const LABELS = ["", "Mala", "Regular", "Buena", "Muy buena", "¡Excelente!"];

/**
 * mode "invite": enlace único de la carta (token). mode "open": enlace general
 * para clientes anteriores; pide la laptop y la opinión queda por aprobar.
 */
export function ReviewForm({
  token = "",
  mode = "invite",
  defaultAuthor,
  googleUrl,
}: {
  token?: string;
  mode?: "invite" | "open";
  defaultAuthor: string;
  googleUrl: string;
}) {
  const open = mode === "open";
  const [state, action, pending] = useActionState<ReviewFormState, FormData>(
    open ? submitOpenReviewAction : submitReviewAction.bind(null, token),
    { status: "idle" },
  );
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const shown = hover || rating;

  if (state.status === "ok") {
    return (
      <div className="py-4 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-on-primary">
          <Check className="h-7 w-7" strokeWidth={3} />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold">¡Gracias por tu opinión!</h2>
        <p className="mt-2 text-on-surface-variant">
          {open ? "La revisamos y la publicamos en nuestra web muy pronto." : "Ya aparece en nuestra web como compra verificada."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {googleUrl ? (
            <a href={googleUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "primary", size: "md", className: "min-h-12" })}>
              También dejarla en Google
            </a>
          ) : null}
          <Link href="/opiniones" className={buttonClasses({ variant: "outline", size: "md", className: "min-h-12" })}>
            Ver opiniones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-7">
      <fieldset>
        <legend className="text-sm font-semibold tracking-wide">Tu calificación</legend>
        <div className="mt-3 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer p-1" onMouseEnter={() => setHover(n)}>
              <input type="radio" name="rating" value={n} className="sr-only" checked={rating === n} onChange={() => setRating(n)} />
              <span className="sr-only">{n} de 5</span>
              <Star
                className={cn(
                  "h-10 w-10 transition-transform duration-150 md:h-11 md:w-11",
                  n <= shown ? "scale-105 fill-[#f5b301] text-[#f5b301]" : "text-white/25",
                )}
                strokeWidth={1.5}
              />
            </label>
          ))}
          <span className="ml-3 text-lg font-bold text-on-background">{LABELS[shown]}</span>
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold tracking-wide">Cuéntanos tu experiencia</span>
        <textarea
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={600}
          placeholder="¿Cómo llegó la laptop? ¿Qué tal la atención y el envío?"
          className="mt-2 w-full resize-y rounded-2xl border border-white/12 bg-black/35 px-4 py-3 text-base placeholder:text-on-surface-variant/50 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <span className="mt-1 block text-right text-xs text-on-surface-variant">{comment.length}/600</span>
      </label>

      {open ? (
        <label className="block">
          <span className="text-sm font-semibold tracking-wide">¿Qué laptop compraste?</span>
          <input
            name="laptop"
            maxLength={160}
            placeholder="Ej. Lenovo ThinkPad T14"
            className="mt-2 min-h-12 w-full rounded-2xl border border-white/12 bg-black/35 px-4 text-base focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
      ) : null}
      {open ? <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" /> : null}

      <label className="block">
        <span className="text-sm font-semibold tracking-wide">Nombre que se mostrará</span>
        <input
          name="author"
          defaultValue={defaultAuthor}
          maxLength={40}
          className="mt-2 min-h-12 w-full rounded-2xl border border-white/12 bg-black/35 px-4 text-base focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      {state.status === "error" ? <p className="rounded-2xl border border-error/40 bg-error/10 p-3 text-sm font-semibold text-error">{state.message}</p> : null}

      <button
        type="submit"
        disabled={pending || !rating}
        className={buttonClasses({ variant: "primary", size: "lg", className: "min-h-14 w-full disabled:opacity-50" })}
      >
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {pending ? "Enviando…" : rating ? "Publicar mi opinión" : "Elige tus estrellas"}
      </button>
    </form>
  );
}
