# Pickle Pub - Admin Panel 🍺

Pickle Pub'ın menü ve içerik yönetim sistemi. Supabase ile desteklenen, modern ve kullanıcı dostu bir admin paneli.

## 🚀 Özellikler

### Admin Paneli
- ✅ Şifre korumalı admin girişi
- ✅ Kategori yönetimi (CRUD işlemleri)
- ✅ Menü ürünleri yönetimi
  - Resim yükleme
  - Fiyat belirleme
  - İndirim yönetimi (% olarak)
  - Aktif/Pasif durumu
- ✅ Popüler ürünler yönetimi
  - Ana sayfada slider olarak gösterilir
  - Sürükle-bırak sıralama
- ✅ Aktivite yönetimi
  - Hafta içi/sonu aktiviteleri
  - Özel gün seçimi
  - Saat aralığı belirleme

### Kullanıcı Arayüzü
- 🎨 Modern ve responsive tasarım
- 🌓 Dark/Light mode desteği
- 📱 Mobil uyumlu
- ⚡ Hızlı yükleme
- 🎭 Otomatik slider (popüler ürünler)

## 📋 Gereksinimler

- Node.js 18+
- Supabase hesabı
- npm veya pnpm

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
# veya
pnpm install
```

### 2. Supabase Projesini Ayarlayın

1. [Supabase](https://supabase.com) üzerinde yeni bir proje oluşturun
2. SQL Editor'de `supabase-schema.sql` dosyasını çalıştırın
3. Storage > Buckets bölümünden `product-images` bucket'ının public olarak ayarlandığından emin olun

### 3. Environment Değişkenlerini Ayarlayın

`.env.local` dosyasını oluşturun ve şu değişkenleri ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_PASSWORD=your-secure-password
```

**Not:** Supabase URL ve API Key'i Supabase Dashboard > Settings > API bölümünden alabilirsiniz.

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📱 Kullanım

### Admin Paneline Giriş

1. `/admin` adresine gidin
2. `.env.local` dosyasında belirlediğiniz şifreyi girin
3. Dashboard'a erişin

### Kategori Ekleme

1. Admin Panel > Kategoriler
2. "Yeni Kategori" butonuna tıklayın
3. Kategori adı ve açıklamasını girin
4. Kaydedin

### Ürün Ekleme

1. Admin Panel > Menü Ürünleri
2. "Yeni Ürün" butonuna tıklayın
3. Ürün bilgilerini doldurun:
   - Ad
   - Açıklama
   - Kategori
   - Fiyat
   - Eski fiyat (isteğe bağlı - indirim göstermek için)
   - İndirim yüzdesi
   - Resim yükleyin
4. "Aktif" olarak işaretleyin
5. Kaydedin

### Popüler Ürün Ekleme

1. Admin Panel > Popüler Ürünler
2. "Ürün Ekle" butonuna tıklayın
3. Listeden bir ürün seçin
4. Ana sayfada slider olarak görünecek

### Aktivite Ekleme

1. Admin Panel > Aktiviteler
2. "Yeni Aktivite" butonuna tıklayın
3. Aktivite bilgilerini girin:
   - Başlık
   - Açıklama
   - Gün tipi (Her gün / Hafta içi / Hafta sonu)
   - Özel gün (isteğe bağlı)
   - Saat aralığı
4. Kaydedin

## 🗂️ Proje Yapısı

```
pickle-pub-admin-panel/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   ├── categories/      # Kategori yönetimi
│   │   │   ├── products/         # Ürün yönetimi
│   │   │   ├── popular/          # Popüler ürünler
│   │   │   ├── activities/       # Aktivite yönetimi
│   │   │   ├── layout.tsx        # Admin panel layout
│   │   │   └── page.tsx          # Dashboard ana sayfa
│   │   └── page.tsx              # Admin login
│   ├── api/
│   │   └── admin/
│   │       ├── login/            # Login API
│   │       └── logout/           # Logout API
│   ├── layout.tsx
│   └── page.tsx                  # Ana sayfa
├── components/
│   ├── ui/                       # Shadcn UI componentleri
│   ├── header.tsx
│   ├── hero.tsx
│   ├── popular-items.tsx         # Popüler ürünler slider
│   ├── about.tsx
│   └── footer.tsx
├── lib/
│   ├── supabase.ts               # Supabase client ve helper fonksiyonlar
│   └── utils.ts
├── middleware.ts                 # Auth middleware
├── supabase-schema.sql           # Veritabanı şeması
└── .env.local                    # Environment değişkenleri
```

## 🔒 Güvenlik

- Admin paneli middleware ile korunmaktadır
- Şifre cookie tabanlı authentication kullanır
- Supabase Row Level Security (RLS) aktiftir
- Public read, authenticated write politikaları uygulanmıştır

**⚠️ Production Önerileri:**
- `ADMIN_PASSWORD` için güçlü bir şifre kullanın
- HTTPS kullanın
- Environment değişkenlerini asla commit etmeyin
- Daha güvenli bir authentication sistemi düşünün (örn: NextAuth.js)

## 🎨 Teknolojiler

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI + Radix UI
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **State Management:** React Hooks
- **Forms:** React Hook Form
- **Notifications:** Sonner

## 📝 Lisans

Bu proje Pickle Pub için özel olarak geliştirilmiştir.

## 🤝 Destek

Sorularınız için iletişime geçin.

---

**Pickle Pub** - Lezzet, eğlence ve samimiyetin buluştuğu mekan 🍺🍕