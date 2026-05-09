import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Package,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  comparePrice: string;
  sku: string;
  stockQuantity: number;
  stockStatus: "in_stock" | "out_of_stock" | "low_stock";
  hasVariants: boolean;
  colors: string;
  sizes: string;
  featured: boolean;
  displayMode: "product_page" | "landing_page";
  seoTitle: string;
  seoDescription: string;
}

const emptyForm: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  price: "",
  comparePrice: "",
  sku: "",
  stockQuantity: 0,
  stockStatus: "in_stock",
  hasVariants: false,
  colors: "",
  sizes: "",
  featured: false,
  displayMode: "product_page",
  seoTitle: "",
  seoDescription: "",
};

export default function AdminProducts() {
  const utils = trpc.useUtils();
  const { data, isLoading, refetch } = trpc.product.list.useQuery({});
  const createMutation = trpc.product.create.useMutation({
    onSuccess: () => { utils.product.list.invalidate(); setShowModal(false); resetForm(); },
  });
  const updateMutation = trpc.product.update.useMutation({
    onSuccess: () => { utils.product.list.invalidate(); setShowModal(false); resetForm(); },
  });
  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: () => utils.product.list.invalidate(),
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ProductFormData>(emptyForm);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (product: NonNullable<typeof data>["items"][0]) => {
    const variantOptions = product.variantOptions as { colors?: string[]; sizes?: string[] } | null;
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      shortDescription: product.shortDescription ?? "",
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() ?? "",
      sku: product.sku ?? "",
      stockQuantity: product.stockQuantity ?? 0,
      stockStatus: product.stockStatus as "in_stock" | "out_of_stock" | "low_stock",
      hasVariants: product.hasVariants ?? false,
      colors: variantOptions?.colors?.join(", ") ?? "",
      sizes: variantOptions?.sizes?.join(", ") ?? "",
      featured: product.featured ?? false,
      displayMode: product.displayMode as "product_page" | "landing_page",
      seoTitle: product.seoTitle ?? "",
      seoDescription: product.seoDescription ?? "",
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const variantOptions = {
      colors: form.colors ? form.colors.split(",").map(s => s.trim()) : undefined,
      sizes: form.sizes ? form.sizes.split(",").map(s => s.trim()) : undefined,
    };

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...form,
        variantOptions,
      });
    } else {
      createMutation.mutate({
        ...form,
        variantOptions,
        stockQuantity: Number(form.stockQuantity),
      });
    }
  };

  const filteredItems = data?.items?.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8" dir="ltr">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-[#64748B] mt-1">Manage your store products</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems?.map((product) => (
            <div key={product.id} className="bg-[#141D35] rounded-2xl border border-[#1E2D52] overflow-hidden group hover:border-blue-500/30 transition-all">
              <div className="h-40 bg-gradient-to-br from-[#1A2744] to-[#0F1629] flex items-center justify-center relative">
                <Package size={48} className="text-[#334155]" />
                {!product.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <EyeOff size={24} className="text-white/60" />
                  </div>
                )}
                {product.featured && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-white mb-1 truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-400 font-bold text-lg">{Number(product.price).toLocaleString()} DA</span>
                  {product.comparePrice && (
                    <span className="text-[#64748B] line-through text-sm">{Number(product.comparePrice).toLocaleString()} DA</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-lg",
                    product.stockStatus === "in_stock" ? "bg-green-500/10 text-green-400" :
                    product.stockStatus === "low_stock" ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  )}>
                    {product.stockStatus === "in_stock" ? "In Stock" :
                     product.stockStatus === "low_stock" ? "Low Stock" : "Out of Stock"}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(product)} className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => { if (confirm("Delete this product?")) deleteMutation.mutate({ id: product.id }); }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F1629] rounded-2xl border border-[#1E2D52] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0F1629] border-b border-[#1E2D52] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-[#1A2744] text-[#64748B]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#94A3B8] mb-1.5">Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#94A3B8] mb-1.5">Slug *</label>
                  <input
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#94A3B8] mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#94A3B8] mb-1.5">Price (DA) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#94A3B8] mb-1.5">Compare Price (DA)</label>
                  <input
                    type="number"
                    value={form.comparePrice}
                    onChange={e => setForm({ ...form, comparePrice: e.target.value })}
                    className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-[#94A3B8] mb-1.5">SKU</label>
                  <input
                    value={form.sku}
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                    className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#94A3B8] mb-1.5">Stock Qty</label>
                  <input
                    type="number"
                    value={form.stockQuantity}
                    onChange={e => setForm({ ...form, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#94A3B8] mb-1.5">Status</label>
                  <select
                    value={form.stockStatus}
                    onChange={e => setForm({ ...form, stockStatus: e.target.value as typeof form.stockStatus })}
                    className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="border border-[#1E2D52] rounded-xl p-4">
                <label className="flex items-center gap-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={form.hasVariants}
                    onChange={e => setForm({ ...form, hasVariants: e.target.checked })}
                    className="w-4 h-4 rounded accent-blue-500"
                  />
                  <span className="text-white text-sm font-medium">Has Variants</span>
                </label>
                {form.hasVariants && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs text-[#94A3B8] mb-1">Colors (comma separated)</label>
                      <input
                        value={form.colors}
                        onChange={e => setForm({ ...form, colors: e.target.value })}
                        placeholder="Black, White, Red"
                        className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#94A3B8] mb-1">Sizes (comma separated)</label>
                      <input
                        value={form.sizes}
                        onChange={e => setForm({ ...form, sizes: e.target.value })}
                        placeholder="S, M, L, XL"
                        className="w-full bg-[#141D35] border border-[#1E2D52] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-blue-500"
                  />
                  <span className="text-white text-sm">Featured</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E2D52]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-[#94A3B8] hover:bg-[#1A2744] text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
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
