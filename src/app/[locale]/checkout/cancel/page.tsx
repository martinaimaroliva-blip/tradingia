import Link from "next/link";
import { notFound } from "next/navigation";
import { XCircle } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CheckoutCancelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);

  return (
    <div className="container-page flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-20 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-secondary text-muted-foreground">
        <XCircle className="size-7" />
      </span>
      <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">
        {t.checkout.cancel.title}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
        {t.checkout.cancel.subtitle}
      </p>
      <Button asChild className="mt-7" variant="outline">
        <Link href={`/${locale}/bots`}>{t.checkout.cancel.cta}</Link>
      </Button>
    </div>
  );
}
