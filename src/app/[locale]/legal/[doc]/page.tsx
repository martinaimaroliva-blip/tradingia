import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, locales } from "@/i18n/config";

const DOCS = ["terms", "privacy", "refund"] as const;
type Doc = (typeof DOCS)[number];

function isDoc(v: string): v is Doc {
  return (DOCS as readonly string[]).includes(v);
}

export function generateStaticParams() {
  return locales.flatMap((locale) => DOCS.map((doc) => ({ locale, doc })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}): Promise<Metadata> {
  const { locale, doc } = await params;
  if (!isLocale(locale) || !isDoc(doc)) return {};
  const t = await getDictionary(locale);
  return { title: t.legal[doc].title };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) {
  const { locale, doc } = await params;
  if (!isLocale(locale) || !isDoc(doc)) notFound();
  const t = await getDictionary(locale);
  const page = t.legal[doc];

  return (
    <div className="container-page max-w-3xl py-14 sm:py-20">
      <h1 className="text-3xl font-semibold sm:text-4xl">{page.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t.legal.updatedLabel}: {page.updated}
      </p>

      <div className="mt-10 space-y-8">
        {page.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold">{section.heading}</h2>
            <div className="mt-2 space-y-3">
              {section.paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="text-[15px] leading-relaxed text-muted-foreground"
                >
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
