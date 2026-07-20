"use client";

interface MiniDonutChartProps {
  win: number;
  draw: number;
  loss: number;
  size?: number;
}

const SEGMENT_COLORS = {
  win: "#19B67A",
  draw: "#F1A83A",
  loss: "#E2547A",
} as const;

const TRACK_COLOR = "#E5E7EB";

export function MiniDonutChart({ win, draw, loss, size = 40 }: MiniDonutChartProps) {
  const total = win + draw + loss;
  const strokeWidth = size * 0.34;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = total > 0 ? Math.min(circumference * 0.02, 3) : 0;

  const segments = (
    [
      { key: "win", value: win, color: SEGMENT_COLORS.win },
      { key: "draw", value: draw, color: SEGMENT_COLORS.draw },
      { key: "loss", value: loss, color: SEGMENT_COLORS.loss },
    ] as const
  ).filter((segment) => segment.value > 0);

  let offset = 0;
  const arcs = segments.map((segment) => {
    const length = Math.max((segment.value / total) * circumference - gap, 0);
    const dashArray = `${length} ${circumference - length}`;
    const dashOffset = -offset;
    offset += (segment.value / total) * circumference;
    return { ...segment, dashArray, dashOffset };
  });

  const label =
    total > 0
      ? `${win} win, ${draw} draw, ${loss} loss out of ${total} games`
      : "No games played yet";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
      className="shrink-0"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={TRACK_COLOR}
        strokeWidth={strokeWidth}
      />
      {arcs.map((arc) => (
        <circle
          key={arc.key}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={arc.color}
          strokeWidth={strokeWidth}
          strokeDasharray={arc.dashArray}
          strokeDashoffset={arc.dashOffset}
          strokeLinecap="butt"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      ))}
    </svg>
  );
}
