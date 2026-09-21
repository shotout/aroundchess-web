"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate } from "framer-motion";

// 0-9 plus a duplicate 0 so a wheel can roll forward past 9 (9 -> 0 wrap).
const DIGIT_STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

/**
 * Where wheel `place` (0 = units, 1 = tens, …) sits for a given counter value,
 * in ems of downward travel.
 *
 * The units wheel turns continuously, because it is the one the eye follows —
 * gating it like the wheels above it left it parked for 90% of every step and
 * then snapping, which read as a dropped-frame stutter rather than as motion.
 *
 * Every wheel above it keeps the mechanical tick: it holds its digit while the
 * wheel below crosses its cycle and only turns over during the last 10% of it,
 * exactly like an old car's dial.
 */
function wheelPosition(value: number, place: number): number {
  const scaled = Math.max(0, value) / Math.pow(10, place);
  const digit = Math.floor(scaled) % 10;
  const frac = scaled - Math.floor(scaled);
  if (place === 0) return digit + frac;
  return digit + (frac > 0.9 ? (frac - 0.9) * 10 : 0);
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

  const digitCount = useMemo(
    () =>
      Math.max(
        String(Math.max(Math.abs(start), Math.abs(target), 1)).length,
        1
      ),
    [start, target]
  );

  // Indexed by place value, so refs.current[0] is the units wheel.
  const wheels = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Written straight to the DOM rather than through state. Re-rendering every
    // wheel (and all eleven digits on each) once per frame while the win/lose
    // Lottie is decoding its own frames was enough to drop the roll well below
    // 60fps; the digits themselves never change, only the offset does.
    const apply = (value: number) => {
      for (let place = 0; place < digitCount; place++) {
        const el = wheels.current[place];
        if (el) {
          el.style.transform = `translateY(${-wheelPosition(value, place)}em)`;
        }
      }
    };

    apply(start);
    if (start === target) return;

    const controls = animate(start, target, {
      duration,
      delay,
      ease: [0.25, 1, 0.4, 1],
      onUpdate: apply,
      // Snap: the last frame can land a hair short of `target`, which is all
      // it takes to strand the units wheel between two digits.
      onComplete: () => apply(target),
    });
    return () => controls.stop();
  }, [start, target, duration, delay, digitCount]);

  const places = [];
  for (let place = digitCount - 1; place >= 0; place--) places.push(place);

  return (
    <span className={`inline-flex ${className}`}>
      {places.map((place) => (
        <span
          key={place}
          className="relative inline-block h-[1em] w-[1ch] overflow-hidden"
        >
          <span
            ref={(el) => {
              wheels.current[place] = el;
            }}
            className="absolute left-0 top-0 flex flex-col w-full"
            // The first paint matches the opening value; every frame after it
            // comes from the effect above. willChange keeps each wheel on its
            // own layer so a turn is a composite, not a repaint.
            style={{
              transform: `translateY(${-wheelPosition(start, place)}em)`,
              willChange: "transform",
            }}
          >
            {DIGIT_STRIP.map((d, i) => (
              <span key={i} className="h-[1em] leading-[1em] text-center">
                {d}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
