// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixImages() {
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Checking ${products.length} products for invalid images...`);
  let updatedCount = 0;

  for (const p of products) {
    let changed = false;
    let newP = { ...p };

    const fixUrl = (url) => {
      if (!url) return url;
      let fixed = url;
      fixed = fixed.replace(/\/images\/storage\//g, '/images/products/imported/storage/');
      fixed = fixed.replace(/\/images\/collaborative\//g, '/images/products/imported/collaborative/');
      fixed = fixed.replace(/\/images\/educational\//g, '/images/products/imported/educational/');
      return fixed;
    };

    if (newP.flagship_image) {
      const fixed = fixUrl(newP.flagship_image);
      if (fixed !== newP.flagship_image) {
        newP.flagship_image = fixed;
        changed = true;
      }
    }

    if (newP.images && Array.isArray(newP.images)) {
      const fixedStr = JSON.stringify(newP.images);
      const newStr = fixUrl(fixedStr);
      if (fixedStr !== newStr) {
        newP.images = JSON.parse(newStr);
        changed = true;
      }
    }
    
    if (newP.scene_images && Array.isArray(newP.scene_images)) {
      const fixedStr = JSON.stringify(newP.scene_images);
      const newStr = fixUrl(fixedStr);
      if (fixedStr !== newStr) {
        newP.scene_images = JSON.parse(newStr);
        changed = true;
      }
    }

    if (changed) {
      console.log(`Updating ${p.slug}...`);
      const { error: updateError } = await supabase
        .from('products')
        .update({
          flagship_image: newP.flagship_image,
          images: newP.images,
          scene_images: newP.scene_images
        })
        .eq('id', p.id);
      
      if (updateError) {
        console.error(`Failed to update ${p.slug}:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`Finished fixing images. Updated ${updatedCount} products.`);
}

fixImages();
