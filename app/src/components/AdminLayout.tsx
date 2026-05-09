import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  BarChart3,
  ShieldAlert,
  Settings,
  LogOut,
  FileText,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/products", icon: Package, label: "Products" },
  { path: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { path: "/admin/landing", icon: FileText, label: "Landing Pages" },
  { path: "/admin/shipping", icon: Truck, label: "Shipping" },
  { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/admin/fraud", icon: ShieldAlert, label: "Anti-Fraud" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout() {
  const { user, isLoading, logout } = useAuth({ redirectOnUnauthenticated: true });
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#E2E8F0]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-[#0F1629] border-l border-[#1E2D52] z-40 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-[#1E2D52]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">Walky DZ</h1>
              <p className="text-xs text-[#64748B]">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-right",
                  isActive
                    ? "bg-blue-500/10 text-blue-400 border-r-2 border-blue-500"
                    : "text-[#94A3B8] hover:bg-[#1A2744] hover:text-[#E2E8F0]"
                )}
              >
                <item.icon size={18} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#1E2D52]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name ?? "Admin"}</p>
              <p className="text-xs text-[#64748B]">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mr-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
