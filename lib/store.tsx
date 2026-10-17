"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BOOKS, Book, Bundle, Coupon, COUPONS, Order } from "./data";
import { logAudit } from "./audit";

export interface CartLine {
  slug: string;
  qty: number;
}

interface StoreCtx {
  cart: CartLine[];
  addToCart: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  isWished: (slug: string) => boolean;
  coupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  couponError: boolean;
  orders: Order[];
  placeOrder: (o: Order) => void;
  updateOrder: (number: string, patch: Partial<Order>) => void;
  findOrders: (q: string) => Order[];
  toast: string | null;
  notify: (msg: string) => void;
  products: Book[];
  saveProducts: (list: Book[]) => void;
  findBook: (slug: string) => Book | undefined;
  customBundles: Bundle[];
  saveCustomBundles: (list: Bundle[]) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<Book[]>(BOOKS);
  const [customBundles, setCustomBundles] = useState<Bundle[]>([]);

  useEffect(() => {
    setCart(load("sitr-cart", []));
    setWishlist(load("sitr-wish", []));
    setOrders(load("sitr-orders", []));
    const adminProducts = load<Book[] | null>("sitr-admin-products", null);
    if (adminProducts && Array.isArray(adminProducts) && adminProducts.length > 0)
      setProducts(adminProducts);
    const adminBundles = load<Bundle[] | null>("sitr-custom-bundles", null);
    if (adminBundles && Array.isArray(adminBundles)) setCustomBundles(adminBundles);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("sitr-cart", JSON.stringify(cart));
  }, [cart, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem("sitr-wish", JSON.stringify(wishlist));
  }, [wishlist, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem("sitr-orders", JSON.stringify(orders));
  }, [orders, ready]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const addToCart = useCallback(
    (slug: string, qty = 1) => {
      setCart((c) => {
        const f = c.find((l) => l.slug === slug);
        if (f)
          return c.map((l) =>
            l.slug === slug ? { ...l, qty: Math.min(99, l.qty + qty) } : l
          );
        return [...c, { slug, qty }];
      });
    },
    []
  );

  const setQty = useCallback((slug: string, qty: number) => {
    setCart((c) =>
      qty <= 0
        ? c.filter((l) => l.slug !== slug)
        : c.map((l) => (l.slug === slug ? { ...l, qty } : l))
    );
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setCart((c) => c.filter((l) => l.slug !== slug));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCoupon(null);
  }, []);

  const toggleWish = useCallback((slug: string) => {
    setWishlist((w) =>
      w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug]
    );
  }, []);

  const isWished = useCallback(
    (slug: string) => wishlist.includes(slug),
    [wishlist]
  );

  const applyCoupon = useCallback(
    (code: string) => {
      const c = COUPONS.find(
        (x) => x.code === code.trim().toUpperCase()
      );
      const subtotal = cart.reduce(
        (s, l) =>
          s +
          (products.find((b) => b.slug === l.slug)?.price ??
            BOOKS.find((b) => b.slug === l.slug)?.price ??
            0) *
            l.qty,
        0
      );
      if (c && subtotal >= c.min) {
        setCoupon(c);
        setCouponError(false);
        return true;
      }
      setCouponError(true);
      return false;
    },
    [cart, products]
  );

  const placeOrder = useCallback((o: Order) => {
    setOrders((os) => [o, ...os]);
  }, []);

  const updateOrder = useCallback((number: string, patch: Partial<Order>) => {
    setOrders((os) =>
      os.map((o) => (o.number === number ? { ...o, ...patch } : o))
    );
    logAudit(`order ${number}: ${Object.keys(patch).join(", ")}`);
  }, []);

  const findOrders = useCallback(
    (q: string) => {
      const needle = q.trim();
      if (!needle) return [];
      return orders.filter(
        (o) => o.number === needle || o.phone.replace(/\s/g, "") === needle.replace(/\s/g, "")
      );
    },
    [orders]
  );

  const cartCount = useMemo(
    () => cart.reduce((s, l) => s + l.qty, 0),
    [cart]
  );
  const cartSubtotal = useMemo(
    () =>
      cart.reduce(
        (s, l) =>
          s +
          (products.find((b) => b.slug === l.slug)?.price ??
            BOOKS.find((b) => b.slug === l.slug)?.price ??
            0) *
            l.qty,
        0
      ),
    [cart, products]
  );

  const saveProducts = useCallback((list: Book[]) => {
    setProducts(list);
    try {
      localStorage.setItem("sitr-admin-products", JSON.stringify(list));
    } catch {}
    logAudit(`products saved (${list.length})`);
  }, []);

  const findBook = useCallback(
    (slug: string) =>
      products.find((b) => b.slug === slug) ?? BOOKS.find((b) => b.slug === slug),
    [products]
  );

  const saveCustomBundles = useCallback((list: Bundle[]) => {
    setCustomBundles(list);
    try {
      localStorage.setItem("sitr-custom-bundles", JSON.stringify(list));
    } catch {}
    logAudit(`bundles saved (${list.length})`);
  }, []);

  const value: StoreCtx = {
    cart,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    wishlist,
    toggleWish,
    isWished,
    coupon,
    applyCoupon,
    couponError,
    orders,
    placeOrder,
    updateOrder,
    findOrders,
    toast,
    notify: showToast,
    products,
    saveProducts,
    findBook,
    customBundles,
    saveCustomBundles,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside provider");
  return v;
}

export function useToast() {
  const { toast } = useStore();
  return toast;
}
