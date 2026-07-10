import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Truck, RotateCcw, Minus, Plus, Star, ChevronDown } from "lucide-react";
import { StoreLayout } from "@/components/storefront/layout";
import { productQuery, productsQuery, reviewsQuery, categoriesQuery } from "@/lib/queries";
import { useStore } from "@/lib/store";
import { fmtPKR } from "@/lib/types";
import { Reveal } from "@/components/storefront/section";
import { ProductCard } from "@/components/storefront/product-card";
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
  const [zoom, setZoom] = useState({ active: false, x: 0, y: 0 });
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  useEffect(() => { pushRecent(product.id); }, [product.id, pushRecent]);

  const variantsList = useMemo(() => {
    if (Array.isArray(product.variants) && product.variants.length === 0) {
      const cat = cats.find((c) => c.id === product.category_id);
      if (cat?.slug === "candles") return ["Noir Fig", "Linen Smoke", "Tobacco Rose"];
      if (cat?.slug === "vases" || cat?.slug === "planters") return ["Small", "Medium", "Large"];
      if (cat?.slug === "wall-art") return ["Unframed", "Oak Frame", "Black Frame"];
      return [];
    }
    return [];
  }, [product, cats]);

  const related = all.filter((p) => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);
  const recentProducts = all.filter((p) => recent.includes(p.id) && p.id !== product.id).slice(0, 4);
  const fbt = all.filter((p) => p.id !== product.id && p.is_featured).slice(0, 3);
  const onSale = product.compare_price && product.compare_price > product.price;
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 5;
  const isWished = wishlist.includes(product.id);

  const handleAdd = () => {
    add({ productId: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0], quantity: qty, variant });
    toast.success(`${product.name} added to bag`);
  };

  return (
    <StoreLayout>
      {/* Breadcrumb */}
      <nav className="container-x pt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/shop" className="hover:text-foreground">Shop</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <section className="container-x py-10 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 self-start">
          <div
            className="relative aspect-[4/5] overflow-hidden bg-sand cursor-zoom-in"
            onMouseEnter={() => setZoom((z) => ({ ...z, active: true }))}
            onMouseLeave={() => setZoom({ active: false, x: 0, y: 0 })}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ active: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
          >
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
              style={zoom.active ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: "scale(1.6)" } : {}}
            />
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
            {(product.images as string[]).map((src: string, i: number) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 w-20 h-24 overflow-hidden border ${activeImg === i ? "border-foreground" : "border-transparent opacity-70"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow">{cats.find((c) => c.id === product.category_id)?.name}</p>
          <h1 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex text-primary">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-current" : ""}`} />)}</div>
            <span className="text-xs text-muted-foreground">{reviews.length} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-2xl">{fmtPKR(product.price)}</span>
            {onSale && (<>
              <span className="text-muted-foreground line-through">{fmtPKR(product.compare_price!)}</span>
              <span className="text-xs uppercase tracking-[0.18em] bg-primary text-primary-foreground px-2 py-1">Save {fmtPKR(product.compare_price! - product.price)}</span>
            </>)}
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          {variantsList.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow mb-3">Variant</p>
              <div className="flex flex-wrap gap-2">
                {variantsList.map((v) => (
                  <button key={v} onClick={() => setVariant(v)} className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border ${variant === v ? "border-foreground bg-foreground text-background" : "border-input hover:border-foreground"}`}>{v}</button>
                ))}
              </div>
            </div>
          )}

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
            <button onClick={handleAdd} className="bg-foreground text-background py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary transition-colors">Add to Bag</button>
            <Link to="/checkout" onClick={handleAdd} className="bg-primary text-primary-foreground py-4 text-xs uppercase tracking-[0.2em] text-center hover:opacity-90">Buy Now</Link>
            <button onClick={() => toggleWishlist(product.id)} className="border px-4 py-4" aria-label="Wishlist">
              <Heart className={`h-5 w-5 ${isWished ? "fill-primary text-primary" : ""}`} />
            </button>
          </div>

          {/* Trust */}
          <div className="mt-10 grid grid-cols-3 gap-4 text-xs">
            {[
              { Icon: Truck, t: "Free over PKR 10k" },
              { Icon: RotateCcw, t: "30-day returns" },
              { Icon: ShieldCheck, t: "Secure COD" },
            ].map((b) => (
              <div key={b.t} className="border p-3 flex flex-col items-center text-center"><b.Icon className="h-4 w-4 mb-2 text-primary" />{b.t}</div>
            ))}
          </div>

          {/* Accordion */}
          <div className="mt-12 divide-y border-y">
            {[
              { t: "Specifications", c: (
                <ul className="text-sm text-muted-foreground space-y-1">
                  {Object.entries(product.specs ?? {}).map(([k, v]) => <li key={k}><span className="text-foreground">{k}:</span> {v as string}</li>)}
                </ul>
              )},
              { t: "Shipping", c: <p className="text-sm text-muted-foreground">Free shipping on orders over PKR 10,000. Standard delivery 3–5 business days nationwide. Cash on Delivery available.</p> },
              { t: "Refund & Returns", c: <p className="text-sm text-muted-foreground">30-day no-questions-asked returns. Items must be unused and in original packaging. See full refund policy.</p> },
              { t: "FAQ", c: (
                <div className="text-sm text-muted-foreground space-y-3">
                  <p><b className="text-foreground">Is this hand-made?</b> Yes — every piece is made by hand and may have subtle variation.</p>
                  <p><b className="text-foreground">Do you ship internationally?</b> Currently we ship across Pakistan. International by request.</p>
                  <p><b className="text-foreground">Care?</b> Wipe with a soft, dry cloth. Avoid harsh chemicals.</p>
                </div>
              )},
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
        </div>
      </section>

      {/* Reviews */}
      <section className="container-x py-20 border-t">
        <p className="eyebrow">Reviews</p>
        <h2 className="font-display text-4xl mt-3">What people are saying.</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((r) => (
            <Reveal key={r.id}>
              <div className="border p-6 h-full">
                <div className="flex text-primary">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-current" : ""}`} />)}</div>
                <p className="font-display text-xl mt-4">{r.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">— {r.customer_name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FBT */}
      {fbt.length > 0 && (
        <section className="container-x py-20 border-t">
          <p className="eyebrow">Frequently bought together</p>
          <h2 className="font-display text-4xl mt-3">Pairs well with.</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {fbt.map((p) => (
              <motion.div key={p.id} whileHover={{ y: -4 }}><ProductCard product={p} /></motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="container-x py-20 border-t">
          <p className="eyebrow">More from this collection</p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}

      {/* Recently viewed */}
      {recentProducts.length > 0 && (
        <section className="container-x py-20 border-t">
          <p className="eyebrow">Recently viewed</p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">{recentProducts.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </StoreLayout>
  );
}
