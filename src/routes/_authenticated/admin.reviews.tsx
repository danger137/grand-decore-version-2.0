import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Star, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { adminReviewsQuery, productsQuery } from "@/lib/queries";
import { adminSaveReviewFn, adminDeleteReviewFn } from "@/lib/api";
import { parseReviewBody, type Review } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(adminReviewsQuery);
    context.queryClient.ensureQueryData(productsQuery);
  },
  component: AdminReviews,
});

function AdminReviews() {
  const { data: reviews } = useSuspenseQuery(adminReviewsQuery);
  const { data: products } = useSuspenseQuery(productsQuery);
  const qc = useQueryClient();

  const [editing, setEditing] = useState<Review | null>(null);
  const [editImg, setEditImg] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const saveMutation = useMutation({
    mutationFn: (data: any) => adminSaveReviewFn({ data }),
    onSuccess: () => {
      toast.success(editing ? "Review updated" : "Review created");
      qc.invalidateQueries({ queryKey: ["admin_reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "Failed to save review"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteReviewFn({ data: id }),
    onSuccess: () => {
      toast.success("Review deleted");
      qc.invalidateQueries({ queryKey: ["admin_reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete review"),
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(fd.entries());
    if (editing) data.id = editing.id;
    data.rating = Number(data.rating);
    const bodyObj = {
      text: fd.get("text") ? String(fd.get("text")) : (fd.get("body") ? String(fd.get("body")) : ""),
      packageQuality: fd.get("packageQuality") ? String(fd.get("packageQuality")) : "",
      image: editImg !== undefined ? editImg : (editing ? parseReviewBody(editing.body).image || "" : ""),
    };
    data.body = JSON.stringify(bodyObj);
    saveMutation.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Reviews</h1>
          <p className="text-muted-foreground mt-1">Manage customer reviews and feedback dynamically.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setEditImg(undefined); } }}>
          <DialogTrigger asChild>
            <button onClick={() => { setEditing(null); setEditImg(undefined); }} className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-widest hover:bg-primary">
              <Plus className="h-4 w-4" /> Add Review
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Review" : "New Review"}</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Product</label>
                <select required name="product_id" defaultValue={editing?.product_id || ""} className="w-full border-b py-2 focus:outline-none bg-transparent">
                  <option value="" disabled>Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Customer Name</label>
                  <input required name="customer_name" defaultValue={editing?.customer_name || ""} placeholder="e.g. Ayesha K." className="w-full border-b py-2 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Rating (1 to 5)</label>
                  <select required name="rating" defaultValue={editing?.rating || 5} className="w-full border-b py-2 focus:outline-none bg-transparent">
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Average)</option>
                    <option value={2}>⭐⭐ (2 - Fair)</option>
                    <option value={1}>⭐ (1 - Poor)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Review Title</label>
                <input required name="title" defaultValue={editing?.title || ""} placeholder="e.g. Stunning piece" className="w-full border-b py-2 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Packaging & Delivery Quality</label>
                <input name="packageQuality" defaultValue={editing ? parseReviewBody(editing.body).packageQuality || "" : ""} placeholder="e.g. 10/10 Bubble wrapped & double boxed safely" className="w-full border-b py-2 focus:outline-none text-xs" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Customer Photo</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded text-xs font-medium transition-colors">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (reader.result) setEditImg(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {(editImg || (editing && parseReviewBody(editing.body).image)) && (
                    <div className="relative w-10 h-10 border rounded overflow-hidden">
                      <img src={editImg || (editing ? parseReviewBody(editing.body).image : "")} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setEditImg("")} className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-[10px] opacity-0 hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  )}
                  <span className="text-[11px] text-muted-foreground">{(editImg || (editing && parseReviewBody(editing.body).image)) ? "Photo attached" : "No photo"}</span>
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Review Content</label>
                <textarea required name="body" rows={4} defaultValue={editing ? parseReviewBody(editing.body).text : ""} placeholder="Write what the customer experienced..." className="w-full border-b py-2 focus:outline-none" />
              </div>
              <button disabled={saveMutation.isPending} className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-widest mt-6 hover:bg-primary">
                {saveMutation.isPending ? "Saving..." : "Save Review"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-background border rounded-sm overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <p className="text-sm">No reviews found in the database.</p>
            <button onClick={() => { setEditing(null); setOpen(true); }} className="mt-4 inline-block text-xs uppercase tracking-widest link-underline">
              Add the first review →
            </button>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-widest border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Review Content</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reviews.map((r) => {
                const parsed = parseReviewBody(r.body);
                return (
                <tr key={r.id} className="hover:bg-muted/50 align-top">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 min-w-[160px]">
                      {r.product_image && <img src={r.product_image} alt="" className="h-10 w-10 object-cover rounded-sm shrink-0" />}
                      <div>
                        <p className="font-medium text-foreground">{r.product_name || "Unknown Product"}</p>
                        {r.product_slug && (
                          <a href={`/product/${r.product_slug}`} target="_blank" rel="noreferrer" className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1">
                            View piece <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium min-w-[120px]">{r.customer_name}</td>
                  <td className="px-6 py-4 min-w-[100px]">
                    <div className="flex text-primary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-current" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground mt-0.5 inline-block">{r.rating} / 5</span>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <p className="font-display text-base text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{parsed.text}</p>
                    {parsed.packageQuality && (
                      <div className="mt-2 bg-muted/40 border border-muted px-2 py-1 rounded text-[11px] text-foreground inline-flex items-center gap-1.5">
                        <span className="font-semibold text-primary">📦 Pkg:</span>
                        <span>{parsed.packageQuality}</span>
                      </div>
                    )}
                    {parsed.image && (
                      <div className="mt-2 flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="w-10 h-10 rounded border overflow-hidden cursor-pointer hover:opacity-80 shrink-0">
                              <img src={parsed.image} alt="Review" className="w-full h-full object-cover" />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl p-2 bg-background">
                            <img src={parsed.image} alt="Review Full" className="w-full max-h-[80vh] object-contain rounded mx-auto" />
                          </DialogContent>
                        </Dialog>
                        <span className="text-[10px] text-muted-foreground font-mono">Customer Photo Attached</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditing(r); setEditImg(parsed.image); setOpen(true); }} className="p-2 hover:bg-accent rounded-sm" title="Edit Review">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => { if (confirm("Delete this review?")) deleteMutation.mutate(r.id); }} className="p-2 hover:bg-destructive/10 text-destructive rounded-sm" title="Delete Review">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
