// Eski Supabase yedeğini (supabase_backup/*.json) yeni Postgres'e geri yükler.
// Çalıştırma: docker compose exec -e RESTORE_ADMIN_USERNAME=... -e RESTORE_ADMIN_PASSWORD=... app node scripts/restore-backup.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()
const backupDir = path.join(__dirname, '..', 'supabase_backup')
const R2_PUBLIC_URL = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '')

function loadJson(name) {
  const file = path.join(backupDir, name)
  if (!fs.existsSync(file)) return []
  const raw = fs.readFileSync(file, 'utf-8').trim()
  if (!raw) return []
  return JSON.parse(raw)
}

// Eski Supabase storage URL'ini R2 public URL'ine çevirir, dosya yolunu korur
function rewriteImageUrl(url) {
  if (!url) return url
  const marker = '/product-images/'
  const idx = url.indexOf(marker)
  if (idx === -1) return url
  const key = url.slice(idx + marker.length)
  return R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : url
}

async function upsertAll(label, records, modelName, transform) {
  let ok = 0
  for (const record of records) {
    try {
      const data = transform ? transform(record) : record
      await prisma[modelName].upsert({
        where: { id: record.id },
        update: {},
        create: data,
      })
      ok++
    } catch (err) {
      console.error(`❌ ${label} eklenemedi (id: ${record.id}):`, err.message)
    }
  }
  console.log(`✅ ${label}: ${ok}/${records.length}`)
}

async function main() {
  if (!R2_PUBLIC_URL) {
    console.warn('⚠️  NEXT_PUBLIC_R2_PUBLIC_URL tanımlı değil — image_url alanları eski Supabase adresinde kalacak.')
  }

  const categories = loadJson('categories.json')
  const products = loadJson('products.json')
  const popularItems = loadJson('popular_items.json')
  const aboutImages = loadJson('about_images.json')
  const campaignsImages = loadJson('campaigns_images.json')
  const activities = loadJson('activities.json')

  // Sıra önemli: FK bağımlılıkları önce gelmeli
  await upsertAll('Kategoriler', categories, 'categories')
  await upsertAll('Ürünler', products, 'products', (p) => ({ ...p, image_url: rewriteImageUrl(p.image_url) }))
  await upsertAll('Popüler ürünler', popularItems, 'popular_items')
  await upsertAll('Hakkımızda görselleri', aboutImages, 'about_images', (a) => ({ ...a, image_url: rewriteImageUrl(a.image_url) }))
  await upsertAll('Kampanya görselleri', campaignsImages, 'campaigns_images', (c) => ({ ...c, image_url: rewriteImageUrl(c.image_url) }))
  await upsertAll('Aktiviteler', activities, 'activities')

  const adminUsername = process.env.RESTORE_ADMIN_USERNAME
  const adminPassword = process.env.RESTORE_ADMIN_PASSWORD

  if (adminUsername && adminPassword) {
    const existing = await prisma.admin_users.findUnique({ where: { username: adminUsername } })
    if (!existing) {
      const password_hash = await bcrypt.hash(adminPassword, 10)
      await prisma.admin_users.create({ data: { username: adminUsername, password_hash } })
      console.log(`✅ Admin kullanıcı oluşturuldu: ${adminUsername}`)
    } else {
      console.log(`ℹ️  Admin kullanıcı zaten var: ${adminUsername}`)
    }
  } else {
    console.log('ℹ️  RESTORE_ADMIN_USERNAME / RESTORE_ADMIN_PASSWORD verilmedi, admin kullanıcı oluşturulmadı.')
  }

  console.log('\n🎉 Geri yükleme tamamlandı.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
