"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSupabase } from "@/client/providers/supabase-provider";
import { TRPCProvider } from "@/client/providers/trpc-provider";
import { Button } from "@/client/components/ui/button";
import { cn } from "@/client/lib/utils";
import {
  LayoutDashboard, Package, ShoppingCart, Truck, BarChart3,
  Shield, Megaphone, Settings, ChevronLeft, Menu, X, LogOut
} from "lucide-react";

const menuItems = [
  { label: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
  { label: "المنتجات", href: "/dashboard/products", icon: Package },
  { label: "الطلبات", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "صفحات الهبوط", href: "/dashboard/landing-pages", icon: Megaphone },
  { label: "الشحن", href: "/dashboard/shipping", icon: Truck },
  { label: "التحليلات", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "مكافحة الاحتيال", href: "/dashboard/fraud", icon: Shield },
  { label: "الإعدادات", href: "/dashboard/settings", icon: Settings },
];

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, signOut } = useSupabase();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#141D35] border-b border-[#1E2D52] h-14 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="text-white font-bold">Walky DZ</span>
        <div className="w-6" />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed right-0 top-0 z-50 h-full w-64 bg-[#0F1629] border-l border-[#1E2D52] transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "translate-x-full",
        "lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-[#1E2D52]">
          <h1 className="text-xl font-bold text-white">Walky DZ</h1>
          <p className="text-xs text-slate-400 mt-1">لوحة التحكم</p>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-[#1A2744] hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {isActive && <ChevronLeft className="w-4 h-4 mr-auto" />}
              </a>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1E2D52]">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {user.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-[#1A2744]" onClick={signOut}>
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-64 min-h-screen">
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <DashboardContent>{children}</DashboardContent>
    </TRPCProvider>
  );
}
