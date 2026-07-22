# Jacky's Storefront

A complete, production-shaped e-commerce storefront — built with Vite + React +
TypeScript, no CSS framework, no backend required. It's the example app that
ships with [Adminium](https://adminium.dev): browse a catalog, configure product
variants, personalize items, run a cart with promo codes and a 4-step checkout,
and place a (demo) order — all from built-in demo data.

**Live demo → [adminium.dev/demo/jackys-storefront](https://adminium.dev/demo/jackys-storefront)**

## Highlights

- **State-based routing** (no router) — a single `view` value drives the whole
  app: home, listing, product, cart, checkout, confirmation, and account.
- **Real commerce logic** — a variant matrix with cross-option disabling and
  out-of-stock overlays, composite cart line-items (options + engraving +
  bundle), `WELCOME10` promo, free-shipping progress, tax, and shipping tiers.
- **Light / dark themes** via CSS custom properties, persisted to `localStorage`.
- **Self-contained visuals** — self-hosted Manrope + JetBrains Mono, tree-shaken
  `lucide-react` icons, and procedural placeholder art (swap in real product
  photos when you have them).
- **No payment integration** — the checkout's card field only *mimics* Stripe
  Elements. Nothing is ever charged.

## Local development

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

## Deploy

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MoSofi/jackys-storefront&project-name=jackys-storefront&repository-name=jackys-storefront)
&nbsp;
[![Deploy to DigitalOcean](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/MoSofi/jackys-storefront/tree/main)

- **Vercel** — click the button above, or import the repo. Build command
  `npm run build`, output `dist`.
- **DigitalOcean App Platform** — click the button above, or use the included
  [`.do/deploy.template.yaml`](.do/deploy.template.yaml).
- **Host anywhere** — `npm run build` produces a fully static `dist/` you can
  drop on any static host (Netlify, Cloudflare Pages, S3, GitHub Pages…). Or
  build the container:

  ```bash
  docker build -t jackys-storefront .
  docker run -p 8080:80 jackys-storefront
  ```

### Build scripts

| Script              | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server.                                          |
| `npm run build`     | Type-check + build to `dist/` at base `/` (root deploys).           |
| `npm run build:demo`| Build to `dist/` at base `/demo/jackys-storefront/` (Adminium demo).|
| `npm run preview`   | Preview a production build locally.                                 |

## Connecting to Adminium

The app runs on **built-in demo data today**. All catalog access goes through a
thin `DataSource` interface ([`src/data/source.ts`](src/data/source.ts)) with a
single `demoSource` implementation. When Adminium's publishable-key API lands,
you'll be able to drop in an Adminium-backed `DataSource` — the same contract,
now reading your real products, orders, and reviews — without touching any of
the screens or the store.

## Project structure

```
src/
  app/         App shell + view switch
  state/       Zustand store (cart engine, filters, checkout, theme)
  data/        demo catalog, types, DataSource seam
  lib/         pricing, ratings, placeholders, formatting
  screens/     Home · Listing · Product · Cart · Checkout · Confirm · Account · NotFound
  components/  Header, Footer, ProductCard, CartDrawer, OptionPicker, modals, …
  styles/      tokens.css (design tokens) + base.css (fonts, utilities)
public/fonts/  self-hosted Manrope + JetBrains Mono (woff2)
```

## License

[AGPL-3.0](LICENSE) © 2026 Jacky's. A demo store shipped with Adminium.
