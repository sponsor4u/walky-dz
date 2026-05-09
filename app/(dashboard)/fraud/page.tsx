"use client";

import { useState } from "react";
import { trpc } from "@/client/providers/trpc-provider";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Badge } from "@/client/components/ui/badge";
import { Shield, Phone, Loader2, Trash2, Plus } from "lucide-react";

export default function FraudPage() {
  const utils = trpc.useUtils();
  const { data: stats } = trpc.fraud.stats.useQuery();
  const { data: blacklist, isLoading } = trpc.fraud.list.useQuery();
  const addMutation = trpc.fraud.add.useMutation({ onSuccess: () => { utils.fraud.list.invalidate(); utils.fraud.stats.invalidate(); } });
  const removeMutation = trpc.fraud.remove.useMutation({ onSuccess: () => { utils.fraud.list.invalidate(); utils.fraud.stats.invalidate(); } });

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ phone: "", ipAddress: "", reason: "" });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Shield className="w-6 h-6 text-blue-400" />
        مكافحة الاحتيال
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي المحظورين", value: stats?.totalBlocked ?? 0, color: "text-white" },
          { label: "محظور تلقائي", value: stats?.autoBlocked ?? 0, color: "text-amber-400" },
          { label: "محظور يدوي", value: stats?.manualBlocked ?? 0, color: "text-blue-400" },
          { label: "محظورين نشطين", value: stats?.activeBlocks ?? 0, color: "text-red-400" },
        ].map((s, i) => (
          <Card key={i} className="bg-[#141D35] border-[#1E2D52]"><CardContent className="p-6">
            <p className="text-sm text-slate-400">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Add to Blacklist */}
      <Card className="bg-[#141D35] border-[#1E2D52]"><CardHeader><CardTitle className="text-white text-lg">إضافة إلى القائمة السوداء</CardTitle></CardHeader><CardContent>
        <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate({ phone: form.phone || undefined, ipAddress: form.ipAddress || undefined, reason: form.reason }); setForm({ phone: "", ipAddress: "", reason: "" }); }} className="flex flex-wrap gap-3">
          <Input placeholder="رقم الهاتف" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-48" />
          <Input placeholder="عنوان IP" value={form.ipAddress} onChange={(e) => setForm({ ...form, ipAddress: e.target.value })} className="w-40" />
          <Input placeholder="السبب" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required className="flex-1 min-w-[200px]" />
          <Button type="submit" className="bg-red-600 hover:bg-red-700"><Plus className="w-4 h-4 ml-2" /> إضافة</Button>
        </form>
      </CardContent></Card>

      {/* Blacklist Table */}
      <div className="bg-[#141D35] border border-[#1E2D52] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[#1E2D52] bg-[#0F1629]">
              <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">الهاتف</th>
              <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">IP</th>
              <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">السبب</th>
              <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">النوع</th>
              <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">التاريخ</th>
              <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right"></th>
            </tr></thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" /></td></tr>
              ) : blacklist?.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500"><Shield className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>القائمة السوداء فارغة</p></td></tr>
              ) : (
                blacklist?.map((entry) => (
                  <tr key={entry.id} className="border-b border-[#1E2D52] last:border-0 hover:bg-[#1A2744]">
                    <td className="py-3 px-4 text-sm text-white font-mono">{entry.phone ?? "—"}</td>
                    <td className="py-3 px-4 text-sm text-slate-400 font-mono">{entry.ipAddress ?? "—"}</td>
                    <td className="py-3 px-4 text-sm text-slate-300">{entry.reason}</td>
                    <td className="py-3 px-4"><Badge variant={entry.isAuto ? "warning" : "info"}>{entry.isAuto ? "تلقائي" : "يدوي"}</Badge></td>
                    <td className="py-3 px-4 text-sm text-slate-400">{new Date(entry.blockedAt).toLocaleDateString("ar-DZ")}</td>
                    <td className="py-3 px-4"><Button size="sm" variant="outline" className="text-red-400" onClick={() => removeMutation.mutate({ id: entry.id })}><Trash2 className="w-4 h-4" /></Button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
