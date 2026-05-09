import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { ShieldAlert, Plus, Trash2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminFraud() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.fraud.list.useQuery();
  const addMutation = trpc.fraud.add.useMutation({
    onSuccess: () => { utils.fraud.list.invalidate(); setShowAdd(false); },
  });
  const removeMutation = trpc.fraud.remove.useMutation({
    onSuccess: () => utils.fraud.list.invalidate(),
  });

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ phone: "", ipAddress: "", reason: "" });
  const [search, setSearch] = useState("");

  const filtered = data?.filter(e =>
    !search || e.phone?.includes(search) || e.reason?.includes(search) || e.ipAddress?.includes(search)
  );

  return (
    <div className="p-8" dir="ltr">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Anti-Fraud</h1>
          <p className="text-[#64748B] mt-1">Manage blocked numbers and IPs</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Block Entry
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-[#141D35] rounded-2xl border border-[#1E2D52] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E2D52]">
                {["Phone", "IP Address", "Reason", "Date", "Type", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D52]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-[#1A2744] rounded animate-pulse" /></td></tr>
                ))
              ) : filtered?.map(e => (
                <tr key={e.id} className="hover:bg-[#1A2744]/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-mono">{e.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8] font-mono">{e.ipAddress ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{e.reason}</td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">{e.blockedAt ? new Date(e.blockedAt).toLocaleDateString() : "N/A"}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", e.isAuto ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400")}>
                      {e.isAuto ? "Auto" : "Manual"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => { if (confirm("Remove block?")) removeMutation.mutate({ id: e.id }); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {(!filtered || filtered.length === 0) && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[#64748B]">No blocked entries</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F1629] rounded-2xl border border-[#1E2D52] w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShieldAlert size={20} className="text-red-400" />Block Entry</h2>
              <button onClick={() => setShowAdd(false)} className="text-[#64748B] hover:text-white">✕</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); if (form.reason) addMutation.mutate({ phone: form.phone || undefined, ipAddress: form.ipAddress || undefined, reason: form.reason }); }} className="space-y-4">
              <div><label className="block text-sm text-[#94A3B8] mb-1.5">Phone (optional)</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div><label className="block text-sm text-[#94A3B8] mb-1.5">IP Address (optional)</label>
                <input value={form.ipAddress} onChange={e => setForm({ ...form, ipAddress: e.target.value })} className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div><label className="block text-sm text-[#94A3B8] mb-1.5">Reason *</label>
                <input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-[#94A3B8] hover:text-white text-sm">Cancel</button>
                <button type="submit" disabled={addMutation.isPending} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium disabled:opacity-50">Block</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
