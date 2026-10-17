"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BellRing, CheckCircle2, Zap } from "lucide-react";
import {
  Order,
  WILAYAS,
  makeOrderNumber,
  makeOtp,
} from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useSettings } from "@/lib/settings";
import { Money } from "./ui";

const schema = z.object({
  name: z.string().min(3),
  phone: z.string().regex(/^(05|06|07)\d{8}$/, "phone"),
  wilaya: z.number().min(1).max(58),
});

type Form = z.infer<typeof schema>;

export function QuickOrderForm({ slug }: { slug: string }) {
  const { t, locale } = useI18n();
  const { placeOrder, findBook } = useStore();
  const { feeFor } = useSettings();
  const router = useRouter();
  const book = findBook(slug);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });
  const wilaya = watch("wilaya") || 16;

  if (!book) return null;
  const fee = feeFor(wilaya, "home").fee;

  const onSubmit = (v: Form) => {
    const order: Order = {
      number: makeOrderNumber(),
      name: v.name,
      phone: v.phone,
      wilaya: v.wilaya,
      commune: "",
      deliveryType: "home",
      items: [{ slug, title: book.title, qty: 1, price: book.price }],
      subtotal: book.price,
      discount: 0,
      deliveryFee: fee,
      gift: false,
      status: "pending",
      otp: makeOtp(),
      verified: false,
      createdAt: new Date().toISOString(),
    };
    placeOrder(order);
    router.push(`/order-success?number=${order.number}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border-2 border-dashed border-gold-500 bg-gold-100/40 p-5"
    >
      <h3 className="mb-1 flex items-center gap-2 font-display text-xl font-bold text-primary-950">
        <Zap size={19} className="text-gold-600" /> {t("quickOrder")}
      </h3>
      <p className="mb-4 text-sm text-ink-500">
        {book.title} — <Money value={book.price} /> + {t("deliveryFee")}{" "}
        <Money value={fee} />
      </p>
      <div className="grid gap-3">
        <div>
          <input
            {...register("name")}
            placeholder={t("fullName")}
            className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold-500"
          />
          {errors.name && <ErrorMsg />}
        </div>
        <div>
          <input
            {...register("phone")}
            placeholder="0600 00 00 00"
            inputMode="tel"
            dir="ltr"
            className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold-500"
          />
          {errors.phone && <ErrorMsg />}
        </div>
        <select
          {...register("wilaya", { valueAsNumber: true })}
          className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold-500"
        >
          {WILAYAS.map((w) => (
            <option key={w.code} value={w.code}>
              {w.code} — {locale === "fr" ? w.fr : w.ar}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-primary-800 py-3 font-bold text-white transition hover:bg-primary-700"
        >
          {t("confirmOrder")} — <Money value={book.price + fee} />
        </button>
      </div>
    </form>
  );
}

function ErrorMsg() {
  return <p className="mt-1 text-xs text-red-600">يرجى ملء هذا الحقل بشكل صحيح</p>;
}

export function NotifyMe({ slug }: { slug: string }) {
  const { t } = useI18n();
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  if (done)
    return (
      <p className="flex items-center gap-2 rounded-2xl bg-primary-50 p-4 text-sm font-bold text-primary-800">
        <CheckCircle2 size={18} /> {t("notifyDone")}
      </p>
    );

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (phone.replace(/\D/g, "").length < 9) return;
        try {
          const raw = localStorage.getItem("sitr-alerts") ?? "[]";
          const arr = JSON.parse(raw) as Array<{ slug: string; phone: string }>;
          arr.push({ slug, phone });
          localStorage.setItem("sitr-alerts", JSON.stringify(arr));
        } catch {}
        setDone(true);
      }}
    >
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="0600 00 00 00"
        inputMode="tel"
        dir="ltr"
        className="flex-1 rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold-500"
      />
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-primary-950 hover:bg-gold-400"
      >
        <BellRing size={15} /> {t("notifyMe")}
      </button>
    </form>
  );
}
