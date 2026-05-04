import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = 'postgresql://postgres.mskfpikoiaeeuuwrkrsw:Pickle.pub123!@aws-1-eu-central-1.pooler.supabase.com:5432/postgres';

const TABLES = [
  'categories',
  'products',
  'popular_items',
  'activities',
  'admin_users',
  'about_images',
  'campaigns_images'
];

const BACKUP_DIR = path.join(process.cwd(), 'supabase_backup');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function exportData() {
  console.log("Bağlanıyor (Session Pooler)...");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("✅ Veritabanına başarıyla bağlanıldı.");

    for (const table of TABLES) {
      console.log(`📦 ${table} tablosu çekiliyor...`);
      const res = await client.query(`SELECT * FROM ${table}`);
      const filePath = path.join(BACKUP_DIR, `${table}.json`);
      fs.writeFileSync(filePath, JSON.stringify(res.rows, null, 2));
      console.log(`   └─ ${res.rows.length} kayıt kaydedildi.`);
    }

    console.log(`📦 storage.objects tablosu çekiliyor...`);
    try {
      const res = await client.query(`SELECT * FROM storage.objects WHERE bucket_id = 'product-images'`);
      const filePath = path.join(BACKUP_DIR, `storage_objects.json`);
      fs.writeFileSync(filePath, JSON.stringify(res.rows, null, 2));
      console.log(`   └─ ${res.rows.length} fotoğraf kaydı bulundu.`);
    } catch (e: any) {
      console.log(`   └─ storage.objects bulunamadı (yetki yok): ${e.message}`);
    }

  } catch (err) {
    console.error("❌ HATA: Veritabanına bağlanılamadı.", err);
  } finally {
    await client.end();
  }
}

exportData();
