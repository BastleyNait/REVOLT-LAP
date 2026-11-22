/** Open book with a check: the store's "Libro de Reclamaciones" mark (line art). */
export function BookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M12 6.5C10.3 5.2 7.9 4.6 4 4.75v13.5c3.9-.15 6.3.45 8 1.75 1.7-1.3 4.1-1.9 8-1.75V4.75c-3.9-.15-6.3.45-8 1.75Z" />
      <path d="M12 6.5V20" />
      <path d="m14.4 11.6 1.4 1.4 2.7-2.9" />
    </svg>
  );
}
