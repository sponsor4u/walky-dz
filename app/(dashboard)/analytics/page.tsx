"use client";

import { useState } from "react";
import { trpc } from "@/client/providers/trpc-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Badge } from "@/client/components/ui/badge";
import { formatPrice, getStatusColor, getStatusLabel } from "@/client/lib/utils";
import { BarChart3, ShoppingCart, DollarSign, TrendingUp, Loader2, MapPin, Package } from "lucide-react";

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const { data, isLoading } = trpc.analytics.dashboard.useQuery({ days });
  const { data: revenueByDay } = trpc.analytics.revenueByDay.useQuery({ days });

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          التحليلات
        </h1>
        <div className="flex gap-2">
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setDays(d)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${days === d ? "bg-blue-600 text-white" : "bg-[#141D35] text-slate-400 hover:text-white border border-[#1E2D52]"}`}>
              {d === 7 ? "أسبوع" : d === 30 ? "شهر" : "3 أشهر"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#141D35] border-[#1E2D52]"><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-400">إجمالي الطلبات</p><p className="text-2xl font-bold text-white">{data?.totalOrders ?? 0}</p></div>
            <div className="w-12 h-12 rounded-xl bg-[#1A2744] flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-blue-400" /></div>
          </div>
        </CardContent></Card>
        <Card className="bg-[#141D35] border-[#1E2D52]"><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-400">الإيرادات</p><p className="text-2xl font-bold text-green-400">{formatPrice(data?.totalRevenue ?? 0)}</p></div>
            <div className="w-12 h-12 rounded-xl bg-[#1A2744] flex items-center justify-center"><DollarSign className="w-5 h-5 text-green-400" /></div>
          </div>
        </CardContent></Card>
        <Card className="bg-[#141D35] border-[#1E2D52]"><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-400">معدل التحويل</p><p className="text-2xl font-bold text-white">—</p></div>
            <div className="w-12 h-12 rounded-xl bg-[#1A2744] flex items-center justify-center"><TrendingUp className="w-5 h-5 text-amber-400" /></div>
          </div>
        </CardContent></Card>
        <Card className="bg-[#141D35] border-[#1E2D52]"><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-400">الولايات الأكثر طلباً</p><p className="text-lg font-bold text-white">{data?.topWilayas?.[0]?.wilayaName ?? "—"}</p></div>
            <div className="w-12 h-12 rounded-xl bg-[#1A2744] flex items-center justify-center"><MapPin className="w-5 h-5 text-purple-400" /></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-[#141D35] border-[#1E2D52]"><CardHeader><CardTitle className="text-white">الطلبات حسب الحالة</CardTitle></CardHeader><CardContent>
          <div className="space-y-2">
            {data?.statusBreakdown?.map((s) => (
              <div key={s.status} className="flex items-center justify-between py-2 border-b border-[#1E2D52] last:border-0">
                <div className="flex items-center gap-2"><Badge className={getStatusColor(s.status)}>{getStatusLabel(s.status)}</Badge></div>
                <span className="text-white font-bold">{s.count}</span>
              </div>
            )) ?? <p className="text-slate-500 text-center py-4">لا توجد بيانات</p>}
          </div>
        </CardContent></Card>

        <Card className="bg-[#141D35] border-[#1E2D52]"><CardHeader><CardTitle className="text-white">أفضل الولايات</CardTitle></CardHeader><CardContent>
          <div className="space-y-2">
            {data?.topWilayas?.map((w, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#1E2D52] last:border-0">
                <span className="text-slate-300 text-sm">{w.wilayaName}</span>
                <div className="flex items-center gap-2"><div className="w-24 h-2 bg-[#1A2744] rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (w.count / (data?.topWilayas?.[0]?.count ?? 1)) * 100)}%` }} /></div><span className="text-white text-sm font-bold">{w.count}</span></div>
              </div>
            )) ?? <p className="text-slate-500 text-center py-4">لا توجد بيانات</p>}
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
}
