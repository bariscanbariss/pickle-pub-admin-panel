// Güncel menu.txt fiyat listesini veritabanına işler.
// Sadece ekler/günceller — hiçbir ürünü silmez veya pasife çekmez.
// Tekrar tekrar çalıştırılabilir (idempotent).
//
// Kullanım (üretimde): docker compose exec app node prisma/sync-menu.js
// Kullanım (yerelde):  node prisma/sync-menu.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ─── KATEGORİLER ─────────────────────────────────────────────────────────────
// İsimler çarkın (wheel-of-fortune) beklediği isimlerle birebir aynı olmalı.
const CATEGORIES = [
  { name: 'Beers',       description: 'Fıçı, şişe ve özel biralar',       display_order: 1 },
  { name: 'Cocktails',   description: 'Özel kokteyl ve karışık içecekler', display_order: 2 },
  { name: 'Whiskeys',    description: 'Tekli ve duble viski seçenekleri',  display_order: 3 },
  { name: 'Wine',        description: 'Kadeh ve şişe şarap seçenekleri',   display_order: 4 },
  { name: 'Shots',       description: 'Shot ve kısa içecekler',            display_order: 5 },
  { name: 'Soft Drinks', description: 'Alkolsüz içecekler',                display_order: 6 },
  { name: 'Foods',       description: 'Yemek ve atıştırmalıklar',          display_order: 7 },
  { name: 'Coffees',     description: 'Sıcak ve soğuk kahve çeşitleri',    display_order: 8 },
  { name: 'Snacks',      description: 'Atıştırmalıklar ve çerezler',       display_order: 9 },
]

// ─── KOKTEYL ALT KATEGORİLERİ ────────────────────────────────────────────────
const SUBCATEGORIES = [
  { category: 'Cocktails', name: 'Votka Bazlı' },
  { category: 'Cocktails', name: 'Cin Bazlı' },
  { category: 'Cocktails', name: 'Viski Bazlı' },
  { category: 'Cocktails', name: 'Tekila Bazlı' },
]

// ─── ÜRÜNLER ─────────────────────────────────────────────────────────────────
// [kategori, isim, fiyat, açıklama, altKategori?, dublefiyatı?]
const PRODUCTS = [
  // ── WHISKEYS ──
  ['Whiskeys', 'Chivas 12',      350, "12 yıl fıçıda bekleyen İskoç mizacı — az buzla, çok sohbetle içilir.", null, 450],
  ['Whiskeys', 'Label Black',    350, "Johnnie Walker'ın en dengeli hâli; ne çok sert ne çok yumuşak, tam kararında.", null, 450],
  ['Whiskeys', 'Jack Daniels',   350, "Tennessee'nin çakır kayısı kömüründen süzülüp gelen klasik — buzla yumuşuyor.", null, 450],
  ['Whiskeys', 'Jameson',        350, "Üçlü damıtımın verdiği pürüzsüzlük; İrlanda'nın en kolay sevilen viskisi.", null, 450],
  ['Whiskeys', 'Jim Beam',       320, "Mısır ağırlıklı bourbon karakteri — tatlımsı, dumansız, kolay içim.", null, 420],
  ['Whiskeys', 'Fireball',       320, "Tarçınla yakan bir viski likörü; shot atmak isteyenlerin gizli favorisi.", null, 420],
  ['Whiskeys', 'Local Viski',    300, "Cebi de damağı da fazla yormayan, sofracı bir yerli viski.", null, 400],
  ['Whiskeys', 'Baileys Bardak', 275, "İrlanda kreması ve viski buluşması; tatlı yerine de geçer, sonrası da güzel gider."],

  // ── COFFEES ──
  ['Coffees', 'Filtre Kahve',     170, "Yavaşça demlenen, acele etmeyen bir fincan."],
  ['Coffees', 'Türk Kahvesi',      80, "Fincanın dibinde falına baktırılası bir telve bırakır."],
  ['Coffees', 'Sütlü Filtre',     180, "Filtre kahvenin sütle yumuşamış, daha uysal hâli."],
  ['Coffees', 'Ice Filtre',       170, "Sıcağa inat, buzla ferahlatan filtre kahve."],
  ['Coffees', 'Ice Filtre Sütlü', 180, "Buzlu filtre kahvenin sütlü, kadifemsi versiyonu."],

  // ── SOFT DRINKS ──
  ['Soft Drinks', 'Kola',             120, "Klasik, sorgusuz sualsiz her masaya yakışan seçim."],
  ['Soft Drinks', 'Sprite',           120, "Ferahlığını üstünden bırakmayan limonlu gazoz."],
  ['Soft Drinks', 'Fanta',            120, "Portakal aromasıyla neşeli bir seçenek."],
  ['Soft Drinks', 'Soda',             100, "Sade, gazlı, hiç iddiası olmayan bir ferahlık."],
  ['Soft Drinks', 'Churchill',        125, "Limon ve nane ikilisinin serinleten klasik karışımı."],
  ['Soft Drinks', 'Alkolsüz Kokteyl', 200, "Kokteyl deneyimini alkolsüz yaşamak isteyenler için renkli bir karışım."],
  ['Soft Drinks', 'Meyve Suyu',       150, "Günün taze meyvesinden, sade bir yudum."],
  ['Soft Drinks', 'Su',                50, "Bazen en doğru sipariş budur."],
  ['Soft Drinks', 'Italian Soda',     200, "Şuruplu, renkli, fotoğraflık bir ferahlık."],
  ['Soft Drinks', 'Çay',               90, "Sohbeti uzatmak için bahane arayanlara."],
  ['Soft Drinks', 'Limonata',         130, "Ekşi-tatlı dengesini tutturmuş ev yapımı tazelik."],
  ['Soft Drinks', 'Redbull',          200, "Gecenin geri kalanına devam kararı almış olanlar için."],

  // ── SHOTS ──
  ['Shots', 'Tekila',       110, "Tuz, tekila, limon — sırasını şaşırmayın."],
  ['Shots', 'Jagermeister', 140, "38 bitkinin buz gibi, otsu ve biraz gizemli karışımı."],
  ['Shots', 'Black Label',  140, "Whisky'nin tek yudumda geçiştirilen hâli."],
  ['Shots', 'Jack',         140, "Jack Daniels'ın shot boyu — kısa ama etkili."],
  ['Shots', 'Baileys',      120, "Kremamsı, tatlı, ilk shot için nazik bir başlangıç."],
  ['Shots', 'Zivania',      120, "Kıbrıs'ın güçlü, üzüm kökenli geleneksel damıtması."],
  ['Shots', '5 Li Shot',    550, "Masaya beş farklı karar getiren bir seçim."],
  ['Shots', 'Hönönö',       250, "Pickle Pub'a özel, adını sorduran gizemli bir karışım."],
  ['Shots', 'Baileys Shot', 120, "Baileys'in küçük bardaktaki hızlı versiyonu."],
  ['Shots', 'Miyav',        140, "İsmi kadar şaşırtıcı, tadı merak edilesi bir shot."],

  // ── COCKTAILS ──
  ['Cocktails', 'Barbie',              350, "Pembe rengi kadar iddialı, votka temelli tatlı-ekşi bir karışım.", 'Votka Bazlı'],
  ['Cocktails', 'Long Island',         400, "Dört farklı beyaz alkolün aynı bardakta buluştuğu klasik — dikkatli yudumlanır."],
  ['Cocktails', 'Sex On The Beach',    320, "Şeftali ve kızılcık aromalı, plaj kadar keyifli bir votka kokteyli.", 'Votka Bazlı'],
  ['Cocktails', 'Pickle Special',      350, "Tarifi barmenlerde saklı, Pickle Pub imzalı özel karışım."],
  ['Cocktails', 'Tokyo Icetea',        400, "Long Island'ın Midori ile yeşile boyanmış uzak doğu esintili hâli."],
  ['Cocktails', 'Gin + Soft',          300, "Cinin botanik karakterini damağa taşıyan sade bir karışım.", 'Cin Bazlı'],
  ['Cocktails', 'Vodka + Soft',        300, "Votkanın nötr temizliğini seçtiğiniz meşrubatla yumuşatın.", 'Votka Bazlı'],
  ['Cocktails', 'Pickle Margarita',    300, "Tekila, misket limonu ve tuzlu kenar — Pickle Pub yorumuyla.", 'Tekila Bazlı'],
  ['Cocktails', 'Jagerbomb',           350, "Jägermeister'ın enerji içeceğiyle patlayan buluşması."],
  ['Cocktails', 'Bombay + Soft',       350, "Bombay Sapphire'ın on bitkilik inceliği, seçtiğiniz meşrubatla tamamlanır.", 'Cin Bazlı', 450],
  ['Cocktails', 'Absolut + Soft',      350, "İsveç'in duru votkası, damak zevkinize göre yumuşuyor.", 'Votka Bazlı', 420],
  ['Cocktails', 'Morqin',              400, "Adını Pickle Pub'ın kendi mutfağından alan, tarifi dışarı çıkmayan bir karışım."],
  ['Cocktails', 'Devils Margarita',    350, "Klasik margaritanın biraz daha yakıcı, biraz daha cesur hâli.", 'Tekila Bazlı'],
  ['Cocktails', 'Ironman',             370, "Adı gibi güçlü, ilk yudumda kendini belli eden bir kokteyl."],
  ['Cocktails', 'Jaggerito',           350, "Jägermeister'ın mojito esintili, beklenmedik bir yorumu."],
  ['Cocktails', 'Sour Patch',          400, "Ekşi şekerlemenin içeceğe dönüşmüş, renkli ve iddialı hâli."],
  ['Cocktails', 'Frozen',              450, "Buz gibi, yoğun kıvamlı frozen margarita keyfi.", 'Tekila Bazlı'],

  // ── FOODS ──
  ['Foods', 'Hotdog',                400, "Bira yanına sorgusuz gidecek klasik sokak lezzeti."],
  ['Foods', 'Et Burger',              520, "Izgara etin dumanlı kokusunu ilk ısırıkta hissettiren burger."],
  ['Foods', 'Tavuk Burger',           490, "Çıtır tavuğun sade ve doyurucu hâli."],
  ['Foods', 'Tonbalık Sandviç',       250, "Hafif ama unutulmayan bir ton balığı klasiği."],
  ['Foods', 'Tavuk Wrap',             490, "Lavaşın içine sarılmış çıtır tavuk keyfi."],
  ['Foods', 'Et Wrap',                430, "Kırmızı etin lavaş içinde pratik ve doyurucu hâli."],
  ['Foods', 'Bira Tabağı',            900, "Masaya paylaşmak için gelen, biranın yanına sığmayan büyük tabak."],
  ['Foods', 'Patates Kızartması',     325, "Çıtır dışı, yumuşak içi — hiçbir masada eksik kalmaz."],
  ['Foods', 'Pizza',                  720, "İnce hamur üzerine cömert malzeme; paylaşmaya değer."],
  ['Foods', 'Hotdog Yarım',           250, "Tam porsiyona karar veremeyenler için ideal ölçü."],
  ['Foods', 'Pickle Monster Burger',  690, "Pickle Pub'ın en iddialı burgeri; adını boşuna almadı."],
  ['Foods', 'Tiftik Burger',          680, "Uzun süre pişen etin lifleyip dağılan, yumuşacık hâli."],
  ['Foods', 'Bacon Burger',           680, "Füme bacon'ın burgere kattığı o tuzlu-tatlı denge."],
  ['Foods', 'Pasta Servis',            50, "Kendi pastanızı getirdiyseniz, servisini bize bırakın."],

  // ── BEERS ──
  ['Beers', '50cl Fıçı',           220, "Taze çekilmiş, köpüğü tam kıvamında bir bardak."],
  ['Beers', '30cl Fıçı',           190, "Fıçı birayı küçük ölçekte denemek isteyenlere."],
  ['Beers', 'Orj Mexican',         270, "Meksika'nın orijinal tarifiyle gelen buzlu bira karışımı."],
  ['Beers', '30cl Mexican Orj',    250, "Orijinal Mexican'ın küçük boy hâli."],
  ['Beers', '30cl Fake Mexican',   230, "Orijinaline göz kırpan, cüzdan dostu alternatif."],
  ['Beers', 'Şişe Bira',           250, "Sade ve klasik; markası günün stoğuna göre değişir."],
  ['Beers', 'Pickle Beer',         250, "Pickle Pub'ın kendi imzasını taşıyan bira seçimi."],
  ['Beers', 'Pickle Tekila',       270, "Biranın içine düşen tekila şotuyla ikili bir sürpriz."],
  ['Beers', 'Corona',              280, "Dilim misket limonuyla servis edilen Meksika klasiği."],
  ['Beers', 'Amsterdam',           280, "Hollanda esintili, dengeli bir bira seçimi."],
  ['Beers', 'Guinness',            300, "Koyu rengi kadar derin, kadifemsi köpüklü İrlanda birası."],
  ['Beers', '30 Cl Heineken',      250, "Yeşil şişenin küçük ve pratik ölçüsü."],
  ['Beers', '50cl Heineken',       280, "Uzun sohbetler için büyük boy Heineken."],
  ['Beers', 'Glutensiz',           240, "Glutene dokunmadan bira keyfinden vazgeçmeyenler için."],
  ['Beers', 'Pickle 30cl',         230, "Pickle Pub'ın kendi birasının küçük ölçüsü."],
  ['Beers', 'Hellboy',             300, "İsmi kadar iddialı, güçlü karakterli bir bira."],
  ['Beers', 'Mexican Fake 50 Cl',  250, "Fake Mexican'ın büyük boy hâli."],

  // ── SNACKS ──
  ['Snacks', 'Fıstık',        100, "İçkinin yanında hiç eksik olmayan klasik çerez."],
  ['Snacks', 'Ruffles',       100, "Çıtır cips, uzun sohbetlerin sessiz ortağı."],
  ['Snacks', 'Karışık Çerez', 140, "Fıstıktan kuru üzüme, masaya dolan bir karışık kase."],

  // ── WINE ──
  ['Wine', 'Şarap Kadeh', 250, "Tek kadehlik bir mola, günün şarabına göre değişir."],
  ['Wine', 'Sıcak Şarap', 250, "Baharatlarla ısıtılmış, soğuk günlere inat bir kadeh."],
]

// İsim karşılaştırmasını boşluk/büyük-küçük harf/noktalama farklarına duyarsız yapar
// (örn. "Jackdaniels" ile "Jack Daniels" ya da "Gin+soft" ile "Gin + Soft" aynı ürün sayılır)
function normalize(name) {
  return name
    .toLocaleLowerCase('tr-TR')
    .replace(/[^a-z0-9ığüşöç]/gi, '')
}

async function main() {
  console.log('🔄 Menü senkronizasyonu başlıyor...\n')

  // ── 1. Kategoriler ──
  const categoryMap = {}
  for (const cat of CATEGORIES) {
    let existing = await prisma.categories.findFirst({ where: { name: cat.name } })
    if (!existing) {
      existing = await prisma.categories.create({ data: cat })
      console.log(`✅ Kategori oluşturuldu: ${cat.name}`)
    }
    categoryMap[cat.name] = existing.id
  }

  // ── 2. Kokteyl alt kategorileri ──
  const subcategoryMap = {}
  for (const sub of SUBCATEGORIES) {
    const category_id = categoryMap[sub.category]
    let existing = await prisma.subcategories.findFirst({ where: { category_id, name: sub.name } })
    if (!existing) {
      existing = await prisma.subcategories.create({ data: { category_id, name: sub.name } })
      console.log(`✅ Alt kategori oluşturuldu: ${sub.category} → ${sub.name}`)
    }
    subcategoryMap[`${sub.category}::${sub.name}`] = existing.id
  }

  // ── 3. Ürünler ──
  let created = 0
  let updated = 0

  for (const [categoryName, name, price, description, subcategoryName, doublePrice] of PRODUCTS) {
    const category_id = categoryMap[categoryName]
    if (!category_id) {
      console.warn(`⚠️  Kategori bulunamadı: ${categoryName}`)
      continue
    }
    const subcategory_id = subcategoryName ? subcategoryMap[`${categoryName}::${subcategoryName}`] || null : null

    const candidates = await prisma.products.findMany({ where: { category_id } })
    const target = normalize(name)
    const existing = candidates.find((p) => normalize(p.name) === target)

    const sharedData = {
      price,
      description,
      subcategory_id,
      is_active: true,
      ...(doublePrice ? { has_double: true, double_price: doublePrice } : {}),
    }

    if (existing) {
      await prisma.products.update({ where: { id: existing.id }, data: sharedData })
      console.log(`  🔄 ${categoryName} → ${name}`)
      updated++
    } else {
      await prisma.products.create({
        data: {
          name,
          category_id,
          display_order: 0,
          discount_percentage: 0,
          is_popular: false,
          ...sharedData,
        },
      })
      console.log(`  ➕ ${categoryName} → ${name}`)
      created++
    }
  }

  console.log(`\n✅ Senkronizasyon tamamlandı! ${created} yeni ürün, ${updated} ürün güncellendi.`)
  console.log('ℹ️  Listede olmayan mevcut ürünlere (örn. eski "Duble" satırları) dokunulmadı.')
}

main()
  .catch((e) => {
    console.error('❌ Senkronizasyon hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
