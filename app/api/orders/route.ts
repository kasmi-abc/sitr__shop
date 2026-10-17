import { NextRequest, NextResponse } from "next/server";
import { getDb, orders } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/ratelimit";

function badOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = req.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

export async function POST(req: NextRequest) {
  if (badOrigin(req)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const ip = clientIp(req.headers);
  if (!rateLimit(`order-post:${ip}`, 10, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  try {
    const body = await req.json();
    const db = await getDb();
    if (db) {
      await db.insert(orders).values({
        number: body.number,
        name: body.name,
        phone: body.phone,
        wilaya: body.wilaya,
        commune: body.commune ?? "",
        deliveryType: body.deliveryType ?? "home",
        items: JSON.stringify(body.items ?? []),
        subtotal: body.subtotal ?? 0,
        discount: body.discount ?? 0,
        deliveryFee: body.deliveryFee ?? 0,
        status: "pending",
        otp: body.otp ?? "0000",
        verified: false,
      });
      return NextResponse.json({ ok: true, stored: "neon" });
    }
    return NextResponse.json({ ok: true, stored: "local" });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ orders: [] }, { status: 401 });
  }
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const db = await getDb();
  if (!db || !q) return NextResponse.json({ orders: [] });
  try {
    const { eq, or } = await import("drizzle-orm");
    const rows = await db
      .select()
      .from(orders)
      .where(or(eq(orders.number, q), eq(orders.phone, q)));
    return NextResponse.json({ orders: rows });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}
