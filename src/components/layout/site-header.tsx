"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n, useLocalePath } from "@/components/providers/i18n-provider";
import { Logo } from "@/components/layout/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

function useNav() {
  const { t } = useI18n();
  return [
    { href: "/bots", label: t.nav.bots },
    { href: "/indicators", label: t.nav.indicators },
    { href: "/signals", label: t.nav.signals },
    { href: "/exness", label: t.nav.whyExness },
    { href: "/contact", label: t.nav.contact },
  ];
}

export function SiteHeader() {
  const { t } = useI18n();
  const lp = useLocalePath();
  const pathname = usePathname();
  const nav = useNav();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname?.replace(/^\/[a-z]{2}/, "") === href;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md"
          : "border-transparent bg-background/40 backdrop-blur-sm",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={lp("/")} className="shrink-0" aria-label={t.meta.siteName}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={lp(item.href)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={lp("/bots")}>{t.nav.cta}</Link>
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={t.nav.menu}
              >
                <Menu className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogTitle className="sr-only">{t.nav.menu}</DialogTitle>
              <div className="flex flex-col gap-1 pt-2">
                {nav.map((item) => (
                  <DialogClose asChild key={item.href}>
                    <Link
                      href={lp(item.href)}
                      className={cn(
                        "rounded-lg px-3 py-3 text-[15px] font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </DialogClose>
                ))}
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <LanguageSwitcher />
                  <DialogClose asChild>
                    <Button asChild size="sm">
                      <Link href={lp("/bots")}>{t.nav.cta}</Link>
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
