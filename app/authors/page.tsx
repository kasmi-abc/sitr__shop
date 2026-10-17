"use client";

import Link from "next/link";
import { Layers, UserRound } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import BookCover from "@/components/BookCover";
import { SectionTitle } from "@/components/ui";

export default function AuthorsPage() {
  const { t, locale } = useI18n();
  const { products } = useStore();

  const byAuthor = new Map<string, typeof products>();
  products.forEach((b) => {
    const list = byAuthor.get(b.author) ?? [];
    list.push(b);
    byAuthor.set(b.author, list);
  });

  const series = new Map<string, typeof products>();
  products.filter((b) => b.series).forEach((b) => {
    const list = series.get(b.series!) ?? [];
    list.push(b);
    series.set(b.series!, list);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <SectionTitle title={t("navAuthors")} sub={t("authorsSub")} />

      {/* series */}
      <h2 className="font-display mb-4 flex items-center gap-2 text-2xl font-bold text-primary-950">
        <Layers size={22} className="text-gold-600" /> {t("seriesTitle")}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {[...series.entries()].map(([name, books]) => (
          <div
            key={name}
            className="rounded-2xl border border-cream-300 bg-white p-5"
          >
            <h3 className="font-display text-xl font-bold text-primary-900">{name}</h3>
            <p className="text-sm text-ink-500">
              {books.length} {t("booksWord")} •{" "}
              {books.reduce((s, b) => s + b.volumes, 0)}{" "}
              {locale === "ar" ? "مجلداً" : locale === "fr" ? "volumes" : "volumes"}
            </p>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
              {books.map((b) => (
                <Link key={b.slug} href={`/books/${b.slug}`} className="w-24 shrink-0">
                  <BookCover title={b.title} author={b.author} hue={b.hue} image={b.image} />
                  <p className="mt-1 truncate text-center text-xs font-bold text-primary-900">
                    {b.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* authors */}
      <h2 className="font-display mb-4 mt-10 flex items-center gap-2 text-2xl font-bold text-primary-950">
        <UserRound size={22} className="text-gold-600" />{" "}
        {locale === "ar" ? "المؤلفون" : locale === "fr" ? "Auteurs" : "Authors"}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...byAuthor.entries()].map(([author, books]) => (
          <div
            key={author}
            className="rounded-2xl border border-cream-300 bg-white p-5 transition hover:border-gold-500 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="font-display flex h-12 w-12 items-center justify-center rounded-full bg-primary-800 text-xl font-bold text-gold-300">
                {author.replace(" /", "").trim().charAt(0)}
              </span>
              <div>
                <h3 className="font-bold text-primary-950">{author}</h3>
                <p className="text-xs text-ink-500">
                  {books.length} {t("booksWord")}
                </p>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5">
              {books.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/books/${b.slug}`}
                    className="block truncate rounded-lg px-3 py-2 text-sm font-semibold text-primary-800 hover:bg-cream-100"
                  >
                    {b.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
