export const dynamic = "force-dynamic"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingButtons } from "@/components/floating-buttons"
import { getCategories, getActiveProducts, getSubcategories, type Product, type Subcategory } from "@/lib/supabase"
import { notFound } from "next/navigation"
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
  { keywords: ["snack", "snacks", "cips", "çerez", "atıştırmalık"], slug: "snacks", title: "Atıştırmalıklar" },
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

// 250.00 → "250" · 149.50 → "149,50" — klasik menülerde gereksiz sıfır gösterilmez
function formatPrice(value: number) {
  const isWhole = Number.isInteger(value)
  return isWhole
    ? value.toString()
    : value.toFixed(2).replace(".", ",")
}

function MenuRow({ product }: { product: Product }) {
  return (
    <li className="py-5 first:pt-0">
      <div className="flex items-baseline gap-3">
        <span className="font-medium text-foreground text-[1.05rem] leading-snug">
          {product.name}
        </span>
        <span
          aria-hidden
          className="flex-1 border-b border-dotted border-border translate-y-[-0.3em]"
        />
        <span className="flex items-baseline gap-2 whitespace-nowrap">
          {product.original_price && Number(product.original_price) > Number(product.price) && (
            <span className="text-sm text-muted-foreground line-through">
              ₺{formatPrice(Number(product.original_price))}
            </span>
          )}
          <span className="text-accent font-semibold tabular-nums">
            ₺{formatPrice(Number(product.price))}
          </span>
          {product.has_double && product.double_price != null && (
            <span className="text-xs text-muted-foreground tabular-nums">
              (Duble ₺{formatPrice(Number(product.double_price))})
            </span>
          )}
        </span>
      </div>

      <div className="flex items-start justify-between gap-3 mt-1">
        {product.description ? (
          <p className="text-sm text-muted-foreground italic max-w-md leading-relaxed">
            {product.description}
          </p>
        ) : (
          <span />
        )}
        {!!product.discount_percentage && product.discount_percentage > 0 && (
          <span className="text-xs font-medium text-accent whitespace-nowrap">
            %{product.discount_percentage} indirim
          </span>
        )}
      </div>
    </li>
  )
}

function MenuGroup({ heading, products }: { heading?: string; products: Product[] }) {
  if (products.length === 0) return null
  return (
    <div className="mb-10 last:mb-0">
      {heading && (
        <div className="flex items-center gap-4 mb-2">
          <h3 className="italic text-accent text-lg shrink-0" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            {heading}
          </h3>
          <span className="flex-1 border-t border-border" />
        </div>
      )}
      <ul className="divide-y divide-border/70">
        {products.map((product) => (
          <MenuRow key={product.id} product={product} />
        ))}
      </ul>
    </div>
  )
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  // Next.js 15+ params bir Promise — await edilmesi gerekiyor
  const { category: slug } = await params

  // Geçersiz slug → 404
  const mapEntry = CATEGORY_MAP.find((m) => m.slug === slug)
  if (!mapEntry) {
    return notFound()
  }

  // Veritabanından kategori listesi ve o kategoriye ait ürünleri çek
  const categories = await getCategories().catch(() => [])
  const dbCategory = findDbCategory(slug, categories)

  // DB'de kategori varsa o kategoriye göre ürün ve alt kategorileri çek, yoksa boş
  const [products, subcategories] = dbCategory
    ? await Promise.all([
        getActiveProducts(dbCategory.id).catch(() => [] as Product[]),
        getSubcategories(dbCategory.id).catch(() => [] as Subcategory[]),
      ])
    : [[] as Product[], [] as Subcategory[]]

  const categoryTitle = dbCategory?.name ?? mapEntry.title
  const categoryDesc = dbCategory?.description ?? "Özenle seçilmiş lezzetli ürünlerimizi keşfedin"

  // Ürünleri alt kategoriye göre grupla (alt kategorisi olmayan ürünler "Diğer" grubuna düşer)
  const groupedBySubcategory = subcategories.map((sub) => ({
    id: sub.id,
    name: sub.name,
    items: products.filter((p) => p.subcategory_id === sub.id),
  })).filter((group) => group.items.length > 0)

  const ungrouped = products.filter((p) => !p.subcategory_id)
  const hasSubcategoryGroups = groupedBySubcategory.length > 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Sayfa Başlık Bölümü */}
        <section className="section-padding pb-8">
          <div className="max-w-3xl mx-auto">
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

        {/* Ürün Listesi */}
        <section className="px-4 md:px-8 lg:px-16 pb-20">
          <div className="max-w-3xl mx-auto">
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
            ) : hasSubcategoryGroups ? (
              <>
                {groupedBySubcategory.map((group) => (
                  <MenuGroup key={group.id} heading={group.name} products={group.items} />
                ))}
                {ungrouped.length > 0 && (
                  <MenuGroup heading="Diğer" products={ungrouped} />
                )}
              </>
            ) : (
              <MenuGroup products={products} />
            )}
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  )
}
