const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedModels() {
  const updates = [
    { category_id: "oando-tables", '3d_model': "/models/tables/conference.glb" },
    { category_id: "oando-workstations", '3d_model': "/models/workstations/desk.glb" },
    { category_id: "oando-seating", '3d_model': "/models/seating/task.glb" },
    { category_id: "oando-storage", '3d_model': "/models/storage/cabinet.glb" }
  ];

  for (const group of updates) {
    const { error } = await supabase
        .from('products')
        .update({ "3d_model": group['3d_model'] })
        .eq('category_id', group.category_id);
    
    if (error) {
        console.error(`Error updating ${group.category_id}:`, error);
    } else {
        console.log(`Updated ${group.category_id} with ${group['3d_model']}`);
    }
  }
}

seedModels();
