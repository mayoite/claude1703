const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  const { error } = await supabase.rpc('execute_sql', { 
    sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS "3d_model" TEXT;' 
  });
  
  if (error) {
    if (error.message.includes('execute_sql') || error.code === 'PGRST202') {
        console.log("No custom rpc for raw sql. Using a dummy insert/select approach to trigger a 3d_model migration?");
        // Since we don't have direct SQL access through the JS client typically, 
        // we might just log this and rely on the user running the SQL script in Supabase Studio, 
        // OR the supabase CLI if it's installed. 
        console.warn("Please run the SQL migration manually in Supabase Studio: ALTER TABLE products ADD COLUMN \"3d_model\" TEXT;")
    } else {
        console.error("Error:", error);
    }
  } else {
    console.log("Migration executed successfully.");
  }
}

runMigration();
