"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import { Book } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import BookCover from "./BookCover";
import { Price, Stars } from "./ui";

export default function BookCard({ book }: { book: Book }) {
  const { t } = useI18n();
  const { addToCart, toggleWish, isWished, notify } = useStore();
  const router = useRouter();
  const wished = isWished(book.slug);
  const out = book.stock === 0;

  const buyNow = () => {
    addToCart(book.slug);
    router.push("/checkout");
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/books/${book.slug}`} className="relative block bg-cream-100 p-5">
        {book.badge === "bestseller" && (
          <span className="absolute end-3 top-3 z-10 rounded-full bg-gold-500 px-3 py-1 text-[11px] font-bold text-primary-950">
            {t("bestSellersTitle")}
          </span>
        )}
        {book.oldPrice && (
          <span className="absolute start-3 top-3 z-10 rounded-full bg-red-700 px-2 py-1 text-[11px] font-bold text-white">
            <bdi>-{Math.round((1 - book.price / book.oldPrice) * 100)}%</bdi>
          </span>
        )}
        <div className="mx-auto max-w-[170px] transition duration-300 group-hover:scale-[1.04]">
          <BookCover title={book.title} author={book.author} hue={book.hue} image={book.image} />
        </div>
      </Link>

      <button
        onClick={() => toggleWish(book.slug)}
        aria-label="wishlist"
        className={`absolute end-3 top-1/2 -translate-y-8 rounded-full p-2 shadow backdrop-blur transition ${
          wished ? "bg-red-600 text-white" : "bg-white/90 text-ink-700 hover:text-red-600"
        }`}
      >
        <Heart size={16} fill={wished ? "currentColor" : "none"} />
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center gap-1.5">
          <Stars value={book.rating} />
          <span className="text-xs text-ink-500">
            <bdi>{book.rating} ({book.reviews.toLocaleString("en-US")})</bdi>
          </span>
        </div>
        <Link href={`/books/${book.slug}`}>
          <h3 className="font-display text-lg font-bold leading-snug text-primary-950 hover:text-primary-700">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-ink-500">{book.author}</p>
        <div className="mt-1 flex items-center justify-between">
          <Price value={book.price} old={book.oldPrice} />
          <span
            className={`text-xs font-semibold ${out ? "text-red-600" : "text-primary-600"}`}
          >
            {out ? t("outOfStock") : t("inStock")}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            disabled={out}
            onClick={() => {
              addToCart(book.slug);
              notify(t("addedToast"));
            }}
            className="flex items-center justify-center gap-1 rounded-xl bg-primary-800 px-2 py-2.5 text-sm font-bold text-white transition hover:bg-primary-700 disabled:opacity-40"
          >
            <ShoppingCart size={15} />
            {t("addToCart")}
          </button>
          <button
            disabled={out}
            onClick={buyNow}
            className="flex items-center justify-center gap-1 rounded-xl bg-gold-500 px-2 py-2.5 text-sm font-bold text-primary-950 transition hover:bg-gold-400 disabled:opacity-40"
          >
            <Zap size={15} />
            {t("buyNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
