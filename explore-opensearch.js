async function main() {
  const host = "https://os-8ae6aaf-dangerchamp2-08f5.e.aivencloud.com:16944";
  const auth = "Basic " + Buffer.from("avnadmin:AVNS_P2TZrd3sKrabzG7Y-G9").toString("base64");

  console.log('Querying categories from OpenSearch...');
  let res = await fetch(`${host}/categories/_search`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': auth
    },
    body: JSON.stringify({ size: 100, query: { match_all: {} } })
  });
  let data = await res.json();
  const categories = data.hits?.hits || [];
  console.log('\nCategories:');
  categories.forEach(h => {
    console.log(`ID: ${h._id}`);
    console.log(`Name: ${h._source.name}`);
    console.log(`Slug: ${h._source.slug}`);
    console.log(`ImageUrl: ${h._source.imageUrl}`);
    console.log('------------------------');
  });

  console.log('\nQuerying products from OpenSearch...');
  res = await fetch(`${host}/products/_search`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': auth
    },
    body: JSON.stringify({ size: 100, query: { match_all: {} } })
  });
  data = await res.json();
  const products = data.hits?.hits || [];
  console.log('\nProducts matching "candle" or "textile" or "cushion":');
  products.forEach(h => {
    const name = h._source.name || '';
    const desc = h._source.description || '';
    if (
      name.toLowerCase().includes('candle') ||
      name.toLowerCase().includes('textile') ||
      name.toLowerCase().includes('cushion') ||
      desc.toLowerCase().includes('candle') ||
      desc.toLowerCase().includes('textile')
    ) {
      console.log(`ID: ${h._id}`);
      console.log(`Name: ${h._source.name}`);
      console.log(`Slug: ${h._source.slug}`);
      console.log(`Images:`, h._source.images);
      console.log('------------------------');
    }
  });
}

main().catch(console.error);
