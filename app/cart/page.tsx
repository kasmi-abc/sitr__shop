"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, TicketPercent, Trash2 } from "lucide-react";
import { COUPONS } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import BookCover from "@/components/BookCover";
import { Money } from "@/components/ui";

export default function CartPage() {
  const { t } = useI18n();
  const {
    cart,
    setQty,
    removeFromCart,
    cartSubtotal,
    coupon,
    applyCoupon,
    couponError,
    findBook,
  } = useStore();
  const [code, setCode] = useState("");

  const discount = coupon ? Math.round((cartSubtotal * coupon.percent) / 100) : 0;

  if (cart.length === 0)
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
        <span className="rounded-full bg-cream-200 p-6 text-primary-800">
          <ShoppingBag size={40} />
        </span>
        <h1 className="font-display mt-5 text-3xl font-bold text-primary-950">
          {t("cart")}
        </h1>
        <p className="mt-2 text-ink-500">{t("cartEmpty")}</p>
        <Link
          href="/books"
          className="mt-6 rounded-full bg-primary-800 px-8 py-3 font-bold text-white hover:bg-primary-700"
        >
          {t("cartCta")}
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-primary-950 dark:text-cream-50">
        {t("cart")} ({cart.length})
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.map((l) => {
            const b = findBook(l.slug);
            if (!b) return null;
            return (
              <div
                key={l.slug}
                className="flex gap-4 rounded-2xl border border-cream-300 bg-white p-4"
              >
                <Link href={`/books/${b.slug}`} className="w-20 shrink-0">
                  <BookCover title={b.title} author={b.author} hue={b.hue} image={b.image} />
                </Link>
                <div className="flex-1">
                  <Link
                    href={`/books/${b.slug}`}
                    className="font-display text-lg font-bold text-primary-950"
                  >
                    {b.title}
                  </Link>
                  <p className="text-sm text-ink-500">{b.author}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink-500">{t("qty")}:</span>
                      <div className="flex items-center gap-1 rounded-full border border-cream-300 px-1 py-1">
                        <button
                          onClick={() => setQty(l.slug, l.qty - 1)}
                          className="rounded-full p-1 hover:bg-cream-200"
                          aria-label="minus"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-7 text-center text-sm font-bold">{l.qty}</span>
                        <button
                          onClick={() => setQty(l.slug, l.qty + 1)}
                          className="rounded-full p-1 hover:bg-cream-200"
                          aria-label="plus"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <span className="font-bold text-primary-800">
                      <Money value={b.price * l.qty} />
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(l.slug)}
                  aria-label="remove"
                  className="h-fit rounded-full p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl border border-cream-300 bg-white p-6 lg:sticky lg:top-40">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              applyCoupon(code);
            }}
          >
            <div className="relative flex-1">
              <TicketPercent
                size={16}
                className="absolute start-3 top-1/2 -translate-y-1/2 text-ink-500"
              />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("coupon")}
                className="w-full rounded-xl border border-cream-300 bg-cream-50 py-2.5 pe-3 ps-9 text-sm uppercase outline-none focus:border-gold-500"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-primary-800 px-4 text-sm font-bold text-white hover:bg-primary-700"
            >
              {t("apply")}
            </button>
          </form>
          {coupon && (
            <p className="mt-2 text-sm font-bold text-primary-600">
              {t("couponOk")}: {coupon.code} (-{coupon.percent}%)
            </p>
          )}
          {couponError && !coupon && (
            <p className="mt-2 text-sm font-bold text-red-600">{t("couponBad")}</p>
          )}
          <p className="mt-2 text-xs text-ink-500">
            FALLAH10 • {COUPONS[1].code} • {COUPONS[2].code}
          </p>

          <div className="mt-4 space-y-2 border-t border-cream-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-500">{t("subtotal")}</span>
              <span className="font-bold"><Money value={cartSubtotal} /></span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-primary-600">
                <span>{t("coupon")}</span>
                <span className="font-bold">-<Money value={discount} /></span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-primary-900">
              <span>{t("total")}</span>
              <span><Money value={cartSubtotal - discount} /></span>
            </div>
            <p className="text-xs text-ink-500">+ {t("deliveryFee")}</p>
          </div>

          <Link
            href="/checkout"
            className="mt-4 block rounded-2xl bg-gold-500 py-3.5 text-center font-bold text-primary-950 transition hover:bg-gold-400"
          >
            {t("toCheckout")}
          </Link>
          <Link
            href="/books"
            className="mt-2 block text-center text-sm font-bold text-primary-700 hover:text-gold-600"
          >
            {t("continueShopping")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
