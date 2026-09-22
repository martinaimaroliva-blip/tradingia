"use client";

import * as React from "react";

const COOKIE_NAME = "sb_partner_ref";
const MAX_AGE_DAYS = 90;

/**
 * Invisible — just picks up `?partner=<code>` (set by lib/referrals.ts
 * buildPartnerLink) on first load and remembers it in a cookie, so
 * BuyDialog can attach it to checkout later even if the buyer lands on the
 * homepage first and only decides to buy a few pages/days later.
 */
export function PartnerRefCapture() {
  React.useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("partner");
    if (!code) return;
    const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(code)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }, []);

  return null;
}
