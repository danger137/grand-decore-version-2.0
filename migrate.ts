import { PrismaClient } from '@prisma/client';

const oldDbUrl = 'postgresql://neondb_owner:npg_m7ICHwZciXs1@ep-winter-sunset-aq69yyki-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const newDbUrl = 'postgres://avnadmin:AVNS_P2TZrd3sKrabzG7Y-G9@os-8ae6aaf-dangerchamp2-08f5.e.aivencloud.com:16944/defaultdb?sslmode=require';

const neon = new PrismaClient({
  datasourceUrl: oldDbUrl,
});

const aiven = new PrismaClient({
  datasourceUrl: newDbUrl,
});

async function main() {
  console.log('Starting migration...');

  // 1. Migrate StoreSettings
  console.log('Migrating StoreSettings...');
  const settings = await neon.storeSettings.findMany();
  if (settings.length > 0) {
    // Aiven might have default setting from db push, let's delete all and insert
    await aiven.storeSettings.deleteMany();
    await aiven.storeSettings.createMany({ data: settings });
  }

  // 2. Migrate Admin
  console.log('Migrating Admins...');
  const admins = await neon.admin.findMany();
  if (admins.length > 0) {
    await aiven.admin.deleteMany();
    await aiven.admin.createMany({ data: admins });
  }

  // 3. Migrate Categories
  console.log('Migrating Categories...');
  const categories = await neon.category.findMany();
  if (categories.length > 0) {
    await aiven.category.deleteMany();
    await aiven.category.createMany({ data: categories });
  }

  // 4. Migrate Products
  console.log('Migrating Products...');
  const products = await neon.product.findMany();
  if (products.length > 0) {
    await aiven.product.deleteMany();
    await aiven.product.createMany({ data: products });
  }

  // 5. Migrate Reviews
  console.log('Migrating Reviews...');
  const reviews = await neon.review.findMany();
  if (reviews.length > 0) {
    await aiven.review.deleteMany();
    await aiven.review.createMany({ data: reviews });
  }

  // 6. Migrate Orders
  console.log('Migrating Orders...');
  const orders = await neon.order.findMany();
  if (orders.length > 0) {
    await aiven.order.deleteMany();
    await aiven.order.createMany({ data: orders });
  }

  console.log('Migration completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await neon.$disconnect();
    await aiven.$disconnect();
  });
