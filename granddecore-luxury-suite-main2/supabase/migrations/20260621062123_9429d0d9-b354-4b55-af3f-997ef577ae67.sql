
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin','customer');
CREATE TYPE public.order_status AS ENUM ('pending','confirmed','shipped','delivered','cancelled');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  description TEXT,
  sort INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  compare_price NUMERIC(10,2),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  videos TEXT[] NOT NULL DEFAULT '{}',
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  inventory INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_trending BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "products admin write" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "reviews admin write" ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Orders
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 10001;
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE DEFAULT ('GD-' || nextval('public.order_number_seq')::text),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  status public.order_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT USAGE ON SEQUENCE public.order_number_seq TO anon, authenticated, service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders anon insert" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "orders admin read" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders admin update" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders admin delete" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Public track-order RPC (returns minimal info if phone matches)
CREATE OR REPLACE FUNCTION public.track_order(_order_number TEXT, _phone TEXT)
RETURNS TABLE(order_number TEXT, status public.order_status, full_name TEXT, city TEXT, total NUMERIC, created_at TIMESTAMPTZ, items JSONB)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT o.order_number, o.status, o.full_name, o.city, o.total, o.created_at, o.items
  FROM public.orders o
  WHERE o.order_number = _order_number AND o.phone = _phone
  LIMIT 1
$$;
GRANT EXECUTE ON FUNCTION public.track_order(TEXT, TEXT) TO anon, authenticated;

-- Store settings (singleton)
CREATE TABLE public.store_settings (
  id INT PRIMARY KEY DEFAULT 1,
  store_name TEXT NOT NULL DEFAULT 'GrandDecore',
  logo TEXT,
  whatsapp TEXT DEFAULT '03238041309',
  email TEXT DEFAULT 'hello@granddecore.com',
  phone TEXT DEFAULT '03238041309',
  socials JSONB NOT NULL DEFAULT '{"instagram":"https://instagram.com","facebook":"https://facebook.com","tiktok":"https://tiktok.com"}'::jsonb,
  shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 250,
  free_shipping_over NUMERIC(10,2) NOT NULL DEFAULT 10000,
  CONSTRAINT singleton_settings CHECK (id = 1)
);
GRANT SELECT ON public.store_settings TO anon, authenticated;
GRANT ALL ON public.store_settings TO service_role;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.store_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin write" ON public.store_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.store_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Seed categories
INSERT INTO public.categories (name, slug, image, description, sort) VALUES
('Vases & Vessels','vases','https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1200','Sculptural vases for the modern home',1),
('Wall Art','wall-art','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200','Editorial pieces for empty walls',2),
('Lighting','lighting','https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200','Sculptural lamps and pendants',3),
('Mirrors','mirrors','https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1200','Statement mirrors',4),
('Candles','candles','https://images.unsplash.com/photo-1602874801007-aa28b15c5ae3?w=1200','Hand-poured scented candles',5),
('Textiles','textiles','https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200','Throws, cushions, rugs',6),
('Sculptures','sculptures','https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=1200','Limited-edition objects',7),
('Planters','planters','https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200','Vessels for living greenery',8);

-- Seed products (24 across categories)
WITH c AS (SELECT slug, id FROM public.categories)
INSERT INTO public.products (name, slug, description, price, compare_price, category_id, images, specs, inventory, is_featured, is_new, is_trending, is_best_seller) VALUES
('Atelier Travertine Vase','atelier-travertine-vase','Hand-carved travertine vessel with an organic silhouette.', 18500, 22000,(SELECT id FROM c WHERE slug='vases'),
 ARRAY['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1400','https://images.unsplash.com/photo-1612196808214-b40b3b76bd5b?w=1400','https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=1400'],
 '{"Material":"Travertine","Height":"32cm","Origin":"Handmade, Italy"}', 18, true, true, true, true),
('Ode Sculptural Vessel','ode-sculptural-vessel','Soft asymmetry meets matte stoneware.',9800,12500,(SELECT id FROM c WHERE slug='vases'),
 ARRAY['https://images.unsplash.com/photo-1612196808214-b40b3b76bd5b?w=1400','https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1400'],
 '{"Material":"Stoneware","Height":"24cm"}',24,true,true,false,true),
('Linen Field Wall Print','linen-field-wall-print','Limited-edition giclée print on archival linen paper.',6500,null,(SELECT id FROM c WHERE slug='wall-art'),
 ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400','https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1400'],
 '{"Size":"60×80cm","Frame":"Solid oak"}',12,true,true,true,false),
('Maison Diptych','maison-diptych','A two-piece composition for the living room wall.',14200,null,(SELECT id FROM c WHERE slug='wall-art'),
 ARRAY['https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1400','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400'],
 '{"Size":"2× 50×70cm"}',7,false,false,true,true),
('Halo Alabaster Pendant','halo-alabaster-pendant','Warm alabaster glow, hand-finished brass cap.',38500,42000,(SELECT id FROM c WHERE slug='lighting'),
 ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1400','https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1400'],
 '{"Material":"Alabaster, brass","Diameter":"45cm"}',5,true,false,true,true),
('Noma Floor Lamp','noma-floor-lamp','Paper-shade silhouette with solid walnut base.',26500,null,(SELECT id FROM c WHERE slug='lighting'),
 ARRAY['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1400','https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1400'],
 '{"Height":"160cm","Bulb":"E27 (not included)"}',9,false,true,false,false),
('Eos Round Mirror','eos-round-mirror','Hand-beaten brass frame, antique finish.',28500,null,(SELECT id FROM c WHERE slug='mirrors'),
 ARRAY['https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1400','https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=1400'],
 '{"Diameter":"90cm","Material":"Brass, mirror"}',6,true,false,true,true),
('Arc Leaner Mirror','arc-leaner-mirror','Full-length leaner with a softly curved top.',44000,52000,(SELECT id FROM c WHERE slug='mirrors'),
 ARRAY['https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=1400','https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1400'],
 '{"Height":"180cm"}',4,false,true,true,false),
('Noir Fig Candle','noir-fig-candle','Black fig, vetiver, cedar. 60-hour burn.',3800,null,(SELECT id FROM c WHERE slug='candles'),
 ARRAY['https://images.unsplash.com/photo-1602874801007-aa28b15c5ae3?w=1400','https://images.unsplash.com/photo-1611250882761-91c87c95a9d6?w=1400'],
 '{"Burn":"60h","Wax":"Soy + coconut"}',42,true,true,true,true),
('Atelier Trio Set','atelier-trio-set','A trio of complementary scents in matte vessels.',11500,13500,(SELECT id FROM c WHERE slug='candles'),
 ARRAY['https://images.unsplash.com/photo-1611250882761-91c87c95a9d6?w=1400','https://images.unsplash.com/photo-1602874801007-aa28b15c5ae3?w=1400'],
 '{"Includes":"3 × 220g"}',16,false,false,true,true),
('Mira Linen Throw','mira-linen-throw','Stonewashed Belgian linen, fringed edge.',8900,null,(SELECT id FROM c WHERE slug='textiles'),
 ARRAY['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1400','https://images.unsplash.com/photo-1583845112203-29329902332e?w=1400'],
 '{"Size":"140×200cm","Material":"100% Belgian linen"}',22,true,true,false,true),
('Nomad Berber Rug','nomad-berber-rug','Hand-knotted wool with abstract motifs.',62000,null,(SELECT id FROM c WHERE slug='textiles'),
 ARRAY['https://images.unsplash.com/photo-1583845112203-29329902332e?w=1400','https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1400'],
 '{"Size":"200×300cm","Material":"Wool"}',3,false,false,true,false),
('Forme Stone Object','forme-stone-object','Sculptural object hand-finished in solid marble.',16500,null,(SELECT id FROM c WHERE slug='sculptures'),
 ARRAY['https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=1400','https://images.unsplash.com/photo-1612196808214-b40b3b76bd5b?w=1400'],
 '{"Material":"Carrara marble"}',8,true,true,true,false),
('Onyx Curve Sculpture','onyx-curve-sculpture','Single-piece carved onyx, signed by the maker.',54000,null,(SELECT id FROM c WHERE slug='sculptures'),
 ARRAY['https://images.unsplash.com/photo-1612196808214-b40b3b76bd5b?w=1400','https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=1400'],
 '{"Material":"Onyx","Edition":"of 25"}',2,false,true,false,false),
('Terra Planter Large','terra-planter-large','Wheel-thrown terracotta with hand-applied glaze.',7800,null,(SELECT id FROM c WHERE slug='planters'),
 ARRAY['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1400','https://images.unsplash.com/photo-1545241047-6083a3684587?w=1400'],
 '{"Height":"38cm"}',15,true,true,false,true),
('Pillar Concrete Planter','pillar-concrete-planter','Architectural concrete with a tapered base.',9800,11500,(SELECT id FROM c WHERE slug='planters'),
 ARRAY['https://images.unsplash.com/photo-1545241047-6083a3684587?w=1400','https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1400'],
 '{"Height":"55cm","Material":"Cast concrete"}',11,false,false,true,false),
('Lume Table Lamp','lume-table-lamp','Mushroom silhouette in milky hand-blown glass.',22500,null,(SELECT id FROM c WHERE slug='lighting'),
 ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1400','https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1400'],
 '{"Height":"38cm"}',10,true,true,true,true),
('Solene Wall Sconce','solene-wall-sconce','Brushed brass arc with a linen drum shade.',16800,null,(SELECT id FROM c WHERE slug='lighting'),
 ARRAY['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1400','https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1400'],
 '{"Reach":"35cm"}',13,false,false,false,true),
('Ode Petit Vase','ode-petit-vase','Companion to the Ode collection.',5400,null,(SELECT id FROM c WHERE slug='vases'),
 ARRAY['https://images.unsplash.com/photo-1612196808214-b40b3b76bd5b?w=1400','https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1400'],
 '{"Height":"15cm"}',30,false,true,false,true),
('Quiet Linen Cushion','quiet-linen-cushion','Heavy-weight linen, feather insert.',4800,null,(SELECT id FROM c WHERE slug='textiles'),
 ARRAY['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1400','https://images.unsplash.com/photo-1583845112203-29329902332e?w=1400'],
 '{"Size":"55×55cm"}',26,true,false,true,true),
('Atrium Floor Mirror','atrium-floor-mirror','Slim oak frame, leaner profile.',32000,null,(SELECT id FROM c WHERE slug='mirrors'),
 ARRAY['https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1400','https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=1400'],
 '{"Height":"170cm"}',5,false,true,true,false),
('Maison Wax Pillar Set','maison-wax-pillar-set','Set of three unscented pillar candles.',5800,null,(SELECT id FROM c WHERE slug='candles'),
 ARRAY['https://images.unsplash.com/photo-1602874801007-aa28b15c5ae3?w=1400','https://images.unsplash.com/photo-1611250882761-91c87c95a9d6?w=1400'],
 '{"Includes":"3 pillars"}',34,false,false,false,true),
('Halo Print Edition','halo-print-edition','Numbered fine-art print on cotton rag.',7200,null,(SELECT id FROM c WHERE slug='wall-art'),
 ARRAY['https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1400','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400'],
 '{"Size":"50×70cm","Edition":"of 100"}',14,true,false,true,true),
('Form Pedestal Planter','form-pedestal-planter','Tall sculptural planter for statement greenery.',13500,null,(SELECT id FROM c WHERE slug='planters'),
 ARRAY['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1400','https://images.unsplash.com/photo-1545241047-6083a3684587?w=1400'],
 '{"Height":"72cm"}',6,false,true,false,false);

-- Seed reviews
INSERT INTO public.reviews (product_id, customer_name, rating, title, body)
SELECT id, n.name, n.rating, n.title, n.body FROM public.products,
LATERAL (VALUES
 ('Ayesha K.',5,'Stunning piece','Even more beautiful in person. The packaging felt like opening a gift.'),
 ('Hassan R.',5,'Worth every rupee','Quality is on another level — feels like a heirloom.'),
 ('Mehwish A.',4,'Loved it','Arrived faster than expected and looks gorgeous in our living room.')
) AS n(name,rating,title,body);
