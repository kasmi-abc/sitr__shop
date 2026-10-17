import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyTotp } from "@/lib/totp";
import { totpCookieValue, verifyTotpCookie } from "@/lib/totpCookie";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export async function GET() {
  const enabled = Boolean(process.env.ADMIN_TOTP_SECRET);
  let verified = false;
  if (enabled) {
    const store = await cookies();
    verified = await verifyTotpCookie(
      store.get("sitr-totp")?.value,
      process.env.NEXTAUTH_SECRET ?? ""
    );
  }
  return NextResponse.json({ enabled, verified });
}

export async function POST(req: NextRequest) {
  const secret = process.env.ADMIN_TOTP_SECRET;
  if (!secret) return NextResponse.json({ ok: true, required: false });

  const ip = clientIp(req.headers);
  if (!rateLimit(`totp:${ip}`, 10, 60_000)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  }

  const body = await req.json().catch(() => ({ code: "" }));
  const code = String(body.code ?? "");
  if (!verifyTotp(secret, code)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const exp = Date.now() + 12 * 3600 * 1000;
  const value = await totpCookieValue(exp, process.env.NEXTAUTH_SECRET ?? "");
  const secure = (process.env.NEXTAUTH_URL ?? "").startsWith("https");
  const res = NextResponse.json({ ok: true });
  res.cookies.set("sitr-totp", value, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 12 * 3600,
  });
  return res;
}
