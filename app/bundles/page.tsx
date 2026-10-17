"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Gift, ShoppingCart, Zap } from "lucide-react";
import { BUNDLES, bundleTotal } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useSettings } from "@/lib/settings";
import BookCover from "@/components/BookCover";
import { Money, SectionTitle } from "@/components/ui";

export default function BundlesPage() {
  const { t, locale } = useI18n();
  const { addToCart, notify, findBook, customBundles } = useStore();
  const { bundlePrice } = useSettings();
  const router = useRouter();
  const ALL = [...BUNDLES, ...customBundles];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <SectionTitle title={t("bundlesTitle")} sub={t("bundlesSub")} />

      <div className="grid gap-6 lg:grid-cols-2">
        {ALL.map((bundle) => {
          const b = { ...bundle, price: bundlePrice(bundle.slug, bundle.price) };
          const books = b.books
            .map((s) => findBook(s))
            .filter((x) => x !== undefined);
          const total = bundleTotal(bundle);
          return (
            <article
              key={b.slug}
              id={b.slug}
              className="scroll-mt-40 overflow-hidden rounded-3xl border border-cream-300 bg-white shadow-sm"
            >
              <div
                className="pattern-light p-6 text-white"
                style={{
                  background: `linear-gradient(140deg, hsl(${b.hue} 40% 24%), hsl(${b.hue} 48% 12%))`,
                }}
              >
                <div className="flex flex-col items-center gap-5 sm:flex-row">
                  <div className="w-36 shrink-0">
                    <BookCover
                      title={b.title[locale]}
                      author={`${books.length} ${t("booksWord")}`}
                      hue={b.hue}
                    />
                  </div>
                  <div>
                    <h2 className="font-display flex items-center gap-2 text-2xl font-bold">
                      <Gift size={22} className="text-gold-300" />
                      {b.title[locale]}
                    </h2>
                    <p className="mt-1 text-sm text-cream-100/85">{b.desc[locale]}</p>
                    <div className="mt-3 flex flex-wrap items-baseline gap-2">
                      <span className="text-3xl font-bold text-gold-300">
                        <Money value={b.price} />
                      </span>
                      <span className="text-sm text-cream-100/60 line-through">
                        <Money value={total} />
                      </span>
                      <span className="rounded-full bg-gold-500 px-2.5 py-0.5 text-xs font-bold text-primary-950">
                        {t("saveWord")} <Money value={total - b.price} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-sm font-bold text-ink-500">
                  {t("bundleIncludes")} ({books.length}):
                </h3>
                <ul className="mt-2 space-y-2">
                  {books.map((bk) => (
                    <li key={bk.slug}>
                      <Link
                        href={`/books/${bk.slug}`}
                        className="flex items-center justify-between gap-2 rounded-xl bg-cream-50 px-4 py-2.5 text-sm transition hover:bg-cream-200"
                      >
                        <span className="flex items-center gap-2 font-bold text-primary-900">
                          <Check size={15} className="text-primary-600" />
                          {bk.title} — <span className="font-normal text-ink-500">{bk.author}</span>
                        </span>
                        <span className="font-bold text-primary-800">
                          <Money value={bk.price} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {b.gift && (
                  <p className="mt-3 rounded-xl bg-gold-100/60 px-4 py-2.5 text-sm font-bold text-gold-700">
                    {t("giftWrap")} — {t("free")}
                  </p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      books.forEach((bk) => addToCart(bk.slug));
                      notify(t("addedToast"));
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-primary-800 py-3.5 text-sm font-bold text-white transition hover:bg-primary-700"
                  >
                    <ShoppingCart size={17} /> {t("addToCart")}
                  </button>
                  <button
                    onClick={() => {
                      books.forEach((bk) => addToCart(bk.slug));
                      router.push("/checkout");
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gold-500 py-3.5 text-sm font-bold text-primary-950 transition hover:bg-gold-400"
                  >
                    <Zap size={17} /> {t("buyNow")} — <Money value={b.price} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
