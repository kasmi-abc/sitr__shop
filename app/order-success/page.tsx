"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, KeyRound, PackageSearch, Printer } from "lucide-react";
import { WILAYAS, orderTotal } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Money } from "@/components/ui";
import { printInvoice } from "@/components/print";

function Success() {
  const { t, locale } = useI18n();
  const params = useSearchParams();
  const number = params.get("number") ?? "";
  const { orders } = useStore();
  const order = orders.find((o) => o.number === number);

  if (!order)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-bold text-ink-500">{t("trackingNotFound")}</p>
        <Link href="/" className="mt-4 inline-block font-bold text-primary-700">
          {t("home")}
        </Link>
      </div>
    );

  const w = WILAYAS.find((x) => x.code === order.wilaya);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-3xl border border-cream-300 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-700">
          <CheckCircle2 size={44} />
        </span>
        <h1 className="font-display mt-4 text-3xl font-bold text-primary-950">
          {t("thanksTitle")}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-ink-500">{t("thanksSub")}</p>

        <div className="mx-auto mt-6 max-w-md rounded-2xl bg-primary-950 p-5 text-white">
          <p className="text-sm text-cream-100/70">{t("orderNumber")}</p>
          <p className="font-display text-3xl font-bold tracking-wide text-gold-300">
            {order.number}
          </p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-cream-100/80">
            <KeyRound size={14} /> OTP: <b className="text-white">{order.otp}</b>
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-md space-y-2 rounded-2xl bg-cream-50 p-5 text-start text-sm">
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between gap-2">
              <span>{it.title} × {it.qty}</span>
              <b><Money value={it.price * it.qty} /></b>
            </div>
          ))}
          <div className="flex justify-between border-t border-cream-300 pt-2 font-bold">
            <span>{t("total")}</span>
            <span><Money value={orderTotal(order)} /></span>
          </div>
          <p className="text-ink-500">
            {order.name} • {order.phone} • {w ? (locale === "fr" ? w.fr : w.ar) : ""} {order.commune}
          </p>
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => printInvoice(order, locale)}
            className="flex items-center justify-center gap-2 rounded-full border-2 border-primary-800 px-8 py-3 font-bold text-primary-800 hover:bg-primary-800 hover:text-white"
          >
            <Printer size={17} /> {t("printReceipt")}
          </button>
          <Link
            href={`/verify?number=${order.number}`}
            className="rounded-full bg-gold-500 px-8 py-3 font-bold text-primary-950 hover:bg-gold-400"
          >
            {t("verifyTitle")}
          </Link>
          <Link
            href={`/tracking?number=${order.number}`}
            className="flex items-center justify-center gap-2 rounded-full bg-primary-800 px-8 py-3 font-bold text-white hover:bg-primary-700"
          >
            <PackageSearch size={17} /> {t("trackCta")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <Success />
    </Suspense>
  );
}
