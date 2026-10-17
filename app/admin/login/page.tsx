"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AdminLoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpVerified, setTotpVerified] = useState(false);
  const [step, setStep] = useState<"password" | "otp">("password");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/totp")
      .then((r) => r.json())
      .then((d: { enabled: boolean; verified: boolean }) => {
        if (!alive) return;
        setTotpEnabled(d.enabled);
        setTotpVerified(d.verified);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      if (totpEnabled && !totpVerified) setStep("otp");
      else router.replace("/admin");
    }
  }, [status, totpEnabled, totpVerified, router]);

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpBusy(true);
    setOtpError(false);
    try {
      const r = await fetch("/api/auth/totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp }),
      });
      const d = await r.json();
      if (d.ok) {
        router.push("/admin");
      } else {
        setOtpError(true);
      }
    } catch {
      setOtpError(true);
    }
    setOtpBusy(false);
  };

  if (step === "otp") {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-3xl border border-cream-300 bg-white p-8 shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-800 text-gold-300">
            <ShieldCheck size={30} />
          </span>
          <h1 className="font-display mt-4 text-center text-2xl font-bold text-primary-950">
            {t("otpTitle")}
          </h1>
          <p className="mt-2 text-center text-sm text-ink-500">{t("otpSub")}</p>
          <form onSubmit={submitOtp} className="mt-6 space-y-4">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              dir="ltr"
              className="w-full rounded-xl border-2 border-cream-300 bg-cream-50 py-4 text-center text-2xl font-bold tracking-[0.4em] outline-none focus:border-gold-500"
            />
            {otpError && (
              <p className="text-center text-sm font-bold text-red-600">
                {t("otpBad")}
              </p>
            )}
            <button
              type="submit"
              disabled={otpBusy || otp.replace(/\D/g, "").length !== 6}
              className="w-full rounded-2xl bg-primary-800 py-3.5 font-bold text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {otpBusy ? "..." : t("login")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-cream-300 bg-white p-8 shadow-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-800 text-gold-300">
          <KeyRound size={30} />
        </span>
        <h1 className="font-display mt-4 text-center text-2xl font-bold text-primary-950">
          {t("adminLogin")}
        </h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(false);
            const res = await signIn("credentials", {
              email,
              password,
              redirect: false,
            });
            setLoading(false);
            if (res?.ok) {
              try {
                const d = await fetch("/api/auth/totp").then((r) => r.json());
                setTotpEnabled(Boolean(d.enabled));
                setTotpVerified(Boolean(d.verified));
                if (d.enabled && !d.verified) setStep("otp");
                else router.push("/admin");
              } catch {
                router.push("/admin");
              }
            } else {
              setError(true);
            }
          }}
        >
          <div className="relative">
            <Mail size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
              type="email"
              dir="ltr"
              autoComplete="username"
              className="w-full rounded-xl border border-cream-300 bg-cream-50 py-3 pe-3 ps-9 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div className="relative">
            <KeyRound size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password")}
              type="password"
              dir="ltr"
              autoComplete="current-password"
              className="w-full rounded-xl border border-cream-300 bg-cream-50 py-3 pe-3 ps-9 text-sm outline-none focus:border-gold-500"
            />
          </div>
          {error && (
            <p className="text-center text-sm font-bold text-red-600">
              {t("verifyBad")}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary-800 py-3.5 font-bold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "..." : t("login")}
          </button>
        </form>
      </div>
    </div>
  );
}
