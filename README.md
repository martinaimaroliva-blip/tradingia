# SmartradeBot

Sales website for trading **bots**, **indicators** and a monthly **signals** membership. Live at [smartradebot.com](https://smartradebot.com).

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript
- **Styling:** Tailwind CSS v4 · shadcn-style UI primitives (Radix)
- **i18n:** hand-rolled dictionaries — Spanish / English / Arabic, with geo + `Accept-Language` detection and full RTL for Arabic
- **Payments:** Stripe (cards + signal subscriptions) and NOWPayments (crypto), both verified via webhooks
- **CRM / funnel:** systeme.io — lead capture popup, contact form, referral form, standard-price (no-Exness) remarketing, and Exness-verified buyers all sync as contacts, tagged with their funnel stage via a `funnel_stage` custom field (works on any plan, including free — tags are optional on top)
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

### Automated delivery (file products, e.g. indicators)

If the product is a file the buyer can just be emailed (not account-bound like a
bot, which still needs the manual compile-and-send flow below):

1. Add a module under `src/lib/deliverables/` exporting the file content as a
   string constant (`CODE`/`FILE_NAME`) and localized `INSTALL_INSTRUCTIONS`
   — see `xauusd-impulse-signal.ts` for the shape.
2. Register it by slug in `src/lib/deliverables/index.ts`.
3. Set `hasAutoDelivery: true` on the product in `products.ts` (cosmetic flag
   only — the actual lookup is by slug in `getDeliverable`).

`fulfilPurchase` (`lib/delivery.ts`) checks the registry on every confirmed
payment and, when it finds a match, attaches the file and swaps the generic
"we'll send it by hand" line for the real install steps — no human involved.
Everything without a registry entry keeps working exactly as before.

## The purchase flow

`BuyDialog` (`src/components/commerce/buy-dialog.tsx`) walks through several steps —
skipping whichever don't apply to that product:

1. **Price choice** (bots & indicators with an Exness discount only): two buttons,
   standard vs. Exness-referral price.
2. **Details**: name + email, always.
3. **Standard price, on a bot**: a VPS warning (a bot needs one to run 24/7;
   Exness gives one free from a $2,000 deposit) with a chance to switch to the
   Exness price instead. If they stick with standard, submitting details fires a
   background `/api/leads` call (`source: "checkout_no_exness"`) so systeme.io
   can remarket to them if they don't finish checking out.
4. **Exness price**: a verification gate — see below — before payment unlocks.
5. **Payment method**: card (Stripe), crypto, or Mercado Pago.
   - Crypto is USDT only, on TRC20 or BEP20 (NOWPayments `pay_currency`, see
     `USDT_NETWORKS` in `lib/payments.ts` — verify the exact ticker spelling
     against NOWPayments' `/v1/currencies` before going live). Chosen over
     Binance Pay: Binance Pay requires the payer to have a Binance account
     and pay via their app/QR, whereas this accepts USDT from any wallet on
     the chosen network — closer to what was asked for.
   - **dLocal** is shown as a fourth, disabled "coming soon" option — no
     integration yet, pending their onboarding.
   - Mercado Pago (`lib/payments.ts#createMercadoPagoPreference`, Checkout
     Pro) is the local option for Argentina — card, cuotas, cash. It bills
     in USD by default; most AR seller accounts are ARS-only, so if
     preferences get rejected either ask Mercado Pago to enable USD for the
     account or set `MERCADOPAGO_CURRENCY=ARS` + a `MERCADOPAGO_FX_RATE` you
     control (nothing here guesses an exchange rate).
   - Stripe needs a business entity in a country it supports (not Argentina)
     to actually receive payouts — see the note in the "Payment providers by
     country" section below before relying on it.
6. **After payment** (bots only): the success page shows a short form —
   account number + MT4/5 server — since bots are compiled by hand per account
   today. The same form is linked from the buyer's confirmation email in case
   they close the tab first.

## Exness price verification

The Exness price is real money off, so it's gated server-side, not just a UI
choice — `/api/checkout` rejects `priceChoice: "exness"` unless it comes with a
signed token (`lib/exness.ts`). The flow to get one:

1. After choosing the Exness price and entering their details, the buyer says
   whether they already have an Exness account.
   - **Already have one** → choose "switch partner" (in-app instructions: log
     in, open live chat, type "change partner", submit the form with our
     referral link — flagged as ~72h to confirm) or "open an additional
     account" with a different email (faster).
   - **Don't have one** → straight to opening a new account with our link.
2. Either way, they submit the email their Exness account is/will be
   registered under. `POST /api/exness/verify-request` checks it live
   against the Exness Partner API (`POST /api/partner/affiliation/`,
   `lib/exness.ts#checkExnessAccount` — auth is `Authorization: JWT
   <EXNESS_API_KEY>`).
   - **Affiliated already** (typical for "open a new account", which Exness
     usually attributes right away): the buyer is dropped straight into the
     payment step in the same session — no waiting. This also upserts the
     buyer into systeme.io with `funnel_stage: "exness_verified"` (plus
     `SYSTEMEIO_TAG_ID_EXNESS_VERIFIED` if set), so the funnel automation
     knows they're one step from paying even if they abandon checkout.
   - **Not affiliated yet** (typical right after "switch partner", which
     Exness reviews manually): falls back to notifying **you**
     (`ORDER_NOTIFICATION_EMAIL`) with the case, plus a ready-to-forward
     **resume link** (`lib/exness.ts#buildExnessResumeLink`, HMAC-signed for
     that exact product+email) to send once you confirm it in your Exness
     partner dashboard.
   - **`EXNESS_API_KEY` not set**: skips straight to the manual/resume-link
     path above for every case.
3. Opening the resume link drops the buyer straight past the whole gate,
   with the Exness price already unlocked — `/api/checkout` re-validates the
   signature server-side, so the link can't be edited or guessed.

Set `EXNESS_VERIFY_SECRET` to a real random string before launch — without it
the signing falls back to a shared, insecure dev value. The affiliation
check's response also includes the client's Exness account number(s)
(`accounts`) — not wired up yet, but a good candidate for pre-filling the
post-payment account-details form later instead of asking again.

Today this gate only exists for **bots and indicators** (the only products
with an `exnessPriceUSD` in `lib/products.ts`) — signals don't have an
Exness-linked price yet, so there's nothing to verify there. Say the word if
you want a signals tier added to this flow too.

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
   emails you that too — match it to the sale by the email address.

Once there's a license-key system that can validate an account number at
runtime, swap the "email a human" steps for a real API call and attach the
actual file — the webhook plumbing already carries everything (product,
buyer, price tier) that would need.

## Payment providers by country

- **Stripe** requires the merchant account itself to be domiciled in a
  country Stripe supports for payouts — Argentina isn't one of them. It
  works fine as coded (dynamic `price_data`, no per-product setup) for
  anyone with a business entity in a supported country (US, UK, EU, etc.);
  it then accepts cards from essentially anywhere, including Colombia,
  Chile and Saudi Arabia.
- **Mercado Pago** is the practical self-serve option for an Argentina-based
  seller today, but accounts are per-country — an Argentine Mercado Pago
  account collects from Argentine cardholders; reaching Colombia or Chile
  with local payment methods the same way would need separate Mercado Pago
  accounts opened in those countries, not one account covering the region.
- **Crypto (NOWPayments)** has no such border — it's the one method that
  already works the same everywhere, which is why it's worth leaning on for
  customers a card processor doesn't reach yet (e.g. Colombia without a
  Mercado Pago Colombia account).

None of this is a code limitation — it's each provider's own merchant
onboarding rules. Wiring in another country-specific processor later is the
same pattern as Mercado Pago: a function in `lib/payments.ts`, a checkout
branch, a webhook route.

## Environment variables

See `.env.example`. Everything is optional — features activate as keys are added:

- **systeme.io:** `SYSTEMEIO_API_KEY`, optional `SYSTEMEIO_TAG_ID` (tag applied to
  every lead/contact form/referral submission), optional
  `SYSTEMEIO_TAG_ID_EXNESS_VERIFIED` (a separate tag applied only when a buyer's
  Exness affiliation is confirmed — use it to trigger a "close the sale" automation)
- **Site URL:** `NEXT_PUBLIC_SITE_URL` — set to `https://smartradebot.com` in
  Vercel once the domain is connected (used for metadata, OG tags and links in
  emails)
- **Stripe:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **NOWPayments:** `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET`
- **Mercado Pago:** `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`,
  optional `MERCADOPAGO_SANDBOX`/`MERCADOPAGO_CURRENCY`/`MERCADOPAGO_FX_RATE`
- **Zoho Mail SMTP:** `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASS`, `ORDER_NOTIFICATION_EMAIL`
- **Exness verification:** `EXNESS_VERIFY_SECRET` (set a real one before launch),
  reserved `EXNESS_API_KEY` for future partner-API access
- **Public links:** `NEXT_PUBLIC_EXNESS_REFERRAL_URL`, `NEXT_PUBLIC_MEET_URL`,
  `NEXT_PUBLIC_TELEGRAM_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`

## Still to wire up (phase 2)

- A license-key system, so bot delivery can become fully automatic instead of
  "email the order details to a human to compile"
- Exness partner-API integration (`checkExnessAccount` in `lib/exness.ts`),
  so account verification stops being a manual dashboard check
- Telegram bot: add/remove buyers from the private signals channel on
  subscription start / lapse
- systeme.io: move buyers to the post-purchase email sequence
- Native Arabic copy review
