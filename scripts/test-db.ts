import { Client } from 'pg';

async function testConnection(connString: string, label: string) {
  console.log(`\nTest: ${label}`);
  const client = new Client({
    connectionString: connString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`✅ BAŞARILI: ${label}`);
    const res = await client.query('SELECT 1 as val');
    console.log('Query result:', res.rows[0].val);
    await client.end();
    return true;
  } catch (err: any) {
    console.log(`❌ BAŞARISIZ: ${label} - ${err.message}`);
    try { await client.end(); } catch (e) {}
    return false;
  }
}

async function run() {
  const password = encodeURIComponent("Pickle.pub123!");
  const strings = [
    `postgresql://postgres:${password}@db.mskfpikoiaeeuuwrkrsw.supabase.co:5432/postgres`,
    `postgresql://postgres.mskfpikoiaeeuuwrkrsw:${password}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.mskfpikoiaeeuuwrkrsw:${password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres:${password}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres:${password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`
  ];

  for (const s of strings) {
    await testConnection(s, s);
  }
}

run();
