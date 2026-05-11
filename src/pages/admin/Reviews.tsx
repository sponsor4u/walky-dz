import { useEffect, useState } from 'react';
import { Star, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { db } from '@/lib/db';
import type { Review } from '@/types';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReviews(); }, []);

  async function loadReviews() {
    const data = await db.getReviews();
    setReviews(data);
    setLoading(false);
  }

  async function toggleApproval(id: string, current: boolean) {
    await db.updateReview(id, { is_approved: !current });
    loadReviews();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#f0f0f0]">التقييمات ({reviews.length})</h1>

      <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>العميل</th>
                <th>التقييم</th>
                <th>النص</th>
                <th>مُلاحظ</th>
                <th>التاريخ</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => <tr key={i}>{[...Array(6)].map((_, j) => <td key={j}><div className="skeleton-pulse h-10 rounded" /></td>)}</tr>)
                : reviews.map(r => (
                  <tr key={r.id}>
                    <td className="font-medium text-[#f0f0f0]">{r.customer_name}</td>
                    <td>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-[#3f3f3f]'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="max-w-[200px] truncate text-[#8b8b8b]">{r.text}</td>
                    <td>
                      {r.is_verified && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/15 text-blue-400"><CheckCircle className="w-3 h-3" />موثق</span>}
                    </td>
                    <td className="text-[#8b8b8b] text-xs">{new Date(r.created_at).toLocaleDateString('ar-DZ')}</td>
                    <td>
                      <button onClick={() => toggleApproval(r.id, r.is_approved)} className={`text-xs px-3 py-1 rounded-lg transition-colors ${r.is_approved ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-green-500/15 text-green-400 hover:bg-green-500/25'}`}>
                        {r.is_approved ? 'رفض' : 'قبول'}
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
