import { useEffect, useState } from 'react';
import { Search, Save, ChevronDown } from 'lucide-react';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import type { Wilaya, Commune } from '@/types';

export default function Shipping() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState<number | null>(null);
  const [editingPrices, setEditingPrices] = useState<Record<string, { home?: number; desk?: number }>>({});

  useEffect(() => { loadWilayas(); }, []);

  async function loadWilayas() {
    setLoading(true);
    const w = await db.getAllWilayas();
    setWilayas(w);
    setLoading(false);
  }

  async function loadCommunes(wilayaId: number) {
    const c = await db.getCommunesByWilaya(wilayaId);
    setCommunes(c);
    setSelectedWilaya(wilayaId);
    setEditingPrices({});
  }

  async function saveWilayaPrice(id: number, field: 'home_price' | 'desk_price', value: number) {
    await db.updateWilaya(id, { [field]: value });
    setWilayas(prev => prev.map(w => w.id === id ? { ...w, [field]: value } : w));
  }

  async function saveCommunePrice(id: string, field: 'home_price' | 'desk_price', value: number) {
    await db.updateCommune(id, { [field]: value });
    setCommunes(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }

  const filteredWilayas = wilayas.filter(w =>
    w.name_ar.includes(search) || w.name_fr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#f0f0f0]">إدارة الشحن</h1>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-[300px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8b]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في الولايات..." className="admin-input pr-10 w-full" />
        </div>
      </div>

      {/* Wilayas Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>الكود</th>
                <th>الولاية</th>
                <th>توصيل للمنزل</th>
                <th>نقطة استلام</th>
                <th>نشط</th>
                <th>البلديات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(10)].map((_, i) => <tr key={i}>{[...Array(6)].map((_, j) => <td key={j}><div className="skeleton-pulse h-10 rounded" /></td>)}</tr>)
                : filteredWilayas.map(w => (
                  <tr key={w.id}>
                    <td className="font-mono text-sm text-[#8b8b8b]">{w.id}</td>
                    <td className="font-medium text-[#f0f0f0]">{w.name_ar} ({w.name_fr})</td>
                    <td>
                      <input
                        type="number"
                        defaultValue={w.home_price}
                        onBlur={e => saveWilayaPrice(w.id, 'home_price', parseInt(e.target.value) || 0)}
                        className="admin-input !w-[100px] text-center"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        defaultValue={w.desk_price}
                        onBlur={e => saveWilayaPrice(w.id, 'desk_price', parseInt(e.target.value) || 0)}
                        className="admin-input !w-[100px] text-center"
                      />
                    </td>
                    <td>
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${w.is_active ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
                    </td>
                    <td>
                      <button onClick={() => loadCommunes(w.id)} className="text-sm text-[#3b82f6] hover:underline flex items-center gap-1">
                        عرض البلديات
                        <ChevronDown className={`w-3 h-3 transition-transform ${selectedWilaya === w.id ? 'rotate-180' : ''}`} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Communes Table */}
      {selectedWilaya && (
        <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="font-semibold text-[#f0f0f0]">بلديات {wilayas.find(w => w.id === selectedWilaya)?.name_ar}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr><th>البلدية</th><th>توصيل للمنزل</th><th>نقطة استلام</th><th>نشط</th></tr>
              </thead>
              <tbody>
                {communes.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-[#8b8b8b]">لا توجد بيانات للبلديات</td></tr>
                ) : communes.map(c => (
                  <tr key={c.id}>
                    <td className="text-[#f0f0f0]">{c.name_ar} ({c.name_fr})</td>
                    <td>
                      <input
                        type="number"
                        value={editingPrices[c.id]?.home ?? c.home_price ?? wilayas.find(w => w.id === selectedWilaya)?.home_price ?? 0}
                        onChange={e => setEditingPrices(prev => ({ ...prev, [c.id]: { ...prev[c.id], home: parseInt(e.target.value) } }))}
                        onBlur={e => saveCommunePrice(c.id, 'home_price', parseInt(e.target.value) || 0)}
                        className="admin-input !w-[100px] text-center"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editingPrices[c.id]?.desk ?? c.desk_price ?? wilayas.find(w => w.id === selectedWilaya)?.desk_price ?? 0}
                        onChange={e => setEditingPrices(prev => ({ ...prev, [c.id]: { ...prev[c.id], desk: parseInt(e.target.value) } }))}
                        onBlur={e => saveCommunePrice(c.id, 'desk_price', parseInt(e.target.value) || 0)}
                        className="admin-input !w-[100px] text-center"
                      />
                    </td>
                    <td><span className={`inline-block w-2.5 h-2.5 rounded-full ${c.is_active ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
