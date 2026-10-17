"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  CheckCircle2,
  Circle,
  PackageSearch,
  Printer,
  RotateCcw,
  Truck,
} from "lucide-react";
import { OrderStatus, WILAYAS, orderTotal } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Money } from "@/components/ui";
import { printInvoice } from "@/components/print";

const FLOW: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "delivered"];

function Tracking() {
  const { t, locale } = useI18n();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("number") ?? "");
  const [searched, setSearched] = useState(params.get("number") ?? "");
  const { findOrders } = useStore();
  const results = findOrders(searched);

  const statusLabel = (s: OrderStatus) =>
    s === "pending" ? t("statusPending")
    : s === "confirmed" ? t("statusConfirmed")
    : s === "packed" ? t("statusPacked")
    : s === "shipped" ? t("statusShipped")
    : s === "delivered" ? t("statusDelivered")
    : s === "cancelled" ? t("cancelOrd")
    : t("statusReturned");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-center text-3xl font-bold text-primary-950 dark:text-cream-50">
        {t("trackingTitle")}
      </h1>
      <p className="mt-1 text-center text-sm text-ink-500 dark:text-cream-100/70">{t("trackingSub")}</p>

      <form
        className="mx-auto mt-5 flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(q);
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="SITR-... / 0550..."
          className="flex-1 rounded-2xl border border-cream-300 bg-white px-5 py-3 text-sm outline-none focus:border-gold-500"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-2xl bg-primary-800 px-6 font-bold text-white hover:bg-primary-700"
        >
          <PackageSearch size={16} /> {t("trackingBtn")}
        </button>
      </form>

      {searched && results.length === 0 && (
        <p className="mt-8 text-center font-bold text-ink-500">{t("trackingNotFound")}</p>
      )}

      <div className="mt-6 space-y-5">
        {results.map((o) => {
          const w = WILAYAS.find((x) => x.code === o.wilaya);
          const idx = FLOW.indexOf(o.status === "returned" ? "pending" : o.status);
          return (
            <div key={o.number} className="rounded-3xl border border-cream-300 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-xl font-bold text-primary-950">{o.number}</p>
                <span
                  className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                    o.status === "delivered"
                      ? "bg-primary-100 text-primary-800"
                      : o.status === "returned"
                        ? "bg-red-100 text-red-700"
                        : "bg-gold-100 text-gold-700"
                  }`}
                >
                  {statusLabel(o.status)}
                </span>
              </div>

              {o.status === "returned" ? (
                <p className="mt-4 flex items-center gap-2 text-sm font-bold text-red-600">
                  <RotateCcw size={16} /> {t("statusReturned")}
                </p>
              ) : o.status === "cancelled" ? (
                <p className="mt-4 flex items-center gap-2 text-sm font-bold text-ink-500">
                  <Circle size={16} /> {t("cancelOrd")}
                </p>
              ) : (
                <ol className="mt-5 space-y-0">
                  {FLOW.map((s, i) => (
                    <li key={s} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        {i <= idx ? (
                          <CheckCircle2 size={22} className="text-primary-600" />
                        ) : (
                          <Circle size={22} className="text-cream-300" />
                        )}
                        {i < FLOW.length - 1 && (
                          <span className={`h-7 w-0.5 ${i < idx ? "bg-primary-500" : "bg-cream-300"}`} />
                        )}
                      </div>
                      <p className={`pb-5 text-sm font-bold ${i <= idx ? "text-primary-900" : "text-ink-500"}`}>
                        {statusLabel(s)}
                      </p>
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-2 space-y-1 rounded-2xl bg-cream-50 p-4 text-sm">
                {o.items.map((it, i) => (
                  <div key={i} className="flex justify-between gap-2">
                    <span>{it.title} × {it.qty}</span>
                    <b><Money value={it.price * it.qty} /></b>
                  </div>
                ))}
                <div className="flex justify-between border-t border-cream-300 pt-2 font-bold">
                  <span>{t("total")}</span>
                  <span><Money value={orderTotal(o)} /></span>
                </div>
                <p className="flex items-center gap-1.5 pt-1 text-ink-500">
                  <Truck size={14} /> {o.name} • {w ? (locale === "fr" ? w.fr : w.ar) : ""} • {o.phone}
                </p>
                <button
                  onClick={() => printInvoice(o, locale)}
                  className="print-hidden mt-3 flex items-center gap-1.5 rounded-full border border-cream-300 px-4 py-2 text-xs font-bold text-primary-800 hover:border-gold-500"
                >
                  <Printer size={14} /> {t("printReceipt")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense>
      <Tracking />
    </Suspense>
  );
}
