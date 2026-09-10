"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { locales, localeNames, isLocale } from "@/i18n/config";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function switchTo(next: string) {
    if (!isLocale(next) || next === locale) return;
    const segments = (pathname || "/").split("/");
    if (isLocale(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const nextPath = segments.join("/") || `/${next}`;
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    startTransition(() => {
      router.push(nextPath);
      router.refresh();
    });
  }

  return (
    <Select value={locale} onValueChange={switchTo}>
      <SelectTrigger
        aria-label={t.common.languageLabel}
        data-pending={pending || undefined}
        className={`h-9 w-auto gap-2 border-border/70 bg-transparent px-3 text-[13px] data-[pending]:opacity-60 ${className ?? ""}`}
      >
        <Globe className="size-4 opacity-70" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {locales.map((l) => (
          <SelectItem key={l} value={l}>
            {localeNames[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
