import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { BarChart3, TrendingUp, ShoppingCart, DollarSign, BarChart, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminAnalytics() {
  const [days, setDays] = useState(30);
  const { data, isLoading } = trpc.analytics.dashboard.useQuery({ days });

  const statusColors: Record<string, string> = {
    new: "bg-blue-500",
    confirmed: "bg-teal-500",
    shipping: "bg-amber-500",
    delivered: "bg-green-500",
    returned: "bg-orange-500",
    cancelled: "bg-red-500",
  };

  const statusLabels: Record<string, string> = {
    new: "New", confirmed: "Confirmed", shipping: "Shipping",
    delivered: "Delivered", returned: "Returned", cancelled: "Cancelled",
  };

  const stats = [
    { icon: ShoppingCart, label: "Orders", value: data?.totalOrders ?? 0, color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: DollarSign, label: "Revenue", value: `${Number(data?.totalRevenue ?? 0).toLocaleString()} DA`, color: "text-green-400", bg: "bg-green-500/10" },
    { icon: BarChart, label: "Avg Order", value: data?.totalOrders ? `${Math.round(Number(data?.totalRevenue ?? 0) / data.totalOrders)} DA` : "0 DA", color: "text-amber-400", bg: "bg-amber-500/10" },
    { icon: TrendingUp, label: "Status", value: `${data?.statusBreakdown?.length ?? 0} types`, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="p-8" dir="ltr">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-[#64748B] mt-1">Track your store performance</p>
        </div>
        <div className="flex gap-1 bg-[#141D35] border border-[#1E2D52] rounded-xl p-1">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", days === d ? "bg-blue-500 text-white" : "text-[#94A3B8] hover:text-white")}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-[#141D35] rounded-2xl border border-[#1E2D52] p-6">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", s.bg)}>
              <s.icon size={20} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-sm text-[#64748B]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-[#141D35] rounded-2xl border border-[#1E2D52] p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-400" />
            Order Status
          </h2>
          <div className="space-y-3">
            {data?.statusBreakdown?.map(s => (
              <div key={s.status} className="flex items-center gap-3">
                <span className={cn("w-3 h-3 rounded-full shrink-0", statusColors[s.status])} />
                <span className="text-sm text-[#94A3B8] w-24">{statusLabels[s.status]}</span>
                <div className="flex-1 h-6 bg-[#0F1629] rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", statusColors[s.status])}
                    style={{ width: `${Math.min(100, (s.count / (data.totalOrders || 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-white w-8 text-right">{s.count}</span>
              </div>
            ))}
            {(!data?.statusBreakdown || data.statusBreakdown.length === 0) && (
              <p className="text-[#64748B] text-center py-4">No data yet</p>
            )}
          </div>
        </div>

        {/* Top Wilayas */}
        <div className="bg-[#141D35] rounded-2xl border border-[#1E2D52] p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-teal-400" />
            Top Wilayas
          </h2>
          <div className="space-y-3">
            {data?.topWilayas?.map((w, i) => (
              <div key={w.wilayaName} className="flex items-center gap-3">
                <span className="text-sm text-[#64748B] w-6 font-mono">#{i + 1}</span>
                <span className="text-sm text-white flex-1">{w.wilayaName}</span>
                <div className="flex-1 h-5 bg-[#0F1629] rounded-full overflow-hidden max-w-[200px]">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (w.count / ((data.topWilayas[0]?.count) || 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-white w-8 text-right">{w.count}</span>
              </div>
            ))}
            {(!data?.topWilayas || data.topWilayas.length === 0) && (
              <p className="text-[#64748B] text-center py-4">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#141D35] rounded-2xl border border-[#1E2D52] p-6 mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E2D52]">
                {["Order", "Customer", "Amount", "Status", "Date"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D52]">
              {data?.recentOrders?.slice(0, 10).map(order => (
                <tr key={order.id} className="hover:bg-[#1A2744]/50">
                  <td className="px-4 py-3 text-sm font-mono text-blue-400">#{order.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-white">{order.customerName}</td>
                  <td className="px-4 py-3 text-sm text-white font-medium">{Number(order.total).toLocaleString()} DA</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", statusColors[order.status]?.replace("bg-", "bg-") + "/10 text-" + statusColors[order.status]?.replace("bg-", "") + "-400")}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
              {(!data?.recentOrders || data.recentOrders.length === 0) && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[#64748B]">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
