-- Update Category images in PostgreSQL
UPDATE "Category" 
SET "imageUrl" = 'https://images.pexels.com/photos/25461443/pexels-photo-25461443.jpeg' 
WHERE slug = 'textiles';

UPDATE "Category" 
SET "imageUrl" = 'https://images.pexels.com/photos/15687753/pexels-photo-15687753.jpeg' 
WHERE slug = 'candles';

-- Update Product images in PostgreSQL
UPDATE "Product"
SET images = ARRAY['https://images.pexels.com/photos/15687753/pexels-photo-15687753.jpeg']::text[]
WHERE slug = 'amber-sandalwood-candle';

UPDATE "Product"
SET images = ARRAY['https://images.pexels.com/photos/15687753/pexels-photo-15687753.jpeg']::text[]
WHERE slug = 'lavender-soy-candle';
