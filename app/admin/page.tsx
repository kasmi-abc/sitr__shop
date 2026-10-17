"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  Download,
  Eye,
  FileText,
  Gift,
  ImagePlus,
  LogOut,
  Menu,
  Package,
  Pencil,
  Plus,
  Printer,
  Save,
  Search,
  Settings as SettingsIcon,
  ShoppingBag,
  Star,
  Store,
  Trash2,
  Truck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  BOOKS,
  BUNDLES,
  CATEGORIES,
  ORDER_STATUSES,
  WILAYAS,
  Book,
  CategoryId,
  Order,
  OrderStatus,
  Testimonial,
  orderTotal,
} from "@/lib/data";
import { Locale, useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useSettings } from "@/lib/settings";
import { clearAudit, readAudit, setAuditUser } from "@/lib/audit";
import { Money } from "@/components/ui";
import {
  Barcode,
  printGiftCard,
  printInvoice,
  printLabel,
  printLabels,
  printPickList,
  printReport,
} from "@/components/print";

type Tab =
  | "overview"
  | "books"
  | "orders"
  | "delivery"
  | "bundles"
  | "customers"
  | "pages"
  | "settings";

function StatusBadge({ s }: { s: OrderStatus }) {
  const { t } = useI18n();
  const label =
    s === "pending" ? t("statusPending")
    : s === "confirmed" ? t("statusConfirmed")
    : s === "packed" ? t("statusPacked")
    : s === "shipped" ? t("statusShipped")
    : s === "delivered" ? t("statusDelivered")
    : s === "cancelled" ? t("cancelOrd")
    : t("statusReturned");
  const cls =
    s === "delivered"
      ? "bg-primary-100 text-primary-800"
      : s === "returned" || s === "cancelled"
        ? "bg-red-100 text-red-700"
        : s === "pending"
          ? "bg-gold-100 text-gold-700"
          : "bg-blue-50 text-blue-700";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>{label}</span>
  );
}

function fileToDataUrl(file: File, maxW = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(img.width * scale));
      c.height = Math.max(1, Math.round(img.height * scale));
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function readPdf(file: File): Promise<{ name: string; data: string }> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () =>
      resolve({ name: file.name, data: typeof r.result === "string" ? r.result : "" });
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const { t, locale } = useI18n();
  const { status, data: session } = useSession();
  const router = useRouter();
  const { orders, updateOrder, products } = useStore();
  const [tab, setTab] = useState<Tab>("overview");
  const [drawer, setDrawer] = useState(false);
  const [q, setQ] = useState("");
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    setAuditUser(session?.user?.email);
  }, [session?.user?.email]);

  const all = orders;

  const pending = all.filter((o) => o.status === "pending");
  const lowStock = products.filter((b) => b.stock < 12);
  const notifCount = pending.length + lowStock.length;

  if (status === "loading")
    return <div className="px-4 py-20 text-center font-bold">...</div>;
  if (status === "unauthenticated") return null;

  const menu: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: "overview", label: t("overview"), icon: BarChart3 },
    { id: "books", label: t("manageBooks"), icon: BookOpen },
    { id: "orders", label: t("ordersHub"), icon: Package },
    { id: "delivery", label: t("deliveryHub"), icon: Truck },
    { id: "bundles", label: t("offersHub"), icon: Gift },
    { id: "customers", label: t("customersTab"), icon: Users },
    { id: "pages", label: t("contentPages"), icon: FileText },
    { id: "settings", label: t("storeSettings"), icon: SettingsIcon },
  ];

  const side = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-cream-200 px-5 py-4">
        <BookOpen size={20} className="text-gold-600" />
        <p className="font-display text-lg font-bold text-primary-950">
          {locale === "ar" ? "ستر شوب" : "Sitr Shop"}
        </p>
      </div>
      <nav className="flex-1 space-y-1 overflow-auto p-3">
        {menu.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setTab(m.id);
              setDrawer(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
              tab === m.id
                ? "bg-primary-800 text-white shadow"
                : "text-ink-700 hover:bg-cream-200"
            }`}
          >
            <m.icon size={18} className={tab === m.id ? "text-gold-300" : "text-gold-600"} />
            {m.label}
          </button>
        ))}
      </nav>
      <div className="border-t border-cream-200 p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
        >
          <LogOut size={17} /> {t("logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex max-w-[1400px] gap-0 px-0 py-0 lg:gap-5 lg:px-4 lg:py-6">
      {/* sidebar desktop */}
      <aside className="sticky top-32 hidden h-[calc(100vh-9rem)] w-64 shrink-0 overflow-hidden rounded-3xl border border-cream-300 bg-white lg:block">
        {side}
      </aside>
      {/* drawer mobile */}
      {drawer && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <aside className="absolute bottom-0 start-0 top-0 w-72 bg-white shadow-2xl">
            {side}
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1 px-4 py-4 lg:px-0 lg:py-0">
        {/* topbar */}
        <div className="flex items-center gap-2 rounded-2xl border border-cream-300 bg-white px-3 py-2.5">
          <button
            className="rounded-lg p-2 text-primary-900 hover:bg-cream-200 lg:hidden"
            onClick={() => setDrawer(true)}
            aria-label="menu"
          >
            <Menu size={20} />
          </button>
          <div className="relative hidden flex-1 sm:block">
            <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("quickSearch")}
              className="w-full rounded-full bg-cream-100 py-2 pe-3 ps-9 text-sm outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>
          <div className="relative ms-auto sm:ms-0">
            <button
              onClick={() => setAlertsOpen((a) => !a)}
              aria-label="notifications"
              className="relative rounded-full p-2.5 text-primary-900 hover:bg-cream-200"
            >
              <Bell size={20} />
              {notifCount > 0 && (
                <span className="absolute end-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
                  {notifCount}
                </span>
              )}
            </button>
            {alertsOpen && (
              <div className="absolute end-0 top-full z-50 mt-2 w-72 rounded-2xl border border-cream-300 bg-white p-3 shadow-xl">
                <p className="px-2 py-1 text-xs font-bold text-ink-500">
                  {pending.length} {t("pendingOrdersLbl")} • {lowStock.length} {t("lowStockAlert")}
                </p>
                {pending.slice(0, 3).map((o) => (
                  <button
                    key={o.number}
                    onClick={() => {
                      setTab("orders");
                      setOpenOrder(o.number);
                      setAlertsOpen(false);
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-start text-sm font-bold text-primary-900 hover:bg-cream-100"
                  >
                    <span dir="ltr">{o.number}</span> — {o.name}
                  </button>
                ))}
                {lowStock.slice(0, 3).map((b) => (
                  <button
                    key={b.slug}
                    onClick={() => {
                      setTab("books");
                      setAlertsOpen(false);
                    }}
                    className="flex w-full items-center gap-1.5 rounded-xl px-3 py-2 text-start text-sm text-ink-700 hover:bg-cream-100"
                  >
                    <AlertTriangle size={14} className="text-gold-600" /> {b.title} ({b.stock})
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-primary-800 px-3 py-2 text-xs font-bold text-white sm:flex">
            <Users size={14} /> {locale === "ar" ? "الأدمن" : "Admin"}
          </span>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full border border-cream-300 px-3 py-2 text-xs font-bold text-primary-800 hover:border-gold-500"
          >
            <Store size={14} /> {t("viewStore")}
          </Link>
        </div>

        {/* mobile search */}
        <div className="mt-2 sm:hidden">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("quickSearch")}
            className="w-full rounded-full border border-cream-300 bg-white py-2.5 px-4 text-sm outline-none"
          />
        </div>

        <div className="mt-4">
          {tab === "overview" && (
            <Overview all={all} go={(tb, num, slug) => { setTab(tb); if (num) setOpenOrder(num); if (slug) setEditSlug(slug); }} />
          )}
          {tab === "books" && <BooksManager q={q} editRequest={editSlug} clearEditRequest={() => setEditSlug(null)} />}
          {tab === "orders" && (
            <OrdersManager all={all} q={q} openNum={openOrder} clearOpen={() => setOpenOrder(null)} patch={updateOrder} />
          )}
          {tab === "delivery" && <DeliveryManager all={all} q={q} />}
          {tab === "bundles" && <BundlesManager />}
          {tab === "customers" && <CustomersManager />}
          {tab === "pages" && <PagesManager />}
          {tab === "settings" && <SettingsManager />}
        </div>
      </div>
    </div>
  );
}

function Overview({
  all,
  go,
}: {
  all: Order[];
  go: (t: Tab, num?: string, slug?: string) => void;
}) {
  const { t, locale } = useI18n();
  const { products } = useStore();

  const today = new Date().toISOString().slice(0, 10);
  const todaySales = all
    .filter((o) => o.createdAt.slice(0, 10) === today && o.status !== "cancelled" && o.status !== "returned")
    .reduce((s, o) => s + orderTotal(o), 0);
  const revenue = all
    .filter((o) => o.status !== "cancelled" && o.status !== "returned")
    .reduce((s, o) => s + orderTotal(o), 0);
  const pending = all.filter((o) => o.status === "pending");
  const stockUnits = products.reduce((s, b) => s + b.stock, 0);

  const days = [...Array(7)].map((_, i) => {
    // eslint-disable-next-line react-hooks/purity
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    const sum = all
      .filter((o) => o.createdAt.slice(0, 10) === key && o.status !== "cancelled" && o.status !== "returned")
      .reduce((s, o) => s + orderTotal(o), 0);
    return { key, label: d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { weekday: "short" }), sum };
  });
  const max = Math.max(1, ...days.map((d) => d.sum));

  const cards = [
    { icon: Wallet, label: t("todaySales"), value: <Money value={todaySales} /> },
    { icon: Package, label: t("newOrdersLbl"), value: String(pending.length) },
    { icon: ShoppingBag, label: t("stockBooks"), value: String(stockUnits) },
    { icon: BarChart3, label: t("statRevenue"), value: <Money value={revenue} /> },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl border border-cream-300 bg-white p-4">
            <c.icon size={20} className="text-gold-600" />
            <p className="mt-2 text-xl font-bold text-primary-950">{c.value}</p>
            <p className="text-xs text-ink-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <h3 className="font-bold text-primary-950">{t("reportBtn")} — 7</h3>
        <div className="mt-4 flex h-36 items-end gap-2">
          {days.map((d) => (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-ink-500">
                {d.sum > 0 ? `${Math.round(d.sum / 1000)}k` : ""}
              </span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary-800 to-gold-500"
                style={{ height: `${Math.max(4, Math.round((d.sum / max) * 100))}%` }}
              />
              <span className="text-[10px] text-ink-500">{d.label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => printReport(all, products.map((b) => ({ title: b.title, sold: b.sold })), locale)}
          className="mt-4 flex items-center gap-1.5 rounded-full border border-cream-300 px-4 py-2 text-xs font-bold text-primary-800 hover:border-gold-500"
        >
          <Printer size={14} /> {t("reportBtn")}
        </button>
      </div>

      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-primary-950">
            {t("pendingOrdersLbl")} ({pending.length})
          </h3>
          <button onClick={() => go("orders")} className="text-xs font-bold text-gold-700 hover:underline">
            {t("viewAll")}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-start text-xs text-ink-500">
                <th className="py-2 text-start">{t("orderNumber")}</th>
                <th className="text-start">{t("fullName")}</th>
                <th className="text-start">{t("wilaya")}</th>
                <th className="text-start">{t("total")}</th>
                <th className="text-end">{t("orderDetails")}</th>
              </tr>
            </thead>
            <tbody>
              {pending.slice(0, 8).map((o) => (
                <tr key={o.number} className="border-b border-cream-100">
                  <td className="py-2.5 font-bold" dir="ltr">{o.number}</td>
                  <td>{o.name}</td>
                  <td>{WILAYAS.find((w) => w.code === o.wilaya)?.ar} ({o.wilaya})</td>
                  <td className="font-bold"><Money value={orderTotal(o)} /></td>
                  <td className="text-end">
                    <button
                      onClick={() => go("orders", o.number)}
                      className="rounded-lg bg-primary-800 px-3 py-1.5 text-xs font-bold text-white"
                    >
                      {t("orderDetails")}
                    </button>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-ink-500">—</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-gold-500/50 bg-gold-100/30 p-5">
        <h3 className="flex items-center gap-2 font-bold text-primary-950">
          <AlertTriangle size={17} className="text-gold-600" /> {t("lowStockAlert")}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {products.filter((b) => b.stock < 12).map((b) => (
            <button
              key={b.slug}
              onClick={() => go("books", undefined, b.slug)}
              title={t("edit")}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink-700 shadow-sm transition hover:border-gold-500 hover:text-primary-800"
            >
              {b.title} — {b.stock}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const EMPTY_BOOK: Book = {
  slug: "",
  title: "",
  author: "",
  publisher: "",
  volumes: 1,
  pages: 200,
  binding: { ar: "غلاف مقوى", fr: "Rigide", en: "Hard cover" },
  price: 1000,
  rating: 5,
  reviews: 0,
  category: "student",
  stock: 10,
  sold: 0,
  hue: 150,
  desc: { ar: "", fr: "", en: "" },
  index: [],
};

function BooksManager({ q, editRequest, clearEditRequest }: { q: string; editRequest: string | null; clearEditRequest: () => void }) {
  const { t, locale } = useI18n();
  const { products, saveProducts } = useStore();
  const [editing, setEditing] = useState<Book | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [catF, setCatF] = useState<string>("all");

  useEffect(() => {
    if (editRequest) {
      const b = products.find((x) => x.slug === editRequest);
      if (b) {
        setEditing({ ...b, desc: { ...b.desc }, index: [...b.index], binding: { ...b.binding } });
        setIsNew(false);
      }
      clearEditRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRequest]);

  const norm = (s: string) => s.toLowerCase();
  const list = products.filter(
    (b) =>
      (catF === "all" || b.category === catF) &&
      (!q ||
        norm(b.title).includes(norm(q)) ||
        norm(b.author).includes(norm(q)) ||
        norm(b.publisher).includes(norm(q)))
  );

  const series = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((b) => {
      if (b.series) m.set(b.series, (m.get(b.series) ?? 0) + 1);
    });
    return [...m.entries()];
  }, [products]);

  const startNew = () => {
    setEditing({ ...EMPTY_BOOK, slug: `book-${Date.now()}`, desc: { ar: "", fr: "", en: "" }, index: [] });
    setIsNew(true);
  };

  const save = (b: Book) => {
    if (isNew) saveProducts([...products, b]);
    else saveProducts(products.map((x) => (x.slug === b.slug ? b : x)));
    setEditing(null);
    setIsNew(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-cream-300 bg-white p-4">
        <h3 className="font-bold text-primary-950">{t("manageBooks")} ({list.length})</h3>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 rounded-full bg-primary-800 px-4 py-2 text-sm font-bold text-white"
        >
          <Plus size={15} /> {t("addNew")}
        </button>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-2xl border border-cream-300 bg-white p-3">
        {[{ id: "all", label: t("all") }].concat(
          CATEGORIES.map((c) => ({
            id: c.id as string,
            label: locale === "fr" ? c.fr : locale === "en" ? c.en : c.ar,
          }))
        ).map((c) => (
          <button
            key={c.id}
            onClick={() => setCatF(c.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
              catF === c.id ? "bg-primary-800 text-white" : "bg-cream-100 text-ink-700"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-cream-300 bg-white p-4">
        <h4 className="text-sm font-bold text-primary-950">{t("catSeriesLbl")}</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <span key={c.id} className="rounded-full bg-cream-100 px-3 py-1.5 text-xs font-bold">
              {c.ar} ({products.filter((b) => b.category === c.id).length})
            </span>
          ))}
          {series.map(([s, n]) => (
            <span key={s} className="rounded-full bg-gold-100 px-3 py-1.5 text-xs font-bold text-gold-700">
              {s} ({n})
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-cream-300 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-cream-200 text-xs text-ink-500">
              <th className="p-3 text-start">{t("catalogTitle")}</th>
              <th className="text-start">{t("publisher")}</th>
              <th className="text-start">{t("filterPrice")}</th>
              <th className="text-start">{t("qty")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.slug} className="border-b border-cream-100">
                <td className="p-3">
                  <span className="font-bold text-primary-950">{b.title}</span>
                  <span className="block text-xs text-ink-500">{b.author}{b.reviewer ? ` • ${b.reviewer}` : ""}</span>
                </td>
                <td className="text-xs">{b.publisher}</td>
                <td className="font-bold"><Money value={b.price} /></td>
                <td>
                  <span className={b.stock === 0 ? "font-bold text-red-600" : b.stock < 12 ? "font-bold text-gold-600" : ""}>
                    {b.stock}
                  </span>
                </td>
                <td className="whitespace-nowrap p-3 text-end">
                  <button onClick={() => { setEditing({ ...b, desc: { ...b.desc }, index: [...b.index], binding: { ...b.binding } }); setIsNew(false); }} aria-label="edit" className="rounded-lg p-1.5 text-primary-700 hover:bg-cream-100">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => { if (window.confirm(t("remove") + "؟")) saveProducts(products.filter((x) => x.slug !== b.slug)); }} aria-label="delete" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <BookForm
          initial={editing}
          isNew={isNew}
          onSave={save}
          onClose={() => { setEditing(null); setIsNew(false); }}
        />
      )}
    </div>
  );
}

function BookForm({
  initial,
  isNew,
  onSave,
  onClose,
}: {
  initial: Book;
  isNew: boolean;
  onSave: (b: Book) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [f, setF] = useState<Book>(initial);
  const [indexText, setIndexText] = useState(initial.index.join("\n"));
  const set = (p: Partial<Book>) => setF((prev) => ({ ...prev, ...p }));
  const inp = "w-full rounded-xl border border-cream-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold-500";

  return (
    <div className="fixed inset-0 z-[130] overflow-auto bg-black/40 p-4">
      <div className="mx-auto my-6 max-w-2xl rounded-3xl bg-cream-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-primary-950">
            {isNew ? t("addNew") : t("edit")}
          </h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-cream-200" aria-label="close">
            <X size={18} />
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input value={f.title} onChange={(e) => set({ title: e.target.value })} placeholder="العنوان *" className={inp} />
          <input value={f.author} onChange={(e) => set({ author: e.target.value })} placeholder="المؤلف / الشارح *" className={inp} />
          <input value={f.reviewer ?? ""} onChange={(e) => set({ reviewer: e.target.value })} placeholder="المحقق" className={inp} />
          <input value={f.publisher} onChange={(e) => set({ publisher: e.target.value })} placeholder="دار النشر" className={inp} />
          <select value={f.category} onChange={(e) => set({ category: e.target.value as CategoryId })} className={inp}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.ar}</option>
            ))}
          </select>
          <input value={f.series ?? ""} onChange={(e) => set({ series: e.target.value || undefined })} placeholder="السلسلة (اختياري)" className={inp} list="series-list" />
          <datalist id="series-list">
            {BOOKS.filter((b) => b.series).map((b) => (
              <option key={b.series} value={b.series} />
            ))}
          </datalist>
          <input value={f.binding.ar} onChange={(e) => set({ binding: { ...f.binding, ar: e.target.value } })} placeholder="التجليد" className={inp} />
          <select value={f.badge ?? ""} onChange={(e) => set({ badge: (e.target.value || undefined) as Book["badge"] })} className={inp}>
            <option value="">—</option>
            <option value="bestseller">الأكثر طلبا</option>
            <option value="new">جديد</option>
            <option value="series">سلسلة</option>
          </select>
          <input type="number" value={f.price} onChange={(e) => set({ price: Number(e.target.value) })} placeholder="السعر" className={inp} />
          <input type="number" value={f.oldPrice ?? ""} onChange={(e) => set({ oldPrice: e.target.value ? Number(e.target.value) : undefined })} placeholder="سعر التخفيض (اختياري)" className={inp} />
          <input type="number" value={f.volumes} onChange={(e) => set({ volumes: Number(e.target.value) })} placeholder="المجلدات" className={inp} />
          <input type="number" value={f.pages} onChange={(e) => set({ pages: Number(e.target.value) })} placeholder="الصفحات" className={inp} />
          <input type="number" value={f.stock} onChange={(e) => set({ stock: Number(e.target.value) })} placeholder="المخزون" className={inp} />
          <input type="number" value={f.hue} min={0} max={360} onChange={(e) => set({ hue: Number(e.target.value) })} placeholder="لون الغلاف (0-360)" className={inp} />
        </div>
        <textarea value={f.desc.ar} onChange={(e) => set({ desc: { ...f.desc, ar: e.target.value } })} rows={3} placeholder="الوصف (عربي)" className={`${inp} mt-3`} />
        <textarea value={indexText} onChange={(e) => setIndexText(e.target.value)} rows={3} placeholder="الفهرس (سطر لكل باب)" className={`${inp} mt-3`} />

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="cursor-pointer rounded-2xl border-2 border-dashed border-cream-300 bg-white p-4 text-center text-sm font-bold text-ink-700 hover:border-gold-500">
            <ImagePlus size={20} className="mx-auto mb-1 text-gold-600" />
            {t("uploadImg")}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) set({ image: await fileToDataUrl(file) });
              }}
            />
            {f.image && (
              <Image
                src={f.image}
                alt=""
                width={96}
                height={128}
                unoptimized
                className="mx-auto mt-2 h-24 w-auto rounded-lg object-cover"
              />
            )}
          </label>
          <label className="cursor-pointer rounded-2xl border-2 border-dashed border-cream-300 bg-white p-4 text-center text-sm font-bold text-ink-700 hover:border-gold-500">
            <FileText size={20} className="mx-auto mb-1 text-red-600" />
            {t("pdfFile")} {f.pdf ? "(✓)" : ""}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 1.5 * 1024 * 1024) {
                  set({ pdf: file.name });
                } else {
                  const r = await readPdf(file);
                  set({ pdf: r.data });
                }
              }}
            />
            {f.pdf && <p className="mt-2 truncate text-xs text-ink-500">{f.pdf.startsWith("data:") ? "PDF مرفق" : f.pdf}</p>}
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onSave({ ...f, index: indexText.split("\n").map((s) => s.trim()).filter(Boolean) })}
            disabled={!f.title.trim() || !f.author.trim()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-primary-800 py-3 font-bold text-white disabled:opacity-40"
          >
            <Save size={16} /> {t("save")}
          </button>
          <button onClick={onClose} className="rounded-2xl border border-cream-300 px-6 font-bold">
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrdersManager({
  all,
  q,
  openNum,
  clearOpen,
  patch,
}: {
  all: Order[];
  q: string;
  openNum: string | null;
  clearOpen: () => void;
  patch: (n: string, p: Partial<Order>) => void;
}) {
  const { t, locale } = useI18n();
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [detail, setDetail] = useState<string | null>(openNum);

  useEffect(() => {
    if (openNum) setDetail(openNum);
  }, [openNum ]);

  const list = all.filter(
    (o) =>
      (status === "all" || o.status === status) &&
      (!q ||
        o.number.includes(q) ||
        o.name.includes(q) ||
        o.phone.includes(q))
  );

  const setStatusOf = (n: string, s: OrderStatus) => patch(n, { status: s });

  return (
    <div className="space-y-4">
      <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-2xl border border-cream-300 bg-white p-3">
        {(["all", ...ORDER_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
              status === s ? "bg-primary-800 text-white" : "bg-cream-100 text-ink-700"
            }`}
          >
            {s === "all" ? t("all") : <StatusBadge s={s} />}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {list.map((o) => (
          <div key={o.number} className="flex flex-wrap items-center gap-3 rounded-2xl border border-cream-300 bg-white p-4">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-primary-950">
                <span dir="ltr">{o.number}</span> — {o.name}
              </p>
              <p className="text-xs text-ink-500">
                {WILAYAS.find((w) => w.code === o.wilaya)?.ar} • {o.items.length} {t("booksWord")} • <Money value={orderTotal(o)} />
              </p>
            </div>
            <StatusBadge s={o.status} />
            <div className="flex gap-1.5">
              <button onClick={() => setDetail(o.number)} aria-label="detail" className="rounded-lg bg-cream-100 p-2 text-primary-800 hover:bg-cream-200">
                <Eye size={16} />
              </button>
              <button onClick={() => printLabel(o, locale)} aria-label="print" className="rounded-lg bg-cream-100 p-2 text-primary-800 hover:bg-cream-200">
                <Printer size={16} />
              </button>
              {o.status === "pending" && (
                <button onClick={() => setStatusOf(o.number, "confirmed")} className="flex items-center gap-1 rounded-lg bg-primary-800 px-3 py-2 text-xs font-bold text-white">
                  <Check size={14} /> {t("confirmOrd")}
                </button>
              )}
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="rounded-2xl bg-white py-10 text-center font-bold text-ink-500">—</p>}
      </div>

      {detail && (
        <OrderDrawer
          order={all.find((o) => o.number === detail)!}
          onClose={() => { setDetail(null); clearOpen(); }}
          patch={patch}
        />
      )}
    </div>
  );
}

function OrderDrawer({ order: o, onClose, patch }: { order: Order; onClose: () => void; patch: (n: string, p: Partial<Order>) => void }) {
  const { t, locale } = useI18n();
  const { carriers } = useSettings();
  const [reason, setReason] = useState("");

  if (!o) return null;
  const w = WILAYAS.find((x) => x.code === o.wilaya);

  return (
    <div className="fixed inset-0 z-[130]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 end-0 top-0 w-full max-w-md overflow-auto bg-cream-50 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-primary-950">
            {t("orderDetails")} — <span dir="ltr">{o.number}</span>
          </h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-cream-200" aria-label="close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-white p-4 text-sm">
            <h4 className="mb-2 font-bold text-primary-900">{t("customerData")}</h4>
            <p><b>{t("fullName")}:</b> {o.name}</p>
            <p><b>{t("phone")}:</b> <bdi dir="ltr">{o.phone}</bdi></p>
            {o.phone2 && <p><b>{t("phone2")}:</b> <bdi dir="ltr">{o.phone2}</bdi></p>}
            <p><b>{t("wilaya")}:</b> {w ? (locale === "fr" ? w.fr : w.ar) : o.wilaya} — <b>{t("commune")}:</b> {o.commune}</p>
            <p><b>{t("deliveryType")}:</b> {o.deliveryType === "home" ? t("homeDelivery") : t("officeDelivery")} • <b>{t("carrierLabel")}:</b> {o.carrier ?? "—"}</p>
            {o.notes && <p><b>{t("notes")}:</b> {o.notes}</p>}
            {o.giftNote && <p><b>{t("giftNote")}:</b> {o.giftNote}</p>}
          </div>

          <div className="rounded-2xl bg-white p-4 text-sm">
            <h4 className="mb-2 font-bold text-primary-900">{t("orderSummary")}</h4>
            {o.items.map((it, i) => (
              <div key={i} className="flex justify-between gap-2 py-1">
                <span>{it.title} × {it.qty}</span>
                <b><Money value={it.price * it.qty} /></b>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-cream-200 pt-2 font-bold">
              <span>{t("codAmount")}</span>
              <span><Money value={orderTotal(o)} /></span>
            </div>
          </div>

          <div className="flex justify-center rounded-2xl bg-white p-4">
            <Barcode value={o.number} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">{t("changeStatus")}
              <select
                value={o.status}
                onChange={(e) => patch(o.number, { status: e.target.value as OrderStatus })}
                className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2.5 text-sm"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-bold">{t("carrierLabel")}
              <select
                value={o.carrier ?? carriers[0] ?? ""}
                onChange={(e) => patch(o.number, { carrier: e.target.value })}
                className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2.5 text-sm"
              >
                {carriers.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => printLabel(o, locale)} className="flex items-center justify-center gap-1 rounded-xl bg-primary-800 py-2.5 text-xs font-bold text-white">
              <Printer size={14} /> {t("labelBtn")}
            </button>
            <button onClick={() => printInvoice(o, locale)} className="flex items-center justify-center gap-1 rounded-xl bg-gold-500 py-2.5 text-xs font-bold text-primary-950">
              <Printer size={14} /> {t("invoiceBtn")}
            </button>
            {o.gift && (
              <button onClick={() => printGiftCard(o, locale)} className="flex items-center justify-center gap-1 rounded-xl border-2 border-gold-500 py-2.5 text-xs font-bold text-gold-700">
                <Gift size={14} /> {t("giftCardBtn")}
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("notes")}
              className="flex-1 rounded-xl border border-cream-300 px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={() => { patch(o.number, { status: "cancelled", notes: `${o.notes ?? ""} [${reason || t("cancelOrd")}]` }); onClose(); }}
              className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white"
            >
              {t("cancelOrd")} / Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeliveryManager({ all, q }: { all: Order[]; q: string }) {
  const { t, locale } = useI18n();
  const { deliveryOverrides, update, carriers, carrierKeys } = useSettings();
  const [sel, setSel] = useState<string[]>([]);
  const [rates, setRates] = useState<Record<string, { home: number; office: number }>>(deliveryOverrides);
  const [rateQ, setRateQ] = useState("");
  const [newCarrier, setNewCarrier] = useState("");
  const [keys, setKeys] = useState(carrierKeys);

  useEffect(() => setRates(deliveryOverrides), [deliveryOverrides]);
  useEffect(() => setKeys(carrierKeys), [carrierKeys]);

  const shippable = all.filter(
    (o) =>
      !["delivered", "returned", "cancelled"].includes(o.status) &&
      (!q || o.number.includes(q) || o.name.includes(q) || o.phone.includes(q))
  );
  const chosen = all.filter((o) => sel.includes(o.number));
  const pendingOrders = all.filter((o) => o.status === "pending" || o.status === "confirmed");

  const csv = () => {
    const rows = [
      ["number", "name", "phone", "phone2", "wilaya", "commune", "carrier", "type", "total"].join(","),
      ...chosen.map((o) =>
        [o.number, `"${o.name}"`, o.phone, o.phone2 ?? "", o.wilaya, `"${o.commune}"`, o.carrier ?? "", o.deliveryType, orderTotal(o)].join(",")
      ),
    ].join("\n");
    const blob = new Blob(["﻿" + rows], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bordereau.csv";
    a.click();
  };

  const wilayas = WILAYAS.filter(
    (w) => !rateQ || w.ar.includes(rateQ) || w.fr.toLowerCase().includes(rateQ.toLowerCase()) || String(w.code) === rateQ
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <h3 className="font-bold text-primary-950">{t("carrierLabel")}</h3>
        <div className="mt-3 space-y-3">
          {carriers.map((c) => {
            const k = keys[c] ?? { apiKey: "", secret: "", address: "", enabled: true };
            return (
              <div key={c} className="rounded-2xl bg-cream-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-primary-950">{c}</p>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs font-bold">
                      <input
                        type="checkbox"
                        checked={k.enabled}
                        onChange={() => {
                          const n = { ...keys, [c]: { ...k, enabled: !k.enabled } };
                          setKeys(n);
                          update({ carrierKeys: n });
                        }}
                        className="h-4 w-4 accent-primary-800"
                      />
                      {k.enabled ? t("inStock") : t("outOfStock")}
                    </label>
                    <button
                      onClick={() => {
                        update({ carriers: carriers.filter((x) => x !== c) });
                      }}
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                      aria-label="delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 grid gap-2 md:grid-cols-3">
                  <label className="text-xs font-bold" dir="ltr">API Key
                    <input value={k.apiKey} onChange={(e) => setKeys({ ...keys, [c]: { ...k, apiKey: e.target.value } })} onBlur={() => update({ carrierKeys: keys })} placeholder="sk_live_..." className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2 text-sm" />
                  </label>
                  <label className="text-xs font-bold" dir="ltr">Secret / Token
                    <input value={k.secret} onChange={(e) => setKeys({ ...keys, [c]: { ...k, secret: e.target.value } })} onBlur={() => update({ carrierKeys: keys })} placeholder="••••••" className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2 text-sm" />
                  </label>
                  <label className="text-xs font-bold" dir="ltr">Endpoint / Address
                    <input value={k.address} onChange={(e) => setKeys({ ...keys, [c]: { ...k, address: e.target.value } })} onBlur={() => update({ carrierKeys: keys })} placeholder="https://..." className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2 text-sm" />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const name = newCarrier.trim();
            if (!name || carriers.includes(name)) return;
            update({
              carriers: [...carriers, name],
              carrierKeys: { ...keys, [name]: { apiKey: "", secret: "", address: "", enabled: true } },
            });
            setNewCarrier("");
          }}
        >
          <input
            value={newCarrier}
            onChange={(e) => setNewCarrier(e.target.value)}
            placeholder="+ شركة شحن جديدة"
            className="flex-1 rounded-xl border border-cream-300 px-3 py-2.5 text-sm outline-none focus:border-gold-500"
          />
          <button className="flex items-center gap-1 rounded-xl bg-primary-800 px-4 py-2.5 text-sm font-bold text-white">
            <Plus size={15} /> {t("addNew")}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <h3 className="font-bold text-primary-950">{t("deliveryHub")} — {carriers.join(" • ")}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={csv} disabled={chosen.length === 0} className="flex items-center gap-1.5 rounded-full bg-primary-800 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40">
            <Download size={15} /> {t("exportCsv")} ({chosen.length})
          </button>
          <button onClick={() => printLabels(chosen, locale)} disabled={chosen.length === 0} className="flex items-center gap-1.5 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-primary-950 disabled:opacity-40">
            <Printer size={15} /> {t("printLabel")} ({chosen.length})
          </button>
          <button onClick={() => printPickList(pendingOrders, locale)} disabled={pendingOrders.length === 0} className="flex items-center gap-1.5 rounded-full border border-cream-300 px-5 py-2.5 text-sm font-bold text-primary-800 disabled:opacity-40">
            <Package size={15} /> {t("pickListBtn")}
          </button>
        </div>
        <div className="mt-4 max-h-72 space-y-2 overflow-auto">
          {shippable.map((o) => (
            <label key={o.number} className="flex cursor-pointer items-center gap-3 rounded-xl bg-cream-50 px-4 py-2.5 text-sm">
              <input
                type="checkbox"
                checked={sel.includes(o.number)}
                onChange={() =>
                  setSel((s) => (s.includes(o.number) ? s.filter((x) => x !== o.number) : [...s, o.number]))
                }
                className="h-5 w-5 accent-primary-800"
              />
              <span className="font-bold" dir="ltr">{o.number}</span>
              <span>{o.name}</span>
              <span className="text-ink-500">{WILAYAS.find((w) => w.code === o.wilaya)?.ar}</span>
              <b className="ms-auto"><Money value={orderTotal(o)} /></b>
            </label>
          ))}
          {shippable.length === 0 && <p className="py-6 text-center text-ink-500">—</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-primary-950">{t("ratesBtn")} (58)</h3>
          <div className="flex gap-2">
            <input
              value={rateQ}
              onChange={(e) => setRateQ(e.target.value)}
              placeholder={t("quickSearch")}
              className="rounded-xl border border-cream-300 px-3 py-2 text-sm outline-none"
            />
            <button onClick={() => update({ deliveryOverrides: rates })} className="flex items-center gap-1 rounded-full bg-primary-800 px-4 py-2 text-xs font-bold text-white">
              <Save size={14} /> {t("saveChanges")}
            </button>
            <button onClick={() => { setRates({}); update({ deliveryOverrides: {} }); }} className="rounded-full border border-cream-300 px-4 py-2 text-xs font-bold">
              Reset
            </button>
          </div>
        </div>
        <div className="mt-3 grid max-h-96 gap-2 overflow-auto md:grid-cols-2">
          {wilayas.map((w) => {
            const r = rates[String(w.code)] ?? { home: 0, office: 0 };
            return (
              <div key={w.code} className="flex items-center gap-2 rounded-xl bg-cream-50 px-3 py-2 text-sm">
                <span className="w-32 shrink-0 truncate font-bold">{w.code} — {locale === "fr" ? w.fr : w.ar}</span>
                <label className="flex flex-1 items-center gap-1 text-xs">{t("homeDelivery")}
                  <input type="number" value={r.home || ""} placeholder="—" onChange={(e) => setRates({ ...rates, [w.code]: { ...r, home: Number(e.target.value) } })} className="w-full rounded-lg border border-cream-300 px-2 py-1" />
                </label>
                <label className="flex flex-1 items-center gap-1 text-xs">{t("officeDelivery")}
                  <input type="number" value={r.office || ""} placeholder="—" onChange={(e) => setRates({ ...rates, [w.code]: { ...r, office: Number(e.target.value) } })} className="w-full rounded-lg border border-cream-300 px-2 py-1" />
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BundlesManager() {
  const { t, locale } = useI18n();
  const { bundlePrices, update } = useSettings();
  const { products, customBundles, saveCustomBundles, findBook } = useStore();
  const [prices, setPrices] = useState<Record<string, number>>(bundlePrices);
  const [showAdd, setShowAdd] = useState(false);
  const [nb, setNb] = useState({ title: "", desc: "", price: 2000, gift: false, books: [] as string[] });

  useEffect(() => setPrices(bundlePrices), [bundlePrices]);

  const toggleBook = (slug: string) =>
    setNb((p) => ({
      ...p,
      books: p.books.includes(slug) ? p.books.filter((s) => s !== slug) : [...p.books, slug],
    }));

  const createBundle = () => {
    if (!nb.title.trim() || nb.books.length === 0) return;
    saveCustomBundles([
      ...customBundles,
      {
        slug: `custom-${Date.now()}`,
        title: { ar: nb.title, fr: nb.title, en: nb.title },
        desc: { ar: nb.desc, fr: nb.desc, en: nb.desc },
        books: nb.books,
        price: nb.price,
        hue: 150,
        gift: nb.gift,
      },
    ]);
    setNb({ title: "", desc: "", price: 2000, gift: false, books: [] });
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowAdd((s) => !s)}
        className="flex items-center gap-1.5 rounded-full bg-primary-800 px-5 py-2.5 text-sm font-bold text-white"
      >
        <Plus size={15} /> {t("addNew")} — {t("offersHub")}
      </button>

      {showAdd && (
        <div className="rounded-2xl border-2 border-dashed border-gold-500 bg-white p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <input value={nb.title} onChange={(e) => setNb({ ...nb, title: e.target.value })} placeholder="اسم البوكس *" className="rounded-xl border border-cream-300 px-3 py-2.5 text-sm outline-none focus:border-gold-500" />
            <input value={nb.desc} onChange={(e) => setNb({ ...nb, desc: e.target.value })} placeholder="وصف مختصر" className="rounded-xl border border-cream-300 px-3 py-2.5 text-sm outline-none focus:border-gold-500" />
            <input type="number" value={nb.price} onChange={(e) => setNb({ ...nb, price: Number(e.target.value) })} placeholder="السعر" className="rounded-xl border border-cream-300 px-3 py-2.5 text-sm outline-none focus:border-gold-500" />
            <label className="flex items-center gap-2 rounded-xl border border-cream-300 px-3 py-2.5 text-sm font-bold">
              <input type="checkbox" checked={nb.gift} onChange={(e) => setNb({ ...nb, gift: e.target.checked })} className="h-5 w-5 accent-primary-800" />
              {t("giftWrap")}
            </label>
          </div>
          <p className="mt-3 text-xs font-bold text-ink-500">{t("bundleIncludes")} ({nb.books.length}):</p>
          <div className="mt-2 grid max-h-56 gap-1.5 overflow-auto md:grid-cols-2">
            {products.map((b) => (
              <label key={b.slug} className="flex cursor-pointer items-center gap-2 rounded-xl bg-cream-50 px-3 py-2 text-sm">
                <input type="checkbox" checked={nb.books.includes(b.slug)} onChange={() => toggleBook(b.slug)} className="h-4 w-4 accent-primary-800" />
                <span className="truncate font-semibold">{b.title}</span>
              </label>
            ))}
          </div>
          <button onClick={createBundle} disabled={!nb.title.trim() || nb.books.length === 0} className="mt-3 rounded-2xl bg-gold-500 px-8 py-2.5 text-sm font-bold text-primary-950 disabled:opacity-40">
            {t("save")}
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
      {BUNDLES.map((b) => (
        <div key={b.slug} className="rounded-2xl border border-cream-300 bg-white p-5">
          <h3 className="font-display text-xl font-bold text-primary-950">{b.title[locale as Locale]}</h3>
          <p className="text-sm text-ink-500">{b.desc[locale as Locale]}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {b.books.map((s) => {
              const bk = findBook(s);
              return <li key={s} className="text-ink-700">• {bk?.title ?? s}</li>;
            })}
          </ul>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              value={prices[b.slug] ?? b.price}
              onChange={(e) => setPrices({ ...prices, [b.slug]: Number(e.target.value) })}
              className="w-32 rounded-xl border border-cream-300 px-3 py-2 text-sm font-bold"
            />
            <span className="text-sm font-bold text-primary-800">{t("da")}</span>
            <button
              onClick={() => update({ bundlePrices: prices })}
              className="flex items-center gap-1 rounded-full bg-primary-800 px-4 py-2 text-xs font-bold text-white"
            >
              <Save size={13} /> {t("save")}
            </button>
          </div>
        </div>
      ))}
      {customBundles.map((b) => (
        <div key={b.slug} className="rounded-2xl border-2 border-gold-500/60 bg-white p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-xl font-bold text-primary-950">{b.title[locale as Locale]}</h3>
            <button
              onClick={() => saveCustomBundles(customBundles.filter((x) => x.slug !== b.slug))}
              className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
              aria-label="delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
          <p className="text-sm text-ink-500">{b.desc[locale as Locale]}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {b.books.map((s) => {
              const bk = findBook(s);
              return <li key={s} className="text-ink-700">• {bk?.title ?? s}</li>;
            })}
          </ul>
          <p className="mt-3 text-lg font-bold text-primary-800"><Money value={b.price} /></p>
        </div>
      ))}
      </div>
    </div>
  );
}

function CustomersManager() {
  const { t, locale } = useI18n();
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [alerts, setAlerts] = useState<Array<{ slug: string; phone: string }>>([]);
  const [form, setForm] = useState({ name: "", wilaya: "", text: "" });

  useEffect(() => {
    try {
      const r = localStorage.getItem("sitr-reviews");
      if (r) setReviews(JSON.parse(r));
      setAlerts(JSON.parse(localStorage.getItem("sitr-alerts") ?? "[]"));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("sitr-reviews", JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <h3 className="flex items-center gap-2 font-bold text-primary-950">
          <Star size={16} className="text-gold-500" /> {t("testimonialsTitle")} ({reviews.length})
        </h3>
        <form
          className="mt-3 grid gap-2 rounded-2xl bg-cream-50 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name || !form.text) return;
            setReviews([
              { name: { ar: form.name, fr: form.name, en: form.name }, wilaya: form.wilaya || "—", text: { ar: form.text, fr: form.text, en: form.text }, rating: 5 },
              ...reviews,
            ]);
            setForm({ name: "", wilaya: "", text: "" });
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="الاسم" className="rounded-xl border border-cream-300 px-3 py-2 text-sm" />
            <input value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })} placeholder="الولاية" className="rounded-xl border border-cream-300 px-3 py-2 text-sm" />
          </div>
          <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="نص الرأي" rows={2} className="rounded-xl border border-cream-300 px-3 py-2 text-sm" />
          <button className="rounded-xl bg-gold-500 py-2 text-sm font-bold text-primary-950"><Plus size={14} className="inline" /> {t("save")}</button>
        </form>
        <div className="mt-3 max-h-80 space-y-2 overflow-auto">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-xl bg-cream-50 p-3 text-sm">
              <p className="font-bold">{r.name[locale]} <span className="font-normal text-ink-500">— {r.wilaya}</span></p>
              <p className="mt-1 text-ink-700">{r.text[locale]}</p>
              <button onClick={() => setReviews((x) => x.filter((_, j) => j !== i))} className="mt-1 text-xs font-bold text-red-600">{t("remove")}</button>
            </div>
          ))}
        </div>
      </div>
      <div className="h-fit rounded-2xl border border-cream-300 bg-white p-5">
        <h3 className="font-bold text-primary-950">
          {locale === "ar" ? "تنبيهات توفر المنتج" : "Alertes stock"} ({alerts.length})
        </h3>
        <div className="mt-3 space-y-2 text-sm">
          {alerts.map((a, i) => (
            <div key={i} className="flex justify-between rounded-xl bg-cream-50 px-3 py-2">
              <span className="font-bold">{BOOKS.find((b) => b.slug === a.slug)?.title ?? a.slug}</span>
              <span dir="ltr">{a.phone}</span>
            </div>
          ))}
          {alerts.length === 0 && <p className="text-ink-500">—</p>}
        </div>
      </div>
    </div>
  );
}

function PagesManager() {
  const { t, locale } = useI18n();
  const s = useSettings();
  const [about, setAbout] = useState(s.about);
  const [terms, setTerms] = useState(s.terms);
  const [faq, setFaq] = useState(s.faq);

  useEffect(() => {
    setAbout(s.about);
    setTerms(s.terms);
    setFaq(s.faq);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locales: Locale[] = ["ar", "fr", "en"];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <h3 className="font-bold text-primary-950">{t("linkAbout")}</h3>
        {locales.map((l) => (
          <div key={l} className="mt-2">
            <p className="text-xs font-bold text-ink-500">{l.toUpperCase()}</p>
            <textarea value={about[l]} onChange={(e) => setAbout({ ...about, [l]: e.target.value })} rows={l === "ar" ? 6 : 3} className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2 text-sm leading-relaxed" />
          </div>
        ))}
        <button onClick={() => s.update({ about })} className="mt-3 flex items-center gap-1 rounded-full bg-primary-800 px-5 py-2 text-xs font-bold text-white">
          <Save size={13} /> {t("saveChanges")}
        </button>
      </div>

      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <h3 className="font-bold text-primary-950">{t("linkTerms")}</h3>
        {locales.map((l) => (
          <div key={l} className="mt-2">
            <p className="text-xs font-bold text-ink-500">{l.toUpperCase()}</p>
            <textarea value={terms[l]} onChange={(e) => setTerms({ ...terms, [l]: e.target.value })} rows={l === "ar" ? 6 : 3} className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2 text-sm leading-relaxed" />
          </div>
        ))}
        <button onClick={() => s.update({ terms })} className="mt-3 flex items-center gap-1 rounded-full bg-primary-800 px-5 py-2 text-xs font-bold text-white">
          <Save size={13} /> {t("saveChanges")}
        </button>
      </div>

      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-primary-950">{t("navFaq")} ({faq.length})</h3>
          <button
            onClick={() => setFaq([...faq, { q: { ar: "", fr: "", en: "" }, a: { ar: "", fr: "", en: "" } }])}
            className="flex items-center gap-1 rounded-full bg-gold-500 px-4 py-2 text-xs font-bold text-primary-950"
          >
            <Plus size={13} /> {t("addNew")}
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {faq.map((f, i) => (
            <div key={i} className="rounded-2xl bg-cream-50 p-3">
              <div className="grid gap-2 md:grid-cols-2">
                <input value={f.q.ar} onChange={(e) => { const n = [...faq]; n[i] = { ...f, q: { ...f.q, ar: e.target.value } }; setFaq(n); }} placeholder="السؤال (عربي)" className="rounded-xl border border-cream-300 px-3 py-2 text-sm font-bold" />
                <input value={f.q.fr} onChange={(e) => { const n = [...faq]; n[i] = { ...f, q: { ...f.q, fr: e.target.value } }; setFaq(n); }} placeholder="Question (FR)" className="rounded-xl border border-cream-300 px-3 py-2 text-sm" />
              </div>
              <textarea value={f.a.ar} onChange={(e) => { const n = [...faq]; n[i] = { ...f, a: { ...f.a, ar: e.target.value } }; setFaq(n); }} placeholder="الجواب (عربي)" rows={2} className="mt-2 w-full rounded-xl border border-cream-300 px-3 py-2 text-sm" />
              <div className="mt-2 flex gap-2">
                <button onClick={() => s.update({ faq })} className="rounded-full bg-primary-800 px-4 py-1.5 text-xs font-bold text-white">{t("save")}</button>
                <button onClick={() => { const n = faq.filter((_, j) => j !== i); setFaq(n); s.update({ faq: n }); }} className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-bold text-red-600">{t("remove")}</button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-500">{locale === "ar" ? "تلميح: املأ العربية أساسا، والفرنسية والإنجليزية عند الإمكان." : "Tip: fill Arabic first."}</p>
      </div>
    </div>
  );
}

function SettingsManager() {
  const { t } = useI18n();
  const s = useSettings();
  const [f, setF] = useState({
    phone: s.phone,
    phoneDisplay: s.phoneDisplay,
    tiktok: s.tiktok,
    instagram: s.instagram,
    announcement: s.announcement,
    announcement2: s.announcement2,
  });
  const [audit, setAudit] = useState(() => readAudit().slice(0, 50));

  const inp = "w-full rounded-xl border border-cream-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold-500";

  return (
    <div className="max-w-2xl space-y-4">
      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <h3 className="font-bold text-primary-950">{t("footerContact")}</h3>
        <div className="mt-3 grid gap-3">
          <label className="text-xs font-bold">Tel (tel:)<input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} dir="ltr" className={inp} /></label>
          <label className="text-xs font-bold">Display<input value={f.phoneDisplay} onChange={(e) => setF({ ...f, phoneDisplay: e.target.value })} dir="ltr" className={inp} /></label>
          <label className="text-xs font-bold">TikTok<input value={f.tiktok} onChange={(e) => setF({ ...f, tiktok: e.target.value })} dir="ltr" className={inp} /></label>
          <label className="text-xs font-bold">Instagram<input value={f.instagram} onChange={(e) => setF({ ...f, instagram: e.target.value })} dir="ltr" className={inp} /></label>
        </div>
      </div>
      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <h3 className="font-bold text-primary-950">Announcement bar</h3>
        {(["ar", "fr", "en"] as Locale[]).map((l) => (
          <div key={l} className="mt-2 grid gap-2 md:grid-cols-2">
            <input value={f.announcement[l]} onChange={(e) => setF({ ...f, announcement: { ...f.announcement, [l]: e.target.value } })} placeholder={`run 1 — ${l}`} className={inp} />
            <input value={f.announcement2[l]} onChange={(e) => setF({ ...f, announcement2: { ...f.announcement2, [l]: e.target.value } })} placeholder={`run 2 — ${l}`} className={inp} />
          </div>
        ))}
      </div>
      <button
        onClick={() => s.update(f)}
        className="flex items-center gap-1.5 rounded-2xl bg-primary-800 px-8 py-3 font-bold text-white"
      >
        <Save size={16} /> {t("saveChanges")}
      </button>
      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-primary-950">Activity log</h3>
          <button
            onClick={() => {
              clearAudit();
              setAudit([]);
            }}
            className="text-xs font-bold text-red-600 hover:text-red-700"
          >
            Clear
          </button>
        </div>
        <ul className="mt-3 max-h-64 space-y-1 overflow-auto text-xs text-ink-700" dir="ltr">
          {audit.length === 0 && <li className="text-ink-500">No entries</li>}
          {audit.map((e, i) => (
            <li key={i} className="rounded-lg bg-cream-50 px-2 py-1.5">
              <b>{new Date(e.at).toLocaleString()}</b> — {e.who}: {e.action}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
