"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Banknote,
  BookMarked,
  BookOpen,
  Gift,
  GraduationCap,
  MoonStar,
  Scale,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { BUNDLES, CATEGORIES, bundleTotal } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useSettings } from "@/lib/settings";
import BookCard from "@/components/BookCard";
import BookCover from "@/components/BookCover";
import DeliveryCalculator from "@/components/DeliveryCalculator";
import { Money, SectionTitle } from "@/components/ui";

const CAT_ICONS: Record<string, typeof BookOpen> = {
  aqeedah: MoonStar,
  fiqh: Scale,
  seerah: BookOpen,
  tafsir: BookMarked,
  student: GraduationCap,
  gifts: Gift,
};

export default function HomePage() {
  const { t, locale, dir } = useI18n();
  const { products } = useStore();
  const { bundlePrice } = useSettings();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const best = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);

  return (
    <div>
      <section className="pattern-light relative overflow-hidden bg-primary-950 text-white">
        <div className="pointer-events-none absolute -start-24 -top-24 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -end-16 h-96 w-96 rounded-full bg-primary-500/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/50 bg-gold-500/10 px-4 py-1.5 text-[13px] font-bold text-gold-300">
              <Sparkles size={14} /> {t("heroBadge")}
            </span>
            <h1 className="font-display mt-5 text-5xl font-bold leading-tight md:text-6xl">
              {t("heroTitle")}
              <span className="text-gold-400">.</span>
            </h1>
            <p className="mt-4 max-w-xl leading-loose text-cream-100/85">
              {t("heroSubtitle")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/books"
                className="flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 font-bold text-primary-950 shadow-lg shadow-gold-500/25 transition hover:bg-gold-400"
              >
                {t("heroCtaBooks")} <Arrow size={17} />
              </Link>
              <Link
                href="/bundles"
                className="flex items-center gap-2 rounded-full border-2 border-cream-100/40 px-7 py-3.5 font-bold text-cream-50 transition hover:border-gold-400 hover:text-gold-300"
              >
                <Gift size={17} /> {t("heroCtaBundles")}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-cream-100/80">
              {[t("heroTrust1"), t("heroTrust2"), t("heroTrust3")].map((s) => (
                <span key={s} className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-gold-400" /> {s}
                </span>
              ))}
            </div>
          </div>

          <div className="relative hidden justify-center md:flex">
            <div className="absolute h-80 w-80 rounded-full border border-gold-500/30" />
            <div className="absolute h-64 w-64 rounded-full border border-gold-500/20" />
            <Image
              src="/logo.jpg"
              alt="ستر شوب"
              width={220}
              height={220}
              className="animate-float-soft relative z-10 h-52 w-52 rounded-full border-4 border-gold-500 bg-white object-cover shadow-2xl"
              priority
            />
            <div className="absolute -start-2 top-6 z-20 w-32 rotate-[-8deg]">
              <BookCover title="الرحيق المختوم" author="المباركفوري" hue={42} />
            </div>
            <div className="absolute -end-2 bottom-4 z-20 w-32 rotate-[8deg]">
              <BookCover title="الداء والدواء" author="ابن القيم" hue={152} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14">
        <SectionTitle title={t("categoriesTitle")} sub={t("categoriesSub")} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => {
            const Icon = CAT_ICONS[c.id] ?? BookOpen;
            const count = products.filter((b) => b.category === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/books?cat=${c.id}`}
                className="group rounded-2xl border border-cream-300 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-gold-500 hover:shadow-lg"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-800 text-gold-300 transition group-hover:bg-gold-500 group-hover:text-primary-950">
                  <Icon size={24} />
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-primary-950">
                  {locale === "fr" ? c.fr : locale === "en" ? c.en : c.ar}
                </h3>
                <p className="mt-1 text-xs text-ink-500">
                  {count} {t("booksWord")}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-gold-600">
              <Award size={15} /> {t("bestSellersSub")}
            </p>
            <h2 className="font-display mt-1 text-3xl font-bold text-primary-950 md:text-4xl dark:text-cream-50">
              {t("bestSellersTitle")}
            </h2>
          </div>
          <Link
            href="/books"
            className="flex items-center gap-1.5 rounded-full border border-primary-800 px-5 py-2.5 text-sm font-bold text-primary-800 transition hover:bg-primary-800 hover:text-white dark:border-gold-500 dark:text-gold-300 dark:hover:bg-gold-500 dark:hover:text-primary-950"
          >
            {t("viewAll")} <Arrow size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {best.map((b) => (
            <BookCard key={b.slug} book={b} />
          ))}
        </div>
      </section>

      <section className="pattern-islamic mt-14 bg-primary-900 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle title={t("bundleTitle")} sub={t("bundleSub")} />
          <div className="grid gap-5 md:grid-cols-2">
            {BUNDLES.slice(0, 2).map((bundle) => {
              const b = { ...bundle, price: bundlePrice(bundle.slug, bundle.price) };
              return (
              <div
                key={b.slug}
                className="flex flex-col gap-5 rounded-3xl border border-gold-500/30 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10 sm:flex-row"
              >
                <div className="mx-auto w-40 shrink-0 sm:mx-0">
                  <BookCover
                    title={b.title[locale]}
                    author={`${b.books.length} ${t("booksWord")}`}
                    hue={b.hue}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold text-gold-300">
                    {b.title[locale]}
                  </h3>
                  <p className="mt-1 text-sm text-cream-100/80">{b.desc[locale]}</p>
                  <div className="mt-3 flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">
                      <Money value={b.price} />
                    </span>
                    <span className="text-sm text-cream-100/60 line-through">
                      <Money value={bundleTotal(bundle)} />
                    </span>
                    <span className="rounded-full bg-gold-500 px-2.5 py-0.5 text-xs font-bold text-primary-950">
                      {t("saveWord")} <Money value={bundleTotal(bundle) - b.price} />
                    </span>
                  </div>
                  <Link
                    href={`/bundles#${b.slug}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-bold text-primary-950 hover:bg-gold-400"
                  >
                    {t("viewAll")} <Arrow size={15} />
                  </Link>
                </div>
              </div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/bundles"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gold-500 px-8 py-3 font-bold text-gold-300 transition hover:bg-gold-500 hover:text-primary-950"
            >
              <Gift size={17} /> {t("bundlesTitle")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14">
        <SectionTitle title={t("trustTitle")} sub={t("trustSub")} />
        <div className="grid gap-5 md:grid-cols-3">
          {(
            [
              { icon: Truck, title: t("trustShip"), desc: t("trustShipD") },
              { icon: Banknote, title: t("trustCod"), desc: t("trustCodD") },
              { icon: Gift, title: t("trustGift"), desc: t("trustGiftD") },
            ] as const
          ).map((c, i) => (
            <div
              key={i}
              className="rounded-3xl border border-cream-300 bg-white p-6 shadow-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-800 text-gold-300">
                <c.icon size={22} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-primary-950">
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-14">
        <DeliveryCalculator />
      </section>
    </div>
  );
}
