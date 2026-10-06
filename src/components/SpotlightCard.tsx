'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * React Bits — SpotlightCard (adapted).
 * Changes vs. the registry version: the spotlight layer is updated directly
 * through a ref (no React state → the card's children never re-render on
 * mouse move), only real mouse pointers light it up (no stuck spotlight after
 * a tap), and the card brings no background of its own so callers can use
 * the site's `.glass` surface.
 */
interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.25)'
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const paint = (x: number, y: number) => {
    if (!spotRef.current) return;
    spotRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${spotlightColor}, transparent 80%)`;
  };

  const show = (opacity: number) => {
    if (spotRef.current) spotRef.current.style.opacity = String(opacity);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = e => {
    if (e.pointerType !== 'mouse' || !divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    paint(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <div
      ref={divRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={e => e.pointerType === 'mouse' && show(0.6)}
      onPointerLeave={() => show(0)}
      onFocus={() => show(0.6)}
      onBlur={() => show(0)}
      className={cn('relative overflow-hidden rounded-3xl', className)}
    >
      <div
        ref={spotRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 ease-out"
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
