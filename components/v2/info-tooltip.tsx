"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface InfoTooltipProps {
  text: string;
  size?: number;
  align?: "left" | "right";
}

export function InfoTooltip({ text, size = 14, align = "right" }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open]);

  const arrowOffset = Math.max(size / 2, 10);

  return (
    <div
      ref={ref}
      className="relative inline-flex shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex items-center justify-center"
        aria-label="More info"
      >
        <Image
          src="/images/v2/play/information.png"
          alt="info"
          width={size}
          height={size}
          style={{ width: size, height: size }}
          className="object-contain shrink-0"
        />
      </button>

      {open && (
        <div
          className={`absolute bottom-full mb-[8px] w-max max-w-[min(220px,70vw)] z-50 ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          <div className="relative bg-black text-white text-[12px] leading-snug rounded-lg px-3 py-2 shadow-lg text-center">
            {text}
            <div
              className="absolute -bottom-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black"
              style={align === "left" ? { left: arrowOffset } : { right: arrowOffset }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
