"use client";

import Script from "next/script";
import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Loads gtag.js and sends a page_view on every route change — the base
 * script only fires one on first load, and App Router navigations don't
 * trigger a full page reload, so client-side route changes need their own
 * event or they'd never show up in GA.
 *
 * Renders nothing when NEXT_PUBLIC_GA_MEASUREMENT_ID isn't set, so it's a
 * silent no-op until Martín creates a GA4 property and adds the id.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
      <React.Suspense fallback={null}>
        <RouteChangeTracker />
      </React.Suspense>
    </>
  );
}

function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!GA_ID || typeof window.gtag !== "function") return;
    const query = searchParams.toString();
    window.gtag("event", "page_view", {
      page_path: query ? `${pathname}?${query}` : pathname,
    });
  }, [pathname, searchParams]);

  return null;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
