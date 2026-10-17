import { Cairo, Amiri } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { StoreProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";
import { SettingsProvider } from "@/lib/settings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import PageTitle from "@/components/PageTitle";
import AuthProvider from "@/components/AuthProvider";
import CookieConsent from "@/components/CookieConsent";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: "ستر شوب | Sitr Shop — علمٌ يُهدى وسترٌ يُقرّب",
  description:
    "ستر شوب — متجر نسائي للكتب الشرعية والقفازات. توصيل سريع لجميع الولايات والدفع عند الاستلام.",
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/logo.jpg" },
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    siteName: "Sitr Shop",
    title: "ستر شوب | Sitr Shop",
    description:
      "متجر نسائي للكتب الشرعية والقفازات — الدفع عند الاستلام وتوصيل جميع الولايات.",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Sitr Shop" }],
  },
  twitter: {
    card: "summary",
    title: "ستر شوب | Sitr Shop",
    description: "الكتب الشرعية والقفازات — الدفع عند الاستلام.",
    images: ["/logo.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#5b1230",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${amiri.variable} flex min-h-full flex-col antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <SettingsProvider>
                <StoreProvider>
                  <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-[100] focus:rounded-xl focus:bg-primary-800 focus:px-4 focus:py-2 focus:text-white"
                  >
                    تخطي إلى المحتوى
                  </a>
                  <PageTitle />
                  <Header />
                  <main id="main" className="flex-1">
                    {children}
                  </main>
                  <Footer />
                  <Toast />
                  <CookieConsent />
                </StoreProvider>
              </SettingsProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
