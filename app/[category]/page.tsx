import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MenuSection } from "@/components/menu-section"
import { FloatingButtons } from "@/components/floating-buttons"
import { getCategories } from "@/lib/supabase"
import { notFound } from "next/navigation"

const CATEGORY_MAP = [
  { keywords: ["cocktail", "kokteyl", "kokteyller"], id: "cocktails" },
  { keywords: ["beer", "bira", "biralar"], id: "beers" },
  { keywords: ["soft", "alkolsüz", "meşrubat"], id: "softdrinks" },
  { keywords: ["food", "yiyecek", "yemek", "atıştırmalık"], id: "foods" },
  { keywords: ["whiskey", "viski", "viskiler"], id: "whiskeys" },
  { keywords: ["shot", "shots"], id: "shots" },
  { keywords: ["coffee", "kahve", "kahveler", "coffe", "coffes"], id: "coffes" },
  { keywords: ["wine", "şarap", "şaraplar"], id: "wine" },
]

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categories = await getCategories().catch(() => [])
  
  // URL'deki slug ile bizim haritadaki id eşleşiyor mu kontrol et
  const mapEntry = CATEGORY_MAP.find(m => m.id === params.category)
  
  if (!mapEntry) {
    // Eşleşmiyorsa bu sayfa 404 versin ki diğer sayfaları (örn: /admin) engellemesin
    return notFound()
  }

  let initialCategoryId = null
  
  // Veritabanındaki gerçek ID'yi bul
  const dbCategory = categories.find(cat => {
    const lower = cat.name.toLowerCase()
    return mapEntry.keywords.some(kw => lower.includes(kw))
  })

  if (dbCategory) {
    initialCategoryId = dbCategory.id
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-16 md:pt-24">
        {/* Sadece menüyü ve seçili kategoriyi göster */}
        <MenuSection initialCategoryId={initialCategoryId} />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  )
}
