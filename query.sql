SELECT id, name, slug, "imageUrl" FROM "Category";
SELECT id, name, slug, images FROM "Product" WHERE name ILIKE '%candle%' OR name ILIKE '%textile%' OR name ILIKE '%cushion%';
