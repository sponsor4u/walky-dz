import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: { default: "Walky DZ - Algeria COD Ecommerce", template: "%s | Walky DZ" },
  description: "أفضل المنتجات بأفضل الأسعار في الجزائر. توصيل سريع لجميع الولايات. الدفع عند الاستلام.",
  keywords: ["جزائر", "تسوق", "COD", "الدفع عند الاستلام", "منتجات", "توصيل"],
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    siteName: "Walky DZ",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0F1E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={inter.variable} suppressHydrationWarning>
      <body className="bg-[#0A0F1E] text-[#E2E8F0] antialiased">
        {children}
      </body>
    </html>
  );
}
