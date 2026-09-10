import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Localized 404. Next renders this without the [locale] param available, so we
 * keep copy in English here and rely on the root redirect for locale handling.
 */
export default function LocaleNotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you were looking for doesn&rsquo;t exist or was moved.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Go to homepage</Link>
      </Button>
    </div>
  );
}
