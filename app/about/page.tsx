"use client";

import Image from "next/image";
import { BookOpen, HeartHandshake, Truck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { SectionTitle } from "@/components/ui";

export default function AboutPage() {
  const { t, locale } = useI18n();
  const { about } = useSettings();
  const paras = about[locale].split("\n\n");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <SectionTitle title={t("aboutTitle")} />
      <div className="overflow-hidden rounded-3xl border border-cream-300 bg-white">
        <div className="pattern-light flex flex-col items-center bg-primary-950 px-6 py-10 text-center text-white">
          <Image
            src="/logo.jpg"
            alt="ستر شوب"
            width={120}
            height={120}
            className="h-28 w-28 rounded-full border-4 border-gold-500 bg-white object-cover"
          />
          <p className="font-display mt-4 text-3xl font-bold">ستر شوب</p>
          <p className="text-gold-300">{t("heroBadge")}</p>
        </div>
        <div className="space-y-4 px-6 py-8 text-lg leading-loose text-ink-700 md:px-10">
          {paras.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="grid gap-4 px-6 pb-8 md:grid-cols-3 md:px-10">
          {[
            { icon: BookOpen, t1: "طبعات محققة", t2: "ننتقي أجود الطبعات" },
            { icon: Truck, t1: "توصيل وطني", t2: "58 ولاية حتى الباب" },
            { icon: HeartHandshake, t1: "ثقة العائلات", t2: "آلاف الطلبات الناجحة" },
          ].map((v, i) => (
            <div key={i} className="rounded-2xl bg-cream-50 p-5 text-center">
              <v.icon size={26} className="mx-auto text-gold-600" />
              <p className="mt-2 font-bold text-primary-950">{v.t1}</p>
              <p className="text-sm text-ink-500">{v.t2}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
