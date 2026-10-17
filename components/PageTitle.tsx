"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BOOKS } from "@/lib/data";
import { Locale, useI18n } from "@/lib/i18n";

const BRAND: Record<Locale, string> = {
  ar: "ستر شوب — علمٌ يُهدى وسترٌ يُقرّب",
  fr: "Sitr Shop — Livres & gants",
  en: "Sitr Shop — Books & gloves",
};

const ROUTES: { match: (p: string) => boolean; name: Record<Locale, string> }[] = [
  { match: (p) => p === "/", name: { ar: "علمٌ يُهدى وسترٌ يُقرّب", fr: "Un savoir qui s'offre", en: "Knowledge as a gift" } },
  { match: (p) => p === "/books", name: { ar: "الكتب والقفازات", fr: "Livres & gants", en: "Books & gloves" } },
  { match: (p) => p === "/bundles", name: { ar: "البوكسات والمجموعات", fr: "Coffrets", en: "Bundles" } },
  { match: (p) => p === "/authors", name: { ar: "المؤلفون والسلاسل", fr: "Auteurs et séries", en: "Authors and series" } },
  { match: (p) => p === "/cart", name: { ar: "سلة المشتريات", fr: "Panier", en: "Cart" } },
  { match: (p) => p === "/checkout", name: { ar: "إتمام الطلب", fr: "Commander", en: "Checkout" } },
  { match: (p) => p === "/order-success", name: { ar: "تم استلام طلبك", fr: "Commande reçue", en: "Order received" } },
  { match: (p) => p === "/verify", name: { ar: "تأكيد الطلبية", fr: "Vérification", en: "Verification" } },
  { match: (p) => p === "/tracking", name: { ar: "تتبع الطلبية", fr: "Suivi de commande", en: "Order tracking" } },
  { match: (p) => p === "/wishlist", name: { ar: "المفضلة", fr: "Favoris", en: "Wishlist" } },
  { match: (p) => p === "/about", name: { ar: "من نحن", fr: "À propos", en: "About us" } },
  { match: (p) => p === "/terms", name: { ar: "الشروط والأحكام", fr: "Conditions générales", en: "Terms and conditions" } },
  { match: (p) => p === "/delivery", name: { ar: "سياسة التوصيل", fr: "Livraison", en: "Delivery" } },
  { match: (p) => p === "/privacy", name: { ar: "سياسة الخصوصية", fr: "Confidentialité", en: "Privacy" } },
  { match: (p) => p === "/faq", name: { ar: "الأسئلة الشائعة", fr: "Questions fréquentes", en: "FAQ" } },
  { match: (p) => p.startsWith("/admin"), name: { ar: "لوحة التحكم", fr: "Administration", en: "Dashboard" } },
];

export default function PageTitle() {
  const pathname = usePathname();
  const { locale } = useI18n();

  useEffect(() => {
    let name: string | null = null;
    if (pathname.startsWith("/books/")) {
      const slug = pathname.split("/")[2];
      const book = BOOKS.find((b) => b.slug === slug);
      if (book) name = `${book.title} — ${book.author}`;
    }
    if (!name) name = ROUTES.find((r) => r.match(pathname))?.name[locale] ?? null;
    document.title = name ? `${name} | ${BRAND[locale]}` : BRAND[locale];
  }, [pathname, locale]);

  return null;
}
