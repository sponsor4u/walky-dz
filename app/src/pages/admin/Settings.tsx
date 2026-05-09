import { useState, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { Palette, Store, Save, Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function AdminSettings() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.settings.get.useQuery();
  const updateMutation = trpc.settings.update.useMutation({
    onSuccess: () => { utils.settings.get.invalidate(); setSaved(true); setTimeout(() => setSaved(false), 2000); },
  });
  const theme = useTheme();

  const [form, setForm] = useState({
    storeName: "",
    primaryColor: "#2563EB",
    accentColor: "#F97316",
    fontFamily: "Cairo",
    whatsappNumber: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        storeName: settings.storeName ?? "Walky DZ",
        primaryColor: settings.primaryColor ?? "#2563EB",
        accentColor: settings.accentColor ?? "#F97316",
        fontFamily: settings.fontFamily ?? "Cairo",
        whatsappNumber: settings.whatsappNumber ?? "",
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
    theme.setColors(form.primaryColor, form.accentColor);
  };

  if (isLoading) {
    return <div className="p-8"><div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent" /></div>;
  }

  return (
    <div className="p-8" dir="ltr">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-[#64748B] mt-1">Customize your store</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Settings */}
        <form onSubmit={handleSubmit} className="bg-[#141D35] rounded-2xl border border-[#1E2D52] p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Store size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Store</h2>
          </div>

          <div>
            <label className="block text-sm text-[#94A3B8] mb-1.5">Store Name</label>
            <input
              value={form.storeName}
              onChange={e => setForm({ ...form, storeName: e.target.value })}
              className="w-full bg-[#0F1629] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-[#94A3B8] mb-1.5">WhatsApp Number</label>
            <input
              value={form.whatsappNumber}
              onChange={e => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="213XXXXXXXXX"
              className="w-full bg-[#0F1629] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-[#94A3B8] mb-1.5">Font Family</label>
            <select
              value={form.fontFamily}
              onChange={e => setForm({ ...form, fontFamily: e.target.value })}
              className="w-full bg-[#0F1629] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Cairo">Cairo (Arabic)</option>
              <option value="Inter">Inter (English)</option>
              <option value="Tajawal">Tajawal</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? "Saved!" : updateMutation.isPending ? "Saving..." : "Save Settings"}
          </button>
        </form>

        {/* Theme */}
        <form onSubmit={handleSubmit} className="bg-[#141D35] rounded-2xl border border-[#1E2D52] p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Palette size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Theme</h2>
          </div>

          <div>
            <label className="block text-sm text-[#94A3B8] mb-1.5">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                className="w-12 h-10 rounded-lg border border-[#1E2D52] cursor-pointer"
              />
              <input
                value={form.primaryColor}
                onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                className="flex-1 bg-[#0F1629] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#94A3B8] mb-1.5">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accentColor}
                onChange={e => setForm({ ...form, accentColor: e.target.value })}
                className="w-12 h-10 rounded-lg border border-[#1E2D52] cursor-pointer"
              />
              <input
                value={form.accentColor}
                onChange={e => setForm({ ...form, accentColor: e.target.value })}
                className="flex-1 bg-[#0F1629] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <div className="flex-1 h-12 rounded-xl" style={{ background: form.primaryColor }} />
            <div className="flex-1 h-12 rounded-xl" style={{ background: form.accentColor }} />
          </div>
        </form>
      </div>
    </div>
  );
}
