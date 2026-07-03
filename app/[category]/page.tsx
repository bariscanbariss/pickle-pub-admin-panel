import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingButtons } from "@/components/floating-buttons"
import { getCategories, getActiveProducts } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const CATEGORY_MAP = [
  { keywords: ["cocktail", "kokteyl", "kokteyller"], id: "cocktails", title: "Kokteyller" },
  { keywords: ["beer", "bira", "biralar"], id: "beers", title: "Biralar" },
  { keywords: ["soft", "alkolsüz", "meşrubat"], id: "soft-drinks", title: "Alkolsüz İçecekler" },
  { keywords: ["food", "yiyecek", "yemek", "atıştırmalık"], id: "foods", title: "Yiyecekler" },
  { keywords: ["whiskey", "viski", "viskiler"], id: "whiskeys", title: "Viskiler" },
  { keywords: ["shot", "shots"], id: "shots", title: "Shotlar" },
  { keywords: ["coffee", "kahve", "kahveler", "coffe", "coffes"], id: "coffees", title: "Kahveler" },
  { keywords: ["wine", "şarap", "şaraplar"], id: "wine", title: "Şaraplar" },
]

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categories = await getCategories().catch(() => [])
  
  const mapEntry = CATEGORY_MAP.find(m => m.id === params.category)
  
  if (!mapEntry) {
    return notFound()
  }

  // Veritabanındaki gerçek kategoriyi bul (Eğer admin panelden eklenmişse)
  const dbCategory = categories.find(cat => {
    const lower = cat.name.toLowerCase()
    return mapEntry.keywords.some(kw => lower.includes(kw))
  })

  // O kategoriye ait ürünleri çek
  const products = dbCategory ? await getActiveProducts(dbCategory.id).catch(() => []) : []

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          <div className="mb-8 flex items-center justify-between">
            <Link 
              href="/#menu-categories" 
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Geri Dön
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{dbCategory ? dbCategory.name : mapEntry.title}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {dbCategory?.description || "Özenle seçilmiş lezzetli ürünlerimizi keşfedin"}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Bu kategoride henüz ürün bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        Resim Yok
                      </div>
                    )}

                    {/* Discount Badge */}
                    {product.discount_percentage > 0 && (
                      <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        %{product.discount_percentage} İndirim
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      {product.original_price && product.original_price > product.price ? (
                        <>
                          <span className="text-2xl font-bold text-accent">
                            ₺{product.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ₺{product.original_price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-accent">
                          ₺{product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
      
      <Footer />
      <FloatingButtons />
    </div>
  )
}
