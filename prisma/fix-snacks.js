/**
 * fix-snacks.js
 * 
 * "Snacks" kategorisini oluşturur ve "Beers" kategorisindeki 
 * atıştırmalıkları (Fıstık, Ruffles, Karışık Çerez vb.) bu yeni kategoriye taşır.
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const SNACKS_ITEMS = ['Fıstık', 'Ruffles', 'Karışık Çerez']

async function main() {
  console.log('🍿 Snacks kategorisi düzenlemesi başlıyor...\n')

  // 1. Snacks kategorisini bul veya oluştur
  let snacksCategory = await prisma.categories.findFirst({ where: { name: 'Snacks' } })
  
  if (!snacksCategory) {
    snacksCategory = await prisma.categories.create({
      data: {
        name: 'Snacks',
        description: 'Atıştırmalıklar ve çerezler',
        display_order: 9,
      }
    })
    console.log(`✅ "Snacks" kategorisi oluşturuldu.`)
  } else {
    console.log(`ℹ️  "Snacks" kategorisi zaten mevcut.`)
  }

  // 2. Beers (veya başka kategorilerdeki) ürünleri bulup taşı
  let movedCount = 0
  for (const itemName of SNACKS_ITEMS) {
    const item = await prisma.products.findFirst({
      where: { name: itemName }
    })

    if (item && item.category_id !== snacksCategory.id) {
      await prisma.products.update({
        where: { id: item.id },
        data: { category_id: snacksCategory.id }
      })
      console.log(`  ➕ "${itemName}" Snacks kategorisine taşındı.`)
      movedCount++
    }
  }

  console.log(`\n✅ İşlem tamamlandı! Toplam ${movedCount} ürün taşındı.`)
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
