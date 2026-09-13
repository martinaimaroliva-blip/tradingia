import { cn } from "@/lib/utils";

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="relative grid size-8 place-items-center rounded-lg bg-primary/15 ring-1 ring-inset ring-primary/30"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 17l5-6 4 4 8-9" />
          <path d="M15 6h6v6" />
        </svg>
      </span>
      {withWordmark && (
        <span className="text-[17px] font-semibold tracking-tight">
          Smartrade<span className="text-primary">Bot</span>
        </span>
      )}
    </span>
  );
}
