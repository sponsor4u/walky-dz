import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { TRPCProvider } from "@/client/providers/trpc-provider";
import { SupabaseProvider } from "@/client/providers/supabase-provider";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Walky DZ - Algeria COD Ecommerce", template: "%s | Walky DZ" },
  description: "أفضل المنتجات بأفضل الأسعار في الجزائر. توصيل سريع لجميع الولايات. الدفع عند الاستلام.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={inter.variable} suppressHydrationWarning>
      <body className="bg-[#0A0F1E] text-[#E2E8F0] antialiased">
        <SupabaseProvider>
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
