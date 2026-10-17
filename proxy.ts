import { NextRequest, NextResponse } from "next/server";
import { verifyTotpCookie } from "@/lib/totpCookie";

function hasSession(req: NextRequest): boolean {
  return Boolean(
    req.cookies.get("next-auth.session-token") ??
      req.cookies.get("__Secure-next-auth.session-token")
  );
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!hasSession(req)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (process.env.ADMIN_TOTP_SECRET) {
      const ok = await verifyTotpCookie(
        req.cookies.get("sitr-totp")?.value,
        process.env.NEXTAUTH_SECRET ?? ""
      );
      if (!ok) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
