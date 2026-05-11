import { useEffect, useState } from 'react';
import { Search, Phone, MapPin, ShoppingBag, Ban, CheckCircle } from 'lucide-react';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import type { Customer } from '@/types';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadCustomers(); }, []);

  async function loadCustomers() {
    setLoading(true);
    const data = await db.getCustomers();
    setCustomers(data);
    setLoading(false);
  }

  async function toggleBlacklist(id: string, current: boolean) {
    await db.updateCustomer(id, { blacklist: !current });
    loadCustomers();
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">العملاء ({customers.length})</h1>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8b]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الهاتف..." className="admin-input pr-10 w-[250px]" />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الهاتف</th>
                <th>الولاية</th>
                <th>الطلبات</th>
                <th>إجمالي الإنفاق</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => <tr key={i}>{[...Array(7)].map((_, j) => <td key={j}><div className="skeleton-pulse h-10 rounded" /></td>)}</tr>)
                : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-[#8b8b8b]">لا يوجد عملاء</td></tr>
                ) : filtered.map(c => (
                  <tr key={c.id}>
                    <td className="font-medium text-[#f0f0f0]">{c.name}</td>
                    <td className="text-[#8b8b8b]"><div className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</div></td>
                    <td className="text-[#8b8b8b]"><div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.wilaya?.name_ar || '-'}</div></td>
                    <td><div className="flex items-center gap-1 text-[#f0f0f0]"><ShoppingBag className="w-3 h-3 text-[#8b8b8b]" />{c.order_count}</div></td>
                    <td className="font-semibold" style={{ color: '#ef4444' }}>{formatPrice(c.total_spent)}</td>
                    <td>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${c.blacklist ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
                        {c.blacklist ? <Ban className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {c.blacklist ? 'محظور' : 'نشط'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => toggleBlacklist(c.id, c.blacklist)} className={`text-xs px-3 py-1 rounded-lg transition-colors ${c.blacklist ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25' : 'bg-red-500/15 text-red-400 hover:bg-red-500/25'}`}>
                        {c.blacklist ? 'إلغاء الحظر' : 'حظر'}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
