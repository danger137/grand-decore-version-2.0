import { PrismaClient } from '@prisma/client';
import { Client } from '@opensearch-project/opensearch';

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://neondb_owner:npg_m7ICHwZciXs1@ep-winter-sunset-aq69yyki-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

const osClient = new Client({
  node: 'https://avnadmin:AVNS_P2TZrd3sKrabzG7Y-G9@os-8ae6aaf-dangerchamp2-08f5.e.aivencloud.com:16944'
});

async function recreateIndex(index: string) {
  try {
    const exists = await osClient.indices.exists({ index });
    if (exists.body) {
      await osClient.indices.delete({ index });
    }
    await osClient.indices.create({ index });
    console.log(`Created index: ${index}`);
  } catch (err) {
    console.error(`Error creating index ${index}:`, err);
  }
}

async function main() {
  console.log('Starting migration from Prisma to OpenSearch...');

  // Create indexes
  await recreateIndex('settings');
  await recreateIndex('admins');
  await recreateIndex('categories');
  await recreateIndex('products');
  await recreateIndex('reviews');
  await recreateIndex('orders');

  // Migrate Settings
  console.log('Migrating Settings...');
  const settings = await prisma.storeSettings.findMany();
  for (const item of settings) {
    await osClient.index({
      index: 'settings',
      id: String(item.id),
      body: item
    });
  }

  // Migrate Admins
  console.log('Migrating Admins...');
  const admins = await prisma.admin.findMany();
  for (const item of admins) {
    await osClient.index({
      index: 'admins',
      id: item.id,
      body: item
    });
  }

  // Migrate Categories
  console.log('Migrating Categories...');
  const categories = await prisma.category.findMany();
  for (const item of categories) {
    await osClient.index({
      index: 'categories',
      id: item.id,
      body: item
    });
  }

  // Migrate Products
  console.log('Migrating Products...');
  const products = await prisma.product.findMany();
  for (const item of products) {
    await osClient.index({
      index: 'products',
      id: item.id,
      body: item
    });
  }

  // Migrate Reviews
  console.log('Migrating Reviews...');
  const reviews = await prisma.review.findMany();
  for (const item of reviews) {
    await osClient.index({
      index: 'reviews',
      id: item.id,
      body: item
    });
  }

  // Migrate Orders
  console.log('Migrating Orders...');
  const orders = await prisma.order.findMany();
  for (const item of orders) {
    await osClient.index({
      index: 'orders',
      id: item.id,
      body: item
    });
  }

  console.log('Migration completed successfully!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    // osClient doesn't need to be explicitly closed in newer versions if process exits
  });
