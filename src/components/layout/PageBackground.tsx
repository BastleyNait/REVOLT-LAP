/**
 * Ambient aurora behind the whole site: soft color blobs so the frosted-glass
 * surfaces have something luminous to refract.
 *
 * Static radial gradients, not blurred animated shapes. The previous version
 * drifted three `blur-3xl` blobs forever: a GPU blur over a third of the screen
 * each, and — worse — every frosted surface on top (the navbar, the hero chips)
 * had to re-filter its backdrop on every frame even with nobody touching the
 * page. On modest laptops and phones that was the constant lag. A radial
 * gradient draws the same soft glow with no filter and no per-frame work.
 * Colors are the original palette values, independent of the UI tokens.
 */
const blobs = [
  { className: "left-[-12%] top-[-10%] h-[43vw] w-[30vw]", color: "rgb(0 160 118 / 0.45)" },
  { className: "right-[-14%] top-[6%] h-[38vw] w-[38vw]", color: "rgb(80 160 110 / 0.4)" },
  { className: "bottom-[-16%] left-[18%] h-[44vw] w-[44vw]", color: "rgb(0 106 78 / 0.38)" },
];

export function PageBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {blobs.map((blob, index) => (
        <span
          key={index}
          className={`absolute block ${blob.className}`}
          style={{ background: `radial-gradient(closest-side, ${blob.color}, transparent)` }}
        />
      ))}
    </div>
  );
}
