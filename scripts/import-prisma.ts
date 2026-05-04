import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const BACKUP_DIR = path.join(process.cwd(), 'supabase_backup');

async function importData() {
  console.log("🚀 Prisma içe aktarma işlemi başlıyor...");

  try {
    // 1. Kategoriler
    if (fs.existsSync(path.join(BACKUP_DIR, 'categories.json'))) {
      const categories = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, 'categories.json'), 'utf-8'));
      console.log(`📦 Kategoriler yükleniyor (${categories.length} adet)...`);
      for (const cat of categories) {
        await prisma.categories.upsert({
          where: { id: cat.id },
          update: cat,
          create: cat,
        });
      }
    }

    // 2. Ürünler
    if (fs.existsSync(path.join(BACKUP_DIR, 'products.json'))) {
      const products = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, 'products.json'), 'utf-8'));
      console.log(`📦 Ürünler yükleniyor (${products.length} adet)...`);
      for (const prod of products) {
        // image_url Supabase storage linkiyse, public/uploads dizinine uygun formata dönüştür
        if (prod.image_url && prod.image_url.includes('supabase.co')) {
          const urlObj = new URL(prod.image_url);
          const fileName = path.basename(urlObj.pathname);
          prod.image_url = `/uploads/${fileName}`;
        }
        
        await prisma.products.upsert({
          where: { id: prod.id },
          update: prod,
          create: prod,
        });
      }
    }

    // 3. Popüler Ürünler
    if (fs.existsSync(path.join(BACKUP_DIR, 'popular_items.json'))) {
      const popular = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, 'popular_items.json'), 'utf-8'));
      console.log(`📦 Popüler Ürünler yükleniyor (${popular.length} adet)...`);
      for (const pop of popular) {
        await prisma.popular_items.upsert({
          where: { id: pop.id },
          update: pop,
          create: pop,
        });
      }
    }

    // 4. Aktiviteler
    if (fs.existsSync(path.join(BACKUP_DIR, 'activities.json'))) {
      const activities = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, 'activities.json'), 'utf-8'));
      console.log(`📦 Aktiviteler yükleniyor (${activities.length} adet)...`);
      for (const act of activities) {
        if (act.image_url && act.image_url.includes('supabase.co')) {
          const urlObj = new URL(act.image_url);
          const fileName = path.basename(urlObj.pathname);
          act.image_url = `/uploads/${fileName}`;
        }
        await prisma.activities.upsert({
          where: { id: act.id },
          update: act,
          create: act,
        });
      }
    }

    // 5. Admin Kullanıcıları
    if (fs.existsSync(path.join(BACKUP_DIR, 'admin_users.json'))) {
      const admins = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, 'admin_users.json'), 'utf-8'));
      console.log(`📦 Admin Kullanıcıları yükleniyor (${admins.length} adet)...`);
      for (const admin of admins) {
        await prisma.admin_users.upsert({
          where: { username: admin.username },
          update: admin,
          create: admin,
        });
      }
    }

    // 6. Hakkımızda Resimleri
    if (fs.existsSync(path.join(BACKUP_DIR, 'about_images.json'))) {
      const about = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, 'about_images.json'), 'utf-8'));
      console.log(`📦 Hakkımızda Resimleri yükleniyor (${about.length} adet)...`);
      for (const ab of about) {
        if (ab.image_url && ab.image_url.includes('supabase.co')) {
          const urlObj = new URL(ab.image_url);
          const fileName = path.basename(urlObj.pathname);
          ab.image_url = `/uploads/${fileName}`;
        }
        await prisma.about_images.upsert({
          where: { id: ab.id },
          update: ab,
          create: ab,
        });
      }
    }

    // 7. Kampanya Resimleri
    if (fs.existsSync(path.join(BACKUP_DIR, 'campaigns_images.json'))) {
      const campaigns = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, 'campaigns_images.json'), 'utf-8'));
      console.log(`📦 Kampanya Resimleri yükleniyor (${campaigns.length} adet)...`);
      for (const camp of campaigns) {
        if (camp.image_url && camp.image_url.includes('supabase.co')) {
          const urlObj = new URL(camp.image_url);
          const fileName = path.basename(urlObj.pathname);
          camp.image_url = `/uploads/${fileName}`;
        }
        await prisma.campaigns_images.upsert({
          where: { id: camp.id },
          update: camp,
          create: camp,
        });
      }
    }

    console.log("🎉 Tüm veriler başarıyla yeni veritabanına aktarıldı!");
  } catch (error) {
    console.error("❌ HATA: İçe aktarma sırasında bir sorun oluştu:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
