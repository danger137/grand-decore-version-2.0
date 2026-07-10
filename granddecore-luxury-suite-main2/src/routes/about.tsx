import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreLayout } from "@/components/storefront/layout";
import { Reveal } from "@/components/storefront/section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — GrandDecore" },
      { name: "description", content: "GrandDecore is a Pakistan-based atelier of slow-made home decor. Read our story." },
      { property: "og:title", content: "About GrandDecore" },
      { property: "og:description", content: "Hand-crafted home decor, made slowly, in small batches." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <StoreLayout>
      <section className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1920" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="container-x relative h-full flex flex-col justify-end pb-16 text-background max-w-2xl">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>The Atelier</p>
          <h1 className="font-display text-6xl md:text-8xl mt-4 leading-[1]">Made slowly, on purpose.</h1>
        </div>
      </section>

      <section className="container-x py-24 grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <p className="eyebrow">Our story</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">A house built on patience and craft.</h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>GrandDecore began as a small studio in Lahore in 2019, born out of a frustration that beautifully-made home objects were either painfully expensive or carelessly mass-produced — never in between.</p>
            <p>We work directly with stone carvers in Italy, brass smiths in India, weavers across Pakistan and ceramicists in Portugal. Every piece is made in small batches, often signed by the maker.</p>
            <p>Our standard is simple: would we want it in our own homes for years? If not, we don't make it.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-3">
            <img src="https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=900" alt="" className="aspect-[4/5] object-cover" />
            <img src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900" alt="" className="aspect-[4/5] object-cover mt-12" />
          </div>
        </Reveal>
      </section>

      <section className="bg-bone border-y py-24">
        <div className="container-x grid md:grid-cols-3 gap-12">
          {[
            { n: "01", t: "Material first", b: "Travertine, alabaster, brass, hand-blown glass, Belgian linen. Real materials, honestly used." },
            { n: "02", t: "Small batches", b: "Every collection is limited. Most pieces are made in runs of 25 to 100." },
            { n: "03", t: "Fair to makers", b: "We pay our craftspeople properly. It's why our pricing isn't the cheapest — and won't be." },
          ].map((b) => (
            <Reveal key={b.n}>
              <p className="font-display text-5xl text-primary">{b.n}</p>
              <h3 className="font-display text-2xl mt-3">{b.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{b.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl">Visit the edit.</h2>
        <Link to="/shop" className="mt-8 inline-block bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary">Shop everything</Link>
      </section>
    </StoreLayout>
  );
}
