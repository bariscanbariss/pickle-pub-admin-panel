# Pickle Pub - Admin Panel 🍺

Pickle Pub'ın menü ve içerik yönetim sistemi. Next.js + Prisma + PostgreSQL ile çalışan, modern ve kullanıcı dostu bir admin paneli.

## 🚀 Özellikler

### Admin Paneli
- ✅ Şifre korumalı admin girişi (bcrypt ile hash'lenmiş, `admin_users` tablosunda saklanır)
- ✅ Kategori ve alt kategori yönetimi (CRUD işlemleri)
- ✅ Menü ürünleri yönetimi
  - Açıklama
  - Fiyat belirleme
  - İndirim yönetimi (% olarak)
  - Aktif/Pasif durumu
- ✅ Kampanya görselleri yönetimi
- ✅ Aktivite yönetimi
  - Hafta içi/sonu aktiviteleri
  - Özel gün seçimi
  - Saat aralığı belirleme
- ✅ Hakkımızda görselleri yönetimi

### Kullanıcı Arayüzü
- 🎨 Modern ve responsive tasarım
- 📱 Mobil uyumlu
- ⚡ Hızlı yükleme
- 🎭 Otomatik slider (kampanyalar)

## 📋 Gereksinimler

- Node.js 22+
- pnpm
- PostgreSQL (yerelde Docker Compose ile, üzerinde ayrıca kendi sunucunuz da olabilir)
- Cloudflare R2 (ürün/görsel depolama için)

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
pnpm install
```

### 2. Environment Değişkenlerini Ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri girin:

```bash
cp .env.example .env
```

Gerekli değişkenler: veritabanı bağlantısı (`DATABASE_URL`, `DIRECT_URL`) ve Cloudflare R2 bilgileri (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `NEXT_PUBLIC_R2_PUBLIC_URL`).

### 3. Veritabanını Hazırlayın

```bash
npx prisma migrate deploy
```

Admin kullanıcısı oluşturmak için `scripts/restore-backup.js` içindeki adımları veya doğrudan `admin_users` tablosuna bcrypt hash'lenmiş bir şifre eklemeyi kullanabilirsiniz.

### 4. Geliştirme Sunucusunu Başlatın

```bash
pnpm dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

### Docker ile Çalıştırma

Production ortamı için `docker-compose.yml` PostgreSQL ve Next.js uygulamasını birlikte ayağa kaldırır; container başlarken `prisma migrate deploy` otomatik çalışır:

```bash
docker compose up -d --build
```

## 📱 Kullanım

### Admin Paneline Giriş

1. `/admin` adresine gidin
2. `admin_users` tablosundaki kullanıcı adı/şifre ile giriş yapın

### Kategori ve Alt Kategori Ekleme

1. Admin Panel > Kategoriler — üst kategoriler
2. Admin Panel > Alt Kategoriler — bir kategoriye bağlı alt gruplar (örn. Kokteyller altında Votka Bazlı, Cin Bazlı)

### Ürün Ekleme

1. Admin Panel > Menü Ürünleri
2. "Yeni Ürün" butonuna tıklayın
3. Ürün bilgilerini doldurun: ad, açıklama, kategori, alt kategori (varsa), fiyat, eski fiyat (isteğe bağlı), indirim yüzdesi
4. "Aktif" olarak işaretleyin ve kaydedin

### Aktivite Ekleme

1. Admin Panel > Aktiviteler
2. "Yeni Aktivite" butonuna tıklayın
3. Başlık, açıklama, gün tipi, özel gün ve saat aralığını girin
4. Kaydedin

## 🗂️ Proje Yapısı

```
pickle-pub-admin-panel/
├── app/
│   ├── [category]/                # Müşteriye açık kategori/menü sayfası
│   ├── admin/
│   │   ├── dashboard/
│   │   │   ├── categories/        # Kategori yönetimi
│   │   │   ├── subcategories/     # Alt kategori yönetimi
│   │   │   ├── products/          # Ürün yönetimi
│   │   │   ├── campaigns/         # Kampanya görselleri
│   │   │   ├── activities/        # Aktivite yönetimi
│   │   │   ├── about-images/      # Hakkımızda görselleri
│   │   │   ├── layout.tsx         # Admin panel layout
│   │   │   └── page.tsx           # Dashboard ana sayfa
│   │   └── page.tsx               # Admin login
│   ├── api/
│   │   └── admin/
│   │       ├── login/             # Login API
│   │       └── logout/            # Logout API
│   ├── layout.tsx
│   └── page.tsx                   # Ana sayfa
├── components/
│   ├── ui/                        # Shadcn UI componentleri
│   ├── header.tsx
│   ├── hero.tsx
│   ├── menu-categories.tsx
│   ├── about.tsx
│   └── footer.tsx
├── lib/
│   ├── supabase.ts                # Prisma tabanlı server actions (isim tarihsel)
│   ├── prisma.ts                  # Prisma client
│   └── utils.ts
├── prisma/
│   ├── schema.prisma               # Veritabanı şeması
│   └── migrations/                 # SQL migration geçmişi
├── middleware.ts                   # Auth middleware
├── docker-compose.yml               # PostgreSQL + Next.js (production)
└── .env.example                     # Environment değişkenleri şablonu
```

## 🔒 Güvenlik

- Admin paneli middleware ile korunmaktadır
- Şifre cookie tabanlı authentication kullanır
- Admin şifreleri `admin_users` tablosunda bcrypt ile hash'lenmiş olarak saklanır

**⚠️ Production Önerileri:**
- Güçlü admin şifreleri kullanın
- HTTPS kullanın
- Environment değişkenlerini asla commit etmeyin
- Daha güvenli bir authentication sistemi düşünün (örn: NextAuth.js)

## 🎨 Teknolojiler

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI + Radix UI
- **Database:** PostgreSQL (Prisma ORM)
- **Storage:** Cloudflare R2
- **State Management:** React Hooks
- **Forms:** React Hook Form
- **Notifications:** Sonner

## 📝 Lisans

Bu proje Pickle Pub için özel olarak geliştirilmiştir.

## 🤝 Destek

Sorularınız için iletişime geçin.

---

**Pickle Pub** - Lezzet, eğlence ve samimiyetin buluştuğu mekan 🍺🍕
