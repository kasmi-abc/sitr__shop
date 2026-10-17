"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, use, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  Heart,
  ListOrdered,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import BookCard from "@/components/BookCard";
import BookCover from "@/components/BookCover";
import { NotifyMe, QuickOrderForm } from "@/components/QuickOrderForm";
import { Price, Stars } from "@/components/ui";
import { notFound } from "next/navigation";

function Product({ slug }: { slug: string }) {
  const { t, locale, dir } = useI18n();
  const { addToCart, toggleWish, isWished, notify, products, findBook } = useStore();
  const [tab, setTab] = useState<"index" | "inside" | "pack" | "photos">("index");
  const quickRef = useRef<HTMLDivElement>(null);
  const search = useSearchParams();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const book = findBook(slug);
  useEffect(() => {
    if (search.get("quick") === "1")
      quickRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [search]);

  if (!book) return notFound();

  const cat = CATEGORIES.find((c) => c.id === book.category);
  const related = products.filter(
    (b) => b.category === book.category && b.slug !== book.slug
  ).slice(0, 4);
  const wished = isWished(book.slug);
  const out = book.stock === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/books"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-gold-600 dark:text-gold-300"
      >
        <Arrow size={15} className="rotate-180" /> {t("backToBooks")}
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        {/* gallery */}
        <div>
          <div className="rounded-3xl border border-cream-300 bg-white p-8">
            <div className="mx-auto max-w-[280px]">
              {tab === "index" && (
                <BookCover large title={book.title} author={book.author} hue={book.hue} image={book.image} />
              )}
              {tab === "inside" && (
                <div className="aspect-[3/4] overflow-hidden rounded-md border border-cream-300 bg-cream-50 p-6 text-justify font-display text-[13px] leading-loose text-ink-700 shadow-inner">
                  <p className="mb-2 text-center font-bold text-primary-900">
                    {locale === "ar" ? "نموذج من داخل الكتاب" : "Aperçu intérieur"}
                  </p>
                  {book.index.slice(0, 3).map((h, i) => (
                    <p key={i} className="mb-2">
                      <span className="font-bold">— {h}:</span> ...وهذا العلم
                      النافع الذي سطّره المؤلف بمداد من نور، يهدي القارئ إلى
                      سواء السبيل...
                    </p>
                  ))}
                </div>
              )}
              {tab === "pack" && (
                <div className="flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-md bg-primary-950 p-6 text-center text-cream-50">
                  <Package size={48} className="text-gold-400" />
                  <p className="font-display text-xl font-bold">{t("galleryPackaging")}</p>
                  <p className="text-sm text-cream-100/75">
                    {locale === "ar"
                      ? "كرتون مقوى + تغليف بلاستيكي ضد الماء + شريط ستر شوب"
                      : "Carton rigide + film waterproof + ruban Sitr Shop"}
                  </p>
                  <Truck size={32} className="mt-2 text-gold-400" />
                </div>
              )}
              {tab === "photos" && book.images && (
                <div className="grid max-h-[520px] grid-cols-2 gap-2 overflow-auto">
                  {[book.image, ...book.images].filter(Boolean).map((src, i) => (
                    <Image
                      key={i}
                      src={src!}
                      alt={`${book.title} ${i + 1}`}
                      width={400}
                      height={533}
                      className="aspect-[3/4] w-full rounded-md border border-cream-300 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={`mt-3 grid gap-3 ${book.images?.length ? "grid-cols-4" : "grid-cols-3"}`}>
            {(
              [
                { id: "index", icon: BookOpen, label: locale === "ar" ? "الغلاف" : "Cover" },
                { id: "inside", icon: Eye, label: locale === "ar" ? "من الداخل" : "Inside" },
                ...(book.images?.length
                  ? [{ id: "photos" as const, icon: Eye, label: locale === "ar" ? "صور" : "Photos" }]
                  : []),
                { id: "pack", icon: Package, label: t("galleryPackaging") },
              ] as const
            ).map((tb) => (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`flex items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-[13px] font-bold transition ${
                  tab === tb.id
                    ? "border-gold-500 bg-gold-500/10 text-primary-900"
                    : "border-cream-300 bg-white text-ink-500"
                }`}
              >
                <tb.icon size={15} /> {tb.label}
              </button>
            ))}
          </div>
        </div>

        {/* details */}
        <div>
          <div className="flex items-center gap-2">
            <Stars value={book.rating} />
            <span className="text-sm text-ink-500">
              {book.rating} • {book.reviews.toLocaleString("en-US")} {t("reviewsCount")}
            </span>
          </div>
          <h1 className="font-display mt-2 text-4xl font-bold text-primary-950 dark:text-cream-50">
            {book.title}
          </h1>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {[
              [t("author"), book.author],
              [t("publisher"), book.publisher],
              [t("reviewer"), book.reviewer ?? "—"],
              [t("category"), cat ? (locale === "fr" ? cat.fr : locale === "en" ? cat.en : cat.ar) : ""],
              [t("volumes"), String(book.volumes)],
              [t("pages"), String(book.pages)],
              [t("coverType"), book.binding[locale]],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-cream-300 bg-white px-4 py-2.5">
                <dt className="text-xs text-ink-500">{k}</dt>
                <dd className="font-bold text-primary-950">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
            <Price value={book.price} old={book.oldPrice} big />
            <span className={`text-sm font-bold ${out ? "text-red-600" : "text-primary-600"}`}>
              {out ? t("outOfStock") : `${t("inStock")} (${book.stock})`}
            </span>
          </div>

          {out ? (
            <div className="mt-4">
              <NotifyMe slug={book.slug} />
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
              <button
                onClick={() => {
                  addToCart(book.slug);
                  notify(t("addedToast"));
                }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary-800 py-4 font-bold text-white transition hover:bg-primary-700"
              >
                <ShoppingCart size={18} /> {t("addToCart")}
              </button>
              <button
                onClick={() => toggleWish(book.slug)}
                aria-label="wishlist"
                className={`rounded-2xl border-2 px-5 transition ${
                  wished
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-cream-300 bg-white text-ink-700 hover:border-red-400 hover:text-red-600"
                }`}
              >
                <Heart size={20} fill={wished ? "currentColor" : "none"} />
              </button>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-cream-300 bg-white p-5">
            <h2 className="font-display text-xl font-bold text-primary-950">
              {t("aboutBook")}
            </h2>
            <p className="mt-2 leading-loose text-ink-700">{book.desc[locale]}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-cream-300 bg-white p-5">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-primary-950">
              <ListOrdered size={19} className="text-gold-600" /> {t("bookIndex")}
            </h2>
            <ol className="mt-3 space-y-2">
              {book.index.map((h, i) => (
                <li key={i} className="flex gap-3 text-sm text-ink-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-800 text-xs font-bold text-gold-300">
                    {i + 1}
                  </span>
                  {h}
                </li>
              ))}
            </ol>
            {book.pdf?.startsWith("data:") && (
              <a
                href={book.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-600"
              >
                <Eye size={16} /> PDF — {t("bookIndex")}
              </a>
            )}
          </div>

          {!out && (
            <div ref={quickRef} className="mt-4 scroll-mt-40">
              <QuickOrderForm slug={book.slug} />
            </div>
          )}
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display mb-6 text-2xl font-bold text-primary-950 dark:text-cream-50">
            {t("relatedBooks")}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((b) => (
              <BookCard key={b.slug} book={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <Suspense>
      <Product slug={slug} />
    </Suspense>
  );
}
