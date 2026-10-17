"use client";

import Link from "next/link";
import { HeartOff } from "lucide-react";
import { BOOKS } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import BookCard from "@/components/BookCard";

export default function WishlistPage() {
  const { t } = useI18n();
  const { wishlist, products } = useStore();
  const books = (products.length > 0 ? products : BOOKS).filter((b) => wishlist.includes(b.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-primary-950 dark:text-cream-50">
        {t("wishlist")} ({books.length})
      </h1>
      {books.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
          <span className="rounded-full bg-cream-200 p-6 text-primary-800">
            <HeartOff size={36} />
          </span>
          <p className="mt-4 font-bold text-ink-500">{t("wishlistEmpty")}</p>
          <Link
            href="/books"
            className="mt-5 rounded-full bg-primary-800 px-8 py-3 font-bold text-white"
          >
            {t("cartCta")}
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((b) => (
            <BookCard key={b.slug} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
