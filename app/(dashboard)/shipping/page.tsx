"use client";

import { useState } from "react";
import { trpc } from "@/client/providers/trpc-provider";
import { Input } from "@/client/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { Truck, Loader2, Save, MapPin } from "lucide-react";

export default function ShippingPage() {
  const [search, setSearch] = useState("");
  const utils = trpc.useUtils();
  const { data: zones, isLoading } = trpc.shipping.listZones.useQuery();
  const updateMutation = trpc.shipping.updateZone.useMutation({ onSuccess: () => utils.shipping.listZones.invalidate() });

  const [editingZones, setEditingZones] = useState<Record<number, { homePrice: string; deskPrice: string; freeShippingMin: string }>>({});

  const filteredZones = zones?.filter(z =>
    z.wilaya?.nameAr?.toLowerCase().includes(search.toLowerCase())
  );

  const updateZoneField = (id: number, field: string, value: string) => {
    setEditingZones(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const saveZone = (id: number) => {
    const edits = editingZones[id];
    if (!edits) return;
    updateMutation.mutate({
      id,
      homePrice: edits.homePrice,
      deskPrice: edits.deskPrice,
      freeShippingMin: edits.freeShippingMin || null,
    });
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-blue-400" />
          مناطق الشحن
        </h1>
      </div>

      <Input
        placeholder="البحث بالولاية..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="bg-[#141D35] border border-[#1E2D52] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E2D52] bg-[#0F1629]">
                <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">الولاية</th>
                <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">المنزل (دج)</th>
                <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">المكتب (دج)</th>
                <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">شحن مجاني من</th>
                <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right">الحالة</th>
                <th className="py-3 px-4 text-sm text-slate-400 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" /></td></tr>
              ) : filteredZones?.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500"><Truck className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>لا توجد مناطق شحن</p></td></tr>
              ) : (
                filteredZones?.map((zone) => (
                  <tr key={zone.id} className="border-b border-[#1E2D52] last:border-0 hover:bg-[#1A2744]">
                    <td className="py-3 px-4 text-sm text-white font-medium">{zone.wilaya?.nameAr ?? `ولاية ${zone.wilayaId}`}</td>
                    <td className="py-3 px-4">
                      <Input
                        defaultValue={zone.homePrice?.toString() ?? ""}
                        onChange={(e) => updateZoneField(zone.id, "homePrice", e.target.value)}
                        className="w-24 h-8 text-sm"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        defaultValue={zone.deskPrice?.toString() ?? ""}
                        onChange={(e) => updateZoneField(zone.id, "deskPrice", e.target.value)}
                        className="w-24 h-8 text-sm"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        defaultValue={zone.freeShippingMin?.toString() ?? ""}
                        onChange={(e) => updateZoneField(zone.id, "freeShippingMin", e.target.value)}
                        placeholder="بدون"
                        className="w-24 h-8 text-sm"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={zone.isEnabled ? "success" : "warning"}>
                        {zone.isEnabled ? "مفعل" : "معطل"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline" onClick={() => saveZone(zone.id)} disabled={updateMutation.isPending}>
                        <Save className="w-3.5 h-3.5" />
                      </Button>
                    </td>
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
