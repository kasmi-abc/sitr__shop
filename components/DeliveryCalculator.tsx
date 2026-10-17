"use client";

import { useMemo, useState } from "react";
import { Calculator, Home, Building2 } from "lucide-react";
import { WILAYAS } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { Money } from "./ui";

export default function DeliveryCalculator({ compact }: { compact?: boolean }) {
  const { t, locale } = useI18n();
  const { feeFor } = useSettings();
  const [code, setCode] = useState(16);
  const [type, setType] = useState<"home" | "office">("home");

  const res = useMemo(() => feeFor(code, type), [feeFor, code, type]);
  const wilaya = WILAYAS.find((w) => w.code === code);

  return (
    <div className={compact ? "" : "rounded-3xl border border-cream-300 bg-white p-6 shadow-sm md:p-8"}>
      {!compact && (
        <div className="mb-5 flex items-center gap-2">
          <span className="rounded-xl bg-primary-800 p-2 text-gold-300">
            <Calculator size={20} />
          </span>
          <div>
            <h3 className="font-display text-xl font-bold text-primary-950">
              {t("deliveryCalcTitle")}
            </h3>
            <p className="text-sm text-ink-500">{t("deliveryCalcSub")}</p>
          </div>
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-3">
        <select
          value={code}
          onChange={(e) => setCode(Number(e.target.value))}
          className="rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold outline-none focus:border-gold-500"
        >
          {WILAYAS.map((w) => (
            <option key={w.code} value={w.code}>
              {w.code} — {locale === "fr" ? w.fr : w.ar}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setType("home")}
            className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition ${
              type === "home"
                ? "border-primary-800 bg-primary-800 text-white"
                : "border-cream-300 bg-white text-ink-700"
            }`}
          >
            <Home size={15} /> {t("homeDelivery")}
          </button>
          <button
            onClick={() => setType("office")}
            className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition ${
              type === "office"
                ? "border-primary-800 bg-primary-800 text-white"
                : "border-cream-300 bg-white text-ink-700"
            }`}
          >
            <Building2 size={15} /> {t("officeDelivery")}
          </button>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-primary-950 px-5 py-3 text-white">
          <span className="text-sm text-cream-100/80">
            {wilaya ? (locale === "fr" ? wilaya.fr : wilaya.ar) : ""} • {res.days} يوم
          </span>
          <span className="text-xl font-bold text-gold-300">
            <Money value={res.fee} />
          </span>
        </div>
      </div>
    </div>
  );
}
