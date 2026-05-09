"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/client/providers/trpc-provider";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/client/components/ui/tabs";
import { Loader2, Settings, Save, Store, Palette, Megaphone } from "lucide-react";

export default function SettingsPage() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.settings.get.useQuery();
  const updateMutation = trpc.settings.update.useMutation({ onSuccess: () => utils.settings.get.invalidate() });

  const [form, setForm] = useState({
    storeName: "", storeSlug: "", logoUrl: "", faviconUrl: "",
    primaryColor: "#2563EB", secondaryColor: "#1D4ED8", accentColor: "#F97316",
    fontFamily: "Cairo", whatsappNumber: "", phoneNumber: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        storeName: settings.storeName ?? "Walky DZ",
        storeSlug: settings.storeSlug ?? "walky-dz",
        logoUrl: settings.logoUrl ?? "",
        faviconUrl: settings.faviconUrl ?? "",
        primaryColor: settings.primaryColor ?? "#2563EB",
        secondaryColor: settings.secondaryColor ?? "#1D4ED8",
        accentColor: settings.accentColor ?? "#F97316",
        fontFamily: settings.fontFamily ?? "Cairo",
        whatsappNumber: settings.whatsappNumber ?? "",
        phoneNumber: settings.phoneNumber ?? "",
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateMutation.mutate(form);
  };

  if (isLoading) {
    return <div className="p-8 max-w-4xl mx-auto flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>;
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" />
          إعدادات المتجر
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 ml-2" /> حفظ</>}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-[#141D35] border border-[#1E2D52]">
          <TabsTrigger value="general" className="flex items-center gap-1"><Store className="w-4 h-4" /> عام</TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-1"><Palette className="w-4 h-4" /> المظهر</TabsTrigger>
          <TabsTrigger value="pixels" className="flex items-center gap-1"><Megaphone className="w-4 h-4" /> التتبع</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="bg-[#141D35] border-[#1E2D52]"><CardHeader><CardTitle className="text-white">معلومات المتجر</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm text-slate-400 mb-1 block">اسم المتجر</label><Input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} /></div>
              <div><label className="text-sm text-slate-400 mb-1 block">الرابط (Slug)</label><Input value={form.storeSlug} onChange={(e) => setForm({ ...form, storeSlug: e.target.value })} /></div>
              <div><label className="text-sm text-slate-400 mb-1 block">رابط الشعار</label><Input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://..." /></div>
              <div><label className="text-sm text-slate-400 mb-1 block">رابط Favicon</label><Input value={form.faviconUrl} onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })} placeholder="https://..." /></div>
              <div><label className="text-sm text-slate-400 mb-1 block">رقم واتساب</label><Input value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="05XX XX XX XX" /></div>
              <div><label className="text-sm text-slate-400 mb-1 block">رقم الهاتف</label><Input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="05XX XX XX XX" /></div>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <Card className="bg-[#141D35] border-[#1E2D52]"><CardHeader><CardTitle className="text-white">ألوان المظهر</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "اللون الأساسي", key: "primaryColor", value: form.primaryColor },
                { label: "اللون الثانوي", key: "secondaryColor", value: form.secondaryColor },
                { label: "لون التمييز", key: "accentColor", value: form.accentColor },
                { label: "الخط", key: "fontFamily", value: form.fontFamily },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-sm text-slate-400 mb-1 block">{field.label}</label>
                  <div className="flex gap-2">
                    {field.key.includes("Color") && (
                      <input type="color" value={field.value} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="w-10 h-9 rounded cursor-pointer" />
                    )}
                    <Input value={field.value} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="pixels" className="space-y-4">
          <Card className="bg-[#141D35] border-[#1E2D52]"><CardHeader><CardTitle className="text-white">إعدادات التتبع</CardTitle></CardHeader><CardContent>
            <p className="text-slate-400 text-sm">يمكنك إدارة إعدادات Meta Pixel و TikTok Pixel و Google Analytics من هنا. ستتوفر قريباً.</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
