import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { getDictionary } from "@/i18n/dictionaries";
import {
  dirForLocale,
  isLocale,
  locales,
  type Locale,
} from "@/i18n/config";
import { absoluteUrl } from "@/lib/utils";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LeadCaptureModal } from "@/components/lead/lead-capture-modal";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { PartnerRefCapture } from "@/components/referrals/partner-ref-capture";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    title: {
      default: dict.meta.defaultTitle,
      template: `%s · ${dict.meta.siteName}`,
    },
    description: dict.meta.defaultDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
      url: absoluteUrl(`/${locale}`),
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);
  const dir = dirForLocale(typedLocale);

  return (
    <html
      lang={typedLocale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${arabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <I18nProvider locale={typedLocale} dir={dir} messages={dict}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <LeadCaptureModal />
          <WhatsAppButton />
          <PartnerRefCapture />
          <GoogleAnalytics />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
