/**
 * Ambient aurora behind the whole site: soft, blurred color blobs that drift
 * slowly so the frosted-glass surfaces have something luminous to refract.
 * Pure CSS (no canvas/WebGL), fixed and non-interactive, under all content.
 */
const blobs = [
  { className: "left-[-12%] top-[-10%] h-[43vw] w-[30vw] bg-primary/45",   delay: "0s",   dur: "22s" },
  { className: "right-[-14%] top-[6%] h-[38vw] w-[38vw] bg-tertiary/40",   delay: "-6s",  dur: "26s" },
  { className: "bottom-[-16%] left-[18%] h-[44vw] w-[44vw] bg-secondary/38", delay: "-12s", dur: "30s" },
];

export function PageBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {blobs.map((b, i) => (
        <span
          key={i}
          className={`absolute block rounded-full blur-3xl ${b.className}`}
          style={{ animation: `blobFloat ${b.dur} ease-in-out ${b.delay} infinite` }}
        />
      ))}
    </div>
  );
}
