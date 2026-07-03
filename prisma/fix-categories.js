/**
 * fix-categories.js
 * 
 * Türkçe kategorilerdeki ürünleri İngilizce eşdeğerlerine taşır,
 * sonra Türkçe kategorileri siler.
 * 
 * Çalıştır: node prisma/fix-categories.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Türkçe → İngilizce eşleştirme
const MERGE_MAP = [
  { from: 'Biralar',    to: 'Beers' },
  { from: 'Kokteyller', to: 'Cocktails' },
  { from: 'Viskiler',   to: 'Whiskeys' },
]

async function main() {
  console.log('🔧 Kategori düzeltme başlıyor...\n')

  for (const { from, to } of MERGE_MAP) {
    const fromCat = await prisma.categories.findFirst({ where: { name: from } })
    const toCat   = await prisma.categories.findFirst({ where: { name: to } })

    if (!fromCat) {
      console.log(`ℹ️  "${from}" kategorisi bulunamadı, atlanıyor.`)
      continue
    }
    if (!toCat) {
      console.log(`⚠️  "${to}" kategorisi bulunamadı! Önce seed çalıştırın.`)
      continue
    }

    // Türkçe kategorideki ürünleri İngilizce kategoriye taşı
    const updated = await prisma.products.updateMany({
      where: { category_id: fromCat.id },
      data:  { category_id: toCat.id }
    })

    console.log(`✅ "${from}" → "${to}": ${updated.count} ürün taşındı.`)

    // Türkçe kategoriyi sil
    await prisma.categories.delete({ where: { id: fromCat.id } })
    console.log(`🗑️  "${from}" kategorisi silindi.\n`)
  }

  console.log('✅ Tüm düzeltmeler tamamlandı!')
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
