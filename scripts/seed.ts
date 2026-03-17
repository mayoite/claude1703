// Seed script using direct postgres connection (bypasses RLS).
// Run with: npx tsx scripts/seed.ts
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

// Parse the connection string manually to avoid URL-encoding issues
// with special characters in the password (e.g. @, #, $)
const rawUrl = (process.env.DATABASE_URL ?? '').replace(/^\"|\"$/g, '').replace(/^'|'$/g, '');

if (!rawUrl) {
    console.error('DATABASE_URL not set in .env.local');
    process.exit(1);
}

// Regex that handles passwords containing @ by matching the last @host:port/db
// e.g. postgresql://postgres:[Buddy@#$02122022]@db.xxx.supabase.co:5432/postgres
const match = rawUrl.match(/^postgresql:\/\/([^:]+):(.+)@([^@]+):(\d+)\/(.+)$/);
if (!match) {
    console.error('Could not parse DATABASE_URL. Format: postgresql://user:password@host:port/db');
    process.exit(1);
}

// Grab the last @-separated segment as host:port/db, everything before is user:password
const parts = rawUrl.replace(/^postgresql:\/\//, '').split('@');
const hostPart = parts[parts.length - 1]; // last segment is host:port/db
const userPart = parts.slice(0, parts.length - 1).join('@'); // rejoin rest as user:pass

const [userStr, ...passParts] = userPart.split(':');
const passwordStr = passParts.join(':'); // handle colons in password
const [hostStr, portAndDb] = hostPart.split(':');
const [portStr, dbStr] = portAndDb.split('/');

const sql = postgres({
    host: hostStr,
    port: parseInt(portStr),
    database: dbStr,
    username: userStr,
    password: passwordStr,
    ssl: 'require',
});

async function seed() {
    console.log('Connecting to Supabase via direct postgres connection...');

    const seedFile = path.join(process.cwd(), 'scripts', 'seed_data.sql');

    if (!fs.existsSync(seedFile)) {
        console.error('seed_data.sql not found.');
        process.exit(1);
    }

    const seedSql = fs.readFileSync(seedFile, 'utf-8');

    // Split into individual statements
    const statements = seedSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;
    let skipCount = 0;

    for (const statement of statements) {
        try {
            await sql.unsafe(statement + ';');
            successCount++;
        } catch (err: any) {
            if (err.code === '23505' || err.message?.includes('duplicate key')) {
                skipCount++; // Already exists, skip
            } else {
                console.error(`Error: ${err.message}\n  → ${statement.substring(0, 100)}`);
                errorCount++;
            }
        }
    }

    console.log(`✅ Done: ${successCount} inserted, ${skipCount} skipped (already exist), ${errorCount} errors.`);
    await sql.end();
}

seed().catch(err => {
    console.error('Fatal:', err.message);
    process.exit(1);
});
