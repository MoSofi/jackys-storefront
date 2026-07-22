// The clipped-overlay star technique from the comp: a grey five-star row with
// an amber five-star row absolutely positioned on top, clipped to avg%.

import { STAR_COLOR } from "../data/demo.ts";

export interface StarRatingProps {
  avg: number;
  size: number;
  gap?: number;
}

export function StarRating({ avg, size, gap = 2 }: StarRatingProps) {
  const pct = Math.max(0, Math.min(100, (avg / 5) * 100));
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        fontSize: size + "px",
        lineHeight: 1,
        letterSpacing: gap + "px",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: "var(--border-strong)" }}>★★★★★</span>
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: pct + "%",
          overflow: "hidden",
          color: STAR_COLOR,
        }}
      >
        ★★★★★
      </span>
    </span>
  );
}
