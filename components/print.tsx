"use client";

import type { Locale } from "@/lib/i18n";
import { Order, WILAYAS, formatPrice, orderTotal } from "@/lib/data";

const PL: Record<Locale, Record<string, string>> = {
  ar: {
    invoice: "وصل الطلب / الفاتورة",
    receipt: "وصل تأكيد الطلب",
    label: "ملصق الشحن",
    pick: "قائمة التجميع والتحضير",
    gift: "بطاقة إهداء",
    report: "تقرير المبيعات والجرد",
    store: "ستر شوب للكتب الشرعية والقفازات",
    orderNo: "رقم الطلب",
    date: "التاريخ",
    customer: "بيانات الزبون",
    name: "الاسم",
    phone: "الهاتف",
    phone2: "هاتف ثان",
    wilaya: "الولاية",
    commune: "البلدية",
    items: "الكتب المطلوبة",
    book: "الكتاب",
    qty: "الكمية",
    unit: "سعر الوحدة",
    total: "الإجمالي",
    subtotal: "المجموع الفرعي",
    delivery: "التوصيل",
    discount: "الخصم",
    giftWrap: "تغليف هدية",
    grand: "المجموع الإجمالي",
    cod: "الدفع عند الاستلام",
    thanks: "شكرا لإقبالكم على كتاب الله وسنة نبيه — ستر شوب",
    fragile: "يحتوي على كتب علمية — يرجى عدم الثني أو التعريض للرطوبة",
    home: "توصيل للمنزل",
    office: "استلام من المكتب",
    carrier: "شركة التوصيل",
    notes: "ملاحظات",
    verify: "تحقق",
    prepared: "جهزه",
    packed: "غلف",
    signature: "التوقيع",
    from: "من",
    to: "إلى",
    topBooks: "الكتب الأكثر مبيعا",
    topWilayas: "أكثر الولايات طلبا",
    ordersCount: "عدد الطلبات",
    revenue: "المبيعات",
    giftMsg: "نص الإهداء",
    track: "تابع طلبك من صفحة تتبع الطلبية في الموقع",
  },
  fr: {
    invoice: "Facture / Bon de livraison",
    receipt: "Reçu de commande",
    label: "Étiquette d'expédition",
    pick: "Liste de préparation",
    gift: "Carte cadeau",
    report: "Rapport des ventes",
    store: "Sitr Shop — Livres religieux",
    orderNo: "N° commande",
    date: "Date",
    customer: "Client",
    name: "Nom",
    phone: "Téléphone",
    phone2: "2e tél",
    wilaya: "Wilaya",
    commune: "Commune",
    items: "Articles",
    book: "Livre",
    qty: "Qté",
    unit: "Prix unit.",
    total: "Total",
    subtotal: "Sous-total",
    delivery: "Livraison",
    discount: "Remise",
    giftWrap: "Cadeau",
    grand: "Total général",
    cod: "Paiement à la livraison",
    thanks: "Merci pour votre confiance — Sitr Shop",
    fragile: "Contient des livres — ne pas plier, protéger de l'humidité",
    home: "À domicile",
    office: "Au bureau",
    carrier: "Transporteur",
    notes: "Notes",
    verify: "Vérif.",
    prepared: "Préparé",
    packed: "Emballé",
    signature: "Signature",
    from: "De",
    to: "À",
    topBooks: "Top livres",
    topWilayas: "Top wilayas",
    ordersCount: "Commandes",
    revenue: "Revenus",
    giftMsg: "Message",
    track: "Suivez votre commande sur le site",
  },
  en: {
    invoice: "Invoice / Packing Slip",
    receipt: "Order Receipt",
    label: "Shipping Label",
    pick: "Pick List",
    gift: "Gift Card",
    report: "Sales Report",
    store: "Sitr Shop — Islamic Books",
    orderNo: "Order No.",
    date: "Date",
    customer: "Customer",
    name: "Name",
    phone: "Phone",
    phone2: "2nd phone",
    wilaya: "Wilaya",
    commune: "Commune",
    items: "Items",
    book: "Book",
    qty: "Qty",
    unit: "Unit price",
    total: "Total",
    subtotal: "Subtotal",
    delivery: "Delivery",
    discount: "Discount",
    giftWrap: "Gift wrap",
    grand: "Grand total",
    cod: "Cash on delivery",
    thanks: "Thank you for your trust — Sitr Shop",
    fragile: "Contains books — do not bend, keep dry",
    home: "Home delivery",
    office: "Office pickup",
    carrier: "Carrier",
    notes: "Notes",
    verify: "Check",
    prepared: "Picked",
    packed: "Packed",
    signature: "Signature",
    from: "From",
    to: "To",
    topBooks: "Top books",
    topWilayas: "Top wilayas",
    ordersCount: "Orders",
    revenue: "Revenue",
    giftMsg: "Message",
    track: "Track your order on the website",
  },
};

export function wilayaName(code: number, locale: Locale): string {
  const w = WILAYAS.find((x) => x.code === code);
  if (!w) return String(code);
  return locale === "fr" ? `${w.code} — ${w.fr}` : `${w.code} — ${w.ar}`;
}

export function barcodeBars(value: string): number[] {
  const bars: number[] = [];
  const s = value.replace(/[^A-Za-z0-9]/g, "") || "DLF";
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    bars.push(1 + (c % 3), 1 + ((c >> 2) % 2));
  }
  return bars;
}

export function Barcode({ value, height = 44 }: { value: string; height?: number }) {
  const bars = barcodeBars(value);
  let x = 0;
  const rects: { x: number; w: number }[] = [];
  bars.forEach((w, i) => {
    if (i % 2 === 0) rects.push({ x, w: w * 2 });
    x += w * 2;
  });
  return (
    <svg width={x} height={height} viewBox={`0 0 ${x} ${height}`} aria-label={value}>
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={0} width={r.w} height={height} fill="#111" />
      ))}
    </svg>
  );
}

function barcodeSvg(value: string): string {
  const bars = barcodeBars(value);
  let x = 0;
  let rects = "";
  bars.forEach((w, i) => {
    if (i % 2 === 0)
      rects += `<rect x="${x}" y="0" width="${w * 2}" height="44" fill="#111"/>`;
    x += w * 2;
  });
  return `<svg width="${x}" height="44" viewBox="0 0 ${x} 44" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

const CUR: Record<Locale, string> = { ar: "دج", fr: "DA", en: "DZD" };
const money = (n: number, l: Locale) => `${formatPrice(n)} ${CUR[l]}`;

function docShell(title: string, locale: Locale, body: string, size: string): string {
  const dir = locale === "ar" ? "rtl" : "ltr";
  return `<!DOCTYPE html><html lang="${locale}" dir="${dir}"><head><meta charset="utf-8"><title>${title}</title>
<style>
  @page { size: ${size}; margin: 8mm; }
  * { box-sizing: border-box; }
  body { font-family: Tahoma, Arial, sans-serif; color: #191919; margin: 0; padding: 8mm; }
  .head { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0f3d2e; padding-bottom: 10px; }
  .brand { font-size: 22px; font-weight: 800; color: #0f3d2e; }
  .brand small { display: block; font-size: 11px; color: #a8861d; font-weight: 700; }
  .meta { text-align: end; font-size: 12px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
  th { background: #0f3d2e; color: #fff; padding: 7px; }
  td { border: 1px solid #bbb; padding: 6px 7px; }
  .totals { margin-top: 10px; margin-inline-start: auto; width: 260px; font-size: 13px; }
  .totals div { display: flex; justify-content: space-between; padding: 3px 0; }
  .grand { font-weight: 800; font-size: 15px; border-top: 2px solid #0f3d2e; margin-top: 4px; padding-top: 6px; }
  .foot { margin-top: 14px; border-top: 1px dashed #999; padding-top: 8px; font-size: 11px; text-align: center; color: #555; }
  .box { border: 1px solid #999; border-radius: 8px; padding: 10px 12px; margin-top: 12px; font-size: 12px; }
  .box h3 { margin: 0 0 6px; color: #0f3d2e; font-size: 13px; }
  .warn { background: #faf0d2; border: 1px solid #c9a227; border-radius: 8px; padding: 8px 12px; margin-top: 12px; font-size: 12px; font-weight: 700; }
  .chk { display: inline-block; width: 12px; height: 12px; border: 1.5px solid #333; border-radius: 2px; margin-inline-end: 6px; vertical-align: -1px; }
  .giftcard { border: 3px double #c9a227; border-radius: 14px; padding: 26px; text-align: center; margin-top: 10px; }
  .giftcard h2 { color: #0f3d2e; margin: 0 0 10px; }
  .giftcard p { font-size: 16px; line-height: 2; }
  h1.doc { font-size: 18px; color: #0f3d2e; margin: 12px 0 0; }
  .label-grid { display: flex; gap: 12px; margin-top: 12px; }
  .label-grid > div { flex: 1; }
  .cod { font-size: 20px; font-weight: 800; color: #0f3d2e; border: 2px solid #0f3d2e; border-radius: 8px; padding: 8px; text-align: center; margin-top: 12px; }
</style></head><body>${body}<script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script></body></html>`;
}

function openWindow(title: string, html: string) {
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

const head = (t: Record<string, string>, title: string, extra = "") => `
  <div class="head">
    <div class="brand">${t.store}<small>SITR SHOP — 0600 00 00 00</small></div>
    <div class="meta">${extra}</div>
  </div>
  <h1 class="doc">${title}</h1>`;

function itemsTable(t: Record<string, string>, o: Order, l: Locale): string {
  const rows = o.items
    .map(
      (it, i) =>
        `<tr><td>${i + 1}</td><td>${it.title}</td><td>${it.qty}</td><td>${money(it.price, l)}</td><td>${money(it.price * it.qty, l)}</td></tr>`
    )
    .join("");
  return `<table><tr><th>#</th><th>${t.book}</th><th>${t.qty}</th><th>${t.unit}</th><th>${t.total}</th></tr>${rows}</table>`;
}

function totals(t: Record<string, string>, o: Order, l: Locale): string {
  return `<div class="totals">
    <div><span>${t.subtotal}</span><b>${money(o.subtotal, l)}</b></div>
    ${o.discount ? `<div><span>${t.discount}</span><b>-${money(o.discount, l)}</b></div>` : ""}
    <div><span>${t.delivery}</span><b>${money(o.deliveryFee, l)}</b></div>
    ${o.gift ? `<div><span>${t.giftWrap}</span><b>${money(200, l)}</b></div>` : ""}
    <div class="grand"><span>${t.grand}</span><span>${money(orderTotal(o), l)}</span></div>
  </div>`;
}

function customerBox(t: Record<string, string>, o: Order, l: Locale): string {
  return `<div class="box"><h3>${t.customer}</h3>
    <div><b>${t.name}:</b> ${o.name}</div>
    <div><b>${t.phone}:</b> <span dir="ltr">${o.phone}</span>${o.phone2 ? ` — <span dir="ltr">${o.phone2}</span>` : ""}</div>
    <div><b>${t.wilaya}:</b> ${wilayaName(o.wilaya, l)} — <b>${t.commune}:</b> ${o.commune}</div>
    ${o.notes ? `<div><b>${t.notes}:</b> ${o.notes}</div>` : ""}
  </div>`;
}

export function printInvoice(o: Order, locale: Locale) {
  const t = PL[locale];
  const body = `
    ${head(t, `${t.invoice} — ${t.orderNo} ${o.number}`, `${t.date}: ${new Date(o.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB")}<br>${t.cod}`)}
    ${customerBox(t, o, locale)}
    <div class="box"><h3>${t.items}</h3>${itemsTable(t, o, locale)}${totals(t, o, locale)}</div>
    ${o.gift && o.giftNote ? `<div class="box"><h3>${t.giftMsg}</h3><p>${o.giftNote}</p></div>` : ""}
    <div class="foot">${t.thanks}<br>${t.track}</div>`;
  openWindow(t.invoice, docShell(`${t.invoice} ${o.number}`, locale, body, "A5"));
}

export function printLabel(o: Order, locale: Locale) {
  const t = PL[locale];
  const body = `
    <div class="head"><div class="brand">${t.store}</div><div>${barcodeSvg(o.number)}<div style="text-align:center;font-weight:800" dir="ltr">${o.number}</div></div></div>
    <h1 class="doc">${t.label}</h1>
    <div class="label-grid">
      <div class="box"><h3>${t.customer}</h3>
        <div style="font-size:15px;font-weight:800">${o.name}</div>
        <div dir="ltr" style="font-size:15px;font-weight:800;text-align:start">${o.phone}</div>
        ${o.phone2 ? `<div dir="ltr" style="text-align:start">${o.phone2}</div>` : ""}
        <div>${wilayaName(o.wilaya, locale)}</div>
        <div>${o.commune}</div>
      </div>
      <div class="box"><h3>${t.carrier} / COD</h3>
        <div>${o.deliveryType === "home" ? t.home : t.office}</div>
        <div><b>${t.carrier}:</b> ${o.carrier ?? "—"}</div>
        <div style="margin-top:6px"><b>${t.items}:</b> ${o.items.map((i) => `${i.title} ×${i.qty}`).join(" + ")}</div>
      </div>
    </div>
    <div class="cod">${t.cod}: ${money(orderTotal(o), locale)}</div>
    <div class="warn">${t.fragile}</div>`;
  openWindow(t.label, docShell(`${t.label} ${o.number}`, locale, body, "A6"));
}

export function printLabels(orders: Order[], locale: Locale) {
  const t = PL[locale];
  const pages = orders
    .map((o, i) => {
      const w = WILAYAS.find((x) => x.code === o.wilaya);
      return `
      <div style="page-break-after:always">
      <div class="head"><div class="brand">${t.store}</div><div>${barcodeSvg(o.number)}<div style="text-align:center;font-weight:800" dir="ltr">${o.number}</div></div></div>
      <h1 class="doc">${t.label} (${i + 1}/${orders.length})</h1>
      <div class="label-grid">
        <div class="box"><h3>${t.customer}</h3>
          <div style="font-size:15px;font-weight:800">${o.name}</div>
          <div dir="ltr" style="font-size:15px;font-weight:800;text-align:start">${o.phone}</div>
          ${o.phone2 ? `<div dir="ltr" style="text-align:start">${o.phone2}</div>` : ""}
          <div>${o.wilaya} — ${w ? (locale === "fr" ? w.fr : w.ar) : ""}</div>
          <div>${o.commune}</div>
        </div>
        <div class="box"><h3>${t.carrier} / COD</h3>
          <div>${o.deliveryType === "home" ? t.home : t.office}</div>
          <div><b>${t.carrier}:</b> ${o.carrier ?? "—"}</div>
          <div style="margin-top:6px"><b>${t.items}:</b> ${o.items.map((x) => `${x.title} ×${x.qty}`).join(" + ")}</div>
        </div>
      </div>
      <div class="cod">${t.cod}: ${money(orderTotal(o), locale)}</div>
      <div class="warn">${t.fragile}</div>
      </div>`;
    })
    .join("");
  openWindow(t.label, docShell(`${t.label} ×${orders.length}`, locale, pages, "A6"));
}
export function printPickList(orders: Order[], locale: Locale) {
  const t = PL[locale];
  const agg = new Map<string, number>();
  orders.forEach((o) =>
    o.items.forEach((it) => agg.set(it.title, (agg.get(it.title) ?? 0) + it.qty))
  );
  const rows = [...agg.entries()]
    .map(
      ([title, q]) =>
        `<tr><td><span class="chk"></span><span class="chk"></span></td><td>${title}</td><td><b>${q}</b></td></tr>`
    )
    .join("");
  const body = `
    ${head(t, `${t.pick} — ${orders.length} ${t.ordersCount}`, `${t.date}: ${new Date().toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB")}`)}
    <table><tr><th>${t.verify} / ${t.packed}</th><th>${t.book}</th><th>${t.qty}</th></tr>${rows}</table>
    <div class="box"><h3>${t.ordersCount}</h3>${orders.map((o) => `<div><span class="chk"></span><b dir="ltr">${o.number}</b> — ${o.name} (${wilayaName(o.wilaya, locale)})</div>`).join("")}</div>
    <div class="box">${t.prepared}: .................... &nbsp;&nbsp; ${t.signature}: ....................</div>`;
  openWindow(t.pick, docShell(t.pick, locale, body, "A4"));
}

export function printGiftCard(o: Order, locale: Locale) {
  const t = PL[locale];
  const body = `
    <div class="giftcard">
      <h2>${t.gift} — ${t.store}</h2>
      <p>${o.giftNote || "..."}</p>
      <div style="margin-top:14px">${barcodeSvg(o.number)}</div>
      <div class="foot">${t.thanks}</div>
    </div>`;
  openWindow(t.gift, docShell(t.gift, locale, body, "A6"));
}

export function printReport(
  orders: Order[],
  books: { title: string; sold: number }[],
  locale: Locale
) {
  const t = PL[locale];
  const valid = orders.filter((o) => o.status !== "cancelled" && o.status !== "returned");
  const revenue = valid.reduce((s, o) => s + orderTotal(o), 0);
  const byWilaya = new Map<number, number>();
  valid.forEach((o) => byWilaya.set(o.wilaya, (byWilaya.get(o.wilaya) ?? 0) + 1));
  const topW = [...byWilaya.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const topB = [...books].sort((a, b) => b.sold - a.sold).slice(0, 8);
  const body = `
    ${head(t, t.report, `${t.date}: ${new Date().toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB")}`)}
    <div class="label-grid">
      <div class="box"><h3>${t.ordersCount}</h3><div style="font-size:22px;font-weight:800">${valid.length}</div></div>
      <div class="box"><h3>${t.revenue}</h3><div style="font-size:22px;font-weight:800">${money(revenue, locale)}</div></div>
    </div>
    <div class="label-grid">
      <div><table><tr><th>${t.topWilayas}</th><th>${t.ordersCount}</th></tr>${topW.map(([c, n]) => `<tr><td>${wilayaName(c, locale)}</td><td>${n}</td></tr>`).join("")}</table></div>
      <div><table><tr><th>${t.topBooks}</th><th>${t.qty}</th></tr>${topB.map((b) => `<tr><td>${b.title}</td><td>${b.sold}</td></tr>`).join("")}</table></div>
    </div>
    <div class="foot">${t.store}</div>`;
  openWindow(t.report, docShell(t.report, locale, `<style>@page{size:A4 landscape}</style>` + body, "A4 landscape"));
}
