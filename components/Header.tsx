"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  Globe,
  Heart,
  Menu,
  Moon,
  Phone,
  Search,
  ShoppingCart,
  Sun,
  Truck,
  X,
} from "lucide-react";
import { Locale, useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { useSettings } from "@/lib/settings";

const LANGS: { id: Locale; label: string; full: string }[] = [
  { id: "ar", label: "ع", full: "العربية" },
  { id: "fr", label: "FR", full: "Français" },
  { id: "en", label: "EN", full: "English" },
];

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const { cartCount, wishlist } = useStore();
  const { theme, toggle } = useTheme();
  const { phone, phoneDisplay, announcement, announcement2 } = useSettings();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [msg, setMsg] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      document.cookie = `sitr-locale=${locale};path=/;max-age=31536000`;
    } catch {}
  }, [locale ]);

  useEffect(() => {
    const id = window.setInterval(() => setMsg((m) => (m + 1) % 2), 5000);
    return () => window.clearInterval(id);
  }, []);

  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

  const links = [
    { href: "/", label: t("navHome") },
    { href: "/books", label: t("navBooks") },
    { href: "/bundles", label: t("navBundles") },
    { href: "/authors", label: t("navAuthors") },
    { href: "/tracking", label: t("navTracking") },
    { href: "/faq", label: t("navFaq") },
    { href: "/about", label: t("navAbout") },
  ];

  return (
    <header className="print-hidden sticky top-0 z-50">
      {/* announcement bar */}
      <div className="bg-primary-950 text-cream-100">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-center text-[13px] font-semibold">
          <Truck size={14} className="shrink-0 text-gold-400" />
          <span key={msg} className="animate-fade-up">
            {msg === 0 ? announcement[locale] : announcement2[locale]}
          </span>
        </div>
      </div>

      {/* main bar */}
      <div className="border-b border-cream-300 bg-cream-50/95 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#1a1014]/95">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
          <button
            className="rounded-lg p-2 text-primary-900 hover:bg-cream-200 lg:hidden dark:text-cream-50 dark:hover:bg-white/10"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/logo.jpg"
              alt="ستر شوب"
              width={48}
              height={48}
              className="h-11 w-11 rounded-full border-2 border-gold-500 bg-white object-cover"
              priority
            />
            <span className="leading-tight">
              <span className="font-display block whitespace-nowrap text-xl font-bold text-primary-950 dark:text-cream-50">
                ستر شوب
              </span>
              <span className="hidden whitespace-nowrap text-[11px] font-semibold tracking-wide text-gold-600 md:block">
                {locale === "ar"
                  ? "متجر نسائي • كتب شرعية وقفازات"
                  : locale === "fr"
                    ? "Boutique féminine • Livres & gants"
                    : "Sisters-only • Books & gloves"}
              </span>
            </span>
          </Link>

          <form
            className="mx-auto hidden max-w-xl flex-1 items-center md:flex"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/books?q=${encodeURIComponent(q)}`);
            }}
          >
            <div className="relative w-full">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full rounded-full border border-cream-300 bg-white py-2.5 pe-11 ps-5 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              />
              <button
                type="submit"
                aria-label="search"
                className="absolute end-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary-800 p-2 text-white hover:bg-primary-700"
              >
                <Search size={15} />
              </button>
            </div>
          </form>

          <div className="ms-auto flex items-center gap-1.5 md:ms-0">
            {/* language dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                onBlur={() => window.setTimeout(() => setLangOpen(false), 150)}
                aria-label="language"
                className="flex items-center gap-1 rounded-full border border-cream-300 bg-white px-3 py-2 text-xs font-bold text-primary-900 hover:border-gold-500"
              >
                <Globe size={15} />
                {LANGS.find((l) => l.id === locale)?.label}
                <ChevronDown size={13} />
              </button>
              {langOpen && (
                <div className="absolute end-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-xl">
                  {LANGS.map((l) => (
                    <button
                      type="button"
                      key={l.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setLocale(l.id);
                        setLangOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-bold transition hover:bg-cream-100 ${
                        locale === l.id ? "bg-primary-50 text-primary-800" : "text-ink-700"
                      }`}
                    >
                      {l.full}
                      {locale === l.id && <Check size={15} className="text-primary-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* dark mode */}
            <button
              type="button"
              onClick={toggle}
              aria-label="theme"
              title={theme === "light" ? t("darkMode") : t("lightMode")}
              className="rounded-full p-2.5 text-primary-900 transition hover:bg-cream-200 dark:text-gold-300 dark:hover:bg-white/10"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <Link
              href="/wishlist"
              aria-label="wishlist"
              className="relative rounded-full p-2.5 text-primary-900 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-white/10"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              aria-label="cart"
              className="relative rounded-full p-2.5 text-primary-900 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-white/10"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-primary-950">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* mobile search */}
        <div className="px-4 pb-2 md:hidden">
          <form
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/books?q=${encodeURIComponent(q)}`);
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-full border border-cream-300 bg-white py-2 pe-11 ps-4 text-sm outline-none focus:border-gold-500"
            />
            <button
              type="submit"
              aria-label="search"
              className="absolute end-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary-800 p-1.5 text-white"
            >
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* nav */}
        <nav className="hidden border-t border-cream-200 lg:block dark:border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-5 py-2.5 text-sm font-bold transition ${
                  pathname === l.href
                    ? "text-gold-600"
                    : "text-primary-900 hover:text-gold-600 dark:text-cream-100"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-primary-700 dark:text-gold-300"
            >
              <Phone size={14} /> <bdi>{phoneDisplay}</bdi>
            </a>
          </div>
        </nav>

        {/* mobile menu */}
        {open && (
          <nav className="border-t border-cream-200 bg-cream-50 lg:hidden dark:border-white/10 dark:bg-[#1a1014]">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block border-b border-cream-200 px-6 py-3 text-sm font-bold text-primary-900 dark:border-white/10 dark:text-cream-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
