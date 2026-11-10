"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  Download,
  FileText,
  Gift,
  History,
  Loader2,
  MapPin,
  Package,
  Printer,
  RotateCcw,
  Share2,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  emptyShipment,
  longDate,
  missingFields,
  newOrderCode,
  type Delivery,
  type Sender,
  type Shipment,
} from "@/lib/envios/types";

const DRAFT_KEY = "revolt-envios-borrador";
const HISTORY_KEY = "revolt-envios-historial";
const HISTORY_MAX = 12;

interface HistoryItem {
  code: string;
  name: string;
  laptop: string;
  savedAt: number;
  data: Shipment;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / full storage: the app keeps working without it */
  }
}

function slug(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 40);
}

/** The six pages of the PDF, for the summary panel. */
const PAGES = [
  { icon: Tag, title: "Etiquetas", detail: "3 hojas · 2 por hoja · una por cara de la caja", count: 3 },
  { icon: MapPin, title: "Guía de envío", detail: "Destinatario y remitente", count: 1 },
  { icon: Gift, title: "Carta de agradecimiento", detail: "Con QR único para su opinión verificada", count: 1 },
];

/**
 * One-time review link for this order (the letter's QR). Same order code →
 * same link, so reprinting is safe. On failure the QR falls back to the site.
 */
async function createReviewLink(s: Shipment): Promise<{ url: string | null; error?: string }> {
  try {
    const res = await fetch("/api/reviews/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderCode: s.order.code,
        customerName: s.customer.name,
        laptop: s.order.laptop,
        city: s.order.delivery === "shalom" ? s.customer.city : s.customer.city || "Arequipa",
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (res.ok && data.url) return { url: data.url };
    return { url: null, error: data.error ?? `Error ${res.status}` };
  } catch {
    return { url: null, error: "Sin conexión" };
  }
}

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function EnviosApp({ sender, laptops }: { sender: Sender; laptops: string[] }) {
  const [shipment, setShipment] = useState<Shipment>(emptyShipment);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pdf, setPdf] = useState<{ url: string; file: File } | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [install, setInstall] = useState<BeforeInstallPromptEvent | null>(null);
  const [reviewLink, setReviewLink] = useState<{ url: string | null; error?: string } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Restore the draft and history; register the service worker (installable app).
  useEffect(() => {
    setShipment((current) => ({ ...current, ...load<Partial<Shipment>>(DRAFT_KEY, {}) }));
    setHistory(load<HistoryItem[]>(HISTORY_KEY, []));
    setReady(true);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/envios-sw.js", { scope: "/envios" }).catch(() => {});
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstall(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  useEffect(() => {
    if (ready) save(DRAFT_KEY, shipment);
  }, [shipment, ready]);

  // Free the previous PDF when a new one is made or the page closes.
  useEffect(() => () => (pdf ? URL.revokeObjectURL(pdf.url) : undefined), [pdf]);

  const missing = useMemo(() => missingFields(shipment), [shipment]);

  const setCustomer = (field: keyof Shipment["customer"]) => (value: string) =>
    setShipment((s) => ({ ...s, customer: { ...s.customer, [field]: value } }));
  const setOrder = (field: keyof Shipment["order"]) => (value: string) =>
    setShipment((s) => ({ ...s, order: { ...s.order, [field]: value } }));

  const generate = useCallback(async () => {
    if (missing.length) {
      setShowErrors(true);
      document.querySelector<HTMLElement>("[data-invalid='true']")?.focus();
      return;
    }
    setStatus("working");
    setError(null);
    try {
      // The PDF engine (~600 KB) loads only when it's needed.
      const [{ pdf: render }, { ShipmentPdf, registerPdfFonts }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./ShipmentPdf"),
      ]);
      registerPdfFonts(`${window.location.origin}/fonts`);
      const reviewUrl = await createReviewLink(shipment);
      setReviewLink(reviewUrl);
      const blob = await render(
        <ShipmentPdf shipment={shipment} sender={sender} reviewUrl={reviewUrl.url ?? sender.reviewUrl} />,
      ).toBlob();
      const name = `REVOLT-${shipment.order.code}-${slug(shipment.customer.name) || "envio"}.pdf`;
      const file = new File([blob], name, { type: "application/pdf" });
      setPdf({ url: URL.createObjectURL(blob), file });
      setStatus("done");

      const item: HistoryItem = {
        code: shipment.order.code,
        name: shipment.customer.name,
        laptop: shipment.order.laptop,
        savedAt: Date.now(),
        data: shipment,
      };
      setHistory((list) => {
        const next = [item, ...list.filter((h) => h.code !== item.code)].slice(0, HISTORY_MAX);
        save(HISTORY_KEY, next);
        return next;
      });
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (err) {
      console.error(err);
      setError("No se pudo generar el PDF. Revisa tu conexión e inténtalo otra vez.");
      setStatus("error");
    }
  }, [missing.length, sender, shipment]);

  const download = () => {
    if (!pdf) return;
    const a = document.createElement("a");
    a.href = pdf.url;
    a.download = pdf.file.name;
    a.click();
  };
  const canShare = typeof navigator !== "undefined" && !!pdf && !!navigator.canShare?.({ files: [pdf.file] });
  const share = async () => {
    if (!pdf) return;
    try {
      await navigator.share({ files: [pdf.file], title: pdf.file.name });
    } catch {
      /* the user closed the share sheet */
    }
  };

  const reset = () => {
    setShipment(emptyShipment());
    setPdf(null);
    setStatus("idle");
    setShowErrors(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const loadFromHistory = (item: HistoryItem) => {
    setShipment(item.data);
    setPdf(null);
    setStatus("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const removeFromHistory = (code: string) =>
    setHistory((list) => {
      const next = list.filter((h) => h.code !== code);
      save(HISTORY_KEY, next);
      return next;
    });

  const invalid = (label: string) => showErrors && missing.includes(label);
  const shalom = shipment.order.delivery === "shalom";

  return (
    <div className="mx-auto max-w-[75rem] px-4 pb-36 pt-6 md:px-8 md:pb-16 md:pt-10">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image src="/logo-mark.png" alt="" width={44} height={46} className="h-11 w-auto drop-shadow-[0_0_18px_rgba(18,180,128,0.45)]" />
          <div>
            <h1 className="text-2xl font-extrabold leading-none tracking-tight md:text-3xl">
              REVOLT <span className="text-primary">Envíos</span>
            </h1>
            <p className="mt-1 text-sm text-on-surface-variant">Etiquetas, guía de envío y carta en un solo PDF</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {install ? (
            <button
              type="button"
              onClick={async () => {
                await install.prompt();
                setInstall(null);
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 text-sm font-semibold text-primary transition hover:bg-primary/20"
            >
              <Smartphone className="h-4 w-4" /> Instalar app
            </button>
          ) : null}
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold transition hover:border-white/30 hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" /> Nuevo envío
          </button>
          <Link
            href="/admin"
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-on-surface-variant transition hover:text-on-background"
          >
            <ArrowLeft className="h-4 w-4" /> Admin
          </Link>
        </div>
      </header>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8">
        {/* Form */}
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            void generate();
          }}
        >
          <Section icon={<User className="h-5 w-5" />} step={1} title="Cliente" hint="Así lo verá Shalom en la guía de envío.">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                className="sm:col-span-2"
                label="Nombre completo"
                required
                invalid={invalid("Nombre del cliente")}
                value={shipment.customer.name}
                onChange={setCustomer("name")}
                placeholder="Ej.: María Fernanda Quispe Huamán"
                autoComplete="name"
              />
              <TextField label="DNI" value={shipment.customer.dni} onChange={setCustomer("dni")} placeholder="Ej.: 71234567" inputMode="numeric" maxLength={12} />
              <TextField
                label="Celular"
                required
                invalid={invalid("Celular")}
                value={shipment.customer.phone}
                onChange={setCustomer("phone")}
                placeholder="Ej.: 932 102 095"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
          </Section>

          <Section icon={<MapPin className="h-5 w-5" />} step={2} title="Entrega">
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/30 p-1.5">
              {(
                [
                  ["shalom", "Envío por Shalom", Package],
                  ["arequipa", "En Arequipa", MapPin],
                ] as [Delivery, string, typeof Package][]
              ).map(([value, label, LucideIcon]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={shipment.order.delivery === value}
                  onClick={() => setOrder("delivery")(value)}
                  className={cn(
                    "flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition",
                    shipment.order.delivery === value
                      ? "bg-primary text-on-primary shadow-[0_0_20px_rgb(var(--c-primary)/0.35)]"
                      : "text-on-surface-variant hover:bg-white/5 hover:text-on-background",
                  )}
                >
                  <LucideIcon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField
                label={shalom ? "Ciudad de destino" : "Distrito"}
                required={shalom}
                invalid={invalid("Ciudad de destino")}
                value={shipment.customer.city}
                onChange={setCustomer("city")}
                placeholder={shalom ? "Ej.: Lima — Santa Anita" : "Ej.: Cayma"}
              />
              {shalom ? (
                <TextField label="Agencia Shalom" value={shipment.customer.agency} onChange={setCustomer("agency")} placeholder="Ej.: Shalom Av. Los Frutales" />
              ) : null}
              <TextField
                className={shalom ? "sm:col-span-2" : undefined}
                label="Dirección o referencia"
                value={shipment.customer.address}
                onChange={setCustomer("address")}
                placeholder="Opcional"
              />
            </div>
          </Section>

          <Section icon={<Package className="h-5 w-5" />} step={3} title="Pedido">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                className="sm:col-span-2"
                label="Laptop"
                required
                invalid={invalid("Laptop")}
                value={shipment.order.laptop}
                onChange={setOrder("laptop")}
                placeholder="Ej.: Lenovo ThinkPad X13 Yoga · i5 · 16GB · 512GB"
                list="envios-laptops"
              />
              <datalist id="envios-laptops">
                {laptops.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              <TextField label="Fecha de compra" type="date" value={shipment.order.date} onChange={setOrder("date")} />
              <div>
                <span className="mb-2 block text-sm font-semibold tracking-wide">Código de pedido</span>
                <div className="flex gap-2">
                  <input
                    value={shipment.order.code}
                    onChange={(e) => setOrder("code")(e.target.value)}
                    className={inputClass}
                    aria-label="Código de pedido"
                  />
                  <button
                    type="button"
                    onClick={() => setOrder("code")(newOrderCode(shipment.order.date))}
                    title="Generar otro código"
                    aria-label="Generar otro código"
                    className="grid w-12 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/5 transition hover:border-primary/50 hover:text-primary"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <TextField
                className="sm:col-span-2"
                label="Contenido de la caja"
                value={shipment.order.contents}
                onChange={setOrder("contents")}
                placeholder="Ej.: Laptop + cargador original"
              />
            </div>
          </Section>

          <Section icon={<Gift className="h-5 w-5" />} step={4} title="Carta" hint="Opcional: una línea personal al final de la carta.">
            <textarea
              value={shipment.note}
              onChange={(e) => setShipment((s) => ({ ...s, note: e.target.value }))}
              rows={3}
              maxLength={320}
              placeholder="Ej.: P.D. Te incluimos el lápiz que nos preguntaste. ¡Que la disfrutes!"
              className={cn(inputClass, "resize-y")}
            />
            <p className="mt-1.5 text-right text-xs text-on-surface-variant">{shipment.note.length}/320</p>
          </Section>

          {/* Mobile: the main action always under the thumb */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#010201]/90 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3 backdrop-blur-xl lg:hidden">
            <GenerateButton status={status} missing={missing.length} />
          </div>
        </form>

        {/* Summary + result */}
        <aside className="space-y-6 lg:sticky lg:top-6">
          <div className="glass rounded-[1.75rem] p-5 md:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Tu PDF</h2>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">5 hojas A4</span>
            </div>
            <ol className="mt-4 space-y-2.5">
              {PAGES.map(({ icon: PageIcon, title, detail, count }) => (
                <li key={title} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <PageIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{title}</span>
                    <span className="block truncate text-xs text-on-surface-variant">{detail}</span>
                  </span>
                  <span className="text-xs font-bold tabular-nums text-on-surface-variant">×{count}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-on-surface-variant">
              <Printer className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Diseñado para hojas blancas: líneas finas y fondo blanco para ahorrar tinta.
            </p>

            {showErrors && missing.length ? (
              <div className="mt-4 rounded-2xl border border-error/40 bg-error/10 p-3 text-sm">
                <p className="font-semibold text-error">Falta completar:</p>
                <ul className="mt-1 list-inside list-disc text-on-surface-variant">
                  {missing.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-5 hidden lg:block">
              <GenerateButton status={status} missing={missing.length} onClick={() => void generate()} />
            </div>
            {error ? <p className="mt-3 text-sm font-semibold text-error">{error}</p> : null}
          </div>

          {history.length ? (
            <div className="glass rounded-[1.75rem] p-5 md:p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <History className="h-5 w-5 text-primary" /> Envíos recientes
              </h2>
              <ul className="mt-3 divide-y divide-white/[0.07]">
                {history.map((item) => (
                  <li key={item.code} className="flex items-center gap-2 py-2.5">
                    <button type="button" onClick={() => loadFromHistory(item)} className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-sm font-semibold">{item.name || "Sin nombre"}</span>
                      <span className="block truncate text-xs text-on-surface-variant">
                        {item.code} · {item.laptop}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromHistory(item.code)}
                      aria-label={`Quitar ${item.code}`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-on-surface-variant transition hover:bg-white/5 hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      {/* Result */}
      {pdf ? (
        <div ref={resultRef} className="mt-10 scroll-mt-6">
          <div className="glass overflow-hidden rounded-[1.75rem]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 md:p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-on-primary">
                  <Check className="h-5 w-5" strokeWidth={3} />
                </span>
                <div>
                  <p className="font-bold">PDF listo · {shipment.customer.name}</p>
                  <p className="text-sm text-on-surface-variant">
                    {pdf.file.name} · {(pdf.file.size / 1024).toFixed(0)} KB · {longDate(shipment.order.date)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={download} className={actionClass(true)}>
                  <Download className="h-4 w-4" /> Descargar
                </button>
                {canShare ? (
                  <button type="button" onClick={share} className={actionClass(false)}>
                    <Share2 className="h-4 w-4" /> Compartir
                  </button>
                ) : null}
                <a href={pdf.url} target="_blank" rel="noreferrer" className={actionClass(false)}>
                  <FileText className="h-4 w-4" /> Abrir para imprimir
                </a>
              </div>
            </div>
            {reviewLink ? (
              <div
                className={cn(
                  "flex items-start gap-2.5 border-b border-white/10 px-5 py-3 text-sm md:px-6",
                  reviewLink.url ? "text-on-surface-variant" : "text-error",
                )}
              >
                <Star className={cn("mt-0.5 h-4 w-4 shrink-0", reviewLink.url ? "text-primary" : "text-error")} />
                {reviewLink.url ? (
                  <span>
                    QR de opinión verificada, solo para este pedido:{" "}
                    <a href={reviewLink.url} target="_blank" rel="noreferrer" className="break-all font-semibold text-primary underline underline-offset-2">
                      {reviewLink.url.replace(/^https?:\/\//, "")}
                    </a>
                  </span>
                ) : (
                  <span>
                    No se pudo crear el QR de opinión verificada ({reviewLink.error}). El QR de la carta lleva a tu web.
                  </span>
                )}
              </div>
            ) : null}
            {/* Inline preview where the browser can show PDFs (desktop). */}
            <iframe title="Vista previa del PDF" src={`${pdf.url}#view=FitH`} className="hidden h-[80vh] w-full bg-white md:block" />
            <p className="p-5 text-sm text-on-surface-variant md:hidden">
              Toca <strong className="text-on-background">Descargar</strong> o <strong className="text-on-background">Compartir</strong> para
              abrirlo o mandarlo a la impresora. Imprime al 100 % (tamaño real) en A4.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ─────────────────────────── small pieces ─────────────────────────── */

const inputClass =
  "w-full min-h-12 rounded-xl border border-white/12 bg-black/35 px-4 py-3 text-base text-on-background placeholder:text-on-surface-variant/50 transition focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-[0.9375rem]";

function actionClass(primary: boolean) {
  return cn(
    "inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-bold transition active:scale-[0.97]",
    primary
      ? "bg-primary text-on-primary shadow-[0_0_20px_rgb(var(--c-primary)/0.35)] hover:brightness-110"
      : "border border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10",
  );
}

function Section({ icon, step, title, hint, children }: { icon: ReactNode; step: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="glass rounded-[1.75rem] p-5 md:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</span>
        <div>
          <p className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.25em] text-primary">Paso {step}</p>
          <h2 className="text-lg font-bold leading-tight">{title}</h2>
        </div>
        {hint ? <p className="ml-auto hidden max-w-[16rem] text-right text-xs text-on-surface-variant sm:block">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
  invalid,
  className,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  invalid?: boolean;
  className?: string;
} & Omit<React.ComponentProps<"input">, "value" | "onChange" | "className">) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-semibold tracking-wide">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-invalid={invalid ? "true" : undefined}
        aria-invalid={invalid || undefined}
        className={cn(inputClass, invalid && "border-error/70 ring-2 ring-error/25")}
        {...props}
      />
    </label>
  );
}

function GenerateButton({ status, missing, onClick }: { status: string; missing: number; onClick?: () => void }) {
  const working = status === "working";
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={working}
      className={cn(
        "flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-primary px-6 text-base font-extrabold text-on-primary shadow-[0_0_28px_rgb(var(--c-primary)/0.4)] transition active:scale-[0.98] disabled:opacity-70",
        !working && "hover:brightness-110",
      )}
    >
      {working ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" /> Generando PDF…
        </>
      ) : (
        <>
          <FileText className="h-5 w-5" /> {status === "done" ? "Volver a generar" : "Generar PDF"}
          {missing ? <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">{missing} pendiente{missing > 1 ? "s" : ""}</span> : null}
        </>
      )}
    </button>
  );
}
