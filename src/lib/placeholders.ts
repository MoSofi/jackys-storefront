// Procedural placeholder art — the comp has no bitmaps; every product/hero
// visual is a layered CSS gradient tinted from the product's `tint` hex, with a
// large Lucide icon centered on top. The gradients are theme-aware (different
// alphas in dark mode), so these helpers take the current theme.
//
// In a real deployment these placeholders are swapped for actual product
// photography; the tinted slots simply mark where an <img> would go.

export type Theme = "light" | "dark";

export function hexToRgba(hex: string, a: number): string {
  let h = (hex || "#4f46e5").replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Background image string for a placeholder slot. */
export function phBg(tint: string, theme: Theme, ang = "158deg"): string {
  const d = theme === "dark";
  const hi = d
    ? "radial-gradient(120% 82% at 50% 0%, rgba(255,255,255,.06), transparent 55%)"
    : "radial-gradient(120% 82% at 50% 0%, rgba(255,255,255,.6), transparent 58%)";
  const ped =
    "radial-gradient(52% 20% at 50% 80%, " +
    hexToRgba(tint, d ? 0.34 : 0.22) +
    ", transparent 72%)";
  const b = d
    ? "linear-gradient(" +
      ang +
      ", " +
      hexToRgba(tint, 0.32) +
      ", " +
      hexToRgba(tint, 0.14) +
      ")"
    : "linear-gradient(" +
      ang +
      ", " +
      hexToRgba(tint, 0.19) +
      ", " +
      hexToRgba(tint, 0.07) +
      ")";
  return hi + ", " + ped + ", " + b;
}

/** Icon color for a placeholder slot. */
export function phIconCol(tint: string, theme: Theme): string {
  return hexToRgba(tint, theme === "dark" ? 0.62 : 0.5);
}
