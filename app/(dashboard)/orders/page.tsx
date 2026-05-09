"use client";

import { useState } from "react";
import { trpc } from "@/client/providers/trpc-provider";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Badge } from "@/client/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/client/components/ui/select";
import { formatPrice, getStatusColor, getStatusLabel, formatDate } from "@/client/lib/utils";
import { ShoppingCart, Search, RefreshCw, Loader2, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const statusOptions = [
  { value: "new", label: "جديد" },
  { value: "confirmed", label: "مؤكد" },
  { value: "shipping", label: "قيد الشحن" },
  { value: "delivered", label: "تم التوصيل" },
  { value: "returned", label: "مُرجع" },
  { value: "cancelled", label: "ملغي" },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(0);
  const limit = 20;
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.order.list.useQuery({
    search: search || undefined,
    status: status === "all" ? undefined : status as any,
    limit,
    offset: page * limit,
  });

  const updateStatusMutation = trpc.order.updateStatus.useMutation({
    onSuccess: () => { utils.order.list.invalidate(); utils.order.stats.invalidate(); utils.order.recent.invalidate(); },
  });

  const bulkUpdateMutation = trpc.order.bulkUpdateStatus.useMutation({
    onSuccess: () => { utils.order.list.invalidate(); },
  });

  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const toggleSelect = (id: number) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const selectAll = () => {
    if (!data?.items) return;
    if (selectedOrders.length === data.items.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(data.items.map(i => i.id));
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-blue-400" />
          الطلبات
        </h1>
        <div className="text-sm text-slate-400">
          الإيرادات: <span className="text-green-400 font-bold">{formatPrice(data?.revenue ?? 0)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="البحث: رقم الطلب، اسم العميل، الهاتف..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-10" />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="جميع الحالات" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {selectedOrders.length > 0 && (
          <Select onValueChange={(v) => { bulkUpdateMutation.mutate({ ids: selectedOrders, status: v as any }); setSelectedOrders([]); }}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder={`تغيير حالة (${selectedOrders.length})`} /></SelectTrigger>
            <SelectContent>
              {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-[#141D35] border border-[#1E2D52] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E2D52] bg-[#0F1629]">
                <th className="py-3 px-4">
                  <input type="checkbox" checked={data?.items && data.items.length > 0 && selectedOrders.length === data.items.length} onChange={selectAll} className="rounded border-[#1E2D52] bg-[#1A2744]" />
                </th>
                <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">رقم الطلب</th>
                <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">العميل</th>
                <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">المنتج</th>
                <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">المبلغ</th>
                <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">الحالة</th>
                <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" /></td></tr>
              ) : data?.items.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-500"><ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>لا توجد طلبات</p></td></tr>
              ) : (
                data?.items.map((order) => (
                  <tr key={order.id} className="border-b border-[#1E2D52] last:border-0 hover:bg-[#1A2744] transition-colors">
                    <td className="py-3 px-4"><input type="checkbox" checked={selectedOrders.includes(order.id)} onChange={() => toggleSelect(order.id)} className="rounded border-[#1E2D52] bg-[#1A2744]" /></td>
                    <td className="py-3 px-4 text-sm font-mono text-blue-400">{order.orderNumber}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-white">{order.customerName}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" />{order.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-300">{order.product?.name ?? "—"}</td>
                    <td className="py-3 px-4 text-sm text-green-400 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4">
                      <Select defaultValue={order.status} onValueChange={(v) => updateStatusMutation.mutate({ id: order.id, status: v as any })}>
                        <SelectTrigger className="w-[130px] h-7 text-xs">
                          <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>{getStatusLabel(order.status)}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.total > limit && (
          <div className="flex items-center justify-between p-4 border-t border-[#1E2D52]">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
              <ChevronLeft className="w-4 h-4 ml-1" /> السابق
            </Button>
            <span className="text-sm text-slate-400">صفحة {page + 1} من {Math.ceil(data.total / limit)}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={(page + 1) * limit >= data.total}>
              التالي <ChevronRight className="w-4 h-4 mr-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
