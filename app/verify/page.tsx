"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

function Verify() {
  const { t } = useI18n();
  const params = useSearchParams();
  const number = params.get("number") ?? "";
  const { orders, updateOrder } = useStore();
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "bad">("idle");

  const order = orders.find((o) => o.number === number);

  if (!order)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="font-bold text-ink-500">{t("trackingNotFound")}</p>
      </div>
    );

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl border border-cream-300 bg-white p-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
          <ShieldCheck size={34} />
        </span>
        <h1 className="font-display mt-4 text-2xl font-bold text-primary-950">
          {t("verifyTitle")} — {order.number}
        </h1>
        <p className="mt-2 text-sm text-ink-500">{t("verifySub")}</p>

        {state === "ok" || order.verified ? (
          <div className="mt-6">
            <p className="flex items-center justify-center gap-2 rounded-2xl bg-primary-50 p-4 font-bold text-primary-700">
              <BadgeCheck size={20} /> {t("verifyOk")}
            </p>
            <Link
              href={`/tracking?number=${order.number}`}
              className="mt-4 inline-block rounded-full bg-primary-800 px-8 py-3 font-bold text-white"
            >
              {t("trackCta")}
            </Link>
          </div>
        ) : (
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim() === order.otp) {
                updateOrder(order.number, { verified: true, status: "confirmed" });
                setState("ok");
              } else setState("bad");
            }}
          >
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="0000"
              inputMode="numeric"
              className="w-full rounded-2xl border-2 border-cream-300 bg-cream-50 py-4 text-center text-3xl font-bold tracking-[0.5em] outline-none focus:border-gold-500"
            />
            {state === "bad" && (
              <p className="mt-2 text-sm font-bold text-red-600">{t("verifyBad")}</p>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-2xl bg-primary-800 py-3.5 font-bold text-white hover:bg-primary-700"
            >
              {t("verifyBtn")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <Verify />
    </Suspense>
  );
}
