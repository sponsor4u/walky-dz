import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Truck, Save, Plus, Trash2, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminShipping() {
  const utils = trpc.useUtils();
  const { data: zones, isLoading } = trpc.shipping.listZones.useQuery();
  const { data: wilayas } = trpc.shipping.listWilayas.useQuery();
  const { data: providers } = trpc.shipping.listProviders.useQuery();

  const updateMutation = trpc.shipping.updateZone.useMutation({
    onSuccess: () => { utils.shipping.listZones.invalidate(); setSavedId(null); },
  });
  const upsertProvider = trpc.shipping.upsertProvider.useMutation({
    onSuccess: () => utils.shipping.listProviders.invalidate(),
  });
  const deleteProvider = trpc.shipping.deleteProvider.useMutation({
    onSuccess: () => utils.shipping.listProviders.invalidate(),
  });

  const [edits, setEdits] = useState<Record<number, { homePrice: string; deskPrice: string; freeShippingMin: string; isEnabled: boolean }>>({});
  const [search, setSearch] = useState("");
  const [savedId, setSavedId] = useState<number | null>(null);
  const [newProvider, setNewProvider] = useState({ name: "" });

  const getWilayaName = (wilayaId: number) => {
    return wilayas?.find(w => w.id === wilayaId)?.nameAr ?? `Wilaya ${wilayaId}`;
  };

  const handleSave = (zoneId: number) => {
    const edit = edits[zoneId];
    if (!edit) return;
    updateMutation.mutate({
      id: zoneId,
      homePrice: edit.homePrice,
      deskPrice: edit.deskPrice,
      freeShippingMin: edit.freeShippingMin || undefined,
      isEnabled: edit.isEnabled,
    });
    setSavedId(zoneId);
    setTimeout(() => setSavedId(null), 2000);
  };

  const filteredZones = zones?.filter(z => {
    const name = getWilayaName(z.wilayaId);
    return !search || name.includes(search);
  });

  return (
    <div className="p-8" dir="ltr">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Shipping</h1>
        <p className="text-[#64748B] mt-1">Manage shipping zones and providers</p>
      </div>

      {/* Providers */}
      <div className="bg-[#141D35] rounded-2xl border border-[#1E2D52] p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Truck size={18} className="text-blue-400" />
          Shipping Providers
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {providers?.map(p => (
            <div key={p.id} className="flex items-center gap-2 bg-[#0F1629] border border-[#1E2D52] rounded-xl px-4 py-2">
              <span className="text-white text-sm font-medium">{p.name}</span>
              <span className={cn("w-2 h-2 rounded-full", p.isActive ? "bg-green-500" : "bg-gray-500")} />
              <button onClick={() => { if (confirm("Delete?")) deleteProvider.mutate({ id: p.id }); }} className="ml-2 text-red-400 hover:text-red-300">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newProvider.name}
            onChange={e => setNewProvider({ name: e.target.value })}
            placeholder="New provider name"
            className="bg-[#0F1629] border border-[#1E2D52] rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => { if (newProvider.name) { upsertProvider.mutate({ name: newProvider.name }); setNewProvider({ name: "" }); } }}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search wilayas..."
          className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Zones Table */}
      <div className="bg-[#141D35] rounded-2xl border border-[#1E2D52] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E2D52]">
                {["Code", "Wilaya", "Home Price", "Desk Price", "Free Min", "Active", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D52]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-[#1A2744] rounded animate-pulse" /></td></tr>
                ))
              ) : filteredZones?.map(zone => {
                const edit = edits[zone.id];
                const homePrice = edit?.homePrice ?? zone.homePrice?.toString() ?? "600";
                const deskPrice = edit?.deskPrice ?? zone.deskPrice?.toString() ?? "400";
                const freeMin = edit?.freeShippingMin ?? zone.freeShippingMin?.toString() ?? "";
                const isEnabled = edit?.isEnabled ?? zone.isEnabled;

                return (
                  <tr key={zone.id} className="hover:bg-[#1A2744]/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{zone.wilayaId}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{getWilayaName(zone.wilayaId)}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={homePrice}
                        onChange={e => setEdits({ ...edits, [zone.id]: { ...edits[zone.id], homePrice: e.target.value, deskPrice, freeShippingMin: freeMin, isEnabled } })}
                        className="w-24 bg-[#0F1629] border border-[#1E2D52] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={deskPrice}
                        onChange={e => setEdits({ ...edits, [zone.id]: { ...edits[zone.id], homePrice, deskPrice: e.target.value, freeShippingMin: freeMin, isEnabled } })}
                        className="w-24 bg-[#0F1629] border border-[#1E2D52] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={freeMin}
                        onChange={e => setEdits({ ...edits, [zone.id]: { ...edits[zone.id], homePrice, deskPrice, freeShippingMin: e.target.value, isEnabled } })}
                        placeholder="DA"
                        className="w-24 bg-[#0F1629] border border-[#1E2D52] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-[#64748B]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEdits({ ...edits, [zone.id]: { homePrice, deskPrice, freeShippingMin: freeMin, isEnabled: !isEnabled } })}
                        className={cn(
                          "w-10 h-6 rounded-full transition-colors relative",
                          isEnabled ? "bg-green-500" : "bg-gray-600"
                        )}
                      >
                        <div className={cn("w-4 h-4 rounded-full bg-white absolute top-1 transition-all", isEnabled ? "left-5" : "left-1")} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSave(zone.id)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          savedId === zone.id ? "bg-green-500/10 text-green-400" : "hover:bg-blue-500/10 text-blue-400"
                        )}
                      >
                        {savedId === zone.id ? <Check size={16} /> : <Save size={16} />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
