"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { CATEGORIES, bookMatches } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useDebouncedValue } from "@/lib/hooks";
import BookCard from "@/components/BookCard";

type Sort = "new" | "cheap" | "exp" | "top";

function Catalog() {
  const { t, locale } = useI18n();
  const { products } = useStore();
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const initialCat = params.get("cat") ?? "all";

  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState(initialCat);
  const [pub, setPub] = useState("all");
  const [binding, setBinding] = useState("all");
  const [sort, setSort] = useState<Sort>("top");
  const [maxPrice, setMaxPrice] = useState(8000);
  const dq = useDebouncedValue(q, 250);
  const dMaxPrice = useDebouncedValue(maxPrice, 250);

  const publishers = useMemo(
    () => [...new Set(products.map((b) => b.publisher))],
    [products]
  );
  const bindings = useMemo(
    () => [...new Set(products.map((b) => b.binding.ar))],
    [products]
  );

  const results = useMemo(() => {
    let r = products.filter(
      (b) =>
        bookMatches(b, dq) &&
        (cat === "all" || b.category === cat) &&
        (pub === "all" || b.publisher === pub) &&
        (binding === "all" || b.binding.ar === binding) &&
        b.price <= dMaxPrice
    );
    switch (sort) {
      case "cheap":
        r = [...r].sort((a, b) => a.price - b.price);
        break;
      case "exp":
        r = [...r].sort((a, b) => b.price - a.price);
        break;
      case "top":
        r = [...r].sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
        break;
      default:
        r = [...r].sort((a, b) => b.sold - a.sold);
    }
    return r;
  }, [dq, cat, pub, binding, dMaxPrice, sort, products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-primary-950 md:text-4xl dark:text-cream-50">
        {t("catalogTitle")}
      </h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-cream-100/70">
        {results.length} {t("booksWord")}
      </p>

      {/* search */}
      <div className="mt-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-2xl border border-cream-300 bg-white px-5 py-3.5 text-sm shadow-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
        />
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* filters */}
        <aside className="h-fit rounded-2xl border border-cream-300 bg-white p-5 lg:sticky lg:top-40">
          <h3 className="flex items-center gap-2 font-bold text-primary-950">
            <SlidersHorizontal size={16} /> {t("filterCategory")}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
            {(
              [
                { id: "all", label: t("all") },
                ...CATEGORIES.map((c) => ({
                  id: c.id as string,
                  label: locale === "fr" ? c.fr : locale === "en" ? c.en : c.ar,
                })),
              ] as { id: string; label: string }[]
            ).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition lg:text-start ${
                    cat === c.id
                      ? "bg-primary-800 text-white"
                      : "bg-cream-100 text-ink-700 hover:bg-cream-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
          </div>

          <h3 className="mt-5 font-bold text-primary-950">{t("filterPublisher")}</h3>
          <select
            value={pub}
            onChange={(e) => setPub(e.target.value)}
            className="mt-2 w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm outline-none"
          >
            <option value="all">{t("all")}</option>
            {publishers.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <h3 className="mt-5 font-bold text-primary-950">{t("filterBinding")}</h3>
          <select
            value={binding}
            onChange={(e) => setBinding(e.target.value)}
            className="mt-2 w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm outline-none"
          >
            <option value="all">{t("all")}</option>
            {bindings.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <h3 className="mt-5 font-bold text-primary-950">
            {t("filterPrice")} — {maxPrice} {t("da")}
          </h3>
          <input
            type="range"
            min={300}
            max={8000}
            step={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-2 w-full accent-primary-800"
          />

          <h3 className="mt-5 font-bold text-primary-950">الترتيب</h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="mt-2 w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm outline-none"
          >
            <option value="top">{t("sortTop")}</option>
            <option value="new">{t("sortNew")}</option>
            <option value="cheap">{t("sortCheap")}</option>
            <option value="exp">{t("sortExp")}</option>
          </select>
        </aside>

        {/* grid */}
        <div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-cream-300 bg-white py-20 text-ink-500">
              <SearchX size={40} className="text-cream-300" />
              <p className="font-bold">{t("noResults")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((b) => (
                <BookCard key={b.slug} book={b} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense>
      <Catalog />
    </Suspense>
  );
}
