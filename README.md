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

Edit `src/lib/products.ts` (add to `bots`, `indicators` or `signalPlans`) — no Stripe
dashboard setup needed. Checkout builds the Stripe amount on the fly from `priceUSD`/
`exnessPriceUSD` (`price_data`, not a pre-created Price ID), so adding or repricing a
product is a one-file change.

## The purchase flow

`BuyDialog` (`src/components/commerce/buy-dialog.tsx`) walks through up to four steps —
skipping whichever don't apply to that product:

1. **Price choice** (bots & indicators with an Exness discount only): two buttons,
   standard vs. Exness-referral price. Picking "without Exness" on a **bot**
   shows a VPS warning (a bot needs one to run 24/7; Exness gives one free from a
   $2,000 deposit) with a chance to switch to the Exness price instead.
2. **Details**: name + email, always. If they stuck with the standard price after
   seeing the VPS warning, this also fires a background `/api/leads` call
   (`source: "checkout_no_exness"`) so systeme.io can remarket to them if they
   don't finish checking out.
3. **Payment method**: card (Stripe) or crypto — crypto is restricted to
   USDT/USDC/BNB (NOWPayments `pay_currency`, see `CRYPTO_CURRENCIES` in
   `lib/payments.ts` — verify the exact ticker spelling against NOWPayments'
   `/v1/currencies` before going live).
4. **After payment** (bots only): the success page shows a short form —
   account number + MT4/5 server — since bots are compiled by hand per account
   today. The same form is linked from the buyer's confirmation email in case
   they close the tab first.

## How a bot purchase gets fulfilled today

Full end-to-end automation isn't possible yet since compiling is manual — here's
what *is* automated:

1. Card payments: the buyer's email goes to Stripe as `customer_email`; the rest
   (name, product, chosen price tier) rides along in `metadata`, which Stripe
   echoes back on the webhook.
2. Crypto payments: NOWPayments' IPN has no "customer" field, so the buyer's
   name + email are packed into the order description (`src/lib/orders.ts`,
   base64) and unpacked in `api/webhooks/nowpayments`.
3. On a confirmed payment, `lib/delivery.ts` emails **you**
   (`ORDER_NOTIFICATION_EMAIL`) the order (product, price tier, buyer, amount)
   and emails the **buyer** a "we've got your order" note with a link to the
   account-details form. Both emails go out via Zoho Mail SMTP
   (`lib/email.ts`) — see `.env.example` for the `ZOHO_SMTP_*` keys.
4. When the buyer submits account number + server, `api/orders/account-details`
   emails you that too — match it to the sale by the email address (and, for
   the Exness price tier, cross-check the account against your Exness partner
   dashboard before compiling, since the discount is currently honor-system).

Once there's a license-key system that can validate an account number at
runtime, swap the "email a human" steps for a real API call and attach the
actual file — the webhook plumbing already carries everything (product,
buyer, price tier) that would need.

## Environment variables

See `.env.example`. Everything is optional — features activate as keys are added:

- **systeme.io:** `SYSTEMEIO_API_KEY`, optional `SYSTEMEIO_TAG_ID`
- **Stripe:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **NOWPayments:** `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET`
- **Zoho Mail SMTP:** `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASS`, `ORDER_NOTIFICATION_EMAIL`
- **Public links:** `NEXT_PUBLIC_EXNESS_REFERRAL_URL`, `NEXT_PUBLIC_MEET_URL`,
  `NEXT_PUBLIC_TELEGRAM_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`

## Still to wire up (phase 2)

- A license-key system, so bot delivery can become fully automatic instead of
  "email the order details to a human to compile"
- Telegram bot: add/remove buyers from the private signals channel on
  subscription start / lapse
- systeme.io: move buyers to the post-purchase email sequence
- Native Arabic copy review
