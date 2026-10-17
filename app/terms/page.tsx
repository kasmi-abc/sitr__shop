"use client";

import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";

export default function TermsPage() {
  const { t, locale } = useI18n();
  const { terms } = useSettings();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-primary-950 md:text-4xl dark:text-cream-50">
        {t("termsTitle")}
      </h1>
      <div className="mt-6 space-y-4 rounded-3xl border border-cream-300 bg-white p-6 leading-loose text-ink-700 md:p-10">
        {terms[locale].split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
