async function main() {
  const host = "https://os-8ae6aaf-dangerchamp2-08f5.e.aivencloud.com:16944";
  const auth = "Basic " + Buffer.from("avnadmin:AVNS_P2TZrd3sKrabzG7Y-G9").toString("base64");

  const indexes = ['categories', 'products', 'settings'];

  for (const index of indexes) {
    console.log(`\n=== Index: ${index} ===`);
    const res = await fetch(`${host}/${index}/_search`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      body: JSON.stringify({ size: 1000, query: { match_all: {} } })
    });
    const data = await res.json();
    const hits = data.hits?.hits || [];

    hits.forEach(h => {
      const str = JSON.stringify(h._source);
      if (str.includes('candles_category') || str.includes('textiles_category')) {
        console.log(`Document ID: ${h._id}`);
        console.log(`Source:`, h._source);
        console.log('------------------------');
      }
    });
  }
}

main().catch(console.error);
