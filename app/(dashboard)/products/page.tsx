"use client";

import { useState } from "react";
import { trpc } from "@/client/providers/trpc-provider";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Badge } from "@/client/components/ui/badge";
import { formatPrice } from "@/client/lib/utils";
import { Package, Search, Plus, Pencil, Trash2, Eye, Loader2 } from "lucide-react";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", price: "", comparePrice: "", description: "", shortDescription: "", stockQuantity: 0, seoTitle: "", seoDescription: "" });
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.product.list.useQuery({ search: search || undefined, active: undefined, limit: 50 });
  const createMutation = trpc.product.create.useMutation({ onSuccess: () => { utils.product.list.invalidate(); setShowForm(false); resetForm(); } });
  const updateMutation = trpc.product.update.useMutation({ onSuccess: () => { utils.product.list.invalidate(); setShowForm(false); setEditingId(null); resetForm(); } });
  const deleteMutation = trpc.product.delete.useMutation({ onSuccess: () => utils.product.list.invalidate() });

  const resetForm = () => setForm({ name: "", slug: "", price: "", comparePrice: "", description: "", shortDescription: "", stockQuantity: 0, seoTitle: "", seoDescription: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...form });
    } else {
      createMutation.mutate({
        ...form,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        price: form.price || "0",
      });
    }
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice ?? "",
      description: product.description ?? "",
      shortDescription: product.shortDescription ?? "",
      stockQuantity: product.stockQuantity ?? 0,
      seoTitle: product.seoTitle ?? "",
      seoDescription: product.seoDescription ?? "",
    });
    setShowForm(true);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-400" />
          المنتجات
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { resetForm(); setEditingId(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 ml-2" />
          منتج جديد
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="البحث في المنتجات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {showForm && (
        <Card className="bg-[#141D35] border-[#1E2D52]">
          <CardHeader><CardTitle className="text-white">{editingId ? "تعديل منتج" : "منتج جديد"}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="اسم المنتج" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="الرابط (slug)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <Input placeholder="السعر" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <Input placeholder="سعر المقارنة" type="number" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
              <Input placeholder="الكمية" type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })} className="md:col-span-2" />
              <textarea placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2 min-h-[80px] rounded-md border border-[#1E2D52] bg-[#1A2744] p-3 text-sm text-white placeholder:text-slate-500" />
              <Input placeholder="عنوان SEO" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
              <Input placeholder="وصف SEO" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "حفظ التعديلات" : "إنشاء منتج"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>إلغاء</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" /></div>
        ) : data?.items.length === 0 ? (
          <Card className="bg-[#141D35] border-[#1E2D52]"><CardContent className="p-12 text-center text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>لا توجد منتجات</p>
          </CardContent></Card>
        ) : (
          data?.items.map((product) => (
            <Card key={product.id} className="bg-[#141D35] border-[#1E2D52]">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">{product.name}</h3>
                    <p className="text-slate-400 text-sm mt-1 truncate">{product.shortDescription || product.description || "—"}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="text-green-400 font-medium">{formatPrice(product.price)}</span>
                      {product.comparePrice && <span className="text-slate-500 line-through">{formatPrice(product.comparePrice)}</span>}
                      <Badge variant={product.stockStatus === "in_stock" ? "success" : "warning"}>
                        {product.stockStatus === "in_stock" ? "متوفر" : "غير متوفر"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(product)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300" onClick={() => deleteMutation.mutate({ id: product.id })} disabled={deleteMutation.isPending}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
