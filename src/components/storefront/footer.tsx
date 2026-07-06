import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Music2 } from "lucide-react";
import logo from "@/assets/flgo.png";
export function Footer() {
  return (
    // FIX: mt-32 ko hata kar mt-0 kiya taake about page ya kisi bhi page ke niche extra white space zero ho jaye
    <footer className="mt-0 border-t border-stone-800 bg-black text-white w-full">
      <div className="container-x py-20 grid gap-12 md:grid-cols-4">
        <div className="flex flex-col items-start">
          <Link to="/" className="flex items-center justify-start gap-2">
            <img
              src={logo}
              alt="GrandDecore Logo"
              className="h-12 w-auto"
            />

            <h1
              className="text-[15px] font-semibold mt-4"
              style={{ fontFamily: "inherit" }}
            >
              <span className="text-[#4CC157]">Grand</span>
              <span className="text-white">Decore</span>
            </h1>
          </Link>

          <p className="mt-4 text-sm text-stone-400 max-w-xs leading-relaxed text-left">
            Editorial home decor for the considered home. Hand-crafted pieces,
            limited editions, shipped across Pakistan.
          </p>

          {/* Social Icons */}
          <div className="mt-6 flex items-center justify-start gap-3">
            <a
              href="https://www.facebook.com/profile.php?id=100064365477178"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 border border-stone-700 text-white transition-all duration-300 hover:border-[#4CC157] hover:text-[#4CC157]"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/granddecore.store?igsh=Z3JwdjllaHRrbnBo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 border border-stone-700 text-white transition-all duration-300 hover:border-[#4CC157] hover:text-[#4CC157]"
            >
              <Instagram className="h-4 w-4" />
            </a>


            <a
              href="https://www.tiktok.com/@grand.decore?_r=1&_t=ZS-97mEiq7E621"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="p-2 border border-stone-700 text-white transition-all duration-300 hover:border-[#4CC157] hover:text-[#4CC157]"
            >
              <Music2 className="h-4 w-4" />
            </a>
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
          // { to: "/cookie-policy", label: "Cookies" },
          { to: "/terms-and-conditions", label: "Terms" },
        ]} />
      </div>

      {/* Bottom Bar: bg-[#fff] ko bg-stone-950 ya black kiya taake design visual consistency bani rahe aur padding py-6 kiya */}
      <div className="border-t border-stone-800 bg-stone-950">
        <div className="container-x flex flex-col md:flex-row gap-3 justify-between items-center py-6 text-xs uppercase tracking-[0.18em] text-stone-400">
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
      <p className="text-stone-200 tracking-[0.18em] uppercase text-xs font-semibold">{title}</p>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-stone-400 hover:text-white transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}