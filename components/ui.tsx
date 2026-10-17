import { Star, StarHalf } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/data";
import { cn } from "./cn";

export function SectionTitle({
  title,
  sub,
  center = true,
}: {
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-8", center && "text-center")}>
      <div
        className={cn(
          "mb-2 flex items-center gap-2",
          center && "justify-center"
        )}
      >
        <span className="h-px w-10 bg-gold-500" />
        <span className="font-display text-lg text-gold-600">✦</span>
        <span className="h-px w-10 bg-gold-500" />
      </div>
      <h2 className="font-display text-3xl font-bold text-primary-900 md:text-4xl dark:text-cream-50">
        {title}
      </h2>
      {sub && <p className="mt-2 text-ink-500 dark:text-cream-100/70">{sub}</p>}
    </div>
  );
}

export function Stars({ value, className }: { value: number; className?: string }) {
  const full = Math.floor(value);
  const half = value - full >= 0.4;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-gold-500", className)}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
      ))}
      {half && <StarHalf size={14} fill="currentColor" strokeWidth={0} />}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
        <Star key={`e${i}`} size={14} className="text-cream-300" fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}

export function Price({ value, old, big }: { value: number; old?: number; big?: boolean }) {
  const { t } = useI18n();
  return (
    <bdi className="inline-flex items-baseline gap-2 whitespace-nowrap">
      <span className={cn("font-bold text-primary-800", big ? "text-3xl" : "text-lg")}>
        {formatPrice(value)} <span className="text-sm font-semibold">{t("da")}</span>
      </span>
      {old && (
        <span className="text-sm text-ink-500 line-through">
          {formatPrice(old)} {t("da")}
        </span>
      )}
    </bdi>
  );
}

export function Money({ value, className }: { value: number; className?: string }) {
  const { t } = useI18n();
  return (
    <bdi className={cn("whitespace-nowrap", className)}>
      {formatPrice(value)} {t("da")}
    </bdi>
  );
}
