import type { CSSProperties } from 'react';

/**
 * React Bits — ShinyText, rewritten as pure CSS.
 *
 * The registry version drove the sheen from JavaScript on every frame
 * (`motion`'s useAnimationFrame), forever, and pulled in the whole `motion`
 * library (~124 KB) just for this: the biggest single cost of the home page on
 * modest devices. A CSS keyframe animation draws the same sweep with no JS at
 * all; "reduce motion" keeps the text static (see `.shiny-text` in
 * globals.css). Same props as before for the ones in use.
 */
interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  /** Seconds the sheen takes to cross the text. */
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  /** Seconds the sheen waits off-screen between passes. */
  delay?: number;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 2,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  delay = 0,
}: ShinyTextProps) {
  const total = speed + delay;
  // The sweep runs during the first `speed` seconds of each cycle and then
  // holds off-screen for `delay` seconds, like the original.
  const active = Math.round((speed / total) * 100);
  const name = `shine-${active}`;
  const style = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    '--shine-name': name,
    '--shine-duration': `${total}s`,
  } as CSSProperties;

  return (
    <>
      <style>{`@keyframes ${name}{0%{background-position:150% center}${active}%,100%{background-position:-50% center}}`}</style>
      <span className={`shiny-text inline-block ${disabled ? 'shiny-text--off' : ''} ${className}`.trim()} style={style}>
        {text}
      </span>
    </>
  );
}
