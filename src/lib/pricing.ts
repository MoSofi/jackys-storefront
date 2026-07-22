// The cart engine + variant matrix — the load-bearing commerce logic, ported
// faithfully from the comp. Pure functions only; state lives in the store.

import {
  FREE_SHIP,
  PROMO_RATE,
  SHIP_EXPRESS,
  SHIP_OVERNIGHT,
  SHIP_STANDARD,
  TAX_RATE,
} from "../data/demo.ts";
import type {
  Cart,
  CartCustom,
  OptionSelection,
  Order,
  OrderItem,
  OrderTotals,
  Product,
  ShipMethod,
  Stock,
} from "../data/types.ts";

export type VariantStatus = Stock | "na";

export function optionsOf(p: Product) {
  return p.options || [];
}

export function comboKey(p: Product, opts: OptionSelection): string {
  return optionsOf(p)
    .map((o) => opts[o.key])
    .join(",");
}

export function variantOf(p: Product, opts: OptionSelection) {
  if (!p.variants) return { s: p.status, d: 0 };
  return p.variants[comboKey(p, opts)];
}

export function variantExists(p: Product, opts: OptionSelection): boolean {
  if (!optionsOf(p).length || !p.variants) return true;
  return !!p.variants[comboKey(p, opts)];
}

export function variantStatus(p: Product, opts: OptionSelection): VariantStatus {
  const v = variantOf(p, opts);
  return v ? v.s || "in" : "na";
}

export function customFee(p: Product, custom: CartCustom | null): number {
  if (!p.custom || !custom || !custom.text) return 0;
  return (
    (p.custom.fee || 0) +
    (custom.logo && p.custom.logoFee ? p.custom.logoFee : 0)
  );
}

export function unitPrice(
  p: Product,
  opts: OptionSelection,
  custom: CartCustom | null,
): number {
  const v = variantOf(p, opts);
  return p.price + ((v && v.d) || 0) + customFee(p, custom);
}

export function lineKey(
  p: Product,
  opts: OptionSelection,
  custom: CartCustom | null,
  disc: number,
): string {
  return (
    p.id +
    "|" +
    comboKey(p, opts || {}) +
    "|" +
    (custom && custom.text
      ? "e:" + custom.text + (custom.logo ? "+L" : "")
      : "") +
    "|b:" +
    (disc || 0)
  );
}

export function optLabel(p: Product, opts: OptionSelection): string {
  if (!optionsOf(p).length) return "";
  return optionsOf(p)
    .map((o) => {
      const v = o.values.find((x) => x.id === (opts || {})[o.key]);
      return v ? v.label : "";
    })
    .filter(Boolean)
    .join(" · ");
}

export function customLabel(p: Product, custom: CartCustom | null): string {
  if (!p.custom || !custom || !custom.text) return "";
  return (
    p.custom.verb + ': “' + custom.text + '”' + (custom.logo ? " + logo" : "")
  );
}

/** The default option selection for a PDP — falls back to the first existing
 * variant when the all-first-value combo has no entry. */
export function defaultSel(p: Product): OptionSelection {
  const opts = optionsOf(p);
  if (!opts.length) return {};
  const sel: OptionSelection = {};
  opts.forEach((o) => {
    sel[o.key] = o.values[0].id;
  });
  if (variantExists(p, sel)) return sel;
  const keys = Object.keys(p.variants || {});
  if (keys.length) {
    const parts = keys[0].split(",");
    opts.forEach((o, i) => {
      sel[o.key] = parts[i];
    });
  }
  return sel;
}

export interface CartLineView {
  key: string;
  p: Product;
  opts: OptionSelection;
  custom: CartCustom | null;
  qty: number;
  /** Per-unit price after any bundle discount. */
  unit: number;
  /** Per-unit price before the bundle discount. */
  orig: number;
  bundleOff: number;
  optLabel: string;
  customLabel: string;
}

export function cartArr(
  cart: Cart,
  index: Record<string, Product>,
): CartLineView[] {
  return Object.keys(cart)
    .map((k): CartLineView | null => {
      const l = cart[k];
      const p = index[l.pid];
      if (!p) return null;
      const full = unitPrice(p, l.opts || {}, l.custom);
      const d = l.disc || 0;
      return {
        key: k,
        p,
        opts: l.opts || {},
        custom: l.custom || null,
        qty: l.qty,
        unit: full * (1 - d),
        orig: full,
        bundleOff: d,
        optLabel: optLabel(p, l.opts || {}),
        customLabel: customLabel(p, l.custom),
      };
    })
    .filter((x): x is CartLineView => x !== null);
}

export function count(lines: CartLineView[]): number {
  return lines.reduce((s, x) => s + x.qty, 0);
}

export function subtotalOf(lines: CartLineView[]): number {
  return lines.reduce((s, x) => s + x.unit * x.qty, 0);
}

export function shipFee(subtotal: number, ship: ShipMethod): number {
  if (subtotal === 0) return 0;
  if (ship === "express") return SHIP_EXPRESS;
  if (ship === "overnight") return SHIP_OVERNIGHT;
  return subtotal >= FREE_SHIP ? 0 : SHIP_STANDARD;
}

export function discountOf(subtotal: number, promoOn: boolean): number {
  return promoOn ? subtotal * PROMO_RATE : 0;
}

export interface Totals {
  sub: number;
  disc: number;
  ship: number;
  shipFree: boolean;
  tax: number;
  total: number;
}

export function computeTotals(
  lines: CartLineView[],
  ship: ShipMethod,
  promoOn: boolean,
): Totals {
  const sub = subtotalOf(lines);
  const disc = discountOf(sub, promoOn);
  const taxable = Math.max(0, sub - disc);
  const fee = shipFee(sub, ship);
  const tax = taxable * TAX_RATE;
  return {
    sub,
    disc,
    ship: fee,
    shipFree: fee === 0,
    tax,
    total: taxable + fee + tax,
  };
}

export interface NormItem {
  pid: string;
  qty: number;
  unit: number;
  optLabel: string;
  customLabel: string;
}

/** Normalize seeded/placed order items (pairs or rich items) into a uniform
 * shape for the confirm/account views. */
export function normItems(
  items: OrderItem[] | undefined,
  index: Record<string, Product>,
): NormItem[] {
  return (items || []).map((it) => {
    if (Array.isArray(it)) {
      const p = index[it[0]];
      return {
        pid: it[0],
        qty: it[1],
        unit: p ? p.price : 0,
        optLabel: "",
        customLabel: "",
      };
    }
    return {
      pid: it.pid,
      qty: it.qty,
      unit: it.unit != null ? it.unit : (index[it.pid]?.price || 0),
      optLabel: it.optLabel || "",
      customLabel: it.customLabel || "",
    };
  });
}

/** Totals for an order — uses its stored totals when present, otherwise
 * reconstructs them from the items + ship method (seeded orders). */
export function confTotals(
  o: Order,
  index: Record<string, Product>,
): OrderTotals {
  if (o.totals) return o.totals;
  const ni = normItems(o.items, index);
  const sub = ni.reduce((s, it) => s + it.unit * it.qty, 0);
  const m = o.shipMethod || o.ship || "standard";
  const ship =
    m === "express"
      ? SHIP_EXPRESS
      : m === "overnight"
        ? SHIP_OVERNIGHT
        : sub >= FREE_SHIP
          ? 0
          : SHIP_STANDARD;
  const tax = sub * TAX_RATE;
  return { sub, disc: 0, ship, shipFree: ship === 0, tax, total: sub + ship + tax };
}
