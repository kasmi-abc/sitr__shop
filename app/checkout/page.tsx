"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Building2, Gift, Home, Truck } from "lucide-react";
import {
  Order,
  WILAYAS,
  makeOrderNumber,
  makeOtp,
} from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useSettings } from "@/lib/settings";
import { Money } from "@/components/ui";

const schema = z.object({
  name: z.string().min(3),
  phone: z.string().regex(/^(05|06|07)\d{8}$/),
  phone2: z.string().regex(/^((05|06|07)\d{8})?$/),
  wilaya: z.number().min(1).max(58),
  commune: z.string().min(2),
  deliveryType: z.enum(["home", "office"]),
  carrier: z.string().min(2),
  gift: z.boolean(),
  giftNote: z.string().optional(),
  notes: z.string().optional(),
  agree: z.boolean().refine((v) => v === true),
});

type Form = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { t, locale } = useI18n();
  const { cart, cartSubtotal, coupon, clearCart, placeOrder, findBook } = useStore();
  const { feeFor, carriers } = useSettings();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { wilaya: 16, deliveryType: "home", gift: false, carrier: carriers[0] ?? "", phone2: "", agree: false },
  });

  const wilaya = watch("wilaya") ?? 16;
  const deliveryType = watch("deliveryType") ?? "home";
  const gift = watch("gift") ?? false;

  const fee = feeFor(wilaya, deliveryType).fee;
  const discount = coupon
    ? Math.round((cartSubtotal * coupon.percent) / 100)
    : 0;
  const total = cartSubtotal - discount + fee + (gift ? 200 : 0);

  if (cart.length === 0)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-bold text-ink-500">{t("cartEmpty")}</p>
      </div>
    );

  const onSubmit = async (v: Form) => {
    setSubmitting(true);
    const order: Order = {
      number: makeOrderNumber(),
      name: v.name,
      phone: v.phone,
      phone2: v.phone2 || undefined,
      wilaya: v.wilaya,
      commune: v.commune,
      deliveryType: v.deliveryType,
      carrier: v.carrier,
      items: cart.map((l) => {
        const b = findBook(l.slug)!;
        return { slug: l.slug, title: b.title, qty: l.qty, price: b.price };
      }),
      subtotal: cartSubtotal,
      discount,
      deliveryFee: fee,
      gift: v.gift,
      giftNote: v.giftNote,
      notes: v.notes,
      status: "pending",
      otp: makeOtp(),
      verified: false,
      createdAt: new Date().toISOString(),
    };
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    } catch {}
    placeOrder(order);
    clearCart();
    router.push(`/order-success?number=${order.number}`);
  };

  const input =
    "w-full rounded-xl border border-cream-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30";
  const err = "mt-1 text-xs font-semibold text-red-600";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-primary-950 dark:text-cream-50">
        {t("checkoutTitle")}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-5">
          <div className="rounded-2xl border border-cream-300 bg-white p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-bold">{t("fullName")}</label>
                <input {...register("name")} className={input} placeholder="مثال: محمد بن أحمد" />
                {errors.name && <p className={err}>الاسم الكامل مطلوب</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold">{t("phone")}</label>
                <input {...register("phone")} className={input} inputMode="tel" placeholder="0600 00 00 00" dir="ltr" />
                {errors.phone && <p className={err}>رقم هاتف جزائري صحيح (05/06/07...)</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold">{t("phone2")}</label>
                <input {...register("phone2")} className={input} inputMode="tel" placeholder="0600 00 00 00" dir="ltr" />
                {errors.phone2 && <p className={err}>رقم هاتف جزائري صحيح</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold">{t("commune")}</label>
                <input {...register("commune")} className={input} />
                {errors.commune && <p className={err}>البلدية مطلوبة</p>}
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-bold">{t("wilaya")}</label>
                <select {...register("wilaya", { valueAsNumber: true })} className={input}>
                  {WILAYAS.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} — {locale === "fr" ? w.fr : w.ar}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cream-300 bg-white p-6">
            <h3 className="font-bold text-primary-950">{t("deliveryType")}</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(
                [
                  { id: "home", icon: Home, label: t("homeDelivery") },
                  { id: "office", icon: Building2, label: t("officeDelivery") },
                ] as const
              ).map((o) => (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => setValue("deliveryType", o.id)}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3.5 text-sm font-bold transition ${
                    deliveryType === o.id
                      ? "border-primary-800 bg-primary-800 text-white"
                      : "border-cream-300 text-ink-700 hover:border-primary-400"
                  }`}
                >
                  <o.icon size={17} /> {o.label}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <label className="mb-1 flex items-center gap-1.5 text-sm font-bold">
                <Truck size={15} className="text-gold-600" /> {t("carrierLabel")}
              </label>
              <select {...register("carrier")} className={input}>
                {carriers.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-sm text-ink-500">
              {t("deliveryFee")}: <b className="text-primary-800"><Money value={fee} /></b>
            </p>
          </div>

          <div className="rounded-2xl border border-cream-300 bg-white p-6">
            <h3 className="font-bold text-primary-950">{t("payment")}</h3>
            <div className="mt-3 flex items-center gap-3 rounded-xl border-2 border-gold-500 bg-gold-100/40 px-4 py-3.5">
              <Banknote size={20} className="text-gold-700" />
              <span className="text-sm font-bold text-primary-950">{t("cod")}</span>
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-cream-300 px-4 py-3.5">
              <input type="checkbox" {...register("gift")} className="h-5 w-5 accent-primary-800" />
              <Gift size={18} className="text-gold-600" />
              <span className="text-sm font-bold">
                {t("giftWrap")} (+<Money value={200} />)
              </span>
            </label>
            {gift && (
              <div className="mt-3">
                <label className="mb-1 block text-sm font-bold">{t("giftNote")}</label>
                <textarea {...register("giftNote")} rows={2} className={input} placeholder="اكتب كلماتك الطيبة..." />
              </div>
            )}
            <div className="mt-3">
              <label className="mb-1 block text-sm font-bold">{t("notes")}</label>
              <textarea {...register("notes")} rows={2} className={input} />
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-cream-300 bg-white p-6 lg:sticky lg:top-40">
          <h3 className="font-display text-xl font-bold text-primary-950">
            {t("orderSummary")}
          </h3>
          <ul className="mt-3 max-h-56 space-y-2 overflow-auto text-sm">
            {cart.map((l) => {
              const b = findBook(l.slug)!;
              return (
                <li key={l.slug} className="flex justify-between gap-2">
                  <span className="text-ink-700">{b.title} × {l.qty}</span>
                  <span className="font-bold"><Money value={b.price * l.qty} /></span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 space-y-2 border-t border-cream-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-500">{t("subtotal")}</span>
              <b><Money value={cartSubtotal} /></b>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-primary-600">
                <span>{t("coupon")}</span>
                <b>-<Money value={discount} /></b>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-500">{t("deliveryFee")}</span>
              <b><Money value={fee} /></b>
            </div>
            {gift && (
              <div className="flex justify-between">
                <span className="text-ink-500">{t("giftWrap")}</span>
                <b><Money value={200} /></b>
              </div>
            )}
            <div className="flex justify-between pt-2 text-xl font-bold text-primary-900">
              <span>{t("total")}</span>
              <span><Money value={total} /></span>
            </div>
          </div>
          <div className="mt-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register("agree")}
                className="mt-0.5 h-5 w-5 shrink-0 accent-primary-800"
              />
              <span className="text-sm leading-relaxed text-ink-700">
                {t("agreeTerms")}{" "}
                <Link href="/terms" className="font-bold text-primary-800 underline">
                  {t("termsTitle")}
                </Link>{" "}
                —{" "}
                <Link href="/privacy" className="font-bold text-primary-800 underline">
                  {t("privacyTitle")}
                </Link>
              </span>
            </label>
            {errors.agree && (
              <p className="mt-1 text-xs font-semibold text-red-600">
                {t("agreeTerms")}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-2xl bg-primary-800 py-4 font-bold text-white transition hover:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? "..." : t("confirmOrder")}
          </button>
        </aside>
      </form>
    </div>
  );
}
