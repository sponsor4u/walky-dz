import { useEffect, useState } from 'react';
import { Target, Facebook, Video, Camera, BarChart3, Trash2 } from 'lucide-react';
import { db } from '@/lib/db';
import type { Pixel } from '@/types';

export default function Pixels() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPixels(); }, []);

  async function loadPixels() {
    const data = await db.getPixels();
    setPixels(data);
    setLoading(false);
  }

  const icons = { facebook: Facebook, tiktok: Video, snapchat: Camera, ga4: BarChart3 };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#f0f0f0]">بيكسلات التتبع</h1>
      <p className="text-sm text-[#8b8b8b]">أضف بيكسلات التتبع لمنصات الإعلانات لمراقبة أداء حملاتك.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="skeleton-pulse h-[120px] rounded-xl" />)
          : pixels.map(pixel => {
            const Icon = icons[pixel.type] || Target;
            return (
              <div key={pixel.id} className="rounded-xl p-5" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
                      <Icon className="w-5 h-5 text-[#3b82f6]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#f0f0f0]">{pixel.name}</h4>
                      <p className="text-xs text-[#8b8b8b] capitalize">{pixel.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${pixel.is_active ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
                    <button onClick={() => {}} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-[#8b8b8b]"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="mt-3 p-2 rounded-lg font-mono text-xs" style={{ background: '#141414', color: '#8b8b8b' }}>
                  ID: {pixel.pixel_id}
                </div>
              </div>
            );
          })}
      </div>

      <div className="rounded-xl p-6 text-center" style={{ background: '#1a1a1a', border: '1px dashed rgba(255,255,255,0.15)' }}>
        <Target className="w-8 h-8 mx-auto text-[#8b8b8b] mb-2" />
        <p className="text-sm text-[#8b8b8b]">لإضافة بيكسل جديد، استخدم قاعدة البيانات أو لوحة Supabase</p>
      </div>
    </div>
  );
}
