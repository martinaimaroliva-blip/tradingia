import Link from "next/link";
import {
  ArrowRight,
  Bot,
  LineChart,
  Radio,
  ShieldCheck,
  Zap,
  CreditCard,
  Server,
  Wallet,
  Gauge,
  CheckCircle2,
} from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Faq } from "@/components/marketing/faq";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bots, indicators } from "@/lib/products";
import { formatUSD } from "@/lib/utils";

const categoryIcons = [Bot, LineChart, Radio];
const howIcons = [CreditCard, Zap, CheckCircle2];
const exnessIcons = [Gauge, Wallet, Server, ShieldCheck];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = await getDictionary(l);
  const lp = (p: string) => `/${l}${p === "/" ? "" : p}`;

  const featured = [bots[0], indicators[1], bots[2]];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" aria-hidden />
        <div className="container-page relative py-20 sm:py-28">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Badge variant="primary" className="mb-5">
              <span className="size-1.5 rounded-full bg-primary" />
              {t.home.hero.badge}
            </Badge>
            <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
              {t.home.hero.title}{" "}
              <span className="text-gradient">{t.home.hero.titleHighlight}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t.home.hero.subtitle}
            </p>
            <p className="mt-6 text-xs text-muted-foreground">{t.home.hero.note}</p>
          </div>

          {/* Advantages */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
            {t.home.stats.map((s) => (
              <div key={s.label} className="bg-card px-5 py-6 text-center">
                <div className="text-2xl font-semibold text-foreground sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <Section id="products">
        <SectionHeading
          eyebrow={t.meta.tagline}
          title={t.home.categories.title}
          subtitle={t.home.categories.subtitle}
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            {
              ...t.home.categories.bots,
              href: "/bots",
            },
            {
              ...t.home.categories.indicators,
              href: "/indicators",
            },
            {
              ...t.home.categories.signals,
              href: "/signals",
            },
          ].map((cat, i) => {
            const Icon = categoryIcons[i];
            return (
              <Link
                key={cat.href}
                href={lp(cat.href)}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40 hover:bg-card/70"
              >
                <span className="grid size-11 place-items-center rounded-lg bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{cat.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {cat.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {cat.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Featured products */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={lp(`/${p.kind === "bot" ? "bots" : "indicators"}/${p.slug}`)}
              className="group flex flex-col rounded-xl border border-border bg-card/60 p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline">{p.assetLabel[l]}</Badge>
                {p.badge === "popular" && (
                  <Badge variant="accent">{t.common.mostPopular}</Badge>
                )}
                {p.badge === "new" && (
                  <Badge variant="primary">{t.common.comingSoon}</Badge>
                )}
              </div>
              <h4 className="mt-3 font-semibold">{p.name}</h4>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                {p.tagline[l]}
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground line-through">
                  {formatUSD(p.priceUSD, l)}
                </span>
                <span className="font-semibold text-accent">
                  {formatUSD(p.exnessPriceUSD, l)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section className="border-y border-border bg-card/30">
        <SectionHeading
          title={t.home.how.title}
          subtitle={t.home.how.subtitle}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.home.how.steps.map((step, i) => {
            const Icon = howIcons[i];
            return (
              <div key={i} className="relative rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Exness teaser */}
      <Section>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid lg:grid-cols-[1.1fr_1fr]">
            <div className="p-8 sm:p-12">
              <Badge variant="primary">{t.home.exness.badge}</Badge>
              <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                {t.home.exness.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t.home.exness.subtitle}
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href={lp("/exness")}>
                    {t.home.exness.cta}
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {t.home.exness.disclaimer}
              </p>
            </div>
            <div className="grid gap-px bg-border sm:grid-cols-2 lg:border-s lg:border-border">
              {t.home.exness.benefits.map((b, i) => {
                const Icon = exnessIcons[i];
                return (
                  <div key={i} className="bg-card p-6">
                    <Icon className="size-5 text-primary" />
                    <h4 className="mt-3 text-sm font-semibold">{b.title}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {b.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="border-y border-border bg-card/30">
        <SectionHeading
          title={t.home.testimonials.title}
          subtitle={t.home.testimonials.subtitle}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {t.home.testimonials.items.map((item, i) => (
            <figure key={i} className="flex flex-col rounded-xl border border-border bg-card p-6">
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4 text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {item.role}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeading title={t.home.faq.title} subtitle={t.home.faq.subtitle} />
        <div className="mt-12">
          <Faq items={t.home.faq.items} />
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="pb-28">
        <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-primary/[0.06] px-6 py-14 text-center">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-grid opacity-60" aria-hidden />
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold sm:text-3xl">
            {t.home.finalCta.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            {t.home.finalCta.subtitle}
          </p>
          <div className="mt-7">
            <Button asChild size="lg">
              <Link href={lp("/bots")}>
                {t.home.finalCta.cta}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
