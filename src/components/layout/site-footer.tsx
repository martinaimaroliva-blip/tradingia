"use client";

import Link from "next/link";
import { useI18n, useLocalePath } from "@/components/providers/i18n-provider";
import { Logo } from "@/components/layout/logo";

export function SiteFooter() {
  const { t } = useI18n();
  const lp = useLocalePath();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t.footer.productsTitle,
      links: [
        { href: "/bots", label: t.footer.links.bots },
        { href: "/indicators", label: t.footer.links.indicators },
        { href: "/signals", label: t.footer.links.signals },
        { href: "/exness", label: t.footer.links.whyExness },
      ],
    },
    {
      title: t.footer.companyTitle,
      links: [{ href: "/contact", label: t.footer.links.contact }],
    },
    {
      title: t.footer.legalTitle,
      links: [
        { href: "/legal/terms", label: t.footer.links.terms },
        { href: "/legal/privacy", label: t.footer.links.privacy },
        { href: "/legal/refund", label: t.footer.links.refund },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={lp(link.href)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-background/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.footer.riskTitle}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground/90">
            {t.footer.riskBody}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {t.meta.siteName}. {t.footer.rights}
          </p>
          <p className="opacity-80">{t.meta.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
