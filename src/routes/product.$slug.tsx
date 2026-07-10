import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Truck, RotateCcw, Minus, Plus, Star, ChevronDown } from "lucide-react";
import { StoreLayout } from "@/components/storefront/layout";
import { productQuery, productsQuery, reviewsQuery, categoriesQuery } from "@/lib/queries";
import { createReviewFn } from "@/lib/api";
import { useStore } from "@/lib/store";
import { fmtPKR, parseReviewBody } from "@/lib/types";
import { Reveal } from "@/components/storefront/section";
import { ProductCard } from "@/components/storefront/product-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!p) throw notFound();
    context.queryClient.ensureQueryData(reviewsQuery(p.id));
    context.queryClient.ensureQueryData(productsQuery);
    context.queryClient.ensureQueryData(categoriesQuery);
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — GrandDecore` },
      { name: "description", content: loaderData.description ?? "Hand-crafted home decor by GrandDecore." },
      { property: "og:title", content: loaderData.name },
      { property: "og:description", content: loaderData.description ?? "" },
      { property: "og:image", content: loaderData.images[0] ?? "" },
    ] : [],
  }),
  notFoundComponent: () => (
    <StoreLayout>
      <div className="container-x py-32 text-center">
        <p className="eyebrow justify-center">404</p>
        <h1 className="font-display text-5xl mt-4">Piece not found</h1>
        <Link to="/shop" className="inline-block mt-6 link-underline text-xs uppercase tracking-[0.18em]">Browse the edit →</Link>
      </div>
    </StoreLayout>
  ),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const { data: reviews } = useSuspenseQuery(reviewsQuery(product.id));
  const { data: all } = useSuspenseQuery(productsQuery);
  const { data: cats } = useSuspenseQuery(categoriesQuery);
  const add = useStore((s) => s.add);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);
  const pushRecent = useStore((s) => s.pushRecent);
  const recent = useStore((s) => s.recent);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [zoom, setZoom] = useState({ active: false, x: 0, y: 0 });
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewImg, setReviewImg] = useState<string>("");
  const qc = useQueryClient();

  const submitReviewMutation = useMutation({
    mutationFn: (data: any) => createReviewFn({ data }),
    onSuccess: () => {
      toast.success("Thank you for your review!");
      qc.invalidateQueries({ queryKey: ["reviews", product.id] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin_reviews"] });
      setReviewOpen(false);
      setReviewImg("");
    },
    onError: (err: any) => toast.error(err.message || "Failed to submit review"),
  });

  const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(fd.entries());
    data.productId = product.id;
    data.rating = Number(data.rating);
    const bodyObj = {
      text: fd.get("body") ? String(fd.get("body")) : "",
      packageQuality: fd.get("packageQuality") ? String(fd.get("packageQuality")) : "",
      image: reviewImg || "",
    };
    data.body = JSON.stringify(bodyObj);
    submitReviewMutation.mutate(data);
  };

  useEffect(() => { pushRecent(product.id); }, [product.id, pushRecent]);

  // FIXED: previously, any product with an empty "variants" field fell back to a
  // hardcoded guess (Small/Medium/Large/XL, or candle/wall-art names based on
  // category) which made every product show sizes it never actually had.
  // Now: if the product has no variants saved in the admin panel, none are shown.
  const variantsList = useMemo(() => {
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants.map((v: any) =>
        typeof v === "string"
          ? { name: v, price: null, comparePrice: null, image: null }
          : {
            name: v.name,
            price: v.price !== undefined && v.price !== null ? Number(v.price) : null,
            comparePrice: v.comparePrice !== undefined && v.comparePrice !== null ? Number(v.comparePrice) : (v.compare_price !== undefined && v.compare_price !== null ? Number(v.compare_price) : null),
            image: v.image || null,
          }
      );
    }
    return [];
  }, [product]);

  const activeVariantObj = useMemo(() => {
    if (!variantsList.length) return null;
    return variantsList.find((v) => v.name === variant) || variantsList[0];
  }, [variantsList, variant]);

  const colorsList = useMemo(() => {
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      return product.colors;
    }
    if (product.specs && typeof product.specs === "object" && product.specs.colors && Array.isArray(product.specs.colors)) {
      return product.specs.colors;
    }
    return [];
  }, [product]);

  const activeColorObj = useMemo(() => {
    if (!colorsList.length) return null;
    return colorsList.find((c: any) => (typeof c === "string" ? c : c.name) === selectedColor) || colorsList[0];
  }, [colorsList, selectedColor]);

  // FIXED: gallery thumbnails now also include each variant's own image (not just color images),
  // so switching size can bring its photo into the strip and into the main viewer.
  const displayImages = useMemo(() => {
    const list: string[] = Array.isArray(product.images) ? [...product.images] : [];
    variantsList.forEach((v: any) => {
      if (v.image && typeof v.image === "string" && !list.includes(v.image)) {
        list.push(v.image);
      }
    });
    colorsList.forEach((c: any) => {
      const img = typeof c === "object" ? c.image : null;
      if (img && typeof img === "string" && !list.includes(img)) {
        list.push(img);
      }
    });
    return list.length > 0 ? list : ["/placeholder.jpg"];
  }, [product.images, variantsList, colorsList]);

  const colorAddonPrice = activeColorObj ? (typeof activeColorObj === "object" && activeColorObj.price ? Number(activeColorObj.price) : 0) : 0;

  const basePrice = activeVariantObj?.price ? Number(activeVariantObj.price) : product.price;
  const baseComparePrice = activeVariantObj?.comparePrice ? Number(activeVariantObj.comparePrice) : product.compare_price;

  const totalActivePrice = basePrice + colorAddonPrice;
  const totalActiveComparePrice = baseComparePrice ? baseComparePrice + colorAddonPrice : null;
  const onSale = totalActiveComparePrice && totalActiveComparePrice > totalActivePrice;

  const related = all.filter((p) => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);
  const recentProducts = all.filter((p) => recent.includes(p.id) && p.id !== product.id).slice(0, 4);
  const fbt = all.filter((p) => p.id !== product.id && p.is_featured).slice(0, 3);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 5;
  const isWished = wishlist.includes(product.id);

  // FIXED: Add to Bag / Buy Now used to always send product.images[0], ignoring whatever
  // image was actually being shown for the selected variant/color. Now it sends the image
  // that's actually on screen, so the cart + order match exactly what the customer picked.
  const activeDisplayImage = displayImages[activeImg] || displayImages[0] || product.images[0];

  const handleAdd = () => {
    const varName = variant || activeVariantObj?.name;
    const colName = selectedColor || (activeColorObj ? (typeof activeColorObj === "string" ? activeColorObj : activeColorObj.name) : undefined);
    const finalVariantName = colName ? `${varName || ""} — ${colName}` : varName;
    add({ productId: product.id, slug: product.slug, name: product.name, price: totalActivePrice, image: activeDisplayImage, quantity: qty, variant: finalVariantName });
    toast.success(`${product.name} (${finalVariantName || ""}) added to bag`);
  };

  return (
    <StoreLayout>
      {/* Breadcrumb */}
      <nav className="container-x pt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/shop" className="hover:text-foreground">Shop</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <section className="container-x py-10 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 overflow-hidden">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 self-start w-full max-w-full min-w-0">
          <div
            className="relative w-full max-w-full aspect-[4/5] overflow-hidden bg-sand cursor-zoom-in"
            onMouseEnter={() => setZoom((z) => ({ ...z, active: true }))}
            onMouseLeave={() => setZoom({ active: false, x: 0, y: 0 })}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ active: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
          >
            <img
              src={displayImages[activeImg] || displayImages[0]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
              style={zoom.active ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: "scale(1.6)" } : {}}
            />
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
            {(displayImages as string[]).map((src: string, i: number) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 w-20 h-24 overflow-hidden border ${activeImg === i ? "border-foreground" : "border-transparent opacity-70"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 w-full max-w-full">
          <p className="eyebrow text-[#4CC157]">{cats.find((c) => c.id === product.category_id)?.name}</p>
          <h1 className="text-2xl md:text-2xl mt-3 leading-[1.05] break-words font-[600]" style={{ fontFamily: "revert", }}>{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex text-[#E7CB48]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-current" : ""}`} />)}</div>
            <span className="text-xs text-muted-foreground">{reviews.length} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3 transition-all duration-300">
            <span className="text-3xl text-muted-foregroun" style={{ color: '#000', fontWeight: '600' }}>{fmtPKR(totalActivePrice)}</span>
            {onSale && (<>
              <span className="text-muted-foreground line-through text-lg">{fmtPKR(totalActiveComparePrice!)}</span>
              <span className="text-xs uppercase tracking-[0.18em] bg-primary text-primary-foreground px-2 py-1 font-semibold animate-pulse">Save {fmtPKR(totalActiveComparePrice! - totalActivePrice)}</span>
            </>)}
          </div>

          {/* <p className="mt-6 text-muted-foreground leading-relaxed break-words whitespace-pre-line">{product.description}</p> */}

          {variantsList.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <p className="eyebrow">Select Size / Variant</p>
                {activeVariantObj?.price && (
                  <span className="text-xs text-primary font-mono font-medium">
                    {/* {activeVariantObj.name}: {fmtPKR(basePrice)} */}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {variantsList.map((v) => {
                  const isSelected = (variant || variantsList[0]?.name) === v.name;
                  const vPrice = v.price ? Number(v.price) : product.price;
                  return (
                    <button
                      key={v.name}
                      onClick={() => {
                        setVariant(v.name);
                        // FIXED: selecting a size now also swaps to that size's own
                        // photo (when it has one) — previously only colors did this.
                        if (v.image && typeof v.image === "string") {
                          const idx = displayImages.indexOf(v.image);
                          if (idx >= 0) setActiveImg(idx);
                        }
                      }}
                      className={`px-4 py-2.5 text-xs uppercase tracking-[0.18em] border flex items-center gap-2 transition-all duration-200 ${isSelected
                        ? "border-foreground bg-foreground text-background font-semibold shadow-md scale-105"
                        : "border-input hover:border-foreground text-muted-foreground hover:text-foreground bg-background"
                        }`}
                    >
                      <span>{v.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )
          }

          {
            colorsList.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="eyebrow">Select Color / Finish</p>
                  {colorAddonPrice > 0 && (
                    <span className="text-xs text-primary font-mono font-medium">
                      {/* + {fmtPKR(colorAddonPrice)} */}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {colorsList.map((c: any) => {
                    const cName = typeof c === "string" ? c : c.name;
                    const cPrice = typeof c === "object" && c.price ? Number(c.price) : 0;
                    const cImage = typeof c === "object" ? c.image : null;
                    const isSelected = (selectedColor || (typeof colorsList[0] === "string" ? colorsList[0] : colorsList[0]?.name)) === cName;
                    return (
                      <button
                        key={cName}
                        onClick={() => {
                          setSelectedColor(cName);
                          if (cImage && typeof cImage === "string") {
                            const idx = displayImages.indexOf(cImage);
                            if (idx >= 0) setActiveImg(idx);
                          }
                        }}
                        className={`px-4 py-2.5 text-xs uppercase tracking-[0.18em] border flex items-center gap-2 transition-all duration-200 ${isSelected
                          ? "border-primary bg-primary text-primary-foreground font-semibold shadow-md scale-105"
                          : "border-input hover:border-foreground text-muted-foreground hover:text-foreground bg-background"
                          }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {cImage ? (
                            <img src={cImage} alt="" className="w-4 h-4 rounded-full object-cover border border-foreground/20 shrink-0" />
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full border bg-current inline-block opacity-75"></span>
                          )}
                          {cName}
                        </span>
                        {cPrice > 0 && (
                          <span className={`text-[10px] font-mono font-normal ${isSelected ? "text-primary-foreground/80" : "text-primary"}`}>
                            (+{fmtPKR(cPrice)})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          }

          <div className="mt-8 flex items-center gap-4">
            <div className="inline-flex items-center border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-3"><Minus className="h-4 w-4" /></button>
              <span className="w-12 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-3"><Plus className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-muted-foreground">{product.inventory > 0 ? `${product.inventory} in stock` : "Pre-order"}</p>
          </div>

          {/* Sticky CTAs */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 sticky bottom-0 bg-background pt-3 pb-2 z-10">
            <button onClick={handleAdd} className="bg-foreground text-background py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary transition-colors whitespace-nowrap">Add to Bag</button>
            <Link to="/checkout" onClick={handleAdd} className="bg-primary text-primary-foreground py-4 text-xs uppercase tracking-[0.2em] text-center hover:opacity-90 whitespace-nowrap">Buy Now</Link>
            <button onClick={() => toggleWishlist(product.id)} className="border px-4 py-4" aria-label="Wishlist">
              <Heart className={`h-5 w-5 ${isWished ? "fill-primary text-primary" : ""}`} />
            </button>
          </div>

          {/* Trust */}
          <div className="mt-10 grid grid-cols-3 gap-4 text-xs">
            {[
              { Icon: Truck, t: "Free Shipping" },
              { Icon: RotateCcw, t: "30-day returns" },
              { Icon: ShieldCheck, t: "Secure COD" },
            ].map((b) => (
              <div key={b.t} className="border p-3 flex flex-col items-center text-center"><b.Icon className="h-4 w-4 mb-2 text-primary" />{b.t}</div>
            ))}
          </div>

          {/* Accordion */}
          <div className="mt-12 divide-y border-y">
            {[
              {
                t: "Specifications", c: (
                  Object.entries(product.specs ?? {}).length > 0 ? (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {Object.entries(product.specs ?? {}).map(([k, v]) => <li key={k}><span className="text-foreground">{k}:</span> {v as string}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-pre-line">
                      {product.description || "No specifications listed for this product."}
                    </p>
                  )
                )
              },
              { t: "Shipping", c: <p className="text-sm text-muted-foreground">Free Shipping Across Pakistan. Standard delivery 3–5 business days nationwide. Cash on Delivery available.</p> },
              { t: "Refund & Returns", c: <p className="text-sm text-muted-foreground">30-day no-questions-asked returns. Items must be unused and in original packaging. See full refund policy.</p> },
              {
                t: "FAQ", c: (
                  <div className="text-sm text-muted-foreground space-y-3">
                    <p><b className="text-foreground">Is this hand-made?</b> Yes — every piece is made by hand and may have subtle variation.</p>
                    <p><b className="text-foreground">Do you ship internationally?</b> Currently we ship across Pakistan. International by request.</p>
                    <p><b className="text-foreground">Care?</b> Wipe with a soft, dry cloth. Avoid harsh chemicals.</p>
                  </div>
                )
              },
            ].map((row, i) => (
              <div key={row.t}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex justify-between items-center py-5 text-left">
                  <span className="text-xs uppercase tracking-[0.18em]">{row.t}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${faqOpen === i ? "rotate-180" : ""}`} />
                </button>
                {faqOpen === i && <div className="pb-5">{row.c}</div>}
              </div>
            ))}
          </div>
        </div >
      </section >

      {/* Reviews */}
      < section className="container-x py-20 border-t" >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="font-display text-4xl mt-3">What people are saying.</h2>
          </div>
          <Dialog open={reviewOpen} onOpenChange={(v) => { setReviewOpen(v); if (!v) setReviewImg(""); }}>
            <DialogTrigger asChild>
              <button className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-primary transition-colors self-start sm:self-auto">
                Write a Review
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Write a Review for {product.name}</DialogTitle></DialogHeader>
              <form onSubmit={handleReviewSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Your Name</label>
                    <input required name="customerName" placeholder="e.g. Hassan R." className="w-full border-b py-2 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Rating</label>
                    <select required name="rating" defaultValue={5} className="w-full border-b py-2 focus:outline-none bg-transparent">
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
                      <option value={3}>⭐⭐⭐ (3 - Average)</option>
                      <option value={2}>⭐⭐ (2 - Fair)</option>
                      <option value={1}>⭐ (1 - Poor)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Title</label>
                  <input required name="title" placeholder="e.g. Worth every rupee" className="w-full border-b py-2 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Packaging & Delivery Quality</label>
                  <input name="packageQuality" placeholder="e.g. 10/10 Bubble wrapped & double boxed safely" className="w-full border-b py-2 focus:outline-none text-xs" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Upload Product Photo (Optional)</label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded text-xs font-medium transition-colors">
                      Choose Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (reader.result) setReviewImg(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {reviewImg && (
                      <div className="relative w-10 h-10 border rounded overflow-hidden">
                        <img src={reviewImg} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setReviewImg("")} className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-[10px] opacity-0 hover:opacity-100 transition-opacity">✕</button>
                      </div>
                    )}
                    <span className="text-[11px] text-muted-foreground">{reviewImg ? "Photo attached" : "No file selected"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Review</label>
                  <textarea required name="body" rows={3} placeholder="Tell us what you liked about this piece..." className="w-full border-b py-2 focus:outline-none" />
                </div>
                <button disabled={submitReviewMutation.isPending} className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-widest mt-6 hover:bg-primary transition-colors">
                  {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {
          reviews.length === 0 ? (
            <div className="mt-10 border p-12 text-center text-muted-foreground">
              <p className="font-display text-xl text-foreground">No reviews yet for this piece.</p>
              <p className="mt-2 text-sm">Be the first to experience and share your thoughts on the {product.name}.</p>
              <button onClick={() => setReviewOpen(true)} className="mt-6 inline-block text-xs uppercase tracking-widest link-underline">
                Write the first review →
              </button>
            </div>
          ) : (
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {reviews.map((r) => {
                const parsed = parseReviewBody(r.body);
                return (
                  <Reveal key={r.id}>
                    <div className="border p-6 h-full flex flex-col justify-between bg-background shadow-xs">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex text-primary">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-current" : ""}`} />)}</div>
                          <span className="text-xs font-semibold text-muted-foreground">{r.rating}/5</span>
                        </div>
                        <p className="font-display text-xl mt-4 text-foreground">{r.title}</p>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{parsed.text}</p>
                        {parsed.packageQuality && (
                          <div className="mt-3 bg-muted/40 border border-muted px-3 py-1.5 rounded text-xs text-foreground flex items-center gap-1.5">
                            <span className="font-semibold text-primary shrink-0">📦 Packaging:</span>
                            <span className="line-clamp-1">{parsed.packageQuality}</span>
                          </div>
                        )}
                        {parsed.image && (
                          <div className="mt-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="relative w-20 h-20 rounded border overflow-hidden cursor-pointer group shadow-sm">
                                  <img src={parsed.image} alt="Customer review photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-medium">View</div>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-xl p-2 bg-background">
                                <img src={parsed.image} alt="Customer review photo full" className="w-full max-h-[80vh] object-contain rounded mx-auto" />
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>
                      <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">— {r.customer_name}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )
        }
      </section >

      {/* FBT */}
      {
        fbt.length > 0 && (
          <section className="container-x py-20 border-t">
            <p className="eyebrow">Frequently bought together</p>
            <h2 className="font-display text-4xl mt-3">Pairs well with.</h2>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {fbt.map((p) => (
                <motion.div key={p.id} whileHover={{ y: -4 }}><ProductCard product={p} /></motion.div>
              ))}
            </div>
          </section>
        )
      }

      {/* Related */}
      {
        related.length > 0 && (
          <section className="container-x py-20 border-t">
            <p className="eyebrow">More from this collection</p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )
      }

      {/* Recently viewed */}
      {
        recentProducts.length > 0 && (
          <section className="container-x py-20 border-t">
            <p className="eyebrow">Recently viewed</p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">{recentProducts.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )
      }
    </StoreLayout >
  );
}