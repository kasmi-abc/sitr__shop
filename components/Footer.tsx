"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  BookOpen,
  CircleHelp,
  Gift,
  Heart,
  LayoutDashboard,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";

const YEAR = new Date().getFullYear();

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TiktokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useI18n();
  const { phone, phoneDisplay, tiktok, instagram } = useSettings();
  return (
    <footer className="print-hidden mt-16 bg-primary-950 text-cream-100">
      {/* trust strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
          {[
            { icon: Truck, ar: "توصيل 58 ولاية", fr: "Livraison 58 wilayas", en: "58-wilaya delivery" },
            { icon: Banknote, ar: "الدفع عند الاستلام", fr: "Paiement à la livraison", en: "Cash on delivery" },
            { icon: PackageCheck, ar: "تغليف آمن فاخر", fr: "Emballage soigné", en: "Safe premium packing" },
            { icon: ShieldCheck, ar: "طبعات أصلية محققة", fr: "Éditions authentiques", en: "Authentic editions" },
          ].map((f, i) => (
            <TrustItem key={i} {...f} />
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="ستر شوب"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border-2 border-gold-500 bg-white object-cover"
            />
            <div>
              <p className="font-display text-2xl font-bold">ستر شوب</p>
              <p className="text-xs text-gold-300">متجر نسائي • علمٌ يُهدى وسترٌ يُقرّب</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream-100/80">{t("footerAbout")}</p>
          <div className="mt-4 flex gap-2">
            <a
              href={tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="rounded-full bg-white/10 p-2.5 text-cream-100 transition hover:bg-gold-500 hover:text-primary-950"
            >
              <TiktokIcon />
            </a>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full bg-white/10 p-2.5 text-cream-100 transition hover:bg-gold-500 hover:text-primary-950"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-gold-300">{t("footerShop")}</h4>
          <ul className="space-y-2.5 text-sm text-cream-100/80">
            <li><Link href="/books" className="hover:text-gold-300">{t("navBooks")}</Link></li>
            <li><Link href="/bundles" className="hover:text-gold-300">{t("navBundles")}</Link></li>
            <li><Link href="/authors" className="hover:text-gold-300">{t("navAuthors")}</Link></li>
            <li><Link href="/wishlist" className="flex items-center gap-1.5 hover:text-gold-300"><Heart size={13} />{t("wishlist")}</Link></li>
            <li><Link href="/tracking" className="hover:text-gold-300">{t("navTracking")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-gold-300">{t("footerHelp")}</h4>
          <ul className="space-y-2.5 text-sm text-cream-100/80">
            <li><Link href="/about" className="flex items-center gap-1.5 hover:text-gold-300"><BookOpen size={13} />{t("linkAbout")}</Link></li>
            <li><Link href="/faq" className="flex items-center gap-1.5 hover:text-gold-300"><CircleHelp size={13} />{t("navFaq")}</Link></li>
            <li><Link href="/terms" className="hover:text-gold-300">{t("linkTerms")}</Link></li>
            <li><Link href="/delivery" className="flex items-center gap-1.5 hover:text-gold-300"><Truck size={13} />{t("linkDelivery")}</Link></li>
            <li><Link href="/privacy" className="hover:text-gold-300">{t("linkPrivacy")}</Link></li>
            <li><Link href="/bundles" className="flex items-center gap-1.5 hover:text-gold-300"><Gift size={13} />{t("bundleTitle")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-gold-300">{t("footerContact")}</h4>
          <ul className="space-y-2.5 text-sm text-cream-100/80">
            <li>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-gold-300">
                <Phone size={14} className="text-gold-400" /> <bdi>{phoneDisplay}</bdi>
              </a>
            </li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-gold-400" /> contact@sitr-shop.dz</li>
            <li className="flex items-center gap-2"><MapPin size={14} className="text-gold-400" /> الجزائر — توصيل لكل الولايات</li>
            <li>
              <Link href="/admin" className="flex items-center gap-2 text-gold-300/80 hover:text-gold-300">
                <LayoutDashboard size={14} /> {t("adminLogin")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-[13px] text-cream-100/70">
          <p>© {YEAR} ستر شوب — {t("rights")}</p>
          <p className="mt-1">
            designed by{" "}
            <a
              href="https://www.instagram.com/abdelkader_haith/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-gold-300 underline-offset-2 hover:text-gold-200 hover:underline"
            >
              K.Haithem
              <InstagramIcon size={13} />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function TrustItem({
  icon: Icon,
  ar,
  fr,
  en,
}: {
  icon: typeof Truck;
  ar: string;
  fr: string;
  en: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="rounded-xl bg-gold-500/15 p-2.5 text-gold-300">
        <Icon size={20} />
      </span>
      <TrustLabel ar={ar} fr={fr} en={en} />
    </div>
  );
}

function TrustLabel({ ar, fr, en }: { ar: string; fr: string; en: string }) {
  const { locale } = useI18n();
  return (
    <span className="text-sm font-bold">
      {locale === "ar" ? ar : locale === "fr" ? fr : en}
    </span>
  );
}
