"use client";

import Link from "next/link";
import { BookX, Compass, Home } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <span className="pattern-islamic flex h-36 w-36 items-center justify-center rounded-full bg-primary-950 text-gold-400">
        <BookX size={56} />
      </span>
      <p className="font-display mt-6 text-7xl font-bold text-primary-900 dark:text-cream-50">404</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-primary-950 dark:text-cream-50">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-2 text-ink-500 dark:text-cream-100/70">{t("notFoundSub")}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-primary-800 px-7 py-3 font-bold text-white hover:bg-primary-700"
        >
          <Home size={16} /> {t("home")}
        </Link>
        <Link
          href="/books"
          className="flex items-center gap-2 rounded-full border-2 border-gold-500 px-7 py-3 font-bold text-gold-700 hover:bg-gold-500 hover:text-white"
        >
          <Compass size={16} /> {t("navBooks")}
        </Link>
      </div>
    </div>
  );
}
