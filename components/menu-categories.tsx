"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { type Category } from "@/lib/supabase"

interface MenuCategoriesProps {
  categories: Category[]
}

const CATEGORY_MAP = [
  { keywords: ["cocktail", "kokteyl", "kokteyller"], src: "/categories/cocktails.png", id: "cocktails" },
  { keywords: ["beer", "bira", "biralar"], src: "/categories/beers.png", id: "beers" },
  { keywords: ["soft", "alkolsüz", "meşrubat"], src: "/categories/softdrinks.png", id: "softdrinks" },
  { keywords: ["food", "yiyecek", "yemek", "atıştırmalık"], src: "/categories/foods.png", id: "foods" },
  { keywords: ["whiskey", "viski", "viskiler"], src: "/categories/whiskeys.png", id: "whiskeys" },
  { keywords: ["shot", "shots"], src: "/categories/shots.png", id: "shots" },
  { keywords: ["coffee", "kahve", "kahveler", "coffe", "coffes"], src: "/categories/coffes.png", id: "coffes" },
  { keywords: ["wine", "şarap", "şaraplar"], src: "/categories/wine.png", id: "wine" },
]

function matchCategory(name: string) {
  const lower = name.toLowerCase()
  return CATEGORY_MAP.find((m) => m.keywords.some((kw) => lower.includes(kw)))
}

export function MenuCategories({ categories }: MenuCategoriesProps) {
  const matched = categories
    .map((cat) => {
      const map = matchCategory(cat.name)
      return map ? { src: map.src, dbId: cat.id, slug: map.id } : null
    })
    .filter(Boolean) as Array<{ src: string; dbId: string; slug: string }>

  const displayItems =
    matched.length > 0
      ? matched
      : CATEGORY_MAP.map((m) => ({ src: m.src, dbId: m.id, slug: m.id }))

  const router = useRouter()

  const handleClick = (slug: string) => {
    router.push(`/${slug}`)
  }

  return (
    <section id="menu-categories" className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="section-title text-center">Menü</h2>
          <p className="section-subtitle text-center">Kategorini seç, menüyü keşfet</p>
        </div>

        {/* 2×2 staggered grid — right column offset down */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 md:gap-x-10 md:gap-y-4 max-w-xl md:max-w-3xl mx-auto">
          {displayItems.map((item, index) => {
            const isRight = index % 2 === 1
            return (
              <div
                key={item.dbId}
                className={isRight ? "mt-8 md:mt-14" : ""}
              >
                <button
                  onClick={() => handleClick(item.slug)}
                  className="group focus:outline-none w-full"
                  aria-label="Kategoriye git"
                >
                  <Image
                    src={item.src}
                    alt="Menü kategorisi"
                    width={500}
                    height={500}
                    className="w-full h-auto object-contain transition-transform duration-500 ease-out group-hover:scale-[0.93] group-active:scale-[0.9]"
                    sizes="(max-width: 768px) 45vw, 320px"
                    priority={index < 2}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
