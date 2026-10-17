"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Locale } from "./i18n";
import { CARRIERS, deliveryFee } from "./data";
import { logAudit } from "./audit";

export interface CarrierKeys {
  apiKey: string;
  secret: string;
  address: string;
  enabled: boolean;
}

export type Localized = Record<Locale, string>;

export interface Faq {
  q: Localized;
  a: Localized;
}

export interface Settings {
  phone: string;
  phoneDisplay: string;
  tiktok: string;
  instagram: string;
  announcement: Localized;
  announcement2: Localized;
  about: Localized;
  terms: Localized;
  faq: Faq[];
  deliveryOverrides: Record<string, { home: number; office: number }>;
  bundlePrices: Record<string, number>;
  carriers: string[];
  carrierKeys: Record<string, CarrierKeys>;
}

export const DEFAULT_ABOUT: Localized = {
  ar: "ستر شوب — متجر نسائي جزائري متخصص في الكتب الشرعية والقفازات، علمٌ يُهدى وسترٌ يُقرّب.\n\nننتقي لكِ أجود طبعات كتب العقيدة والفقه والسيرة والتفسير، مع قفازات ساترة أنيقة، بتغليف وردي يليق بكِ وبتوصيل سريع حتى باب البيت لجميع الولايات والدفع عند الاستلام.\n\nتنبيه مهم: متجر ستر شوب مخصص للنساء فقط، ويمكن للأخ إتمام الطلب لزوجته أو والدته أو إحدى محارمه.",
  fr: "Sitr Shop — boutique féminine algérienne : livres islamiques & gants. Une science qui s'offre, une pudeur qui rapproche. Éditions vérifiées, emballage rose soigné, livraison 58 wilayas, paiement à la livraison. Réservé aux femmes.",
  en: "Sitr Shop — Algerian sisters-only store: Islamic books & gloves. Knowledge as a gift, modesty as closeness. Verified editions, pink gift wrapping, 58-wilaya delivery, cash on delivery. Women only.",
};

export const DEFAULT_TERMS: Localized = {
  ar: "اهلا بكم في متجر ستر شوب. يرجى قراءة الشروط والأحكام التالية بعناية قبل إتمام طلبك:\n\n1. طبيعة المتجر والطلب: ستر شوب متجر إلكتروني نسائي يقدم الكتب الشرعية والقفازات داخل التراب الوطني الجزائري فقط. لا نملك مقرا أو محلا تجاريا لاستقبال الزبائن واقعيا؛ يتم استلام جميع الطلبات ومعالجتها حصرا عبر الموقع الإلكتروني أو صفحاتنا الرسمية.\n\n2. تأكيد الطلبيات: بعد إتمام نموذج الطلب على الموقع، سيتصل بك فريقنا أو تصلك رسالة لتأكيد الطلب والمعلومات (الاسم ورقم الهاتف والولاية). يرجى عدم التردد في الاستجابة لتأكيد الطلب حتى يتم تجهيزه وإرساله في أقرب وقت.\n\n3. التوصيل والدفع: التوصيل متوفر لجميع الولايات الجزائرية (إلى المنزل أو إلى مكتب شركة التوصيل حسب اختيارك). الدفع يكون عند الاستلام بعد معاينة الطرد والتأكد منه. آجال التوصيل تتراوح عادة بين 24 ساعة إلى 5 أيام عمل حسب الولاية والمنطقة.\n\n4. سياسة الإرجاع والاستبدال: يحق للزبونة معاينة الكتاب أو الطرد عند الاستلام بحضور عامل التوصيل. في حال وجود أي عيب مصنعي (صفحات مفقودة أو مطبوعة بشكل خاطئ) أو تلف ناتج عن الشحن، نلتزم باستبدال الكتاب مجانا أو إعادة مبلغ الكتاب. يشترط للإرجاع أو الاستبدال إعلامنا خلال 48 ساعة من الاستلام مع تقديم صورة أو فيديو يوضح المشكلة.\n\n5. إلغاء الطلب: يمكن للزبونة إلغاء الطلب مجانا قبل خروجه مع شركة الشحن. في حال إلغاء الطلب بعد شحنه دون سبب قاهر، تتحمل الزبونة تكاليف الشحن والإرجاع، حرصا على جدية التعامل وعدم إلحاق الضرر بالمتجر.",
  fr: "Bienvenue chez Sitr Shop. Librairie 100% en ligne, sans boutique physique, livrant sur tout le territoire algerien. Toute commande est confirmee par telephone ou message avant expedition. Livraison a domicile ou au bureau, paiement a la livraison apres verification du colis (24h a 5 jours ouvrables). Defaut d'impression ou casse transport : remplacement gratuit ou remboursement sous 48h avec photo ou video. Annulation gratuite avant expedition ; apres expedition, les frais de retour sont a la charge du client.",
  en: "Welcome to Sitr Shop. A 100% online bookstore with no physical shop, delivering across Algeria. Every order is confirmed by phone or message before shipping. Home or office delivery, cash on delivery after inspecting the parcel (24h to 5 working days). Printing defect or shipping damage: free replacement or refund within 48h with photo or video. Free cancellation before shipping; after shipping, return fees are the customer's responsibility.",
};

const DEFAULT_FAQ: Faq[] = [
  {
    q: { ar: "كيف أطلب؟ وهل الدفع مسبق؟", fr: "Comment commander ? Faut-il payer d'avance ?", en: "How do I order? Is prepayment needed?" },
    a: { ar: "اختر كتبك ثم املأ الاسم والهاتف والولاية، والدفع نقدا عند الاستلام بعد معاينة الطرد.", fr: "Choisissez vos livres, indiquez nom, telephone et wilaya. Paiement en especes a la livraison, apres verification.", en: "Pick your books, enter name, phone and wilaya. Pay cash on delivery after inspecting the parcel." },
  },
  {
    q: { ar: "كم تستغرق مدة التوصيل؟", fr: "Quel est le delai de livraison ?", en: "How long is delivery?" },
    a: { ar: "من 24 ساعة إلى 5 أيام عمل حسب الولاية، ويمكنك حساب السعر من حاسبة التوصيل في الموقع.", fr: "De 24h a 5 jours ouvrables selon la wilaya. Calculez le prix avec notre calculateur.", en: "From 24h to 5 working days depending on the wilaya. Use our delivery calculator for the exact fee." },
  },
  {
    q: { ar: "لماذا تتصلون بي بعد الطلب؟", fr: "Pourquoi m'appelez-vous apres la commande ?", en: "Why do you call after I order?" },
    a: { ar: "للتأكيد ومنع الطلبيات الوهمية، ثم تحصل على رمز تحقق لمتابعة طلبك.", fr: "Pour confirmer et eviter les fausses commandes, puis vous recevez un code de suivi.", en: "To confirm and prevent fake orders, then you receive a verification code to track your order." },
  },
  {
    q: { ar: "هل يمكن إرجاع كتاب فيه عيب؟", fr: "Puis-je retourner un livre defectueux ?", en: "Can I return a defective book?" },
    a: { ar: "نعم، خلال 48 ساعة من الاستلام مع صورة أو فيديو، نستبدله مجانا أو نعيد المبلغ.", fr: "Oui, sous 48h avec photo ou video : remplacement gratuit ou remboursement.", en: "Yes, within 48h with a photo or video: free replacement or refund." },
  },
  {
    q: { ar: "هل لديكم محل أزوره؟", fr: "Avez-vous une boutique physique ?", en: "Do you have a physical shop?" },
    a: { ar: "لا، نحن متجر إلكتروني متجول بالكامل: الطلب عبر الموقع والتوصيل حتى باب البيت.", fr: "Non, librairie 100% en ligne : commande sur le site, livraison jusqu'a votre porte.", en: "No, a fully online travelling bookstore: order on the site, delivered to your door." },
  },
];

const DEFAULTS: Settings = {
  phone: "+213600000000",
  phoneDisplay: "0600 00 00 00",
  tiktok: "https://www.tiktok.com/@sitr__shop",
  instagram: "https://www.instagram.com/sitr__shop/",
  announcement: {
    ar: "التوصيل متوفر لجميع ولايات الجزائر — الدفع عند الاستلام",
    fr: "Livraison vers toutes les wilayas — Paiement à la livraison",
    en: "Delivery to all wilayas — Cash on delivery",
  },
  announcement2: {
    ar: "بوكس الأحلام: هدية العلم الأجمل لمن تحب",
    fr: "Dream Box : le plus beau cadeau de savoir",
    en: "Dream Box: the finest gift of knowledge",
  },
  about: DEFAULT_ABOUT,
  terms: DEFAULT_TERMS,
  faq: DEFAULT_FAQ,
  deliveryOverrides: {},
  bundlePrices: {},
  carriers: [...CARRIERS],
  carrierKeys: {
    Yalidine: { apiKey: "", secret: "", address: "https://api.yalidine.app", enabled: true },
    "ZR Express": { apiKey: "", secret: "", address: "https://zr-express.dz", enabled: true },
    "Kazi Tour": { apiKey: "", secret: "", address: "", enabled: true },
    EMS: { apiKey: "", secret: "", address: "", enabled: true },
  },
};

interface SettingsCtx extends Settings {
  update: (patch: Partial<Settings>) => void;
  feeFor: (code: number, type: "home" | "office") => { fee: number; days: string };
  bundlePrice: (slug: string, fallback: number) => number;
}

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sitr-settings");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Settings>;
        setS({ ...DEFAULTS, ...parsed });
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("sitr-settings", JSON.stringify(s));
      } catch {}
    }
  }, [s, ready]);

  const value = useMemo<SettingsCtx>(
    () => ({
      ...s,
      update: (patch) => {
        setS((prev) => ({ ...prev, ...patch }));
        logAudit(`settings updated: ${Object.keys(patch).join(", ")}`);
      },
      feeFor: (code, type) => {
        const ov = s.deliveryOverrides[String(code)];
        const base = deliveryFee(code, type);
        if (ov && typeof ov[type] === "number" && ov[type] > 0)
          return { fee: ov[type], days: base.days };
        return base;
      },
      bundlePrice: (slug, fallback) => s.bundlePrices[slug] ?? fallback,
    }),
    [s]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings outside provider");
  return v;
}
