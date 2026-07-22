// The product card used in Featured, Listing, and "You might also like".

import type { Product } from "../data/types.ts";
import { catName, statusMeta } from "../lib/catalog.ts";
import { money } from "../lib/format.ts";
import { phBg, phIconCol } from "../lib/placeholders.ts";
import { ratingFor } from "../lib/ratings.ts";
import { useStore } from "../state/store.ts";
import { Icon } from "./Icon.tsx";
import { StarRating } from "./StarRating.tsx";

export interface ProductCardProps {
  product: Product;
  iconSize?: string;
}

export function ProductCard({
  product: p,
  iconSize = "clamp(46px,8vw,60px)",
}: ProductCardProps) {
  const theme = useStore((s) => s.theme);
  const cats = useStore((s) => s.cats);
  const ratings = useStore((s) => s.ratings);
  const userReviews = useStore((s) => s.userReviews);
  const openProduct = useStore((s) => s.openProduct);
  const add = useStore((s) => s.add);

  const out = p.status === "out";
  const sm = statusMeta(p.status);
  const rt = ratingFor(p.id, ratings, userReviews);

  return (
    <div
      className="jk-card"
      onClick={() => openProduct(p.id)}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        boxShadow: "var(--shadow)",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          background: phBg(p.tint, theme),
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: phIconCol(p.tint, theme),
            opacity: out ? 0.5 : 1,
            filter: out ? "grayscale(.5)" : "none",
          }}
        >
          <Icon name={p.icon} size={iconSize} />
        </div>
        <button
          className="jk-qa"
          onClick={(e) => {
            e.stopPropagation();
            add(p.id, 1);
          }}
          title={out ? "Sold out" : "Add to cart"}
          style={{
            position: "absolute",
            top: "11px",
            insetInlineEnd: "11px",
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            border: "1px solid var(--border)",
            background: out ? "var(--surface-2)" : "var(--surface)",
            color: out ? "var(--fg-subtle)" : "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: out ? "not-allowed" : "pointer",
            boxShadow: "var(--shadow)",
          }}
        >
          <Icon name={out ? "ban" : "plus"} size={17} />
        </button>
      </div>
      <div
        style={{
          padding: "13px 15px 15px",
          display: "flex",
          flexDirection: "column",
          gap: "3px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "var(--fg-subtle)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".04em",
          }}
        >
          {catName(cats, p.cat)}
        </div>
        <div
          style={{
            fontSize: "14.5px",
            fontWeight: 700,
            letterSpacing: "-.01em",
            lineHeight: 1.28,
          }}
        >
          {p.title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "5px",
          }}
        >
          <StarRating avg={rt.avg} size={12} gap={1} />
          <span
            style={{
              fontSize: "11px",
              color: "var(--fg-subtle)",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            {rt.avgLabel} ({rt.count})
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "7px",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            {money(p.price)}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11.5px",
              fontWeight: 700,
              color: sm.col,
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: sm.col,
                flexShrink: 0,
              }}
            />
            {sm.label}
          </span>
        </div>
      </div>
    </div>
  );
}
