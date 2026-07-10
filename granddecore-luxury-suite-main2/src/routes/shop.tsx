import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
import { StoreLayout } from "@/components/storefront/layout";
import { ProductCard } from "@/components/storefront/product-card";
import { categoriesQuery, productsQuery } from "@/lib/queries";
import { Reveal } from "@/components/storefront/section";

const shopSearch = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(["featured", "newest", "price-asc", "price-desc"]).optional(),
  page: z.number().int().min(1).optional(),
}).optional();

export const Route = createFileRoute("/shop")({
  validateSearch: shopSearch,
  head: () => ({
    meta: [
      { title: "Shop All — GrandDecore" },
      { name: "description", content: "Shop sculptural vases, lighting, mirrors, candles and textiles. Limited editions, hand-crafted." },
      { property: "og:title", content: "Shop GrandDecore" },
      { property: "og:description", content: "Hand-crafted home decor across eight collections." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery);
    context.queryClient.ensureQueryData(categoriesQuery);
  },
  component: ShopPage,
});

const PAGE_SIZE = 12;

function ShopPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);

  const [priceMax, setPriceMax] = useState<number>(80000);

  const filtered = useMemo(() => {
    let list = products;
    if (search?.category) {
      const cat = categories.find((c) => c.slug === search.category);
      if (cat) list = list.filter((p) => p.category_id === cat.id);
    }
    if (search?.q) {
      const q = search.q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q));
    }
    list = list.filter((p) => p.price <= priceMax);
    switch (search?.sort) {
      case "newest": list = [...list].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)); break;
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      default: list = [...list].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    }
    return list;
  }, [products, categories, search, priceMax]);

  const page = search?.page ?? 1;
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <StoreLayout>
      {/* Hero */}
      <section className="container-x pt-16 pb-12 border-b">
        <p className="eyebrow">The Edit</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">Shop everything.</h1>
        <p className="mt-4 text-muted-foreground max-w-xl">{filtered.length} pieces, hand-picked across eight collections.</p>
      </section>

      <div className="container-x py-12 grid lg:grid-cols-[260px_1fr] gap-12">
        {/* Filters */}
        <aside className="space-y-10">
          <div>
            <p className="eyebrow mb-4">Search</p>
            <input
              defaultValue={search?.q ?? ""}
              onChange={(e) => navigate({ search: { ...search, q: e.target.value || undefined, page: 1 } })}
              placeholder="Search…"
              className="w-full border-b border-foreground bg-transparent py-3 focus:outline-none"
            />
          </div>
          <div>
            <p className="eyebrow mb-4">Category</p>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate({ search: { ...search, category: undefined, page: 1 } })}
                  className={!search?.category ? "text-primary" : "hover:text-primary"}>All</button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button onClick={() => navigate({ search: { ...search, category: c.slug, page: 1 } })}
                    className={search?.category === c.slug ? "text-primary" : "hover:text-primary"}>{c.name}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Max Price</p>
            <input type="range" min={1000} max={80000} step={1000} value={priceMax} onChange={(e) => setPriceMax(+e.target.value)} className="w-full accent-primary" />
            <p className="text-xs mt-2 text-muted-foreground">Up to PKR {priceMax.toLocaleString()}</p>
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="flex flex-wrap gap-3 items-center justify-between border-b pb-4 mb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{filtered.length} pieces</p>
            <select
              value={search?.sort ?? "featured"}
              onChange={(e) => navigate({ search: { ...search, sort: e.target.value as never, page: 1 } })}
              className="bg-transparent text-xs uppercase tracking-[0.18em] focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {paged.length === 0 ? (
            <div className="py-32 text-center">
              <p className="font-display text-3xl">No pieces match those filters.</p>
              <button onClick={() => navigate({ search: {} })} className="mt-4 link-underline text-xs uppercase tracking-[0.18em]">Clear all →</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12">
              {paged.map((p) => (<Reveal key={p.id}><ProductCard product={p} /></Reveal>))}
            </div>
          )}

          {pages > 1 && (
            <div className="mt-16 flex justify-center gap-2 text-xs uppercase tracking-[0.18em]">
              {Array.from({ length: pages }).map((_, i) => (
                <Link key={i} to="/shop" search={{ ...search, page: i + 1 }}
                  className={`px-4 py-2 border ${i + 1 === page ? "bg-foreground text-background" : "hover:bg-accent"}`}>{i + 1}</Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}
