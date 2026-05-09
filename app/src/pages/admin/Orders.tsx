import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Search, RefreshCw, Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

const statuses = ["all", "new", "confirmed", "shipping", "delivered", "returned", "cancelled"] as const;

export default function AdminOrders() {
  const utils = trpc.useUtils();
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data, isLoading, refetch } = trpc.order.list.useQuery({
    status: status === "all" ? undefined : status as "new" | "confirmed" | "shipping" | "delivered" | "returned" | "cancelled",
    search: search || undefined,
    limit: pageSize,
    offset: page * pageSize,
  });

  const updateStatusMutation = trpc.order.updateStatus.useMutation({
    onSuccess: () => { utils.order.list.invalidate(); utils.analytics.dashboard.invalidate(); },
  });
  const deleteMutation = trpc.order.delete.useMutation({
    onSuccess: () => utils.order.list.invalidate(),
  });

  return (
    <div className="p-8" dir="ltr">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-[#64748B] mt-1">{data?.total ?? 0} total orders</p>
        </div>
        <button onClick={() => refetch()} className="p-2.5 rounded-xl bg-[#141D35] border border-[#1E2D52] text-[#94A3B8] hover:text-white transition-colors">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[250px] relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search orders..."
            className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-[#64748B] text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-1 bg-[#141D35] border border-[#1E2D52] rounded-xl p-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(0); }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                status === s ? "bg-blue-500 text-white" : "text-[#94A3B8] hover:text-white"
              )}
            >
              {s === "all" ? "All" : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#141D35] rounded-2xl border border-[#1E2D52] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E2D52]">
                {["Order", "Customer", "Phone", "Wilaya", "Total", "Status", "Date", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D52]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-[#1A2744] rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.items?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-[#64748B]">No orders found</td>
                </tr>
              ) : (
                data?.items?.map(order => (
                  <tr key={order.id} className="hover:bg-[#1A2744]/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-blue-400">#{order.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-white">{order.customerName}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{order.phone}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{order.wilayaName}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-white">{Number(order.total).toLocaleString()} DA</td>
                    <td className="px-4 py-3">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={e => updateStatusMutation.mutate({ id: order.id, status: e.target.value as typeof order.status })}
                          className={cn(
                            "appearance-none text-xs font-bold px-3 py-1.5 rounded-lg border pr-6 cursor-pointer focus:outline-none",
                            statusColors[order.status]?.replace("bg-", "border-") + " " +
                            statusColors[order.status]?.replace("bg-", "text-") + " " +
                            statusColors[order.status]?.replace("bg-", "bg-")?.replace("-500", "-500/10")
                          )}
                          style={{
                            backgroundColor: `${statusColors[order.status]?.replace("bg-", "")?.split("-")?.[0] ?? "gray"}-500/10`,
                          }}
                        >
                          {Object.entries(statusLabels).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#64748B]">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { if (confirm("Delete this order?")) deleteMutation.mutate({ id: order.id }); }}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.total > pageSize && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1E2D52]">
            <span className="text-xs text-[#64748B]">Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, data.total)} of {data.total}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 rounded-lg bg-[#1A2744] text-[#94A3B8] text-xs hover:text-white disabled:opacity-30 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={(page + 1) * pageSize >= data.total}
                className="px-3 py-1.5 rounded-lg bg-[#1A2744] text-[#94A3B8] text-xs hover:text-white disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
