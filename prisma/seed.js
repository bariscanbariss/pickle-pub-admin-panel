const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// ─── KATEGORİLER ───────────────────────────────────────────────────────────────
const categories = [
  { name: 'Biralar',      description: 'Fıçı, şişe ve özel biralar',        display_order: 1 },
  { name: 'Kokteyller',   description: 'Özel kokteyl ve karışık içecekler',  display_order: 2 },
  { name: 'Viskiler',     description: 'Tekli ve duble viski seçenekleri',   display_order: 3 },
  { name: 'Wine',         description: 'Kadeh ve şişe şarap seçenekleri',   display_order: 4 },
  { name: 'Shots',        description: 'Shot ve kısa içecekler',             display_order: 5 },
  { name: 'Soft Drinks',  description: 'Alkolsüz içecekler',                 display_order: 6 },
  { name: 'Foods',        description: 'Yemek ve atıştırmalıklar',           display_order: 7 },
  { name: 'Coffees',      description: 'Sıcak ve soğuk kahve çeşitleri',    display_order: 8 },
]

// ─── ÜRÜNLER ──────────────────────────────────────────────────────────────────
// Her entry: [categoryName, productName, price]
const products = [
  // ── BIRALAR ──
  ['Biralar', '50cl Fıçı',          220],
  ['Biralar', '30cl Fıçı',          190],
  ['Biralar', 'Orj Mexican',        270],
  ['Biralar', '30cl Mexican Orj',   250],
  ['Biralar', '30cl Fake Mexican',  230],
  ['Biralar', 'Şişe Bira',          250],
  ['Biralar', 'Pickle Beer',        250],
  ['Biralar', 'Pickle Tekila',      270],
  ['Biralar', 'Corona',             280],
  ['Biralar', 'Amsterdam',          280],
  ['Biralar', 'Guinness',           300],
  ['Biralar', '30 Cl Heineken',     250],
  ['Biralar', '50cl Heineken',      280],
  ['Biralar', 'Pickle 30cl',        230],
  ['Biralar', 'Hellboy',            300],
  ['Biralar', 'Mexican Fake 50 Cl', 250],
  // Atıştırmalıklar biralar ile birlikte
  ['Biralar', 'Fıstık',             100],
  ['Biralar', 'Ruffles',            100],
  ['Biralar', 'Karışık Çerez',      140],

  // ── KOKTEYLLer ──
  ['Kokteyller', 'Barbie',              350],
  ['Kokteyller', 'Long Island',         400],
  ['Kokteyller', 'Sex On The Beach',    320],
  ['Kokteyller', 'Pickle Special',      350],
  ['Kokteyller', 'Tokyo Icetea',        400],
  ['Kokteyller', 'Gin + Soft',          300],
  ['Kokteyller', 'Vodka + Soft',        300],
  ['Kokteyller', 'Pickle Margarita',    300],
  ['Kokteyller', 'Jagerbomb',           350],
  ['Kokteyller', 'Bombay + Soft',       350],
  ['Kokteyller', 'Bombay + Soft Duble', 450],
  ['Kokteyller', 'Absolut + Soft',      350],
  ['Kokteyller', 'Absolut + Soft Duble',420],
  ['Kokteyller', 'Sour Patch',          400],
  ['Kokteyller', 'Ironman',             370],

  // ── VİSKİLER ──
  ['Viskiler', 'Chivas 12',         350],
  ['Viskiler', 'Chivas 12 Duble',   450],
  ['Viskiler', 'Label Black',       350],
  ['Viskiler', 'Label Black Duble', 450],
  ['Viskiler', 'Jack Daniels',      350],
  ['Viskiler', 'Jack Daniels Duble',450],
  ['Viskiler', 'Jameson',           350],
  ['Viskiler', 'Jameson Duble',     450],
  ['Viskiler', 'Jim Beam',          320],
  ['Viskiler', 'Jim Beam Duble',    420],
  ['Viskiler', 'Fireball',          320],
  ['Viskiler', 'Fireball Duble',    420],
  ['Viskiler', 'Local Viski',       300],
  ['Viskiler', 'Local Viski Duble', 400],
  ['Viskiler', 'Baileys Bardak',    275],

  // ── WİNE ──
  ['Wine', 'Şarap Kadeh',  250],
  ['Wine', 'Şişe Şarap',  1000],
  ['Wine', 'Pizza Şarap', 1400],

  // ── SHOTS ──
  ['Shots', 'Tekila',         110],
  ['Shots', 'Jagermeister',   140],
  ['Shots', 'Black Label',    140],
  ['Shots', 'Jack',           140],
  ['Shots', 'Baileys',        120],
  ['Shots', 'Zivania',        120],
  ['Shots', '5 Li Shot',      550],
  ['Shots', 'Hönönö',         250],
  ['Shots', 'Baileys Shot',   120],
  ['Shots', 'Miyav',          140],

  // ── SOFT DRINKS (Alkolsüz) ──
  ['Soft Drinks', 'Italian Soda',     200],
  ['Soft Drinks', 'Kola',             120],
  ['Soft Drinks', 'Sprite',           120],
  ['Soft Drinks', 'Fanta',            120],
  ['Soft Drinks', 'Soda',             100],
  ['Soft Drinks', 'Churchill',        125],
  ['Soft Drinks', 'Alkolsüz Kokteyl', 200],
  ['Soft Drinks', 'Meyve Suyu',       150],
  ['Soft Drinks', 'Su',                50],
  ['Soft Drinks', 'Çay',               90],
  ['Soft Drinks', 'Redbull',          200],
  ['Soft Drinks', 'Limonata',         180],

  // ── FOODS (Yemek) ──
  ['Foods', 'Hotdog',                 400],
  ['Foods', 'Et Burger',              520],
  ['Foods', 'Et Burger Duble',        650],
  ['Foods', 'Tavuk Burger',           490],
  ['Foods', 'Tavuk Wrap',             490],
  ['Foods', 'Bira Tabağı',            900],
  ['Foods', 'Bira Tabağı Duble',     1200],
  ['Foods', 'Patates Kızartması',     325],
  ['Foods', 'Patates Kızartması Duble',400],
  ['Foods', 'Pizza',                  720],
  ['Foods', 'Pickle Monster Burger',  690],
  ['Foods', 'Tiftik Burger',          680],
  ['Foods', 'Bacon Burger',           620],
  ['Foods', 'Sosisli Bud',            400],

  // ── COFFEES (Kahveler) ──
  ['Coffees', 'Filtre Kahve',    170],
  ['Coffees', 'Türk Kahvesi',     80],
  ['Coffees', 'Sütlü Filtre',    180],
  ['Coffees', 'Ice Filtre',      170],
  ['Coffees', 'Ice Filtre Sütlü',180],
]

// ─── SEED FONKSİYONU ─────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seed başlıyor...\n')

  // ── 1. Admin ──
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'password'
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(adminPassword, salt)

  const existingAdmin = await prisma.admin_users.findUnique({ where: { username: adminUsername } })
  if (!existingAdmin) {
    await prisma.admin_users.create({ data: { username: adminUsername, password_hash: passwordHash } })
    console.log(`✅ Admin oluşturuldu → ${adminUsername}`)
  } else {
    console.log('ℹ️  Admin zaten mevcut.')
  }

  // ── 2. Kategorileri ekle / güncelle ──
  const categoryMap = {} // name → id

  for (const [i, cat] of categories.entries()) {
    const existing = await prisma.categories.findFirst({ where: { name: cat.name } })
    if (!existing) {
      const created = await prisma.categories.create({ data: cat })
      categoryMap[cat.name] = created.id
      console.log(`✅ Kategori eklendi: ${cat.name}`)
    } else {
      categoryMap[cat.name] = existing.id
      console.log(`ℹ️  Kategori zaten mevcut: ${cat.name}`)
    }
  }

  // ── 3. Ürünleri ekle ──
  let added = 0
  let skipped = 0

  for (const [i, [catName, productName, price]] of products.entries()) {
    const category_id = categoryMap[catName]
    if (!category_id) {
      console.warn(`⚠️  Kategori bulunamadı: ${catName}`)
      continue
    }

    const existing = await prisma.products.findFirst({
      where: { name: productName, category_id }
    })

    if (!existing) {
      await prisma.products.create({
        data: {
          name: productName,
          price,
          category_id,
          is_active: true,
          is_popular: false,
          discount_percentage: 0,
          display_order: i,
        }
      })
      console.log(`  ➕ ${catName} → ${productName} (₺${price})`)
      added++
    } else {
      skipped++
    }
  }

  console.log(`\n✅ Seed tamamlandı! ${added} ürün eklendi, ${skipped} ürün zaten mevcuttu.`)
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
