import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config'; // to load .env file

// Supabase client ayarları
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("HATA: .env dosyasında NEXT_PUBLIC_SUPABASE_URL veya NEXT_PUBLIC_SUPABASE_ANON_KEY bulunamadı!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Dışa aktarılacak tablolar
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
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Klasörleri oluştur
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

async function exportTables() {
  console.log("📦 Tablo verileri indiriliyor...");
  
  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`HATA: ${table} tablosu alınamadı.`, error.message);
      continue;
    }
    
    const filePath = path.join(BACKUP_DIR, `${table}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ ${table} tablosu kaydedildi (${data.length} kayıt).`);
  }
}

async function exportStorage() {
  console.log("\n🖼️ Fotoğraflar indiriliyor (product-images bucket'ı)...");
  
  const bucket = 'product-images';
  
  // Storage'daki tüm dosyaları listele (ürün fotoğrafları klasörlerde olabilir, genelde ana dizin veya products altındadır)
  // Mevcut koda göre dosyalar "products/dosyadi.jpg" şeklinde kaydedilmiş olabilir.
  const { data: files, error } = await supabase.storage.from(bucket).list('', {
    limit: 1000,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });
  
  if (error) {
    console.error("HATA: Dosyalar listelenemedi.", error.message);
    return;
  }
  
  // Eğer klasörlenmiş yapı varsa, listelemek için recursive bir fonksiyon gerekebilir. 
  // Lib/supabase.ts'te klasör parametresi 'products' varsayılan verilmiş. O yüzden 'products' klasörüne de bakalım.
  const { data: folderFiles, error: folderError } = await supabase.storage.from(bucket).list('products', {
    limit: 1000,
  });

  const allFiles = [];
  
  if (files) {
    for (const f of files) {
      if (f.id === null) continue; // Klasör demek
      allFiles.push({ path: f.name });
    }
  }
  
  if (folderFiles && !folderError) {
    for (const f of folderFiles) {
      if (f.id === null) continue;
      allFiles.push({ path: `products/${f.name}` });
    }
  }
  
  // Kampanya ve Hakkımızda resimleri nereye kaydediliyor? Genelde product-images içinde root dizinde ya da klasörsüz kaydedilmiş olabilir.
  // Tablolardaki image_url alanlarını da kontrol edip direk public URL'den indirebiliriz. Bu daha güvenilir bir yoldur.
  
  console.log("Veritabanından resim URL'leri taranıyor...");
  const imageUrls = new Set<string>();
  
  const tablesWithImages = ['products', 'activities', 'about_images', 'campaigns_images'];
  for (const table of tablesWithImages) {
    const { data } = await supabase.from(table).select('image_url').not('image_url', 'is', null);
    if (data) {
      data.forEach(item => {
        if (item.image_url) {
          // Eğer /products/isim.jpg gibiyse veya tam URL ise
          imageUrls.add(item.image_url);
        }
      });
    }
  }
  
  console.log(`Toplam ${imageUrls.size} adet aktif resim URL'si bulundu. İndiriliyor...`);
  
  for (const url of imageUrls) {
    try {
      // Eğer url tam bir supabase url'si ise fetch ile indirebiliriz
      // Eğer /artisan-pizza-with-wine-bottle.jpg gibiyse, uygulamanın public klasöründedir zaten indirmeye gerek yok.
      // Sadece supabase storage linki olanları indirelim.
      if (url.includes('supabase.co/storage')) {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        
        // Dosya ismini çıkar
        const urlObj = new URL(url);
        const fileName = path.basename(urlObj.pathname);
        const destPath = path.join(UPLOADS_DIR, fileName);
        
        fs.writeFileSync(destPath, Buffer.from(buffer));
        console.log(`✅ İndirildi: ${fileName}`);
      } else {
        console.log(`ℹ️ Supabase Storage linki değil (Zaten projede var olabilir): ${url}`);
      }
    } catch (e) {
      console.error(`HATA: Resim indirilemedi: ${url}`, e);
    }
  }
}

async function main() {
  console.log("🚀 Supabase Veri Yedekleme Başlıyor...\n");
  await exportTables();
  await exportStorage();
  console.log("\n🎉 Yedekleme tamamlandı!");
  console.log(`Veriler: ${BACKUP_DIR}`);
  console.log(`Resimler: ${UPLOADS_DIR}`);
}

main();
