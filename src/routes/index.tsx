import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { StoreLayout } from "@/components/storefront/layout";
import { HeroSlider } from "@/components/storefront/hero-slider";
import { Reveal, SectionHeader } from "@/components/storefront/section";
import { ProductCard } from "@/components/storefront/product-card";
import { categoriesQuery, productsQuery } from "@/lib/queries";
import { Award, Truck, ShieldCheck, Sparkles, Instagram, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GrandDecore — Luxury Home Decor, Hand-Crafted" },
      { name: "description", content: "Editorial home decor — vases, lighting, mirrors and textiles. Hand-crafted, limited editions. Free shipping over PKR 10,000." },
      { property: "og:title", content: "GrandDecore — Luxury Home Decor" },
      { property: "og:description", content: "Editorial home decor for the considered home. COD across Pakistan." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery);
    context.queryClient.ensureQueryData(categoriesQuery);
  },
  component: HomePage,
});

function HomePage() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);

  const featured = products.filter((p) => p.is_featured).slice(0, 8);
  const bestSellers = products.filter((p) => p.is_best_seller).slice(0, 8);
  const newArrivals = products.filter((p) => p.is_new).slice(0, 4);
  const trending = products.filter((p) => p.is_trending).slice(0, 4);

  return (
    <StoreLayout>
      <HeroSlider />

      {/* Brand strip */}
      <section className="border-y border-border bg-[#000]">
        <div className="container-x py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {[
            { Icon: Award, label: "Hand-Crafted" },
            { Icon: Truck, label: "Free Shipping Over PKR 10k" },
            { Icon: ShieldCheck, label: "30-Day Returns" },
            { Icon: Sparkles, label: "Limited Editions" },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-[#fff]"><Icon className="h-4 w-4 text-[#fff]" />{label}</div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container-x py-24">
        <SectionHeader eyebrow="Shop By Category" title="A house of considered things." subtitle="Eight collections, each made by craftspeople we know by name." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <Link to="/shop" search={{ category: c.slug } as never} className="group block relative overflow-hidden bg-sand aspect-[3/4]">
                <img src={c.image ?? ""} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />

                {/* Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-background">

                  {/* 🛠️ Aapka exact Green color, Bold Text, aur Smooth Upar-se-Neeche Animation */}
                  <h3
                    className="font-display text-2xl font-extrabold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]
                         transition-all duration-500 ease-out
                         transform -translate-y-3 opacity-90
                         group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: '700' }}

                  >
                    {c.name}
                  </h3>

                  {/* Shop Now Text */}
                  <p className="text-xs uppercase tracking-[0.18em] mt-2 opacity-80 text-white font-medium transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" style={{ color: '#4CC157', fontFamily: 'Inter, sans-serif', fontWeight: '700' }}
                  >
                    Shop now →
                  </p>

                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container-x py-24 border-t">
        <div className="flex items-end justify-between gap-8 flex-wrap">
          <SectionHeader eyebrow="Most Loved" title="Best sellers." />
          <Link to="/shop" className="link-underline text-xs uppercase tracking-[0.18em]">View all →</Link>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
          {bestSellers.map((p) => (<Reveal key={p.id}><ProductCard product={p} /></Reveal>))}
        </div>
      </section>

      {/* Editorial split */}
      <section className="container-x py-24 grid lg:grid-cols-2 gap-12 items-center border-t">
        <Reveal>
          <div className="aspect-[4/5] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1400" alt="Atelier" className="h-full w-full object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">Our story</p>
          <h2 className="font-display text-4xl md:text-6xl mt-4 leading-[1.05]">A house built on patience, material and craft.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-lg">
            GrandDecore began as a small atelier in Lahore, working with stone carvers, brass smiths and weavers across Pakistan and beyond. Every piece we make is slow on purpose — designed to live with you for years, not seasons.
          </p>
          <Link to="/about" className="mt-8 inline-flex items-center gap-3 link-underline text-xs uppercase tracking-[0.18em]">Read the story →</Link>
        </Reveal>
      </section>

      {/* New Arrivals + Trending tabs */}
      <section className="container-x py-24 border-t">
        <SectionHeader eyebrow="Just In" title="New arrivals." align="center" />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {newArrivals.map((p) => (<Reveal key={p.id}><ProductCard product={p} /></Reveal>))}
        </div>
      </section>

      <section className="container-x py-24 border-t">
        <SectionHeader eyebrow="Editor's Picks" title="Trending now." align="center" />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((p) => (<Reveal key={p.id}><ProductCard product={p} /></Reveal>))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-black py-16 border-y">
        <div className="container-x grid md:grid-cols-3 gap-12">
          {[
            { n: "01", t: "Made slowly, on purpose", b: "We commission small batches with makers we trust. Nothing is mass-produced." },
            { n: "02", t: "Material first", b: "Travertine, alabaster, brass, hand-blown glass, Belgian linen. Honest materials only." },
            { n: "03", t: "Considered packaging", b: "Pieces arrive wrapped like the gifts they are — recyclable and considered." },
          ].map((b, i) => (
            <Reveal key={b.n} delay={i * 0.08}>
              <p className="font-display text-5xl text-primary">{b.n}</p>
              <h3 className="font-display text-2xl mt-4 text-white">{b.t}</h3>
              <p className="mt-3 text-sm text-white leading-relaxed">{b.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Reviews */}
      {/* <section className="container-x py-24">
        <SectionHeader eyebrow="From the post" title="Loved by 12,000+ homes." align="center" />
        <div className="mt-14 grid md:grid-cols-3 gap-8">
          {[
            { name: "Ayesha K., Lahore", body: "I have ordered four pieces now and every single one has arrived feeling like an heirloom. The travertine vase is unreal." },
            { name: "Hassan R., Karachi", body: "Genuinely the best home decor in Pakistan right now. The brass mirror changed our entire living room." },
            { name: "Mehwish A., Islamabad", body: "Packaging alone is worth it. You can feel the care. Shipping was faster than expected." },
          ].map((r, i) => (
            <Reveal key={r.name} delay={i * 0.05}>
              <div className="border p-8 h-full bg-background">
                <div className="flex gap-0.5 text-primary">{Array.from({ length: 5 }).map((_, x) => <Star key={x} className="h-4 w-4 fill-current" />)}</div>
                <p className="mt-5 font-display text-xl leading-snug">“{r.body}”</p>
                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">— {r.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section> */}

      {/* Inspiration gallery */}
      <section className="border-t">
        <div className="container-x py-24">
          <SectionHeader eyebrow="Decor inspiration" title="Live with it." subtitle="A gallery of the GrandDecore home." />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {[
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900",
            "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=900",
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900",
            "https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=900",
            "https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=900",
          ].map((src, i) => (
            <motion.div key={src} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.6 }} className="aspect-square overflow-hidden">
              <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-110" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Instagram */}
      <section className="bg-black text-white border-t border-stone-900 py-10 text-center w-full">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-stone-400 transition-colors duration-300 hover:text-[#4CC157]"
        >
          <Instagram className="h-4 w-4 transition-colors duration-300" />
          @granddecore
        </a>
        <h2 className="font-display text-4xl md:text-5xl mt-4 text-white">
          Follow along
        </h2>
      </section>

      {/* Featured rail */}
      <section className="container-x py-12 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
          {featured.slice(0, 4).map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
      </section>

      {/* Newsletter */}
      {/* <section className="bg-foreground text-background py-24">
        <div className="container-x max-w-2xl text-center">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>Join the house</p>
          <h2 className="font-display text-4xl md:text-5xl mt-4">Be the first to see new drops.</h2>
          <p className="mt-4 opacity-75">Atelier news, early access, and 10% off your first order.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" required placeholder="Your email" className="flex-1 bg-transparent border border-background/40 px-5 py-4 text-sm placeholder:text-background/50 focus:outline-none focus:border-primary" />
            <button className="bg-background text-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground">Subscribe</button>
          </form>
        </div>
      </section> */}

      {/* CTA banner */}
      <section className="relative h-[60vh] min-h-[480px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1920" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative h-full container-x flex flex-col justify-center items-start text-background max-w-2xl">
          <p className="eyebrow" style={{ color: "#4CC157" }}>Discover the edit</p>
          <h2 className="font-display text-5xl md:text-7xl mt-4 leading-[1.05]">A house<br />for the considered.</h2>
          <Link to="/shop" className="mt-10 bg-background text-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground">Shop everything →</Link>
        </div>
      </section>
    </StoreLayout>
  );
}
