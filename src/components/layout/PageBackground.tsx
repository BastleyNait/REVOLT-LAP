/**
 * Ambient aurora behind the whole site: soft, blurred color blobs that drift
 * slowly so the frosted-glass surfaces have something luminous to refract.
 * Pure CSS (no canvas/WebGL), fixed and non-interactive, under all content.
 * Only `transform` animates (compositor-only); reduced motion freezes it.
 * Colors are the original palette values, independent of the UI tokens.
 */
const blobs = [
  { className: "left-[-12%] top-[-10%] h-[43vw] w-[30vw] bg-[rgb(0_160_118/0.45)]", delay: "0s", dur: "22s" },
  { className: "right-[-14%] top-[6%] h-[38vw] w-[38vw] bg-[rgb(80_160_110/0.4)]", delay: "-6s", dur: "26s" },
  { className: "bottom-[-16%] left-[18%] h-[44vw] w-[44vw] bg-[rgb(0_106_78/0.38)]", delay: "-12s", dur: "30s" },
];

export function PageBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {blobs.map((blob, index) => (
        <span
          key={index}
          className={`blob absolute block rounded-full blur-3xl will-change-transform ${blob.className}`}
          style={{ animation: `blobFloat ${blob.dur} ease-in-out ${blob.delay} infinite` }}
        />
      ))}
    </div>
  );
}
