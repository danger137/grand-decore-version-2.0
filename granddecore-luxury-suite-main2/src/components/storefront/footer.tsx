import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Music2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-bone text-foreground">
      <div className="container-x py-20 grid gap-12 md:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-3xl">Grand<span className="text-primary">Decore</span></Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Editorial home decor for the considered home. Hand-crafted pieces, limited editions, shipped across Pakistan.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://instagram.com" aria-label="Instagram" className="p-2 border hover:bg-foreground hover:text-background"><Instagram className="h-4 w-4" /></a>
            <a href="https://facebook.com" aria-label="Facebook" className="p-2 border hover:bg-foreground hover:text-background"><Facebook className="h-4 w-4" /></a>
            <a href="https://tiktok.com" aria-label="TikTok" className="p-2 border hover:bg-foreground hover:text-background"><Music2 className="h-4 w-4" /></a>
          </div>
        </div>

        <FooterCol title="Shop" links={[
          { to: "/shop", label: "All Pieces" },
          { to: "/shop", label: "New Arrivals" },
          { to: "/shop", label: "Best Sellers" },
          { to: "/shop", label: "On Sale" },
        ]} />
        <FooterCol title="House" links={[
          { to: "/about", label: "About" },
          { to: "/contact", label: "Contact" },
          { to: "/track-order", label: "Track Order" },
        ]} />
        <FooterCol title="Policies" links={[
          { to: "/privacy-policy", label: "Privacy" },
          { to: "/refund-policy", label: "Refund" },
          { to: "/shipping-policy", label: "Shipping" },
          { to: "/return-policy", label: "Return" },
          { to: "/cookie-policy", label: "Cookies" },
          { to: "/terms-and-conditions", label: "Terms" },
        ]} />
      </div>

      <div className="border-t border-border">
        <div className="container-x flex flex-col md:flex-row gap-3 justify-between items-center py-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <p>© {new Date().getFullYear()} GrandDecore. All rights reserved.</p>
          <p>Made with care in Pakistan • COD nationwide</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}><Link to={l.to} className="hover:text-primary">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
