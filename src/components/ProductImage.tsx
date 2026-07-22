// Real product photography. Renders a cover-fit <img> that fills its
// positioned parent, with the product `tint` shown as a subtle background
// color behind the image while it loads (and as a fallback if it fails).
//
// The parent is expected to be `position: relative` (or absolute) with
// `overflow: hidden` and the desired border-radius; this image absolutely
// fills it.

import { hexToRgba } from "../lib/placeholders.ts";

export interface ProductImageProps {
  /** Photo URL. */
  src: string;
  /** Accessible description — pass the product title. */
  alt: string;
  /** Product tint hex, used as the load/fallback background. */
  tint: string;
  /** Dim + desaturate for sold-out treatment. */
  dim?: boolean;
  /** Extra styles merged onto the <img>. */
  style?: React.CSSProperties;
}

export function ProductImage({ src, alt, tint, dim, style }: ProductImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        background: hexToRgba(tint, 0.18),
        opacity: dim ? 0.55 : 1,
        filter: dim ? "grayscale(.5)" : "none",
        ...style,
      }}
    />
  );
}
