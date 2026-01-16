# Data Migration Script

Bu script, `script.js` ve `index.html` dosyalarındaki menü ürünlerini ve kampanyaları Supabase veritabanına aktarmak için kullanılır.

## Özellikler

- ✅ `script.js`'teki tüm kategorileri Supabase'e ekler
- ✅ `script.js`'teki tüm menü ürünlerini Supabase'e ekler
- ✅ `pic` klasöründeki `.webp` resimlerini Supabase Storage'a yükler
- ✅ `index.html`'deki popüler ürünleri (slider) ekler
- ✅ Otomatik kategori eşleştirmesi yapar

## Kullanım

### 1. Environment Variables
`.env.local` dosyanızda Supabase bilgilerinizin olduğundan emin olun:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Gerekli Paketleri Yükleyin

```bash
npm install
```

### 3. Migration'ı Çalıştırın

```bash
npm run migrate
```

## Script Ne Yapar?

### 1. Kategoriler Oluşturulur

Script.js'teki kategori değerleri Türkçe isimlerle eşleştirilir:

- `coffee` → **Kahve**
- `beers` → **Biralar**
- `shots` → **Shot İçkiler**
- `whiskeys` → **Viskiler**
- `cocktails` → **Kokteyller**
- `foods` → **Yemekler**
- `sides` → **Atıştırmalıklar**
- `softdrinks` → **Alkolsüz İçecekler**

### 2. Resimler Yüklenir

`pic` klasöründeki her `.webp` resmi Supabase Storage'a yüklenir:

- `filter.png` → `pic/filter.webp` yüklenir
- `beer.png` → `pic/beer.webp` yüklenir
- vb.

### 3. Ürünler Eklenir

Her ürün için:
- İsim, açıklama, fiyat bilgileri çekilir
- Kategori ile eşleştirilir
- Resim yüklenir ve URL'i kaydedilir
- Ürün veritabanına eklenir

### 4. Popüler Ürünler İşlenir

`index.html`'deki slider'daki ürünler:
- Mevcut ürünlerle eşleştirilir
- Eşleşme yoksa yeni kampanya ürünü olarak eklenir
- `popular_items` tablosuna eklenir
- Ürünün `is_popular` flag'i güncellenir

## Çıktı Örneği

```
🚀 Migration başlıyor...

📁 Kategoriler oluşturuluyor...
✅ Kategori oluşturuldu: Kahve
✅ Kategori oluşturuldu: Biralar
...
✅ 8 kategori oluşturuldu

🍔 Ürünler ekleniyor...
✅ Resim yüklendi: filter.webp
✅ Ürün eklendi: FILTER COFFEE
✅ Resim yüklendi: beer.webp
✅ Ürün eklendi: TUBORG 50CL (DRAFT)
...
✅ 70 ürün eklendi

⭐ Popüler ürünler ekleniyor...
✅ Yeni kampanya ürünü eklendi: Pizza and 75CL Gatonegro Wine
✅ Popüler ürün eklendi: Pizza and 75CL Gatonegro Wine
✅ Popüler ürün eklendi: Barbie Cocktail
...

✅ Migration tamamlandı! 🎉
```

## Önemli Notlar

⚠️ **Script'i sadece bir kez çalıştırın!** Aynı ürünleri tekrar eklemek için tasarlanmamıştır.

⚠️ **Supabase Storage'da `product-images` bucket'ının oluşturulmuş olması gerekir.**

⚠️ **`pic` klasöründe tüm resimlerin `.webp` formatında olması gerekir.**

## Hata Durumunda

Eğer bir hata alırsanız:

1. `.env.local` dosyasını kontrol edin
2. Supabase bağlantısını test edin
3. Storage bucket'ının public olduğundan emin olun
4. Console loglarını kontrol edin

## İlgili Dosyalar

- `migrate-data.ts` - Ana migration script'i
- `../script.js` - Menü ürünleri verisi
- `../index.html` - Popüler ürünler (slider) verisi
- `../pic/*.webp` - Ürün resimleri
