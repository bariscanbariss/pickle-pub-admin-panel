import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

// Load .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') })

// Supabase client - .env.local'den okuyacak
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials not found in .env.local')
  console.error('   Please make sure these are set:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('')
  console.error('   See scripts/SUPABASE_SETUP.md for instructions on getting the Service Role Key')
  process.exit(1)
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Kategori mapping (script.js'teki category değerleri -> Türkçe isimleri)
const categoryMapping: Record<string, { name: string; description: string }> = {
  coffee: { name: 'Kahve', description: 'Özel kahve çeşitleri' },
  beers: { name: 'Biralar', description: 'Soğuk bira çeşitleri' },
  shots: { name: 'Shot İçkiler', description: 'Tek yudumluk içkiler' },
  whiskeys: { name: 'Viskiler', description: 'Kaliteli viski çeşitleri' },
  cocktails: { name: 'Kokteyller', description: 'Özel kokteyl çeşitleri' },
  foods: { name: 'Yemekler', description: 'Ana yemek ve atıştırmalıklar' },
  sides: { name: 'Atıştırmalıklar', description: 'Hafif atıştırmalıklar' },
  softdrinks: { name: 'Alkolsüz İçecekler', description: 'Meşrubatlar ve alkolsüz içecekler' }
}

// script.js'teki menu items
const menuItems = [
  { name: "FILTER COFFEE", description: "", price: "150 TL", category: "coffee", image: "filter.png" },
  { name: "TUBORG 50CL (DRAFT)", description: "", price: "180 TL", category: "beers", image: "beer.png" },
  { name: "TUBORG 30CL (DRAFT)", description: "", price: "165 TL", category: "beers", image: "beer.png" },
  { name: "PICKLE BEER 30CL", description: "", price: "180 TL", category: "beers", image: "beer.png" },
  { name: "PICKLE BEER", description: "If you're a fan of both pickles and beer, you absolutely must try the combination of the two!", price: "200 TL", category: "beers", image: "beer.png" },
  { name: "HELLBOY", description: "!", price: "280 TL", category: "beers", image: "hellboy.png" },
  { name: "PICKLE WITH TEQUILA", description: "If you love tequila, pickles and beer, you absolutely gonna like this", price: "220 TL", category: "beers", image: "beersalt.png" },
  { name: "MEXICAN BEER", description: "Combine of cold beer and freshly squeezed lemon juice", price: "200 TL", category: "beers", image: "beersalt.png" },
  { name: "MEXICAN WITH TEQUILA", description: "Cold beer, tequila and freshly squeezed lemon juice", price: "220 TL", category: "beers", image: "beersalt.png" },
  { name: "BOTTLE BEER", description: "", price: "200 TL", category: "beers", image: "tuborgbottle.png" },
  { name: "HEINEKEN 30CL", description: "", price: "180 TL", category: "beers", image: "heineken.png" },
  { name: "HEINEKEN 50CL", description: "", price: "210 TL", category: "beers", image: "heinekenteneke.png" },
  { name: "CORONA BOTTLE BEER", description: "Corona 50Cl bottle beer with lime", price: "240 TL", category: "beers", image: "corona.png" },
  { name: "GUINNESS BOTTLE BEER", description: "The world-famous Irish dry stout, known for its dark, rich color and velvety smooth texture. A true classic!", price: "240 TL", category: "beers", image: "guiness.png" },
  { name: "AMSTERDAM BOTTLE BEER", description: "A refreshing and crisp lager inspired by the vibrant spirit of Amsterdam. Cheers to good times.", price: "240 TL", category: "beers", image: "amsterdam.png" },
  { name: "TEQUILA", description: "If life gives you lemon and salt ask for tequila", price: "85 TL", category: "shots", image: "tequila.png" },
  { name: "JAGERMEISTER", description: "A classic German liqueur, known for its rich, fruity flavor and smooth texture.", price: "120 TL", category: "shots", image: "jager.png" },
  { name: "BLACK LABEL SHOT", description: "", price: "125 TL", category: "shots", image: "blacklabel.png" },
  { name: "JACK DANIELS SHOT", description: "", price: "120 TL", category: "shots", image: "jackshot.png" },
  { name: "BAILEYS SHOT", description: "", price: "100 TL", category: "shots", image: "baileys.png" },
  { name: "ZIVANIA", description: "", price: "100 TL", category: "shots", image: "zivania.png" },
  { name: "5 SHOTS MIX", description: "Your choice of any 5 shots from our selection", price: "500 TL", category: "shots", image: "5shot.png" },
  { name: "CHIVAS 12", description: "", price: "300 TL", category: "whiskeys", image: "chivas.png" },
  { name: "BLACK LABEL", description: "", price: "300 TL", category: "whiskeys", image: "blacklabel.png" },
  { name: "JACK DANIELS", description: "", price: "300 TL", category: "whiskeys", image: "jackglass.png" },
  { name: "JAMESON", description: "", price: "300 TL", category: "whiskeys", image: "jameson.png" },
  { name: "JIM BEAM", description: "", price: "270 TL", category: "whiskeys", image: "jimbean.png" },
  { name: "FIREBALL", description: "Cinnamon flavored whiskey with a sweet and spicy kick", price: "280 TL", category: "whiskeys", image: "fireball.png" },
  { name: "LOCAL WHISKEY", description: "", price: "240 TL", category: "whiskeys", image: "wniskey.png" },
  { name: "BARBIE", description: "A vibrant pink cocktail that's as fun as it is delicious", price: "300 TL", category: "cocktails", image: "barbieglass.png" },
  { name: "JAGGERITO", description: "", price: "325 TL", category: "cocktails", image: "jaggerito1.png" },
  { name: "LONG ISLAND", description: "A classic cocktail featuring a potent blend of vodka, rum, gin, tequila, triple sec, and cola. A refreshing and powerful drink!", price: "350 TL", category: "cocktails", image: "longisland.png" },
  { name: "APEROL SPRITZ", description: "Aperol Spritz !has a vibrant orange color and a bittersweet, citrusy flavor profile, making it the perfect drink for warm weather", price: "320 TL", category: "cocktails", image: "aperol.png" },
  { name: "SUN BATH", description: "", price: "320 TL", category: "cocktails", image: "sunbath.png" },
  { name: "S.O.T.B", description: "Sex On The Beach - A fruity cocktail with vodka, peach schnapps, orange juice, and cranberry juice", price: "300 TL", category: "cocktails", image: "sexonthebeach.png" },
  { name: "Green Gringo", description: "Aliens in the town with green blood", price: "325 TL", category: "cocktails", image: "greengo.png" },
  { name: "PICKLE SPECIAL", description: "Our signature cocktail featuring our house-made pickle infusion", price: "280 TL", category: "cocktails", image: "picklespecial.png" },
  { name: "TOKYO ICETEA", description: "A Japanese twist on the classic Long Island Ice Tea", price: "350 TL", category: "cocktails", image: "tokyo.png" },
  { name: "IRONMAN", description: "", price: "325 TL", category: "cocktails", image: "ironman.png" },
  { name: "GIN + SOFT", description: "Gin mixed with your choice of soft drink", price: "250 TL", category: "cocktails", image: "ginsoft.png" },
  { name: "VODKA + SOFT", description: "Vodka mixed with your choice of soft drink", price: "250 TL", category: "cocktails", image: "ginsoft.png" },
  { name: "MARGARITA", description: "", price: "250 TL", category: "cocktails", image: "margarita.png" },
  { name: "JAGERBOMB", description: "Jägermeister dropped into an energy drink", price: "300 TL", category: "cocktails", image: "jagerbomb.png" },
  { name: "BOMBAY + SOFT", description: "Premium Bombay Sapphire gin with your choice of soft drink", price: "300 TL", category: "cocktails", image: "bombay.png" },
  { name: "ABSOLUT + SOFT", description: "Premium Absolut vodka with your choice of soft drink", price: "300 TL", category: "cocktails", image: "absolute.png" },
  { name: "HÖNÖNÖ", description: "A unique house specialty cocktail", price: "250 TL", category: "cocktails", image: "honono.png" },
  { name: "SOUR PATCH", description: "A sweet and sour cocktail experience.", price: "350 TL", category: "cocktails", image: "sourpatch.png" },
  { name: "BEER PLATE", description: "Onion rings, french fries, crispy chicken, wings, hellim, tortilla chips", price: "550 TL", category: "foods", image: "beerplate.png" },
  { name: "FRENCH FRIES", description: "Crispy golden french fries", price: "250 TL", category: "foods", image: "fries.png" },
  { name: "HOT DOGS X2", description: "Two delicious hot dogs with all the fixings", price: "350 TL", category: "foods", image: "hotdog.png" },
  { name: "PICKLE MONSTER BURGER", description: "Can't decide between chicken or beef? With the Pickle Monster, you don't have to! This beast of a burger comes loaded with crispy chicken, juicy beef, bold pickles, and our signature sauces. It's not just a meal—it's a monster that crushes hunger!", price: "575 TL", category: "foods", image: "monster.png" },
  { name: "CHEESY BEEF BURGER", description: "Juicy beef patty with fresh toppings on a toasted bun", price: "450 TL", category: "foods", image: "beef.png" },
  { name: "CHICKEN BURGER", description: "Tender chicken patty with fresh toppings on a toasted bun", price: "400 TL", category: "foods", image: "chickenbutger.png" },
  { name: "TIFTIK BURGER", description: "Delicious Tiftik burger with premium ingredients", price: "550 TL", category: "foods", image: "tiftik.png" },
  { name: "CHICKEN WRAP", description: "Grilled chicken with fresh vegetables wrapped in a soft tortilla", price: "400 TL", category: "foods", image: "chicken.png" },
  { name: "BEEF WRAP", description: "Tender beef with fresh vegetables wrapped in a soft tortilla", price: "430 TL", category: "foods", image: "beef2.png" },
  { name: "PIZZA", description: "Tender beef with fresh vegetables wrapped in a soft tortilla", price: "550 TL", category: "foods", image: "pizza1.png" },
  { name: "MIXED NUTS", description: "A selection of premium mixed nuts", price: "100 TL", category: "sides", image: "mixednuts.png" },
  { name: "PEANUTS", description: "Roasted peanuts, perfect for snacking", price: "75 TL", category: "sides", image: "peanuts.png" },
  { name: "RUFFLES, LAYS", description: "Your choice of premium potato chips", price: "75 TL", category: "sides", image: "chips.png" },
  { name: "Lemonade", description: "", price: "160 TL", category: "softdrinks", image: "lemonade.png" },
  { name: "Water", description: "", price: "40 TL", category: "softdrinks", image: "water.png" },
  { name: "Coca-Cola,Fanta,Sprite", description: "", price: "100 TL", category: "softdrinks", image: "cocacola.png" },
  { name: "Churchill", description: "", price: "120 TL", category: "softdrinks", image: "churchill.png" },
  { name: "Soda", description: "", price: "100 TL", category: "softdrinks", image: "soda.png" },
  { name: "Mocktails", description: "", price: "160 TL", category: "softdrinks", image: "mocktails.png" },
  { name: "Tea", description: "Black,Green,Herbal Tea", price: "70 TL", category: "softdrinks", image: "tea.png" },
  { name: "Juices", description: "", price: "120 TL", category: "softdrinks", image: "juices.png" },
  { name: "Italian Soda", description: "", price: "160 TL", category: "softdrinks", image: "italiansoda.png" },
]

// Popüler ürünler (index.html'deki slider'dan)
const popularProducts = [
  { name: "Pizza and 75CL Gatonegro Wine", price: "1100TL", image: "pizzapopular.png" },
  { name: "Barbie Cocktail", price: "300TL", image: "barbie.png" },
  { name: "Aperol Spritz", price: "300TL", image: "aperol2.png" },
  { name: "Midye Tabağı", price: "250TL", image: "midye.png" }
]

// Resim dosyasını .webp olarak upload et
async function uploadImageFile(imagePath: string, imageName: string): Promise<string | null> {
  try {
    // .png uzantısını .webp ile değiştir
    const webpName = imageName.replace('.png', '.webp')
    const picPath = join(process.cwd(), 'pic', webpName)

    if (!fs.existsSync(picPath)) {
      console.log(`❌ Resim bulunamadı: ${webpName}`)
      return null
    }

    const fileBuffer = readFileSync(picPath)
    const fileName = `products/${Date.now()}-${webpName}`

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, fileBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error(`❌ Resim yükleme hatası (${webpName}):`, error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    console.log(`✅ Resim yüklendi: ${webpName}`)
    return publicUrl
  } catch (error) {
    console.error(`❌ Resim yükleme hatası:`, error)
    return null
  }
}

// Fiyat string'ini number'a çevir
function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(' TL', '').replace('TL', ''))
}

async function main() {
  console.log('🚀 Migration başlıyor...\n')

  // 1. Kategorileri oluştur
  console.log('📁 Kategoriler oluşturuluyor...')
  const categoryMap = new Map<string, string>()
  let order = 0

  for (const [key, value] of Object.entries(categoryMapping)) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: value.name,
        description: value.description,
        display_order: order++
      })
      .select()
      .single()

    if (error) {
      console.error(`❌ Kategori oluşturma hatası (${value.name}):`, error)
      continue
    }

    categoryMap.set(key, data.id)
    console.log(`✅ Kategori oluşturuldu: ${value.name}`)
  }

  console.log(`\n✅ ${categoryMap.size} kategori oluşturuldu\n`)

  // 2. Ürünleri ekle
  console.log('🍔 Ürünler ekleniyor...')
  const productMap = new Map<string, string>()
  let productOrder = 0

  for (const item of menuItems) {
    // Resmi yükle
    const imageUrl = await uploadImageFile('pic', item.image)

    const categoryId = categoryMap.get(item.category) || null

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: item.name,
        description: item.description || null,
        price: parsePrice(item.price),
        category_id: categoryId,
        image_url: imageUrl,
        is_active: true,
        is_popular: false,
        discount_percentage: 0,
        display_order: productOrder++
      })
      .select()
      .single()

    if (error) {
      console.error(`❌ Ürün ekleme hatası (${item.name}):`, error)
      continue
    }

    productMap.set(item.name, data.id)
    console.log(`✅ Ürün eklendi: ${item.name}`)
  }

  console.log(`\n✅ ${productMap.size} ürün eklendi\n`)

  // 3. Popüler ürünleri ekle
  console.log('⭐ Popüler ürünler ekleniyor...')
  let popularOrder = 0

  for (const popularItem of popularProducts) {
    // İsimle eşleşen ürünü bul
    let productId = null

    // Önce tam eşleşme dene
    for (const [name, id] of productMap.entries()) {
      if (name.toLowerCase().includes(popularItem.name.toLowerCase()) ||
          popularItem.name.toLowerCase().includes(name.toLowerCase())) {
        productId = id
        break
      }
    }

    if (!productId) {
      // Ürün bulunamazsa, özel kampanya olarak ekle
      const imageUrl = await uploadImageFile('pic', popularItem.image)

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: popularItem.name,
          description: 'Özel Kampanya',
          price: parsePrice(popularItem.price),
          category_id: null,
          image_url: imageUrl,
          is_active: true,
          is_popular: true,
          discount_percentage: 0,
          display_order: productOrder++
        })
        .select()
        .single()

      if (error) {
        console.error(`❌ Popüler ürün ekleme hatası (${popularItem.name}):`, error)
        continue
      }

      productId = data.id
      console.log(`✅ Yeni kampanya ürünü eklendi: ${popularItem.name}`)
    } else {
      // Ürünün is_popular flag'ini güncelle
      await supabase
        .from('products')
        .update({ is_popular: true })
        .eq('id', productId)
    }

    // Popular items tablosuna ekle
    const { error } = await supabase
      .from('popular_items')
      .insert({
        product_id: productId,
        display_order: popularOrder++
      })

    if (error) {
      console.error(`❌ Popüler item ekleme hatası:`, error)
      continue
    }

    console.log(`✅ Popüler ürün eklendi: ${popularItem.name}`)
  }

  console.log('\n✅ Migration tamamlandı! 🎉')
}

main().catch(console.error)
