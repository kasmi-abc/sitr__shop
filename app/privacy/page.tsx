"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { PRIVACY } from "@/lib/legal";

const CUSTOMER_KEYS = [
  "sitr-cart",
  "sitr-wish",
  "sitr-orders",
  "sitr-alerts",
  "sitr-cookie-consent",
];

export default function PrivacyPage() {
  const { t, locale } = useI18n();
  const { notify } = useStore();
  const [done, setDone] = useState(false);
  const sections = PRIVACY[locale];

  const deleteMyData = () => {
    try {
      for (const k of CUSTOMER_KEYS) localStorage.removeItem(k);
      setDone(true);
      notify(t("dataDeleted"));
    } catch {}
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-primary-950 md:text-4xl dark:text-cream-50">
        {t("privacyTitle")}
      </h1>
      <div className="mt-6 space-y-6 rounded-3xl border border-cream-300 bg-white p-6 leading-loose text-ink-700 md:p-10">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-display text-lg font-bold text-primary-900">
              {s.h}
            </h2>
            <p className="mt-1">{s.p}</p>
          </section>
        ))}
        <section className="border-t border-cream-200 pt-5">
          <button
            onClick={deleteMyData}
            disabled={done}
            className="flex items-center gap-2 rounded-2xl border-2 border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 size={16} />
            {done ? t("dataDeleted") : t("deleteMyData")}
          </button>
        </section>
      </div>
    </div>
  );
}
