import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin User
  const password = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@granddecore.com" },
    update: {},
    create: {
      email: "admin@granddecore.com",
      name: "Admin User",
      password,
      role: "admin",
    },
  });

  // Categories
  const categoriesData = [
    { name: "Vases & Vessels", slug: "vases", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1200", description: "Sculptural vases for the modern home", sort: 1 },
    { name: "Wall Art", slug: "wall-art", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200", description: "Editorial pieces for empty walls", sort: 2 },
    { name: "Lighting", slug: "lighting", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200", description: "Sculptural lamps and pendants", sort: 3 },
    { name: "Mirrors", slug: "mirrors", image: "https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1200", description: "Statement mirrors", sort: 4 },
    { name: "Candles", slug: "candles", image: "https://images.unsplash.com/photo-1602874801007-aa28b15c5ae3?w=1200", description: "Hand-poured scented candles", sort: 5 },
    { name: "Textiles", slug: "textiles", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200", description: "Throws, cushions, rugs", sort: 6 },
    { name: "Sculptures", slug: "sculptures", image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=1200", description: "Limited-edition objects", sort: 7 },
    { name: "Planters", slug: "planters", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200", description: "Vessels for living greenery", sort: 8 },
  ];

  const categoryIds = new Map();
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryIds.set(cat.slug, created.id);
  }

  // Products
  const productsData = [
    { name: 'Atelier Travertine Vase', slug: 'atelier-travertine-vase', description: 'Hand-carved travertine vessel with an organic silhouette.', price: 18500, comparePrice: 22000, categoryId: categoryIds.get('vases'), images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1400','https://images.unsplash.com/photo-1612196808214-b40b3b76bd5b?w=1400','https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=1400'], specs: {"Material":"Travertine","Height":"32cm","Origin":"Handmade, Italy"}, inventory: 18, isFeatured: true, isNew: true, isTrending: true, isBestSeller: true },
    { name: 'Ode Sculptural Vessel', slug: 'ode-sculptural-vessel', description: 'Soft asymmetry meets matte stoneware.', price: 9800, comparePrice: 12500, categoryId: categoryIds.get('vases'), images: ['https://images.unsplash.com/photo-1612196808214-b40b3b76bd5b?w=1400','https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1400'], specs: {"Material":"Stoneware","Height":"24cm"}, inventory: 24, isFeatured: true, isNew: true, isTrending: false, isBestSeller: true },
    { name: 'Linen Field Wall Print', slug: 'linen-field-wall-print', description: 'Limited-edition giclée print on archival linen paper.', price: 6500, comparePrice: null, categoryId: categoryIds.get('wall-art'), images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400','https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1400'], specs: {"Size":"60×80cm","Frame":"Solid oak"}, inventory: 12, isFeatured: true, isNew: true, isTrending: true, isBestSeller: false },
    { name: 'Maison Diptych', slug: 'maison-diptych', description: 'A two-piece composition for the living room wall.', price: 14200, comparePrice: null, categoryId: categoryIds.get('wall-art'), images: ['https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1400','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400'], specs: {"Size":"2× 50×70cm"}, inventory: 7, isFeatured: false, isNew: false, isTrending: true, isBestSeller: true },
    { name: 'Halo Alabaster Pendant', slug: 'halo-alabaster-pendant', description: 'Warm alabaster glow, hand-finished brass cap.', price: 38500, comparePrice: 42000, categoryId: categoryIds.get('lighting'), images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1400','https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1400'], specs: {"Material":"Alabaster, brass","Diameter":"45cm"}, inventory: 5, isFeatured: true, isNew: false, isTrending: true, isBestSeller: true },
    { name: 'Noma Floor Lamp', slug: 'noma-floor-lamp', description: 'Paper-shade silhouette with solid walnut base.', price: 26500, comparePrice: null, categoryId: categoryIds.get('lighting'), images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1400','https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1400'], specs: {"Height":"160cm","Bulb":"E27 (not included)"}, inventory: 9, isFeatured: false, isNew: true, isTrending: false, isBestSeller: false },
    { name: 'Eos Round Mirror', slug: 'eos-round-mirror', description: 'Hand-beaten brass frame, antique finish.', price: 28500, comparePrice: null, categoryId: categoryIds.get('mirrors'), images: ['https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1400','https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=1400'], specs: {"Diameter":"90cm","Material":"Brass, mirror"}, inventory: 6, isFeatured: true, isNew: false, isTrending: true, isBestSeller: true },
    { name: 'Arc Leaner Mirror', slug: 'arc-leaner-mirror', description: 'Full-length leaner with a softly curved top.', price: 44000, comparePrice: 52000, categoryId: categoryIds.get('mirrors'), images: ['https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=1400','https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1400'], specs: {"Height":"180cm"}, inventory: 4, isFeatured: false, isNew: true, isTrending: true, isBestSeller: false },
    { name: 'Noir Fig Candle', slug: 'noir-fig-candle', description: 'Black fig, vetiver, cedar. 60-hour burn.', price: 3800, comparePrice: null, categoryId: categoryIds.get('candles'), images: ['https://images.unsplash.com/photo-1602874801007-aa28b15c5ae3?w=1400','https://images.unsplash.com/photo-1611250882761-91c87c95a9d6?w=1400'], specs: {"Burn":"60h","Wax":"Soy + coconut"}, inventory: 42, isFeatured: true, isNew: true, isTrending: true, isBestSeller: true },
    { name: 'Atelier Trio Set', slug: 'atelier-trio-set', description: 'A trio of complementary scents in matte vessels.', price: 11500, comparePrice: 13500, categoryId: categoryIds.get('candles'), images: ['https://images.unsplash.com/photo-1611250882761-91c87c95a9d6?w=1400','https://images.unsplash.com/photo-1602874801007-aa28b15c5ae3?w=1400'], specs: {"Includes":"3 × 220g"}, inventory: 16, isFeatured: false, isNew: false, isTrending: true, isBestSeller: true },
    { name: 'Mira Linen Throw', slug: 'mira-linen-throw', description: 'Stonewashed Belgian linen, fringed edge.', price: 8900, comparePrice: null, categoryId: categoryIds.get('textiles'), images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1400','https://images.unsplash.com/photo-1583845112203-29329902332e?w=1400'], specs: {"Size":"140×200cm","Material":"100% Belgian linen"}, inventory: 22, isFeatured: true, isNew: true, isTrending: false, isBestSeller: true },
    { name: 'Nomad Berber Rug', slug: 'nomad-berber-rug', description: 'Hand-knotted wool with abstract motifs.', price: 62000, comparePrice: null, categoryId: categoryIds.get('textiles'), images: ['https://images.unsplash.com/photo-1583845112203-29329902332e?w=1400','https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1400'], specs: {"Size":"200×300cm","Material":"Wool"}, inventory: 3, isFeatured: false, isNew: false, isTrending: true, isBestSeller: false },
    { name: 'Forme Stone Object', slug: 'forme-stone-object', description: 'Sculptural object hand-finished in solid marble.', price: 16500, comparePrice: null, categoryId: categoryIds.get('sculptures'), images: ['https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=1400','https://images.unsplash.com/photo-1612196808214-b40b3b76bd5b?w=1400'], specs: {"Material":"Carrara marble"}, inventory: 8, isFeatured: true, isNew: true, isTrending: true, isBestSeller: false },
    { name: 'Onyx Curve Sculpture', slug: 'onyx-curve-sculpture', description: 'Single-piece carved onyx, signed by the maker.', price: 54000, comparePrice: null, categoryId: categoryIds.get('sculptures'), images: ['https://images.unsplash.com/photo-1612196808214-b40b3b76bd5b?w=1400','https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=1400'], specs: {"Material":"Onyx","Edition":"of 25"}, inventory: 2, isFeatured: false, isNew: true, isTrending: false, isBestSeller: false },
    { name: 'Terra Planter Large', slug: 'terra-planter-large', description: 'Wheel-thrown terracotta with hand-applied glaze.', price: 7800, comparePrice: null, categoryId: categoryIds.get('planters'), images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1400','https://images.unsplash.com/photo-1545241047-6083a3684587?w=1400'], specs: {"Height":"38cm"}, inventory: 15, isFeatured: true, isNew: true, isTrending: false, isBestSeller: true },
    { name: 'Pillar Concrete Planter', slug: 'pillar-concrete-planter', description: 'Architectural concrete with a tapered base.', price: 9800, comparePrice: 11500, categoryId: categoryIds.get('planters'), images: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=1400','https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1400'], specs: {"Height":"55cm","Material":"Cast concrete"}, inventory: 11, isFeatured: false, isNew: false, isTrending: true, isBestSeller: false },
    { name: 'Lume Table Lamp', slug: 'lume-table-lamp', description: 'Mushroom silhouette in milky hand-blown glass.', price: 22500, comparePrice: null, categoryId: categoryIds.get('lighting'), images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1400','https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1400'], specs: {"Height":"38cm"}, inventory: 10, isFeatured: true, isNew: true, isTrending: true, isBestSeller: true },
    { name: 'Solene Wall Sconce', slug: 'solene-wall-sconce', description: 'Brushed brass arc with a linen drum shade.', price: 16800, comparePrice: null, categoryId: categoryIds.get('lighting'), images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1400','https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1400'], specs: {"Reach":"35cm"}, inventory: 13, isFeatured: false, isNew: false, isTrending: false, isBestSeller: true },
    { name: 'Ode Petit Vase', slug: 'ode-petit-vase', description: 'Companion to the Ode collection.', price: 5400, comparePrice: null, categoryId: categoryIds.get('vases'), images: ['https://images.unsplash.com/photo-1612196808214-b40b3b76bd5b?w=1400','https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1400'], specs: {"Height":"15cm"}, inventory: 30, isFeatured: false, isNew: true, isTrending: false, isBestSeller: true },
    { name: 'Quiet Linen Cushion', slug: 'quiet-linen-cushion', description: 'Heavy-weight linen, feather insert.', price: 4800, comparePrice: null, categoryId: categoryIds.get('textiles'), images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1400','https://images.unsplash.com/photo-1583845112203-29329902332e?w=1400'], specs: {"Size":"55×55cm"}, inventory: 26, isFeatured: true, isNew: false, isTrending: true, isBestSeller: true },
    { name: 'Atrium Floor Mirror', slug: 'atrium-floor-mirror', description: 'Slim oak frame, leaner profile.', price: 32000, comparePrice: null, categoryId: categoryIds.get('mirrors'), images: ['https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1400','https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=1400'], specs: {"Height":"170cm"}, inventory: 5, isFeatured: false, isNew: true, isTrending: true, isBestSeller: false },
    { name: 'Maison Wax Pillar Set', slug: 'maison-wax-pillar-set', description: 'Set of three unscented pillar candles.', price: 5800, comparePrice: null, categoryId: categoryIds.get('candles'), images: ['https://images.unsplash.com/photo-1602874801007-aa28b15c5ae3?w=1400','https://images.unsplash.com/photo-1611250882761-91c87c95a9d6?w=1400'], specs: {"Includes":"3 pillars"}, inventory: 34, isFeatured: false, isNew: false, isTrending: false, isBestSeller: true },
    { name: 'Halo Print Edition', slug: 'halo-print-edition', description: 'Numbered fine-art print on cotton rag.', price: 7200, comparePrice: null, categoryId: categoryIds.get('wall-art'), images: ['https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1400','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400'], specs: {"Size":"50×70cm","Edition":"of 100"}, inventory: 14, isFeatured: true, isNew: false, isTrending: true, isBestSeller: true },
    { name: 'Form Pedestal Planter', slug: 'form-pedestal-planter', description: 'Tall sculptural planter for statement greenery.', price: 13500, comparePrice: null, categoryId: categoryIds.get('planters'), images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1400','https://images.unsplash.com/photo-1545241047-6083a3684587?w=1400'], specs: {"Height":"72cm"}, inventory: 6, isFeatured: false, isNew: true, isTrending: false, isBestSeller: false }
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }

  // Reviews
  const vase = await prisma.product.findUnique({ where: { slug: 'atelier-travertine-vase' } });
  if (vase) {
    const existingReview = await prisma.review.findFirst({ where: { productId: vase.id } });
    if (!existingReview) {
      await prisma.review.createMany({
        data: [
          { productId: vase.id, customerName: 'Ayesha K.', rating: 5, title: 'Stunning piece', body: 'Even more beautiful in person. The packaging felt like opening a gift.' },
          { productId: vase.id, customerName: 'Hassan R.', rating: 5, title: 'Worth every rupee', body: 'Quality is on another level — feels like a heirloom.' },
          { productId: vase.id, customerName: 'Mehwish A.', rating: 4, title: 'Loved it', body: 'Arrived faster than expected and looks gorgeous in our living room.' }
        ]
      });
    }
  }

  // Store Settings
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "GrandDecore",
      whatsapp: "03238041309",
      email: "hello@granddecore.com",
      phone: "03238041309",
      shippingFee: 250,
      freeShippingOver: 10000,
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
