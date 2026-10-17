function hex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  return hex(sig);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const TOTP_COOKIE = "sitr-totp";

export async function totpCookieValue(
  exp: number,
  secret: string
): Promise<string> {
  const sig = await hmac(secret, `sitr-totp:${exp}`);
  return `${exp}.${sig}`;
}

export async function verifyTotpCookie(
  value: string | undefined,
  secret: string
): Promise<boolean> {
  if (!value || !secret) return false;
  const [expStr, sig] = value.split(".");
  const exp = Number(expStr);
  if (!exp || Number.isNaN(exp) || Date.now() > exp) return false;
  const expected = await hmac(secret, `sitr-totp:${exp}`);
  return safeEqual(sig ?? "", expected);
}
