# Supabase Kurulum Rehberi 🚀

Bu rehber, Pickle Pub projesinin Supabase entegrasyonunu adım adım nasıl kuracağınızı gösterir.

## Adım 1: Supabase Projesi Oluşturma

1. [Supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub/Google hesabınızla giriş yapın
4. "New Project" butonuna tıklayın
5. Proje bilgilerini doldurun:
   - **Name:** pickle-pub (veya istediğiniz bir isim)
   - **Database Password:** Güçlü bir şifre oluşturun (kaydedin!)
   - **Region:** Size en yakın bölgeyi seçin
   - **Pricing Plan:** Free plan yeterli
6. "Create new project" butonuna tıklayın
7. Proje oluşturulmasını bekleyin (~2 dakika)

## Adım 2: Veritabanı Şemasını Oluşturma

1. Sol menüden **SQL Editor** seçeneğine tıklayın
2. "New query" butonuna tıklayın
3. Proje kök dizinindeki `supabase-schema.sql` dosyasının içeriğini kopyalayın
4. SQL Editor'e yapıştırın
5. **"RUN"** butonuna tıklayın (sağ alt köşede)
6. Başarılı mesajını görmelisiniz: "Success. No rows returned"

### Şema Kontrolleri

SQL çalıştırıldıktan sonra şu kontrolleri yapın:

1. **Table Editor** > Tables bölümüne gidin
2. Şu tabloların oluşturulduğunu doğrulayın:
   - ✅ categories
   - ✅ products
   - ✅ popular_items
   - ✅ activities
   - ✅ admin_users

## Adım 3: Storage Bucket Ayarları

1. Sol menüden **Storage** seçeneğine tıklayın
2. "Create a new bucket" butonuna tıklayın
3. Bucket bilgilerini doldurun:
   - **Name:** product-images
   - **Public bucket:** ✅ İŞARETLEYİN (önemli!)
4. "Create bucket" butonuna tıklayın

### Storage Politika Kontrolü

1. Oluşturduğunuz `product-images` bucket'ına tıklayın
2. **"Policies"** sekmesine gidin
3. SQL'de tanımlanan politikaların listelendiğini doğrulayın:
   - Public read access
   - Authenticated users upload/update/delete

**Not:** Eğer politikalar otomatik oluşmadıysa, SQL Editor'de schema dosyasını tekrar çalıştırın.

## Adım 4: API Keys ve URL'leri Alma

1. Sol menüden **Settings** > **API** seçeneğine gidin
2. **Project URL** ve **API Keys** bölümünü bulun
3. Şu bilgileri kopyalayın:

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Adım 5: Environment Değişkenlerini Ayarlama

1. Proje kök dizininde `.env.local` dosyası oluşturun
2. Kopyaladığınız bilgileri ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=pickle2024
```

**⚠️ ÖNEMLİ:**
- `ADMIN_PASSWORD` değerini güçlü bir şifre ile değiştirin
- `.env.local` dosyasını asla git'e commit etmeyin (zaten .gitignore'da)
- Production'da farklı bir şifre kullanın

## Adım 6: Row Level Security (RLS) Kontrolü

1. **Table Editor** > **categories** tablosuna gidin
2. Üst menüden **"Policies"** sekmesine tıklayın
3. Şu politikaların aktif olduğunu doğrulayın:
   - ✅ "Public read access for categories"

Diğer tablolar için de (products, popular_items, activities) aynı kontrolü yapın.

### RLS'i Manuel Aktifleştirme (Gerekirse)

Eğer RLS aktif değilse:

1. SQL Editor'e gidin
2. Her tablo için şu komutu çalıştırın:

```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
```

## Adım 7: Test Verileri Ekleme

Schema dosyasında zaten örnek veriler var, ancak manuel test etmek isterseniz:

1. **Table Editor** > **categories** tablosuna gidin
2. "Insert row" butonuna tıklayın
3. Test verisi ekleyin:
   ```
   name: Yiyecekler
   description: Lezzetli yemeklerimiz
   display_order: 1
   ```
4. "Save" butonuna tıklayın

## Adım 8: Bağlantıyı Test Etme

1. Terminalde projeyi çalıştırın:
   ```bash
   npm run dev
   ```

2. Tarayıcıda [http://localhost:3000](http://localhost:3000) adresine gidin

3. Console'da hata olup olmadığını kontrol edin

4. Admin paneline giriş yapmayı deneyin:
   - [http://localhost:3000/admin](http://localhost:3000/admin)
   - `.env.local` dosyasındaki şifreyi girin

5. Dashboard'da istatistiklerin göründüğünü doğrulayın

## Sorun Giderme 🔧

### "Invalid API key" Hatası

**Sebep:** API key yanlış kopyalanmış veya eksik
**Çözüm:**
1. Supabase Dashboard > Settings > API'ye gidin
2. API key'i tekrar kopyalayın
3. `.env.local` dosyasında boşluk olmadığından emin olun
4. Development sunucusunu yeniden başlatın

### "relation does not exist" Hatası

**Sebep:** Tablolar oluşturulmamış
**Çözüm:**
1. SQL Editor'e gidin
2. `supabase-schema.sql` dosyasını tekrar çalıştırın
3. Table Editor'de tabloları kontrol edin

### "Storage bucket not found" Hatası

**Sebep:** product-images bucket oluşturulmamış
**Çözüm:**
1. Storage > Buckets'a gidin
2. `product-images` bucket'ının var olduğunu kontrol edin
3. Public olarak işaretlendiğinden emin olun

### Resimler Yüklenmiyor

**Sebep:** Storage politikaları eksik
**Çözüm:**
1. Storage > product-images > Policies'e gidin
2. SQL Editor'de storage policy komutlarını tekrar çalıştırın:

```sql
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');
```

### Admin Paneline Giriş Yapamıyorum

**Sebep:** Cookie ayarları veya şifre yanlış
**Çözüm:**
1. `.env.local` dosyasındaki `ADMIN_PASSWORD` değerini kontrol edin
2. Tarayıcı cache'ini temizleyin
3. Development sunucusunu yeniden başlatın
4. Farklı bir tarayıcıda deneyin

## Production Deployment 🚀

### Vercel'e Deploy

1. GitHub'a projenizi push edin
2. [Vercel.com](https://vercel.com)'a gidin
3. "Import Project" seçin
4. Repository'yi seçin
5. **Environment Variables** bölümüne şunları ekleyin:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ADMIN_PASSWORD
   ```
6. "Deploy" butonuna tıklayın

### Güvenlik Kontrol Listesi

- ✅ Production'da güçlü `ADMIN_PASSWORD` kullanılıyor
- ✅ HTTPS aktif
- ✅ Environment değişkenleri commit edilmemiş
- ✅ Supabase RLS aktif
- ✅ API keys gizli tutuluyor
- ✅ CORS ayarları yapılmış (Supabase otomatik yapar)

## Yardım ve Destek 💬

Sorun yaşıyorsanız:

1. Supabase Dashboard > Logs bölümünden hataları kontrol edin
2. Browser Console'da JavaScript hatalarına bakın
3. Network sekmesinde API çağrılarını inceleyin
4. [Supabase Docs](https://supabase.com/docs) kaynaklarını inceleyin

---

**Tebrikler! 🎉** Pickle Pub admin paneliniz hazır!
