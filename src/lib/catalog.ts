// Catalog lookups shared across screens: product-by-id, category names/counts,
// and the status pill metadata.

import type { Category, Product, Stock } from "../data/types.ts";

export function indexBy(products: Product[]): Record<string, Product> {
  const idx: Record<string, Product> = {};
  for (const p of products) idx[p.id] = p;
  return idx;
}

export function catName(cats: Category[], slug: string): string {
  const c = cats.find((x) => x.slug === slug);
  return c ? c.name : "All";
}

export function catCount(products: Product[], slug: string): number {
  return products.filter((p) => p.cat === slug).length;
}

export interface StatusMeta {
  label: string;
  col: string;
  soft: string;
}

export function statusMeta(s: Stock | "na"): StatusMeta {
  if (s === "in")
    return { label: "In stock", col: "var(--pos)", soft: "var(--pos-soft)" };
  if (s === "low")
    return { label: "Low stock", col: "var(--warn)", soft: "var(--warn-soft)" };
  return {
    label: "Sold out",
    col: "var(--fg-subtle)",
    soft: "var(--surface-3)",
  };
}
