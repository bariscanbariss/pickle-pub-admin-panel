export const dynamic = "force-dynamic"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingButtons } from "@/components/floating-buttons"
import { getCategories, getActiveProducts } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// URL slug → kategori eşleştirme tablosu
// Bu tablo admin paneldeki kategori isimlerini URL slug'larıyla eşleştirir
const CATEGORY_MAP = [
  { keywords: ["cocktail", "kokteyl", "kokteyller"], slug: "cocktails", title: "Kokteyller" },
  { keywords: ["beer", "bira", "biralar"], slug: "beers", title: "Biralar" },
  { keywords: ["soft", "alkolsüz", "meşrubat", "soft drinks"], slug: "soft-drinks", title: "Alkolsüz İçecekler" },
  { keywords: ["food", "yiyecek", "yemek", "atıştırmalık"], slug: "foods", title: "Yiyecekler" },
  { keywords: ["whiskey", "viski", "viskiler", "whiskeys"], slug: "whiskeys", title: "Viskiler" },
  { keywords: ["shot", "shots"], slug: "shots", title: "Shotlar" },
  { keywords: ["coffee", "kahve", "kahveler", "coffe", "coffes", "coffees"], slug: "coffees", title: "Kahveler" },
  { keywords: ["wine", "şarap", "şaraplar"], slug: "wine", title: "Şaraplar" },
]

// Admin panelinde eklenen kategorileri slug ile eşleştir
function findDbCategory(slug: string, categories: any[]) {
  const mapEntry = CATEGORY_MAP.find((m) => m.slug === slug)
  if (!mapEntry) return null
  return categories.find((cat) => {
    const lower = cat.name.toLowerCase().trim()
    return mapEntry.keywords.some((kw) => lower.includes(kw.toLowerCase()))
  }) || null
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const slug = params.category

  // Geçersiz slug → 404
  const mapEntry = CATEGORY_MAP.find((m) => m.slug === slug)
  if (!mapEntry) {
    return notFound()
  }

  // Veritabanından kategori listesi ve o kategoriye ait ürünleri çek
  const categories = await getCategories().catch(() => [])
  const dbCategory = findDbCategory(slug, categories)

  // DB'de kategori varsa o kategoriye göre ürün çek, yoksa boş
  const products = dbCategory
    ? await getActiveProducts(dbCategory.id).catch(() => [])
    : []

  const categoryTitle = dbCategory?.name ?? mapEntry.title
  const categoryDesc = dbCategory?.description ?? "Özenle seçilmiş lezzetli ürünlerimizi keşfedin"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Sayfa Başlık Bölümü */}
        <section className="section-padding pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Geri dön */}
            <Link
              href="/#menu-categories"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Ana Sayfa</span>
            </Link>

            {/* Başlık */}
            <div className="text-center">
              <h1 className="section-title text-center">{categoryTitle}</h1>
              <p className="section-subtitle text-center">{categoryDesc}</p>
            </div>
          </div>
        </section>

        {/* Ürün Grid */}
        <section className="px-4 md:px-8 lg:px-16 pb-16">
          <div className="max-w-7xl mx-auto">
            {products.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-3xl">🍽️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Henüz ürün eklenmedi</h3>
                <p className="text-muted-foreground">
                  Admin panelinden bu kategoriye ürün ekleyebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <div
                    key={product.id}
                    className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Ürün Görseli */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                          Görsel Yok
                        </div>
                      )}

                      {/* İndirim Rozeti */}
                      {product.discount_percentage > 0 && (
                        <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          %{product.discount_percentage} İndirim
                        </div>
                      )}
                    </div>

                    {/* Ürün Bilgisi */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>

                      {product.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* Fiyat */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-bold text-accent">
                          ₺{Number(product.price).toFixed(2)}
                        </span>
                        {product.original_price &&
                          Number(product.original_price) > Number(product.price) && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₺{Number(product.original_price).toFixed(2)}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  )
}
