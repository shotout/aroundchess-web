"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

// 0-9 plus a duplicate 0 so a wheel can roll forward past 9 (9 -> 0 wrap).
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
  /** Seconds the roll takes. */
  duration?: number;
  /** Seconds to wait before rolling starts. */
  delay?: number;
  className?: string;
}

/**
 * Classic mechanical-odometer counter: each digit sits on a wheel and only
 * rolls to the next value during the last stretch of the digit below it
 * completing a full cycle, exactly like an old car's dial.
 */
export function EloOdometer({
  from,
  to,
  duration = 1.8,
  delay = 0.6,
  className = "",
}: EloOdometerProps) {
  // Whole ratings only. The API can hand back a fractional ELO, and a
  // fractional *end* value left a wheel parked between two digits forever —
  // the counter looked frozen mid-roll. Rounding first means the roll always
  // lands on a whole digit.
  const start = Math.round(from);
  const target = Math.round(to);

  const [value, setValue] = useState(start);
  // Off outside the roll, so a resting counter can never render a part-rolled
  // wheel: the digits below come straight from `target` once this is false.
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (start === target) {
      setValue(target);
      setRolling(false);
      return;
    }
    setValue(start);
    setRolling(true);
    const controls = animate(start, target, {
      duration,
      delay,
      ease: [0.25, 1, 0.4, 1],
      onUpdate: (v) => setValue(v),
      // Snap: the last frame can land a hair short of `target`, which is all
      // it takes to strand the units wheel between two digits.
      onComplete: () => {
        setValue(target);
        setRolling(false);
      },
    });
    return () => controls.stop();
  }, [start, target, duration, delay]);

  const safeValue = Math.max(0, rolling ? value : target);
  const digitCount = Math.max(
    String(Math.max(Math.abs(start), Math.abs(target), 1)).length,
    1
  );

  const wheels = [];
  for (let i = digitCount - 1; i >= 0; i--) {
    const pow = Math.pow(10, i);
    const scaled = safeValue / pow;
    const digit = Math.floor(scaled) % 10;
    const frac = scaled - Math.floor(scaled);
    // The wheel stays put for 90% of the lower cycle, then rolls over
    // during the final 10% — the mechanical tick.
    const roll = rolling && frac > 0.9 ? (frac - 0.9) * 10 : 0;
    wheels.push(<DigitWheel key={i} position={digit + roll} />);
  }

  return <span className={`inline-flex ${className}`}>{wheels}</span>;
}
