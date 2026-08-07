"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

const DIGIT_STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

function DigitWheel({ position }: { position: number }) {
  return (
    <span className="relative inline-block h-[1em] w-[1ch] overflow-hidden">
      <span
        className="absolute left-0 top-0 flex flex-col w-full"
        style={{ transform: `translateY(${-position}em)` }}
      >
        {DIGIT_STRIP.map((d, i) => (
          <span key={i} className="h-[1em] leading-[1em] text-center">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

interface EloOdometerProps {
  from: number;
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function EloOdometer({
  from,
  to,
  duration = 1.8,
  delay = 0.6,
  className = "",
}: EloOdometerProps) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (from === to) {
      setValue(to);
      return;
    }
    const controls = animate(from, to, {
      duration,
      delay,
      ease: [0.25, 1, 0.4, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [from, to, duration, delay]);

  const safeValue = Math.max(0, value);
  const digitCount = Math.max(
    String(Math.max(Math.abs(Math.round(from)), Math.abs(Math.round(to)), 1))
      .length,
    1
  );

  const wheels = [];
  for (let i = digitCount - 1; i >= 0; i--) {
    const pow = Math.pow(10, i);
    const scaled = safeValue / pow;
    const digit = Math.floor(scaled) % 10;
    const frac = scaled - Math.floor(scaled);
    const roll = frac > 0.9 ? (frac - 0.9) * 10 : 0;
    wheels.push(<DigitWheel key={i} position={digit + roll} />);
  }

  return <span className={`inline-flex ${className}`}>{wheels}</span>;
}
