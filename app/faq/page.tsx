"use client";

import { useState } from "react";
import { ChevronDown, CircleHelp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { SectionTitle } from "@/components/ui";

export default function FaqPage() {
  const { t, locale } = useI18n();
  const { faq } = useSettings();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <SectionTitle title={t("navFaq")} />
      <div className="space-y-3">
        {faq.map((f, i) => (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl border bg-white transition ${
              open === i ? "border-gold-500 shadow-md" : "border-cream-300"
            }`}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start font-bold text-primary-950"
            >
              <span className="flex items-center gap-2">
                <CircleHelp size={18} className="shrink-0 text-gold-600" />
                {f.q[locale]}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 transition ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <p className="border-t border-cream-200 px-5 py-4 leading-loose text-ink-700">
                {f.a[locale]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
