"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const KEY = "sitr-cookie-consent";
type Consent = "all" | "essential";

function loadMetaPixel(id: string): void {
  const w = window as unknown as { fbq?: (...a: unknown[]) => void; _fbq?: unknown };
  if (w.fbq) return;
  const fbq = (...args: unknown[]) => {
    const q = ((w.fbq as unknown as { q?: unknown[] })?.q ?? []) as unknown[];
    q.push(args);
    (w.fbq as unknown as { q: unknown[] }).q = q;
  };
  w.fbq = fbq;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  fbq("init", id);
  fbq("track", "PageView");
}

function loadTiktokPixel(id: string): void {
  const w = window as unknown as { ttq?: unknown };
  if (w.ttq) return;
  const ttq = { load: (..._a: unknown[]) => {}, page: (..._a: unknown[]) => {}, track: (..._a: unknown[]) => {}, instance: () => ttq };
  w.ttq = ttq;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + id + "&lib=ttq";
  document.head.appendChild(s);
  ttq.page();
}

export function initAnalytics(consent: Consent | null): void {
  if (consent !== "all") return;
  const meta = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const tiktok = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  if (meta) loadMetaPixel(meta);
  if (tiktok) loadTiktokPixel(tiktok);
}

export default function CookieConsent() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) as Consent | null;
      if (stored === "all" || stored === "essential") {
        initAnalytics(stored);
      } else {
        setShow(true);
      }
    } catch {}
  }, []);

  const choose = (c: Consent) => {
    try {
      localStorage.setItem(KEY, c);
    } catch {}
    initAnalytics(c);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label={t("consentTitle")}
      className="print-hidden fixed inset-x-0 bottom-0 z-50 border-t border-cream-300 bg-white/95 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 md:flex-row md:items-center">
        <Cookie size={22} className="shrink-0 text-gold-600" />
        <div className="flex-1">
          <p className="text-sm font-bold text-primary-950">{t("consentTitle")}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-500">
            {t("consentText")}{" "}
            <Link href="/privacy" className="font-bold text-primary-800 underline">
              {t("privacyTitle")}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => choose("essential")}
            className="rounded-full border border-cream-300 px-4 py-2 text-xs font-bold text-ink-700 hover:bg-cream-100"
          >
            {t("consentEssential")}
          </button>
          <button
            onClick={() => choose("all")}
            className="rounded-full bg-primary-800 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700"
          >
            {t("consentAccept")}
          </button>
        </div>
      </div>
    </div>
  );
}
