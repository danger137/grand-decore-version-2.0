import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fmtPKR, type Product } from "@/lib/types";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const qc = useQueryClient();
  const [edit, setEdit] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      return (data ?? []) as unknown as Product[];
    },
  });
  const { data: cats } = useQuery({
    queryKey: ["admin-cats"],
    queryFn: async () => (await supabase.from("categories").select("*").order("sort")).data ?? [],
  });

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-products"] });
  };

  return (
    <div className="max-w-7xl">
      <header className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="font-display text-4xl mt-2">Products</h1>
        </div>
        <button onClick={() => setCreating(true)} className="bg-foreground text-background px-4 py-2 text-xs uppercase tracking-[0.18em] inline-flex items-center gap-2"><Plus className="h-4 w-4" /> New product</button>
      </header>

      <div className="mt-8 bg-background border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-muted-foreground text-left bg-bone">
            <tr><th className="px-4 py-3">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Flags</th><th></th></tr>
          </thead>
          <tbody className="divide-y">
            {(products ?? []).map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-12 h-14 object-cover bg-muted" />
                  <div><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.slug}</p></div>
                </td>
                <td>{cats?.find((c) => c.id === p.category_id)?.name ?? "—"}</td>
                <td>{fmtPKR(p.price)}</td>
                <td>{p.inventory}</td>
                <td className="text-xs space-x-1">
                  {p.is_new && <span className="border px-1.5">New</span>}
                  {p.is_best_seller && <span className="border px-1.5">Best</span>}
                  {p.is_trending && <span className="border px-1.5">Hot</span>}
                </td>
                <td className="text-right pr-4">
                  <button onClick={() => setEdit(p)} className="p-2 hover:text-primary"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del(p.id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(edit || creating) && (
        <ProductForm product={edit} cats={cats ?? []} onClose={() => { setEdit(null); setCreating(false); qc.invalidateQueries({ queryKey: ["admin-products"] }); }} />
      )}
    </div>
  );
}

function ProductForm({ product, cats, onClose }: { product: Product | null; cats: { id: string; name: string }[]; onClose: () => void }) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    compare_price: product?.compare_price ?? 0,
    category_id: product?.category_id ?? cats[0]?.id ?? "",
    images: (product?.images ?? []).join("\n"),
    videos: (product?.videos ?? []).join("\n"),
    inventory: product?.inventory ?? 0,
    is_new: product?.is_new ?? false,
    is_best_seller: product?.is_best_seller ?? false,
    is_trending: product?.is_trending ?? false,
    is_featured: product?.is_featured ?? false,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      videos: form.videos.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    const res = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(product ? "Updated" : "Created");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-stretch justify-end">
      <div className="bg-background w-full max-w-2xl overflow-y-auto p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">{product ? "Edit product" : "New product"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-6 space-y-4">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
          <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
          <div className="grid grid-cols-3 gap-3">
            <Field label="Price" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: +v })} />
            <Field label="Compare Price" type="number" value={String(form.compare_price)} onChange={(v) => setForm({ ...form, compare_price: +v })} />
            <Field label="Inventory" type="number" value={String(form.inventory)} onChange={(v) => setForm({ ...form, inventory: +v })} />
          </div>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Category</span>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="mt-2 w-full border border-input bg-transparent px-3 py-3">
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <Field label="Images (one URL per line)" value={form.images} onChange={(v) => setForm({ ...form, images: v })} textarea />
          <Field label="Videos (one URL per line)" value={form.videos} onChange={(v) => setForm({ ...form, videos: v })} textarea />
          <div className="grid grid-cols-2 gap-3 text-sm">
            {(["is_featured", "is_new", "is_best_seller", "is_trending"] as const).map((k) => (
              <label key={k} className="flex items-center gap-2">
                <input type="checkbox" checked={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.checked })} />
                {k.replace("is_", "").replace("_", " ")}
              </label>
            ))}
          </div>
          <button disabled={saving} onClick={save} className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.18em] disabled:opacity-50">{saving ? "Saving…" : "Save product"}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", textarea }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      {textarea
        ? <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full border border-input bg-transparent px-3 py-2 focus:outline-none focus:border-foreground" />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full border border-input bg-transparent px-3 py-2 focus:outline-none focus:border-foreground" />}
    </label>
  );
}
