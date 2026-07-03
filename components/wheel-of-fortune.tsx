"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, X } from "lucide-react"
import { type Product } from "@/lib/supabase"

interface WheelOfFortuneProps {
  products: Product[]
}

// Filtrele: içki kategorilerine ait ürünler — geniş keyword seti
function getDrinkItems(products: Product[]) {
  const drinkKeywords = [
    // Kokteyller
    "kokteyl", "cocktail", "mojito", "margarita", "cosmopolitan", "negroni", "daiquiri",
    // Biralar
    "bira", "beer", "ipa", "lager", "ale", "stout", "draft", "draught",
    // Viskiler
    "viski", "whisky", "whiskey", "bourbon", "scotch", "jack", "jameson",
    // Shotlar
    "shot", "shots", "tekila", "tequila", "jager",
    // Votka & diğer
    "votka", "vodka", "cin", "gin", "rom", "rum", "brandy", "cognac", "likör", "liqueur",
  ]

  return products.filter((p) => {
    if (!p.is_active) return false
    const nameLower = p.name.toLowerCase()
    const catNameLower = p.categories?.name?.toLowerCase() ?? ""
    const descLower = p.description?.toLowerCase() ?? ""
    return drinkKeywords.some(
      (kw) => nameLower.includes(kw) || catNameLower.includes(kw) || descLower.includes(kw)
    )
  })
}


// Çark dilimleri için renk paleti (sıcak tonlar)
const SLICE_COLORS = [
  "#D4A853", "#8B4513", "#C17B2E", "#6B3A2A", "#E8C074",
  "#A0522D", "#D2956A", "#7B4F2E", "#F0C080", "#B07050",
]

interface SpinResult {
  product: Product
  angle: number
}

export function WheelOfFortune({ products }: WheelOfFortuneProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<SpinResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const totalRotationRef = useRef(0)

  const drinkItems = getDrinkItems(products)
  
  // Sadece admin panelden eklenen içecekleri göster (Maksimum 10)
  const wheelItems = drinkItems.slice(0, Math.min(10, drinkItems.length))

  const sliceAngle = 360 / wheelItems.length

  const spinWheel = () => {
    if (isSpinning) return
    setIsSpinning(true)
    setShowResult(false)
    setResult(null)

    // En az 5 tam tur + rastgele açı
    const extraSpins = 5 * 360
    const randomAngle = Math.floor(Math.random() * 360)
    const totalSpin = extraSpins + randomAngle
    const newTotalRotation = totalRotationRef.current + totalSpin
    totalRotationRef.current = newTotalRotation
    setRotation(newTotalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      // Hangi dilimin gösterge altında olduğunu hesapla
      const normalizedAngle = (360 - (newTotalRotation % 360)) % 360
      const selectedIndex = Math.floor(normalizedAngle / sliceAngle) % wheelItems.length
      setResult({ product: wheelItems[selectedIndex], angle: normalizedAngle })
      setShowResult(true)
    }, 4500)
  }

  return (
    <section className="section-padding bg-background">
      <div className="max-w-lg mx-auto text-center">
        {/* Section header */}
        <h2 className="section-title mb-2 text-center">Ne İçeyim? 🎰</h2>
        <p className="section-subtitle text-center mb-10">
          Karar veremedin mi? Çarkı çevir, Pickle Pub seçsin!
        </p>

        {/* Wheel container or Empty State */}
        {wheelItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-2xl bg-secondary/10">
            <p className="text-muted-foreground text-sm">
              Çarkı kullanabilmek için lütfen admin panelinden içecek (Kokteyl, Bira vs.) ekleyin.
            </p>
          </div>
        ) : (
          <div className="relative flex flex-col items-center gap-8">
            {/* Pointer arrow at top */}
            <div className="relative w-64 h-64 md:w-72 md:h-72">
              {/* Top pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-20 flex flex-col items-center">
                <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[18px] border-l-transparent border-r-transparent border-t-foreground drop-shadow-md" />
              </div>

              {/* Spinning wheel */}
              <motion.div
                className="w-full h-full rounded-full shadow-2xl overflow-hidden relative"
                animate={{ rotate: rotation }}
                transition={{
                  duration: 4.5,
                  ease: [0.25, 0.1, 0.05, 1.0],
                }}
                style={{ willChange: "transform" }}
              >
                {/* SVG Wheel */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {wheelItems.map((item, i) => {
                    const startAngle = (i * sliceAngle - 90) * (Math.PI / 180)
                    const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180)
                    const x1 = 100 + 100 * Math.cos(startAngle)
                    const y1 = 100 + 100 * Math.sin(startAngle)
                    const x2 = 100 + 100 * Math.cos(endAngle)
                    const y2 = 100 + 100 * Math.sin(endAngle)
                    const largeArc = sliceAngle > 180 ? 1 : 0

                    // Text position (middle of slice)
                    const midAngle = ((i + 0.5) * sliceAngle - 90) * (Math.PI / 180)
                    const textR = 68
                    const tx = 100 + textR * Math.cos(midAngle)
                    const ty = 100 + textR * Math.sin(midAngle)
                    const textRotation = (i + 0.5) * sliceAngle

                    return (
                      <g key={item.id}>
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                          stroke="white"
                          strokeWidth="1.5"
                        />
                        <text
                          x={tx}
                          y={ty}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="7"
                          fontWeight="600"
                          fill="white"
                          transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                          style={{ fontFamily: "var(--font-inter), sans-serif", pointerEvents: "none" }}
                        >
                          {item.name.length > 10 ? item.name.slice(0, 9) + "…" : item.name}
                        </text>
                      </g>
                    )
                  })}
                </svg>

                {/* Center logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                    <Image
                      src="/picklepublogo.png"
                      alt="Pickle Pub"
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Spin button */}
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
              {isSpinning ? "Çevriliyor..." : "Çarkı Çevir!"}
            </button>
          </div>
        )}

        {/* Result modal */}
        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowResult(false)}
            >
              <div
                className="bg-card rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowResult(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-5xl mb-4">🎉</div>
                <h3
                  className="text-2xl font-bold mb-2 text-foreground"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {result.product.name}
                </h3>
                {result.product.price > 0 && (
                  <p className="text-accent font-semibold text-lg mb-4">
                    ₺{result.product.price.toFixed(2)}
                  </p>
                )}
                <p className="text-muted-foreground text-sm mb-6">
                  Bugün bunu dene! Barmene bu ekranı göstermen yeterli 😄
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowResult(false); spinWheel() }}
                    className="flex-1 btn-primary justify-center"
                  >
                    Tekrar Çevir
                  </button>
                  <button
                    onClick={() => setShowResult(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    Tamam!
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

