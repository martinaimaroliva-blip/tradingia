"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PHONE_COUNTRIES, flagEmoji } from "@/lib/phone";

export function PhoneInput({
  id,
  locale,
  iso,
  number,
  onIsoChange,
  onNumberChange,
  placeholder,
}: {
  id: string;
  locale: string;
  iso: string;
  number: string;
  onIsoChange: (iso: string) => void;
  onNumberChange: (value: string) => void;
  placeholder?: string;
}) {
  const countries = React.useMemo(() => {
    let names: Intl.DisplayNames | null = null;
    try {
      names = new Intl.DisplayNames([locale], { type: "region" });
    } catch {
      names = null;
    }
    return PHONE_COUNTRIES.map((c) => ({
      ...c,
      name: names?.of(c.iso) ?? c.iso,
    })).sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);

  const selected = countries.find((c) => c.iso === iso);

  return (
    <div className="flex gap-2" dir="ltr">
      <Select value={iso} onValueChange={onIsoChange}>
        <SelectTrigger
          id={`${id}-country`}
          aria-label="Country code"
          className="w-[7.5rem] shrink-0"
        >
          <SelectValue>
            {selected ? `${flagEmoji(selected.iso)} +${selected.dial}` : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {countries.map((c) => (
            <SelectItem key={c.iso} value={c.iso}>
              {flagEmoji(c.iso)} {c.name} (+{c.dial})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={number}
        onChange={(e) => onNumberChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
