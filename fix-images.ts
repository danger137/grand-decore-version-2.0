import { osClient } from './src/lib/opensearch';

async function main() {
  console.log('Finding and fixing broken images in products...');

  const { body } = await osClient.search({
    index: 'products',
    size: 100,
    body: {
      query: {
        match_all: {}
      }
    }
  });

  const products = body.hits.hits;
  const brokenId = '1612196808214-b40b3b76bd5b';
  // Fallback vase image from unsplash that is known to work
  const replacement = 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=1400'; 

  for (const hit of products) {
    const p = hit._source as any;
    let changed = false;
    
    const newImages = p.images.map((img: string) => {
      if (img.includes(brokenId)) {
        changed = true;
        // Replacement image
        return 'https://images.unsplash.com/photo-1601397222340-9a3c108c4a4a?w=1400';
      }
      return img;
    });

    if (changed) {
      await osClient.update({
        index: 'products',
        id: hit._id,
        body: {
          doc: { images: newImages }
        },
        refresh: true
      });
      console.log(`Fixed images for product: ${p.name}`);
    }
  }

  console.log('Image fixing complete!');
}

main().catch(console.error).finally(() => osClient.close());
