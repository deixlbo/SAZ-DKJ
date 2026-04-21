import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[v0] Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('[v0] Connecting to Supabase...');
const supabase = createClient(supabaseUrl, supabaseKey);

// Read the SQL file
const sqlFilePath = path.join(process.cwd(), 'scripts', '01-setup-supabase-schema.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf-8');

// Split SQL into individual statements
const statements = sql
  .split(';')
  .map((stmt) => stmt.trim())
  .filter((stmt) => stmt.length > 0 && !stmt.startsWith('--'));

async function runMigration() {
  console.log(`[v0] Found ${statements.length} SQL statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    try {
      console.log(`[v0] Executing statement ${i + 1}/${statements.length}...`);
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`[v0] Error in statement ${i + 1}:`, error.message);
        // Don't exit on error - some statements might be idempotent
      } else {
        console.log(`[v0] Statement ${i + 1} completed successfully`);
      }
    } catch (err) {
      console.error(`[v0] Exception in statement ${i + 1}:`, err.message);
    }
  }

  console.log('[v0] Migration completed!');
}

runMigration();
