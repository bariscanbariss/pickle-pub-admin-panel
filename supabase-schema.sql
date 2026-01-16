-- Kategoriler tablosu
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ürünler tablosu
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2), -- İndirim öncesi fiyat
  discount_percentage INTEGER DEFAULT 0,
  image_url TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Popüler ürünler için ayrı tablo (slider için)
CREATE TABLE popular_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktiviteler tablosu (hafta içi/sonu)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  day_type TEXT NOT NULL CHECK (day_type IN ('weekday', 'weekend', 'all')),
  specific_day TEXT, -- Pazartesi, Salı, vb.
  time_slot TEXT, -- Örnek: "18:00-22:00"
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin kullanıcılar için basit tablo
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hakkımızda sayfası resimleri için tablo
CREATE TABLE about_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS) politikaları
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_images ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public access) - eğer varsa önce sil, sonra oluştur
DROP POLICY IF EXISTS "Public read access for categories" ON categories;
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for products" ON products;
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for popular_items" ON popular_items;
CREATE POLICY "Public read access for popular_items" ON popular_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for activities" ON activities;
CREATE POLICY "Public read access for activities" ON activities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for about_images" ON about_images;
CREATE POLICY "Public read access for about_images" ON about_images FOR SELECT USING (true);

-- Storage bucket oluştur (resimleri için) - eğer yoksa
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage politikaları (eğer varsa önce sil, sonra oluştur)
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

-- Örnek veriler ekleyelim
INSERT INTO categories (name, description, display_order) VALUES
  ('Yiyecekler', 'Lezzetli yemeklerimiz', 1),
  ('İçecekler', 'Ferahlatıcı içeceklerimiz', 2),
  ('Kokteyl', 'Özel kokteyllerimiz', 3),
  ('Aperatif', 'Hafif atıştırmalıklar', 4);

-- Örnek ürünler
INSERT INTO products (category_id, name, description, price, image_url, is_popular, display_order)
SELECT
  (SELECT id FROM categories WHERE name = 'Yiyecekler' LIMIT 1),
  'Pizza ve 75CL Gatonegro Şarap',
  'Özel tarifimizle hazırlanan pizza ve premium şarap',
  1100,
  '/artisan-pizza-with-wine-bottle.jpg',
  true,
  1;

INSERT INTO products (category_id, name, description, price, image_url, is_popular, display_order)
SELECT
  (SELECT id FROM categories WHERE name = 'Yiyecekler' LIMIT 1),
  'Signature Hot Dog',
  'Özenle seçilmiş malzemelerle hazırlanan hot dog',
  250,
  '/gourmet-hot-dog-with-toppings.jpg',
  true,
  2;

INSERT INTO products (category_id, name, description, price, image_url, is_popular, display_order)
SELECT
  (SELECT id FROM categories WHERE name = 'Kokteyl' LIMIT 1),
  'Barbie Cocktail',
  'Renkli ve ferahlatıcı özel kokteylimiz',
  300,
  '/pink-cocktail-in-fancy-glass.jpg',
  true,
  3;

-- Popüler ürünleri ekleyelim
INSERT INTO popular_items (product_id, display_order)
SELECT id, display_order FROM products WHERE is_popular = true ORDER BY display_order;

-- Updated_at trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ları ekleyelim
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
