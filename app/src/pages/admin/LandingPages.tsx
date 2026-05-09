import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { FileText, Plus, Trash2, Pencil, Eye, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const sectionTypes = [
  { type: "hero", label: "Hero", defaultContent: { headline: "Your Headline", subheadline: "Your subheadline", ctaText: "Order Now" } },
  { type: "benefits", label: "Benefits", defaultContent: { items: [{ title: "Quality", description: "High quality materials" }] } },
  { type: "reviews", label: "Reviews", defaultContent: {} },
  { type: "trust_badges", label: "Trust Badges", defaultContent: {} },
  { type: "checkout", label: "Checkout Block", defaultContent: {} },
  { type: "countdown", label: "Countdown", defaultContent: { endDate: new Date(Date.now() + 86400000).toISOString() } },
  { type: "video", label: "Video", defaultContent: { url: "" } },
  { type: "faq", label: "FAQ", defaultContent: { items: [{ q: "Question?", a: "Answer." }] } },
  { type: "long_image", label: "Long Image", defaultContent: { imageUrl: "" } },
];

export default function AdminLandingPages() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.landing.list.useQuery({});
  const { data: products } = trpc.product.list.useQuery({});

  const createMutation = trpc.landing.create.useMutation({
    onSuccess: () => { utils.landing.list.invalidate(); setShowCreate(false); },
  });
  const updateMutation = trpc.landing.update.useMutation({
    onSuccess: () => { utils.landing.list.invalidate(); setEditingId(null); },
  });
  const deleteMutation = trpc.landing.delete.useMutation({
    onSuccess: () => utils.landing.list.invalidate(),
  });

  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", productId: 0, hasNavbar: true, hasFooter: true, sections: [] as Array<{ id: string; type: string; enabled: boolean; order: number; content: Record<string, unknown> }> });

  const openCreate = () => {
    setForm({ name: "", slug: "", productId: products?.items?.[0]?.id ?? 0, hasNavbar: true, hasFooter: true, sections: [] });
    setShowCreate(true);
  };

  const openEdit = (page: NonNullable<typeof data>[0]) => {
    const sections = (page.sections as Array<{ id: string; type: string; enabled: boolean; order: number; content: Record<string, unknown> }> | null) ?? [];
    setForm({
      name: page.name,
      slug: page.slug,
      productId: page.productId ?? 0,
      hasNavbar: page.hasNavbar ?? true,
      hasFooter: page.hasFooter ?? true,
      sections,
    });
    setEditingId(page.id);
    setShowCreate(true);
  };

  const addSection = (type: string) => {
    const template = sectionTypes.find(s => s.type === type);
    if (!template) return;
    setForm({
      ...form,
      sections: [...form.sections, {
        id: `section-${Date.now()}`,
        type,
        enabled: true,
        order: form.sections.length,
        content: { ...template.defaultContent },
      }],
    });
  };

  const removeSection = (index: number) => {
    setForm({ ...form, sections: form.sections.filter((_, i) => i !== index) });
  };

  const toggleSection = (index: number) => {
    const s = [...form.sections];
    s[index] = { ...s[index], enabled: !s[index].enabled };
    setForm({ ...form, sections: s });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.productId) return;
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="p-8" dir="ltr">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Landing Pages</h1>
          <p className="text-[#64748B] mt-1">Create and manage landing pages</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Create Page
        </button>
      </div>

      {/* Pages Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.map(page => (
            <div key={page.id} className="bg-[#141D35] rounded-2xl border border-[#1E2D52] p-5 hover:border-purple-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <FileText size={20} className="text-purple-400" />
                </div>
                <div className="flex gap-1">
                  <a href={`/l/${page.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors">
                    <ExternalLink size={14} />
                  </a>
                  <button onClick={() => openEdit(page)} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: page.id }); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-1">{page.name}</h3>
              <p className="text-xs text-[#64748B] mb-2">/{page.slug}</p>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded", page.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400")}>
                  {page.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-xs text-[#64748B]">{((page.sections as Array<unknown> | null)?.length ?? 0)} sections</span>
              </div>
            </div>
          ))}
          {(!data || data.length === 0) && (
            <div className="col-span-full text-center py-16 text-[#64748B]">No landing pages yet. Create your first one!</div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F1629] rounded-2xl border border-[#1E2D52] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0F1629] border-b border-[#1E2D52] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">{editingId ? "Edit Landing Page" : "Create Landing Page"}</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-[#1A2744] text-[#64748B]">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#94A3B8] mb-1.5">Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm text-[#94A3B8] mb-1.5">Slug *</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" required />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#94A3B8] mb-1.5">Product *</label>
                <select
                  value={form.productId}
                  onChange={e => setForm({ ...form, productId: Number(e.target.value) })}
                  className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  {products?.items?.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                  <input type="checkbox" checked={form.hasNavbar} onChange={e => setForm({ ...form, hasNavbar: e.target.checked })} className="rounded accent-blue-500" />
                  Navbar
                </label>
                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                  <input type="checkbox" checked={form.hasFooter} onChange={e => setForm({ ...form, hasFooter: e.target.checked })} className="rounded accent-blue-500" />
                  Footer
                </label>
              </div>

              {/* Sections Builder */}
              <div>
                <label className="block text-sm text-[#94A3B8] mb-2">Sections</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {sectionTypes.map(s => (
                    <button
                      key={s.type}
                      type="button"
                      onClick={() => addSection(s.type)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141D35] border border-[#1E2D52] text-xs text-[#94A3B8] hover:border-blue-500 hover:text-blue-400 transition-colors"
                    >
                      <Plus size={12} />
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {form.sections.map((section, i) => (
                    <div key={section.id} className={cn("flex items-center gap-3 p-3 rounded-xl border transition-colors", section.enabled ? "bg-[#141D35] border-[#1E2D52]" : "bg-[#0A0F1E] border-[#1E2D52]/50 opacity-50")}>
                      <span className="text-xs text-[#64748B] font-mono w-6">{i + 1}</span>
                      <span className="text-sm text-white font-medium flex-1">{sectionTypes.find(s => s.type === section.type)?.label ?? section.type}</span>
                      <button type="button" onClick={() => toggleSection(i)} className={cn("text-xs px-2 py-1 rounded", section.enabled ? "text-green-400" : "text-gray-500")}>
                        {section.enabled ? "On" : "Off"}
                      </button>
                      <button type="button" onClick={() => removeSection(i)} className="p-1 rounded hover:bg-red-500/10 text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E2D52]">
                <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl text-[#94A3B8] hover:bg-[#1A2744] text-sm">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
