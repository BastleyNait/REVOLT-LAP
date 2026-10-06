'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * React Bits — ClickSpark (adapted).
 * Changes vs. the registry version: the canvas only animates while sparks are
 * alive (the original kept a requestAnimationFrame loop running forever), it
 * is sharp on HiDPI screens, it skips the effect under prefers-reduced-motion,
 * and the wrapper is inline (`className`) so it can wrap a single button.
 */
interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  extraScale?: number;
  className?: string;
  children?: React.ReactNode;
}

/** Extra canvas room around the wrapped element so sparks are not clipped. */
const BLEED = 32;

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  className,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round((width + BLEED * 2) * dpr);
      canvas.height = Math.round((height + BLEED * 2) * dpr);
      canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(parent);
    resizeCanvas();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  const draw = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const eased = easeFunc(elapsed / duration);
        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(spark.x + distance * Math.cos(spark.angle), spark.y + distance * Math.sin(spark.angle));
        ctx.lineTo(
          spark.x + (distance + lineLength) * Math.cos(spark.angle),
          spark.y + (distance + lineLength) * Math.sin(spark.angle)
        );
        ctx.stroke();
        return true;
      });

      // Stop the loop as soon as the last spark fades.
      frameRef.current = sparksRef.current.length ? requestAnimationFrame(draw) : 0;
    },
    [sparkColor, sparkSize, sparkRadius, duration, easeFunc, extraScale]
  );

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = canvas.getBoundingClientRect();
    const now = performance.now();

    sparksRef.current.push(
      ...Array.from({ length: sparkCount }, (_, i) => ({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now
      }))
    );
    if (!frameRef.current) frameRef.current = requestAnimationFrame(draw);
  };

  return (
    <div className={cn('relative inline-flex', className)} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute z-10"
        style={{ inset: -BLEED, width: `calc(100% + ${BLEED * 2}px)`, height: `calc(100% + ${BLEED * 2}px)` }}
      />
      {children}
    </div>
  );
};

export default ClickSpark;
