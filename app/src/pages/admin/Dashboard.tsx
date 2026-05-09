import { trpc } from "@/providers/trpc";
import {
  ShoppingBag,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

const statCards = [
  { key: "orders", icon: ShoppingBag, label: "Total Orders", color: "from-pink-500 to-rose-500", path: "/admin/orders" },
  { key: "products", icon: Package, label: "Products", color: "from-blue-500 to-cyan-500", path: "/admin/products" },
  { key: "revenue", icon: DollarSign, label: "Total Revenue", color: "from-green-500 to-teal-500", path: "/admin/analytics" },
  { key: "customers", icon: Users, label: "Active Customers", color: "from-amber-500 to-orange-500", path: "/admin/analytics" },
];

const quickActions = [
  { label: "Add Product", path: "/admin/products", color: "bg-blue-600 hover:bg-blue-700" },
  { label: "View Orders", path: "/admin/orders", color: "bg-emerald-600 hover:bg-emerald-700" },
  { label: "Create Landing", path: "/admin/landing", color: "bg-purple-600 hover:bg-purple-700" },
  { label: "Manage Shipping", path: "/admin/shipping", color: "bg-cyan-600 hover:bg-cyan-700" },
];

const statusColors: Record<string, string> = {
  new: "bg-blue-500",
  confirmed: "bg-teal-500",
  shipping: "bg-amber-500",
  delivered: "bg-green-500",
  returned: "bg-orange-500",
  cancelled: "bg-red-500",
};

const statusLabels: Record<string, string> = {
  new: "New",
  confirmed: "Confirmed",
  shipping: "Shipping",
  delivered: "Delivered",
  returned: "Returned",
  cancelled: "Cancelled",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: stats } = trpc.analytics.dashboard.useQuery({ days: 30 });
  const { data: ordersData } = trpc.order.list.useQuery({ limit: 5 });
  const { data: productsData } = trpc.product.list.useQuery({ limit: 5 });

  const statusCounts: Record<string, number> = {};
  stats?.statusBreakdown?.forEach((s) => {
    statusCounts[s.status] = s.count;
  });

  return (
    <div className="p-8" dir="ltr">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-[#64748B]">Welcome back to Walky DZ Control Center</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <button
            key={card.key}
            onClick={() => navigate(card.path)}
            className={cn(
              "relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br text-white text-left",
              "transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.02]",
              card.color
            )}
          >
            <div className="absolute top-4 right-4 opacity-20">
              <card.icon size={40} />
            </div>
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium mb-2">{card.label}</p>
              <p className="text-3xl font-bold mb-2">
                {card.key === "orders" && (stats?.totalOrders?.toLocaleString() ?? "0")}
                {card.key === "products" && (productsData?.total?.toLocaleString() ?? "0")}
                {card.key === "revenue" && `${Number(stats?.totalRevenue ?? 0).toLocaleString()} DA`}
                {card.key === "customers" && (ordersData?.total?.toLocaleString() ?? "0")}
              </p>
              <div className="flex items-center gap-1 text-white/70 text-xs">
                <TrendingUp size={14} />
                <span>This month</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all",
                action.color
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Orders Pipeline</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {["new", "confirmed", "shipping", "delivered", "returned", "cancelled"].map((status) => (
            <div key={status} className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold border",
                  statusCounts[status]
                    ? `bg-${statusColors[status].replace("bg-", "")}/10 border-${statusColors[status].replace("bg-", "")} text-${statusColors[status].replace("bg-", "")}-400`
                    : "bg-[#141D35] border-[#1E2D52] text-[#64748B]"
                )}
                style={{
                  backgroundColor: statusCounts[status] ? `${statusColors[status].replace("bg-", "")}22` : undefined,
                  borderColor: statusCounts[status] ? statusColors[status].replace("bg-", "") : undefined,
                  color: statusCounts[status] ? undefined : undefined,
                }}
              >
                <span className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", statusColors[status])} />
                  {statusLabels[status]} ({statusCounts[status] ?? 0})
                </span>
              </div>
              {status !== "cancelled" && (
                <ArrowUpRight size={14} className="text-[#64748B] rotate-45" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-[#141D35] rounded-2xl border border-[#1E2D52] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1E2D52] flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <ShoppingBag size={18} className="text-blue-400" />
              Recent Orders
            </h3>
            <button onClick={() => navigate("/admin/orders")} className="text-blue-400 text-sm hover:underline">
              View All
            </button>
          </div>
          <div className="divide-y divide-[#1E2D52]">
            {ordersData?.items?.slice(0, 5).map((order) => (
              <div key={order.id} className="px-6 py-4 hover:bg-[#1A2744] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white text-sm">{order.customerName}</span>
                  <span className="text-blue-400 font-semibold">{Number(order.total).toLocaleString()} DA</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span>{order.phone}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", statusColors[order.status] ?? "bg-gray-500")} />
                    <span>{statusLabels[order.status] ?? order.status}</span>
                  </div>
                </div>
              </div>
            ))}
            {(!ordersData?.items || ordersData.items.length === 0) && (
              <div className="px-6 py-8 text-center text-[#64748B]">No orders yet</div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#141D35] rounded-2xl border border-[#1E2D52] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1E2D52] flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Package size={18} className="text-green-400" />
              Products
            </h3>
            <button onClick={() => navigate("/admin/products")} className="text-blue-400 text-sm hover:underline">
              View All
            </button>
          </div>
          <div className="divide-y divide-[#1E2D52]">
            {productsData?.items?.slice(0, 5).map((product) => (
              <div key={product.id} className="px-6 py-4 hover:bg-[#1A2744] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white text-sm">{product.name}</span>
                  <span className="text-emerald-400 font-semibold">{Number(product.price).toLocaleString()} DA</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span>SKU: {product.sku ?? "N/A"}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    product.stockStatus === "in_stock" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  )}>
                    {product.stockStatus === "in_stock" ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            ))}
            {(!productsData?.items || productsData.items.length === 0) && (
              <div className="px-6 py-8 text-center text-[#64748B]">No products yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
