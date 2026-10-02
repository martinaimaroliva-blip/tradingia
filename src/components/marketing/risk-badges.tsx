import type { Dictionary } from "@/i18n/types";
import type { RiskLevel } from "@/lib/products";
import { cn } from "@/lib/utils";

const STYLES: Record<RiskLevel, string> = {
  conservative: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  moderate: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  aggressive: "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

export function RiskBadges({
  levels,
  t,
  className,
}: {
  levels: RiskLevel[];
  t: Dictionary;
  className?: string;
}) {
  const label: Record<RiskLevel, string> = {
    conservative: t.common.riskConservative,
    moderate: t.common.riskModerate,
    aggressive: t.common.riskAggressive,
  };
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {levels.map((level) => (
        <span
          key={level}
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
            STYLES[level],
          )}
        >
          {label[level]}
        </span>
      ))}
    </div>
  );
}
