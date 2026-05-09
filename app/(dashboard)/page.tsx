"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Badge } from "@/client/components/ui/badge";
import { trpc } from "@/client/providers/trpc-provider";
import { formatPrice, getStatusColor, getStatusLabel } from "@/client/lib/utils";
import {
  ShoppingCart, DollarSign, Package, TrendingUp,
  Users, Activity, ArrowUpRight, ArrowDownRight
} from "lucide-react";

function StatCard({ title, value, change, icon: Icon, changeType }: {
  title: string; value: string; change: string; icon: any; changeType: "up" | "down";
}) {
  return (
    <Card className="bg-[#141D35] border-[#1E2D52]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <div className="flex items-center gap-1 text-xs">
              {changeType === "up" ? (
                <ArrowUpRight className="w-3 h-3 text-green-400" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-400" />
              )}
              <span className={changeType === "up" ? "text-green-400" : "text-red-400"}>
                {change}
              </span>
              <span className="text-slate-500">هذا الشهر</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1A2744] flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: stats } = trpc.order.stats.useQuery();
  const { data: recentOrders } = trpc.order.recent.useQuery({ limit: 5 });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
        <p className="text-slate-400 text-sm">نظرة عامة على أداء المتجر</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي الطلبات"
          value={String(stats?.totalOrders ?? 0)}
          change="12%"
          icon={ShoppingCart}
          changeType="up"
        />
        <StatCard
          title="إجمالي الإيرادات"
          value={formatPrice(stats?.totalRevenue ?? 0)}
          change="8%"
          icon={DollarSign}
          changeType="up"
        />
        <StatCard
          title="منتجات نشطة"
          value="0"
          change="2%"
          icon={Package}
          changeType="up"
        />
        <StatCard
          title="طلبات اليوم"
          value={String(stats?.todayOrders ?? 0)}
          change="15%"
          icon={TrendingUp}
          changeType="up"
        />
      </div>

      {/* Recent Orders */}
      <Card className="bg-[#141D35] border-[#1E2D52]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            آخر الطلبات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E2D52]">
                    <th className="text-right py-3 px-4 text-sm text-slate-400 font-medium">رقم الطلب</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-400 font-medium">العميل</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-400 font-medium">المنتج</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-400 font-medium">المبلغ</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-400 font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#1E2D52] last:border-0 hover:bg-[#1A2744]">
                      <td className="py-3 px-4 text-sm text-white font-mono">{order.orderNumber}</td>
                      <td className="py-3 px-4 text-sm text-slate-300">{order.customerName}</td>
                      <td className="py-3 px-4 text-sm text-slate-300">{order.product?.name ?? "—"}</td>
                      <td className="py-3 px-4 text-sm text-green-400 font-medium">{formatPrice(order.total)}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>لا توجد طلبات بعد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
