# TradingIA

Sales website for trading **bots**, **indicators** and a monthly **signals** membership.

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript
- **Styling:** Tailwind CSS v4 · shadcn-style UI primitives (Radix)
- **i18n:** hand-rolled dictionaries — Spanish / English / Arabic, with geo + `Accept-Language` detection and full RTL for Arabic
- **Payments:** Stripe (cards + signal subscriptions) and NOWPayments (crypto), both verified via webhooks
- **CRM / funnel:** systeme.io (lead capture popup + contact form)
- **Hosting:** Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have; the site runs without any of it
npm run dev
```

Open http://localhost:3000 — you are redirected to the best-matching locale (`/es`, `/en`, `/ar`).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Project layout

```
src/
  proxy.ts                 Locale detection + redirect (Next "proxy" / middleware)
  i18n/
    config.ts              Locales, RTL, country → locale map
    messages/{es,en,ar}.ts All UI copy. en.ts is the source of truth for the type.
  lib/
    products.ts            Bots, indicators and signal plans (edit here to add products)
    systemeio.ts           Lead → systeme.io contact + tag
    payments.ts            Stripe Checkout + NOWPayments invoice
    delivery.ts            Post-payment fulfilment (TODO: email + Telegram access)
  components/
    ui/                    Button, Dialog, Accordion, Select, … (Radix + Tailwind)
    layout/               Header, footer, language switcher
    marketing/            Sections, product cards, product detail, FAQ
    commerce/buy-dialog   Card / crypto choice → /api/checkout
    lead/                 Exit-intent + 60s lead capture modal
  app/
    [locale]/             All pages
    api/
      leads               POST → systeme.io
      checkout            POST → Stripe / NOWPayments checkout URL
      webhooks/stripe     Payment confirmation → fulfilment
      webhooks/nowpayments IPN (HMAC-SHA512) → fulfilment
```

## Adding a product

Edit `src/lib/products.ts` (add to `bots`, `indicators` or `signalPlans`), then add the
matching Stripe Price ID env var: slug `aurum-scalper` → `STRIPE_PRICE_AURUM_SCALPER`.

## Environment variables

See `.env.example`. Everything is optional — features activate as keys are added:

- **systeme.io:** `SYSTEMEIO_API_KEY`, optional `SYSTEMEIO_TAG_ID`
- **Stripe:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*`
- **NOWPayments:** `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET`
- **Public links:** `NEXT_PUBLIC_EXNESS_REFERRAL_URL`, `NEXT_PUBLIC_MEET_URL`,
  `NEXT_PUBLIC_TELEGRAM_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`

## Still to wire up (phase 2)

- `lib/delivery.ts`: email the bot/indicator license + manual after payment
- Telegram bot: add/remove buyers from the private signals channel on
  subscription start / lapse
- systeme.io: move buyers to the post-purchase email sequence
- Native Arabic copy review
