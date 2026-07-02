import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

type CartState = {
  items: CartItem[];
  wishlist: string[];
  recent: string[];
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (item: CartItem) => void;
  remove: (productId: string, variant?: string) => void;
  setQty: (productId: string, qty: number, variant?: string) => void;
  clear: () => void;
  toggleWishlist: (id: string) => void;
  pushRecent: (id: string) => void;
};

const sameLine = (a: CartItem, b: { productId: string; variant?: string }) =>
  a.productId === b.productId && (a.variant ?? "") === (b.variant ?? "");

export const useStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      wishlist: [],
      recent: [],
      open: false,
      setOpen: (open) => set({ open }),
      add: (item) =>
        set((s) => {
          const existing = s.items.find((x) => sameLine(x, item));
          if (existing) {
            return {
              items: s.items.map((x) =>
                sameLine(x, item) ? { ...x, quantity: x.quantity + item.quantity } : x,
              ),
              open: true,
            };
          }
          return { items: [...s.items, item], open: true };
        }),
      remove: (productId, variant) =>
        set((s) => ({ items: s.items.filter((x) => !sameLine(x, { productId, variant })) })),
      setQty: (productId, qty, variant) =>
        set((s) => ({
          items: s.items
            .map((x) => (sameLine(x, { productId, variant }) ? { ...x, quantity: Math.max(1, qty) } : x))
            .filter((x) => x.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id],
        })),
      pushRecent: (id) =>
        set((s) => ({ recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 8) })),
    }),
    { name: "granddecore-cart" },
  ),
);

export const useCartTotals = () => {
  const items = useStore((s) => s.items);
  const subtotal = items.reduce((sum, x) => sum + x.price * x.quantity, 0);
  const count = items.reduce((sum, x) => sum + x.quantity, 0);
  return { subtotal, count };
};
