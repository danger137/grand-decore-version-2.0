import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useStore, useCartTotals } from "@/lib/store";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop", label: "New In", search: { sort: "newest" } },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/track-order", label: "Track Order" },
];

export function Header() {
  const setOpen = useStore((s) => s.setOpen);
  const setWishlistOpen = useStore.getState; // unused, placeholder
  void setWishlistOpen;
  const wishlist = useStore((s) => s.wishlist);
  const { count } = useCartTotals();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-foreground text-background text-[11px] tracking-[0.18em] uppercase">
        <div className="overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee py-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0 gap-12 px-6">
                <span>Free shipping over PKR 10,000</span>
                <span>•</span>
                <span>Cash on Delivery across Pakistan</span>
                <span>•</span>
                <span>Hand-crafted, limited editions</span>
                <span>•</span>
                <span>30-day returns</span>
                <span>•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="container-x flex h-20 items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden -ml-1 p-2"><Menu className="h-5 w-5" /></button>

          <nav className="hidden lg:flex flex-1 items-center gap-8 text-[12px] uppercase tracking-[0.18em]">
            {nav.slice(0, 3).map((n) => (
              <Link key={n.label} to={n.to} className="link-underline hover:text-primary">{n.label}</Link>
            ))}
          </nav>

          <Link to="/" className="font-display text-2xl md:text-3xl tracking-tight">
            Grand<span className="text-primary">Decore</span>
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-end gap-6 text-[12px] uppercase tracking-[0.18em]">
            {nav.slice(3).map((n) => (
              <Link key={n.label} to={n.to} className="link-underline hover:text-primary">{n.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-1 lg:ml-6">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="p-2 hover:text-primary"><Search className="h-5 w-5" /></button>
            <Link to="/auth" aria-label="Account" className="p-2 hover:text-primary hidden sm:inline-flex"><User className="h-5 w-5" /></Link>
            <Link to="/shop" aria-label="Wishlist" className="p-2 relative hover:text-primary">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{wishlist.length}</span>}
            </Link>
            <button onClick={() => setOpen(true)} aria-label="Cart" className="p-2 relative hover:text-primary">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{count}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background lg:hidden">
          <div className="flex items-center justify-between p-5 border-b">
            <Link to="/" onClick={() => setMobileOpen(false)} className="font-display text-2xl">Grand<span className="text-primary">Decore</span></Link>
            <button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
          </div>
          <nav className="flex flex-col p-6 gap-1">
            {nav.map((n) => (
              <Link key={n.label} to={n.to} onClick={() => setMobileOpen(false)} className="font-display text-3xl py-3 border-b">{n.label}</Link>
            ))}
          </nav>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur">
      <div className="container-x pt-10">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Search</p>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <input
          autoFocus value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search vases, lighting, mirrors…"
          className="mt-6 w-full border-b border-foreground bg-transparent py-6 font-display text-3xl md:text-5xl placeholder:text-muted-foreground/40 focus:outline-none"
        />
        <div className="mt-6 flex flex-wrap gap-2">
          {["vases", "lighting", "mirrors", "candles", "textiles"].map((t) => (
            <Link key={t} to="/shop" search={{ q: t } as never} onClick={onClose} className="text-xs uppercase tracking-[0.18em] border border-input px-4 py-2 hover:bg-accent">{t}</Link>
          ))}
        </div>
        {q && (
          <Link to="/shop" search={{ q } as never} onClick={onClose} className="mt-6 inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.18em]">Search “{q}”</Link>
        )}
      </div>
    </div>
  );
}
