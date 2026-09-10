import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Send } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { signalPlans } from "@/lib/products";
import { formatUSD, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Faq } from "@/components/marketing/faq";
import { BuyDialog } from "@/components/commerce/buy-dialog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);
  return { title: t.signals.hero.title, description: t.signals.hero.subtitle };
}

export default async function SignalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = await getDictionary(l);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="container-page relative py-16 sm:py-20">
          <Badge variant="primary" className="mb-4">
            <Send className="size-3" />
            Telegram
          </Badge>
          <h1 className="max-w-2xl text-3xl font-semibold sm:text-4xl">
            {t.signals.hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {t.signals.hero.subtitle}
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-lg font-semibold">{t.signals.includes.title}</h2>
            <ul className="mt-4 space-y-3">
              {t.signals.includes.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-border bg-card/50 p-5">
              <h3 className="text-sm font-semibold">{t.signals.telegram.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.signals.telegram.description}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{t.signals.plansTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.signals.plansNote}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {signalPlans.map((plan) => (
                <div
                  key={plan.slug}
                  className={cn(
                    "flex flex-col rounded-xl border p-5",
                    plan.highlight
                      ? "border-primary/50 bg-primary/[0.06] glow"
                      : "border-border bg-card",
                  )}
                >
                  {plan.highlight && (
                    <Badge variant="primary" className="mb-3 self-start">
                      {t.common.mostPopular}
                    </Badge>
                  )}
                  <h3 className="text-base font-semibold">{plan.name[l]}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                      {formatUSD(plan.priceUSD, l)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.common.perMonth}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {plan.tagline[l]}
                  </p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {plan.features[l].map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-accent" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <BuyDialog
                      slug={plan.slug}
                      kind="signal"
                      label={t.common.subscribe}
                      size="sm"
                      variant={plan.highlight ? "default" : "secondary"}
                      block
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-card/30">
        <SectionHeading title={t.home.faq.title} />
        <div className="mt-10">
          <Faq items={t.signals.faq} />
        </div>
      </Section>
    </>
  );
}
