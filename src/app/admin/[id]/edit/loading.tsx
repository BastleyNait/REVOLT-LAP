/**
 * Shown the instant "Editar" is clicked, while the server loads the product:
 * the page responds right away instead of looking frozen.
 */
export default function LoadingEditProduct() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Cargando producto">
      <div className="h-9 w-2/3 animate-pulse rounded-xl bg-surface-container" />
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-28 animate-pulse rounded bg-surface-container" />
            <div className="h-11 animate-pulse rounded-2xl bg-surface-container/70" />
          </div>
        ))}
      </div>
      <div className="h-40 animate-pulse rounded-2xl bg-surface-container/70" />
    </div>
  );
}
