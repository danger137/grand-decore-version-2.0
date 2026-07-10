import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useStore, useCartTotals } from "@/lib/store";
import { fmtPKR } from "@/lib/types";

export function CartDrawer() {
  const open = useStore((s) => s.open);
  const setOpen = useStore((s) => s.setOpen);
  const items = useStore((s) => s.items);
  const setQty = useStore((s) => s.setQty);
  const remove = useStore((s) => s.remove);
  const { subtotal } = useCartTotals();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-black/40" />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.7, 0, 0.3, 1], duration: 0.45 }}
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[460px] bg-background flex flex-col"
          >
            <header className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <p className="eyebrow">Your bag</p>
                <h2 className="font-display text-2xl">{items.length} {items.length === 1 ? "item" : "items"}</h2>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close cart"><X className="h-5 w-5" /></button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-3xl">Your bag is empty</p>
                  <p className="mt-2 text-sm text-muted-foreground">Begin with our most-loved pieces.</p>
                  <Link to="/shop" onClick={() => setOpen(false)} className="mt-6 bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.18em]">Shop the edit</Link>
                </div>
              ) : (
                <ul className="divide-y">
                  {items.map((i) => (
                    <li key={`${i.productId}-${i.variant ?? ""}`} className="flex gap-4 py-5">
                      <Link to="/product/$slug" params={{ slug: i.slug }} onClick={() => setOpen(false)} className="shrink-0">
                        <img src={i.image} alt={i.name} className="w-24 h-28 object-cover bg-muted" />
                      </Link>
                      <div className="flex-1">
                        <div className="flex justify-between gap-2">
                          <div>
                            <Link to="/product/$slug" params={{ slug: i.slug }} onClick={() => setOpen(false)} className="font-medium leading-tight hover:text-primary">{i.name}</Link>
                            {i.variant && <p className="text-xs text-muted-foreground mt-0.5">{i.variant}</p>}
                          </div>
                          <p className="text-sm">{fmtPKR(i.price * i.quantity)}</p>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border">
                            <button onClick={() => setQty(i.productId, i.quantity - 1, i.variant)} className="px-2 py-1.5"><Minus className="h-3 w-3" /></button>
                            <span className="w-8 text-center text-sm">{i.quantity}</span>
                            <button onClick={() => setQty(i.productId, i.quantity + 1, i.variant)} className="px-2 py-1.5"><Plus className="h-3 w-3" /></button>
                          </div>
                          <button onClick={() => remove(i.productId, i.variant)} className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Remove</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t px-6 py-5 space-y-4">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-medium">{fmtPKR(subtotal)}</span></div>
                <p className="text-xs text-muted-foreground">Shipping calculated at checkout. Free shipping over PKR 10,000.</p>
                <Link to="/checkout" onClick={() => setOpen(false)} className="block w-full text-center bg-foreground text-background py-4 text-xs uppercase tracking-[0.18em] hover:bg-primary transition-colors">Checkout</Link>
                <button onClick={() => setOpen(false)} className="block w-full text-center text-xs uppercase tracking-[0.18em] py-2 link-underline mx-auto">Continue shopping</button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
