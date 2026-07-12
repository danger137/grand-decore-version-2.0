import { PrismaClient } from './node_modules/.prisma/client/index.js';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function main() {
  console.log('Querying database for Candles and Textiles...');

  // Search Categories
  console.log('\n--- Categories ---');
  const categories = await prisma.category.findMany();
  categories.forEach(c => {
    console.log(`ID: ${c.id}`);
    console.log(`Name: ${c.name}`);
    console.log(`Slug: ${c.slug}`);
    console.log(`Image URL: ${c.imageUrl}`);
    console.log('-----------------');
  });

  // Search Products
  console.log('\n--- Products matching "candle" or "textile" ---');
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'candle', mode: 'insensitive' } },
        { name: { contains: 'textile', mode: 'insensitive' } },
        { description: { contains: 'candle', mode: 'insensitive' } },
        { description: { contains: 'textile', mode: 'insensitive' } }
      ]
    }
  });

  products.forEach(p => {
    console.log(`ID: ${p.id}`);
    console.log(`Name: ${p.name}`);
    console.log(`Slug: ${p.slug}`);
    console.log(`Images:`, p.images);
    console.log('-----------------');
  });

  // Search StoreSettings
  console.log('\n--- Store Settings ---');
  const settings = await prisma.storeSettings.findFirst();
  if (settings) {
    console.log(`ID: ${settings.id}`);
    console.log(`Logo URL: ${settings.logoUrl}`);
    console.log(`Banner URL: ${settings.bannerUrl}`);
    console.log(`Banner Title: ${settings.bannerTitle}`);
    console.log(`Banner Subtitle: ${settings.bannerSubtitle}`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
