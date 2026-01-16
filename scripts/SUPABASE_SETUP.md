# Supabase Service Role Key Nasıl Alınır?

Migration script'inin çalışabilmesi için **Service Role Key** gereklidir. Bu key, RLS (Row Level Security) politikalarını bypass ederek veritabanına yazma işlemi yapmanızı sağlar.

## 📝 Adımlar

### 1. Supabase Dashboard'a Gidin
[https://supabase.com/dashboard](https://supabase.com/dashboard) adresine gidin ve projenizi seçin.

### 2. Project Settings'e Gidin
Sol menüden **⚙️ Project Settings** (Proje Ayarları) seçeneğine tıklayın.

### 3. API Bölümüne Gidin
Sol taraftaki menüden **API** sekmesine tıklayın.

### 4. Service Role Key'i Bulun
Sayfayı aşağı kaydırın ve **Project API keys** bölümünde şunları göreceksiniz:

- `anon` `public` - Zaten kullanıyorsunuz ✅
- **`service_role` `secret`** - Bu key'i kopyalayın! 🔑

### 5. .env.local Dosyanıza Ekleyin

`.env.local` dosyanızı açın ve şu satırı ekleyin:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://mskfpikoiaeeuuwrkrsw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (for migrations only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # ← Buraya ekleyin

# Admin Panel Secret
ADMIN_PASSWORD=pickle2024
```

⚠️ **ÖNEMLİ**: Service Role key **çok güçlüdür** ve tüm RLS politikalarını bypass eder. Bu key'i:
- GitHub'a commit etmeyin
- Frontend kodunda kullanmayın
- Sadece backend/migration scriptlerinde kullanın

### 6. Migration'ı Çalıştırın

```bash
npm run migrate
```

## 🎯 Sonuç

Migration başarıyla çalışacak ve:
- ✅ 8 kategori eklenecek
- ✅ 70+ ürün eklenecek
- ✅ 4 popüler ürün (kampanya) eklenecek
- ✅ Tüm resimler zaten Supabase Storage'a yüklendi

## 🔒 Güvenlik Notu

Service Role Key'i aldıktan sonra `.env.local` dosyanızın `.gitignore`'da olduğundan emin olun:

```bash
# .gitignore dosyanızda olmalı
.env*.local
```
