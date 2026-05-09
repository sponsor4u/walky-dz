"use client";

import { useState } from "react";
import { trpc } from "@/client/providers/trpc-provider";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Badge } from "@/client/components/ui/badge";
import { Loader2, Megaphone, Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function LandingPagesPage() {
  const utils = trpc.useUtils();
  const { data: pages, isLoading } = trpc.landing.list.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productId: 1, name: "", slug: "", metaTitle: "", metaDescription: "" });
  const deleteMutation = trpc.landing.delete.useMutation({ onSuccess: () => utils.landing.list.invalidate() });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-blue-400" />
          صفحات الهبوط
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 ml-2" />
          صفحة جديدة
        </Button>
      </div>

      {showForm && (
        <Card className="bg-[#141D35] border-[#1E2D52]"><CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="اسم الصفحة" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="الرابط (slug)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Input placeholder="عنوان SEO" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
            <Input placeholder="وصف SEO" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
            <div className="md:col-span-2 flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700">إنشاء</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
            </div>
          </div>
        </CardContent></Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" /></div>
        ) : pages?.length === 0 ? (
          <Card className="bg-[#141D35] border-[#1E2D52]"><CardContent className="p-12 text-center text-slate-500">
            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>لا توجد صفحات هبوط</p>
          </CardContent></Card>
        ) : (
          pages?.map((page) => (
            <Card key={page.id} className="bg-[#141D35] border-[#1E2D52]"><CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{page.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">/l/{page.slug}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={page.isActive ? "success" : "warning"}>{page.isActive ? "نشطة" : "معطلة"}</Badge>
                    {page.product && <Badge className="bg-blue-500 text-white">{page.product.name}</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/l/${page.slug}`} target="_blank">
                    <Button size="sm" variant="outline"><ExternalLink className="w-4 h-4" /></Button>
                  </Link>
                  <Button size="sm" variant="outline"><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="outline" className="text-red-400" onClick={() => deleteMutation.mutate({ id: page.id })} disabled={deleteMutation.isPending}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent></Card>
          ))
        )}
      </div>
    </div>
  );
}
