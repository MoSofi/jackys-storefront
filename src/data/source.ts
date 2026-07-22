// DataSource — the seam between the storefront UI and its catalog data.
//
// Today there is a single implementation, `demoSource`, backed by the static
// demo catalog in demo.ts. When Adminium's publishable-key API lands, a second
// implementation (e.g. `adminiumSource(key)`) can satisfy the same contract and
// the app switches over without touching the screens or the store.
//
// The contract is intentionally thin and synchronous: the demo data is bundled,
// so there is nothing to await. A backend implementation can widen these to
// return Promises later.

import {
  CATS,
  CUSTOMER,
  ORDERS,
  PRODUCTS,
  RATINGS,
  REVIEWPOOL,
} from "./demo.ts";
import type {
  Category,
  Order,
  Product,
  RatingSeed,
  Review,
} from "./types.ts";

export interface Customer {
  name: string;
  email: string;
  initials: string;
}

export interface DataSource {
  getProducts(): Product[];
  getCategories(): Category[];
  /** Seeded aggregate ratings, keyed by product id. */
  getRatings(): Record<string, RatingSeed>;
  /** The pool reviews are deterministically sampled from, per product. */
  getReviewPool(): Review[];
  /** Seeded order history for the account view. */
  getOrders(): Order[];
  /** The signed-in demo customer. */
  getCustomer(): Customer;
}

export const demoSource: DataSource = {
  getProducts: () => PRODUCTS,
  getCategories: () => CATS,
  getRatings: () => RATINGS,
  getReviewPool: () => REVIEWPOOL,
  getOrders: () => ORDERS,
  getCustomer: () => CUSTOMER,
};
