import { Client } from '@opensearch-project/opensearch';
import bcrypt from 'bcryptjs';

const osClient = new Client({
  node: 'https://avnadmin:AVNS_P2TZrd3sKrabzG7Y-G9@os-8ae6aaf-dangerchamp2-08f5.e.aivencloud.com:16944'
});

async function main() {
  const password = await bcrypt.hash('Nokia927007', 10);
  const admin = {
    id: 'admin-1',
    email: 'granddecore@gmail.com',
    password,
    name: 'Admin',
    role: 'admin',
    createdAt: new Date().toISOString()
  };

  // create indices if they don't exist
  const indices = ['admins', 'settings', 'categories', 'products', 'reviews', 'orders'];
  for (const idx of indices) {
    try {
      await osClient.indices.create({ index: idx });
      console.log(`Created index ${idx}`);
    } catch(e) {
       // Ignore index already exists
    }
  }

  await osClient.index({
    index: 'admins',
    id: admin.id,
    body: admin,
    refresh: true
  });
  console.log('Admin created successfully.');
}

main().catch(console.error).finally(() => osClient.close());
