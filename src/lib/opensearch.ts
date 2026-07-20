import { Client } from '@opensearch-project/opensearch';

// Ensure this uses the OpenSearch URL from env, fallback for now
const osUrl = process.env.OPENSEARCH_URL || "https://avnadmin:AVNS_P2TZrd3sKrabzG7Y-G9@os-8ae6aaf-dangerchamp2-08f5.e.aivencloud.com:16944";

export const osClient = new Client({
  node: osUrl,
  ssl: { rejectUnauthorized: false },
  requestTimeout: 5000,
  maxRetries: 1,
});

// Helper for generating UUIDs
export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
