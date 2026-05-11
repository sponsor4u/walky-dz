import { useState, useRef } from 'react';
import { Upload, Image, Film, Copy, Check } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: string;
}

const mockMedia: MediaItem[] = [
  { id: '1', name: 'hero-banner.jpg', url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop', type: 'image', size: '245 KB' },
  { id: '2', name: 'product-1.jpg', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', type: 'image', size: '189 KB' },
  { id: '3', name: 'category-electronics.jpg', url: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=400&h=400&fit=crop', type: 'image', size: '156 KB' },
  { id: '4', name: 'category-fashion.jpg', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop', type: 'image', size: '203 KB' },
  { id: '5', name: 'promo-video.mp4', url: '', type: 'video', size: '4.2 MB' },
];

export default function Media() {
  const [media, setMedia] = useState<MediaItem[]>(mockMedia);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    // Simulate upload
    const newItems: MediaItem[] = Array.from(files).map(file => ({
      id: `new-${Date.now()}-${Math.random()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      size: `${(file.size / 1024).toFixed(0)} KB`,
    }));
    setMedia(prev => [...newItems, ...prev]);
  }

  function copyUrl(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">مدير الوسائط</h1>
        <button onClick={() => fileInputRef.current?.click()} className="btn-gradient-admin">
          <Upload className="w-4 h-4" />رفع ملفات
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" onChange={handleUpload} className="hidden" />
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors hover:border-[#3b82f6]/50"
        style={{ background: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <Upload className="w-10 h-10 mx-auto text-[#8b8b8b] mb-3" />
        <p className="text-sm text-[#8b8b8b]">اسحب الملفات هنا أو انقر للاختيار</p>
        <p className="text-xs text-[#8b8b8b] mt-1">PNG, JPG, WEBP, MP4 حتى 50MB</p>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.map(item => (
          <div key={item.id} className="rounded-xl overflow-hidden group" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="aspect-square relative overflow-hidden">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: '#1f1f1f' }}>
                  <Film className="w-8 h-8 text-[#8b8b8b]" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => copyUrl(item.url, item.id)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors">
                  {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs text-[#f0f0f0] truncate">{item.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[#8b8b8b]">{item.size}</span>
                {item.type === 'image' ? <Image className="w-3 h-3 text-[#8b8b8b]" /> : <Film className="w-3 h-3 text-[#8b8b8b]" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
