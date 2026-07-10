import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { fmtPKR, type Product } from "@/lib/types";
import { toast } from "sonner";

export function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: (p: Product) => void }) {
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const add = useStore((s) => s.add);
  const isWished = wishlist.includes(product.id);
  const [hover, setHover] = useState(false);
  const img1 = product.images[0] ?? "https://placehold.co/800x1000";
  const img2 = product.images[1] ?? img1;
  const onSale = product.compare_price && product.compare_price > product.price;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-sand">
          <motion.img
            src={img1} alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
            animate={{ opacity: hover ? 0 : 1, scale: hover ? 1.05 : 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.img
            src={img2} alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: hover ? 1 : 0, scale: hover ? 1.05 : 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new && <span className="bg-background/90 text-foreground text-[10px] uppercase tracking-[0.18em] px-2 py-1">New</span>}
            {onSale && <span className="bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.18em] px-2 py-1">Sale</span>}
            {product.is_best_seller && !product.is_new && <span className="bg-foreground text-background text-[10px] uppercase tracking-[0.18em] px-2 py-1">Best Seller</span>}
          </div>

          {/* wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className="absolute top-3 right-3 bg-background/90 p-2 hover:bg-background"
            aria-label="Wishlist"
          >
            <Heart className={`h-4 w-4 ${isWished ? "fill-primary text-primary" : ""}`} />
          </button>

          {/* hover actions */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: hover ? 0 : 16, opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-3 left-3 right-3 flex gap-2"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                add({ productId: product.id, slug: product.slug, name: product.name, price: product.price, image: img1, quantity: 1 });
                toast.success(`${product.name} added`);
              }}
              className="flex-1 bg-foreground text-background text-[11px] uppercase tracking-[0.18em] py-3 inline-flex items-center justify-center gap-2 hover:bg-primary"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
            </button>
            {onQuickView && (
              <button onClick={(e) => { e.preventDefault(); onQuickView(product); }} className="bg-background border border-foreground p-3 hover:bg-foreground hover:text-background" aria-label="Quick view">
                <Eye className="h-3.5 w-3.5" />
              </button>
            )}
          </motion.div>
        </div>

        <div className="pt-4">
          <h3 className="text-sm font-medium leading-tight">{product.name}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm">{fmtPKR(product.price)}</span>
            {onSale && <span className="text-xs text-muted-foreground line-through">{fmtPKR(product.compare_price!)}</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}
