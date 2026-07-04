import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, X, Upload, Check, Image as ImageIcon, Tag, Palette } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { productsQuery, categoriesQuery } from "@/lib/queries";
import { adminSaveProductFn, adminDeleteProductFn } from "@/lib/api";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/products")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery);
    context.queryClient.ensureQueryData(categoriesQuery);
  },
  component: AdminProducts,
});

function AdminProducts() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const qc = useQueryClient();

  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const curatedImages = [
    "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1602874801007-aa28b15c5ae3?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611250882761-91c87c95a9d6?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583845112203-29329902332e?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1545241047-6083a3684587?w=1400&auto=format&fit=crop&q=80",
  ];

  const allAvailableImages = Array.from(
    new Set([
      ...curatedImages,
      ...products.flatMap((p) => (Array.isArray(p.images) ? p.images : [])),
    ])
  ).filter((url) => url && typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image")));

  const saveMutation = useMutation({
    mutationFn: (data: any) => adminSaveProductFn({ data }),
    onSuccess: () => {
      toast.success(editing ? "Product updated successfully" : "Product created successfully");
      qc.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "Failed to save product"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteProductFn({ data: id }),
    onSuccess: () => {
      toast.success("Product deleted");
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete product"),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your catalog, images, and variants.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <button onClick={() => setEditing(null)} className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-widest hover:bg-primary transition-colors">
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
            <ProductModalForm
              key={editing ? editing.id : "new-product"}
              editing={editing}
              categories={categories}
              allAvailableImages={allAvailableImages}
              saveMutation={saveMutation}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-background border rounded-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-widest border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Price / Compare</th>
              <th className="px-6 py-4 font-medium">Inventory</th>
              <th className="px-6 py-4 font-medium">Reviews</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3.5">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="h-12 w-12 object-cover rounded-sm bg-muted shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=200"; }} />
                    ) : (
                      <div className="h-12 w-12 rounded-sm bg-muted flex items-center justify-center text-muted-foreground"><ImageIcon className="h-5 w-5" /></div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.slug}</p>
                      {Array.isArray(p.variants) && p.variants.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {p.variants.map((v: any, idx: number) => {
                            const vName = typeof v === 'string' ? v : v.name;
                            const vPrice = typeof v === 'object' && v.price ? `PKR ${Number(v.price).toLocaleString()}` : null;
                            const vCompare = typeof v === 'object' && v.comparePrice ? `PKR ${Number(v.comparePrice).toLocaleString()}` : null;
                            return (
                              <span key={idx} className="bg-muted border px-2 py-0.5 rounded text-[11px] text-foreground font-medium flex items-center gap-1.5">
                                <span>{vName}</span>
                                {vPrice && (
                                  <span className="text-[10px] text-primary font-mono font-semibold">
                                    {vPrice} {vCompare && <span className="line-through text-muted-foreground font-normal ml-0.5">{vCompare}</span>}
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {Array.isArray(p.colors) && p.colors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.colors.map((c: any, idx: number) => {
                            const cName = typeof c === 'string' ? c : c.name;
                            const cPrice = typeof c === 'object' && c.price ? `+PKR ${Number(c.price).toLocaleString()}` : null;
                            return (
                              <span key={idx} className="bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-[10px] text-primary font-medium flex items-center gap-1">
                                {typeof c === 'object' && c.image ? <img src={c.image} alt="" className="w-3.5 h-3.5 rounded-full object-cover inline-block border" /> : <span>🎨</span>}
                                <span>{cName}</span>
                                {cPrice && <span className="font-mono font-bold">{cPrice}</span>}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">
                  <div className="flex flex-col">
                    <span>PKR {p.price.toLocaleString()}</span>
                    {p.compare_price && p.compare_price > p.price && (
                      <span className="text-xs text-muted-foreground line-through font-normal">PKR {p.compare_price.toLocaleString()}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">{p.inventory} in stock</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500 font-medium">★ {p.avg_rating || "0"}</span>
                    <span className="text-xs text-muted-foreground">({p.reviews_count || 0})</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {p.is_featured && <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase tracking-widest rounded-sm font-medium">Featured</span>}
                    {p.is_new && <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-[10px] uppercase tracking-widest rounded-sm font-medium">New</span>}
                    {p.is_trending && <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[10px] uppercase tracking-widest rounded-sm font-medium">Trending</span>}
                    {p.is_best_seller && <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 text-[10px] uppercase tracking-widest rounded-sm font-medium">Best Seller</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditing(p); setOpen(true); }} className="p-2 hover:bg-accent rounded-sm transition-colors" title="Edit product"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => { if(confirm("Are you sure you want to delete this product?")) deleteMutation.mutate(p.id) }} className="p-2 hover:bg-destructive/10 text-destructive rounded-sm transition-colors" title="Delete product"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductModalForm({
  editing,
  categories,
  allAvailableImages,
  saveMutation,
}: {
  editing: Product | null;
  categories: any[];
  allAvailableImages: string[];
  saveMutation: any;
}) {
  const [selectedImages, setSelectedImages] = useState<string[]>(
    editing?.images && Array.isArray(editing.images) ? editing.images : []
  );
  const [selectedVariants, setSelectedVariants] = useState<any[]>(
    editing?.variants && Array.isArray(editing.variants) && editing.variants.length > 0
      ? editing.variants.map((v: any) =>
          typeof v === "string"
            ? { name: v, price: editing.price?.toString() || "", comparePrice: editing.compare_price?.toString() || "", image: "" }
            : {
                name: v.name || "",
                price: v.price !== undefined && v.price !== null ? v.price.toString() : (editing.price?.toString() || ""),
                comparePrice: v.comparePrice !== undefined && v.comparePrice !== null ? v.comparePrice.toString() : (v.compare_price !== undefined && v.compare_price !== null ? v.compare_price.toString() : (editing.compare_price?.toString() || "")),
                image: v.image || "",
              }
        )
      : editing
      ? []
      : [
          { name: "Small", price: "", comparePrice: "", image: "" },
          { name: "Medium", price: "", comparePrice: "", image: "" },
          { name: "Large", price: "", comparePrice: "", image: "" },
          { name: "XL", price: "", comparePrice: "", image: "" },
        ]
  );
  const [selectedColors, setSelectedColors] = useState<any[]>(
    editing?.colors && Array.isArray(editing.colors)
      ? editing.colors.map((c: any) =>
          typeof c === "string" ? { name: c, price: "", image: "" } : { name: c.name || "", price: c.price !== undefined && c.price !== null ? c.price.toString() : "", image: c.image || "" }
        )
      : editing?.specs?.colors && Array.isArray(editing.specs.colors)
      ? editing.specs.colors.map((c: any) =>
          typeof c === "string" ? { name: c, price: "", image: "" } : { name: c.name || "", price: c.price !== undefined && c.price !== null ? c.price.toString() : "", image: c.image || "" }
        )
      : []
  );
  const [name, setName] = useState(editing?.name || "");
  const [slug, setSlug] = useState(editing?.slug || "");
  const [slugModified, setSlugModified] = useState(!!editing);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [customVariant, setCustomVariant] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [brokenImages, setBrokenImages] = useState<string[]>([]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slugModified) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setSlugModified(true);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(fd.entries());
    if (editing) data.id = editing.id;
    data.name = name;
    data.slug = slug;
    data.price = Number(data.price);
    data.comparePrice = data.comparePrice ? Number(data.comparePrice) : null;
    data.inventory = Number(data.inventory);
    data.isFeatured = data.isFeatured === "on";
    data.isNew = data.isNew === "on";
    data.isTrending = data.isTrending === "on";
    data.isBestSeller = data.isBestSeller === "on";
    data.images = selectedImages;
    data.variants = selectedVariants
      .map((v) => ({
        name: (v.name || "").toString().trim(),
        price: v.price !== "" && v.price !== null && !isNaN(Number(v.price)) ? Number(v.price) : null,
        comparePrice: v.comparePrice !== "" && v.comparePrice !== null && !isNaN(Number(v.comparePrice)) ? Number(v.comparePrice) : null,
      }))
      .filter((v) => v.name !== "");
    data.colors = selectedColors
      .map((c) => ({
        name: (c.name || "").toString().trim(),
        price: c.price !== "" && c.price !== null && !isNaN(Number(c.price)) ? Number(c.price) : 0,
        image: c.image || undefined,
      }))
      .filter((c) => c.name !== "");

    try {
      if (data.specs) data.specs = JSON.parse(data.specs);
    } catch {
      // Ignore parse errors
    }
    saveMutation.mutate(data);
  };

  return (
    <form onSubmit={submit} className="space-y-5 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Product Name *</label>
          <input required name="name" value={name} onChange={handleNameChange} placeholder="e.g. Atelier Travertine Vase" className="w-full border-b py-2 focus:outline-none focus:border-foreground transition-colors bg-transparent text-sm mt-1" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Slug (URL friendly) *</label>
          <input required name="slug" value={slug} onChange={handleSlugChange} placeholder="e.g. atelier-travertine-vase" className="w-full border-b py-2 focus:outline-none focus:border-foreground transition-colors bg-transparent text-sm mt-1" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Description</label>
        <textarea name="description" rows={2} defaultValue={editing?.description || ""} placeholder="Describe product details, textures, and dimensions..." className="w-full border-b py-2 focus:outline-none focus:border-foreground transition-colors bg-transparent text-sm mt-1 resize-none" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Price (PKR) *</label>
          <input required type="number" name="price" defaultValue={editing?.price} placeholder="18500" className="w-full border-b py-2 focus:outline-none focus:border-foreground transition-colors bg-transparent text-sm mt-1" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Compare Price (Optional)</label>
          <input type="number" name="comparePrice" defaultValue={editing?.compare_price || ""} placeholder="22000" className="w-full border-b py-2 focus:outline-none focus:border-foreground transition-colors bg-transparent text-sm mt-1" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Inventory Count *</label>
          <input required type="number" name="inventory" defaultValue={editing?.inventory || 0} placeholder="10" className="w-full border-b py-2 focus:outline-none focus:border-foreground transition-colors bg-transparent text-sm mt-1" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Category</label>
        <select name="categoryId" defaultValue={editing?.category_id || ""} className="w-full border-b py-2 focus:outline-none bg-transparent text-sm mt-1">
          <option value="">None / Standalone</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Interactive Images Selector & Upload */}
      <div className="space-y-3 border p-4 rounded-sm bg-muted/20">
        <label className="text-xs font-semibold uppercase tracking-widest text-foreground flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-primary" /> Product Images ({selectedImages.length})
        </label>
        
        {selectedImages.filter((img) => !brokenImages.includes(img)).length > 0 && (
          <div className="flex flex-wrap gap-3 py-2">
            {selectedImages.filter((img) => !brokenImages.includes(img)).map((img, idx) => (
              <div key={idx} className="relative group border rounded-sm overflow-hidden w-20 h-20 bg-muted shadow-sm">
                <img src={img} alt="" className="w-full h-full object-cover" onError={() => setBrokenImages((prev) => prev.includes(img) ? prev : [...prev, img])} />
                <button
                  type="button"
                  onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Paste image URL here..."
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              className="flex-1 border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-foreground bg-background"
            />
            <button
              type="button"
              onClick={() => {
                if (customImageUrl.trim()) {
                  setSelectedImages([...selectedImages, customImageUrl.trim()]);
                  setCustomImageUrl("");
                }
              }}
              className="bg-secondary text-secondary-foreground px-3.5 py-2 text-xs uppercase tracking-wider rounded-sm hover:bg-secondary/80 font-medium transition-colors"
            >
              Add URL
            </button>
          </div>
          <label className="cursor-pointer bg-foreground hover:bg-primary text-background px-4 py-2 text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-colors font-medium">
            <Upload className="h-3.5 w-3.5" /> Upload Local Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    if (reader.result) {
                      setSelectedImages([...selectedImages, reader.result as string]);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Interactive Variants & Sizes with Per-Size Pricing */}
      <div className="space-y-4 border p-4 rounded-sm bg-muted/20">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-widest text-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" /> Product Sizes & Per-Size Pricing ({selectedVariants.length})
          </label>
          {selectedVariants.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedVariants([])}
              className="text-[10px] text-destructive hover:underline lowercase font-normal"
            >
              clear all
            </button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Set custom Price and Compare Price for each size (Small, Medium, Large, XL, etc.). Leave price blank to use the default product price.
        </p>

        {selectedVariants.length > 0 ? (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {selectedVariants.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-background p-2.5 border rounded-sm shadow-xs">
                <div className="w-1/3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const copy = [...selectedVariants];
                      copy[idx] = { ...copy[idx], name: e.target.value };
                      setSelectedVariants(copy);
                    }}
                    placeholder="Size Name (e.g. Small, Medium)"
                    className="w-full text-xs font-semibold uppercase tracking-wider bg-transparent focus:outline-none border-b py-1 border-transparent focus:border-foreground"
                  />
                </div>
                <div className="w-1/3 flex items-center gap-1 border rounded px-2 py-1 bg-muted/30">
                  <span className="text-[10px] text-muted-foreground font-mono">PKR</span>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const copy = [...selectedVariants];
                      copy[idx] = { ...copy[idx], price: e.target.value };
                      setSelectedVariants(copy);
                    }}
                    placeholder="Price"
                    className="w-full text-xs bg-transparent focus:outline-none font-medium"
                  />
                </div>
                <div className="w-1/3 flex items-center gap-1 border rounded px-2 py-1 bg-muted/30">
                  <span className="text-[10px] text-muted-foreground font-mono">Compare</span>
                  <input
                    type="number"
                    value={item.comparePrice}
                    onChange={(e) => {
                      const copy = [...selectedVariants];
                      copy[idx] = { ...copy[idx], comparePrice: e.target.value };
                      setSelectedVariants(copy);
                    }}
                    placeholder="Optional"
                    className="w-full text-xs bg-transparent focus:outline-none font-medium text-muted-foreground"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVariants(selectedVariants.filter((_, i) => i !== idx))}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  title="Remove variant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-2">No sizes selected (default standalone product).</p>
        )}

        <div>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Quick toggle sizes:</p>
          <div className="flex flex-wrap gap-1.5">
            {["Small", "Medium", "Large", "XL", "2XL", "3XL"].map((v) => {
              const activeIdx = selectedVariants.findIndex((x) => (typeof x === "string" ? x : x.name).toLowerCase() === v.toLowerCase());
              const active = activeIdx >= 0;
              return (
                <button
                  type="button"
                  key={v}
                  onClick={() => {
                    if (active) {
                      setSelectedVariants(selectedVariants.filter((_, i) => i !== activeIdx));
                    } else {
                      setSelectedVariants([...selectedVariants, { name: v, price: "", comparePrice: "", image: "" }]);
                    }
                  }}
                  className={`px-3 py-1 rounded text-[11px] border uppercase tracking-wider transition-all font-medium ${
                    active ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {active ? `✓ ${v}` : `+ ${v}`}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Type custom size (e.g. 500ml, King Size)..."
            value={customVariant}
            onChange={(e) => setCustomVariant(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const clean = customVariant.trim();
                if (clean && !selectedVariants.some((x) => (typeof x === "string" ? x : x.name).toLowerCase() === clean.toLowerCase())) {
                  setSelectedVariants([...selectedVariants, { name: clean, price: "", comparePrice: "" }]);
                  setCustomVariant("");
                }
              }
            }}
            className="flex-1 border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-foreground bg-background"
          />
          <button
            type="button"
            onClick={() => {
              const clean = customVariant.trim();
              if (clean && !selectedVariants.some((x) => (typeof x === "string" ? x : x.name).toLowerCase() === clean.toLowerCase())) {
                setSelectedVariants([...selectedVariants, { name: clean, price: "", comparePrice: "" }]);
                setCustomVariant("");
              }
            }}
            className="bg-muted text-foreground border border-input px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-foreground hover:text-background transition-colors"
          >
            ADD SIZE
          </button>
        </div>
      </div>

      {/* Color Options & Add-on Pricing */}
      <div className="space-y-4 border p-4 rounded-sm bg-muted/20">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-widest text-foreground flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" /> Color Options & Add-on Pricing ({selectedColors.length})
          </label>
          {selectedColors.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedColors([])}
              className="text-[10px] text-destructive hover:underline lowercase font-normal"
            >
              clear all
            </button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Add color variations or finishes (e.g. Gold Finish, Rose Gold, Black Frame). Enter any extra add-on price (e.g. 500) that will be added to the size price. Put 0 or leave blank for no extra charge.
        </p>

        {selectedColors.length > 0 ? (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {selectedColors.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 bg-background p-2.5 border rounded-sm shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="relative shrink-0 w-9 h-9 border rounded overflow-hidden bg-muted flex items-center justify-center">
                    {item.image ? (
                      <>
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...selectedColors];
                            copy[idx] = { ...copy[idx], image: "" };
                            setSelectedColors(copy);
                          }}
                          className="absolute inset-0 bg-black/60 text-white opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                          title="Remove color image"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors" title="Upload Color Image">
                        <Upload className="h-3.5 w-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (reader.result) {
                                  const copy = [...selectedColors];
                                  copy[idx] = { ...copy[idx], image: reader.result as string };
                                  setSelectedColors(copy);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const copy = [...selectedColors];
                        copy[idx] = { ...copy[idx], name: e.target.value };
                        setSelectedColors(copy);
                      }}
                      placeholder="Color / Finish Name (e.g. Gold Finish)"
                      className="w-full text-xs font-semibold uppercase tracking-wider bg-transparent focus:outline-none border-b py-1 border-transparent focus:border-foreground"
                    />
                  </div>
                  <div className="w-1/3 flex items-center gap-1 border rounded px-2 py-1 bg-muted/30">
                    <span className="text-[10px] text-muted-foreground font-mono">+ PKR</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const copy = [...selectedColors];
                        copy[idx] = { ...copy[idx], price: e.target.value };
                        setSelectedColors(copy);
                      }}
                      placeholder="Extra Price (0 for standard)"
                      className="w-full text-xs bg-transparent focus:outline-none font-medium text-primary font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedColors(selectedColors.filter((_, i) => i !== idx))}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    title="Remove color option"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-2">No color add-ons defined.</p>
        )}

        <div>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Quick toggle popular colors & finishes:</p>
          <div className="flex flex-wrap gap-1.5">
            {["Standard", "Noir Fig", "Linen Smoke", "Tobacco Rose", "Unframed", "Oak Frame", "Black Frame", "Gold Finish", "Rose Gold", "Matte Black", "Antique Bronze", "Silver Chrome", "Natural Wood", "Walnut Finish"].map((c) => {
              const activeIdx = selectedColors.findIndex((x) => x.name.toLowerCase() === c.toLowerCase());
              const active = activeIdx >= 0;
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => {
                    if (active) {
                      setSelectedColors(selectedColors.filter((_, i) => i !== activeIdx));
                    } else {
                      setSelectedColors([...selectedColors, { name: c, price: c === "Standard" ? "0" : "", image: "" }]);
                    }
                  }}
                  className={`px-3 py-1 rounded text-[11px] border uppercase tracking-wider transition-all font-medium ${
                    active ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {active ? `✓ ${c}` : `+ ${c}`}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Type custom color (e.g. Velvet Blue, Glossy White)..."
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const clean = customColor.trim();
                if (clean && !selectedColors.some((x) => x.name.toLowerCase() === clean.toLowerCase())) {
                  setSelectedColors([...selectedColors, { name: clean, price: "" }]);
                  setCustomColor("");
                }
              }
            }}
            className="flex-1 border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-foreground bg-background"
          />
          <button
            type="button"
            onClick={() => {
              const clean = customColor.trim();
              if (clean && !selectedColors.some((x) => x.name.toLowerCase() === clean.toLowerCase())) {
                setSelectedColors([...selectedColors, { name: clean, price: "" }]);
                setCustomColor("");
              }
            }}
            className="bg-secondary text-secondary-foreground px-3.5 py-2 text-xs uppercase tracking-wider rounded-sm hover:bg-secondary/80 font-medium transition-colors"
          >
            Add Color
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-2 border-t">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none font-medium"><input type="checkbox" name="isFeatured" defaultChecked={editing?.is_featured} className="rounded" /> Featured</label>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none font-medium"><input type="checkbox" name="isNew" defaultChecked={editing?.is_new} className="rounded" /> New</label>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none font-medium"><input type="checkbox" name="isTrending" defaultChecked={editing?.is_trending} className="rounded" /> Trending</label>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none font-medium"><input type="checkbox" name="isBestSeller" defaultChecked={editing?.is_best_seller} className="rounded" /> Best Seller</label>
      </div>

      <button disabled={saveMutation.isPending} className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.2em] mt-6 hover:bg-primary transition-colors disabled:opacity-50 font-medium">
        {saveMutation.isPending ? "Saving Product..." : editing ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
