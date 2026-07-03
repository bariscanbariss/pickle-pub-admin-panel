"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, X, Dices } from "lucide-react"
import { type Product } from "@/lib/supabase"

interface WheelOfFortuneProps {
  products: Product[]
}

// ─── ÇARK PRESET (FİLTRE) SEÇENEKLERİ ──────────────────────────────────────────
const WHEEL_PRESETS = [
  {
    id: "all-alcohol",
    label: "🍹 Tüm Alkoller",
    categories: ["Cocktails", "Beers", "Whiskeys", "Shots", "Wine"],
  },
  {
    id: "shots",
    label: "🥃 Sadece Shot",
    categories: ["Shots"],
  },
  {
    id: "foods",
    label: "🍔 Ne Yesem?",
    categories: ["Foods"],
  },
  {
    id: "soft-drinks",
    label: "🥤 Alkolsüz",
    categories: ["Soft Drinks", "Coffees"],
  },
]

// ─── CANLI VE ENERJİK RENK PALETİ ──────────────────────────────────────────────
const SLICE_COLORS = [
  "#FF3366", // Canlı Pembe
  "#FF9933", // Turuncu
  "#00CC99", // Turkuaz/Yeşil
  "#9933FF", // Mor
  "#FFCC00", // Sarı
  "#3399FF", // Mavi
  "#FF6633", // Koyu Turuncu
  "#00CC66", // Parlak Yeşil
  "#E6005C", // Fuşya
  "#6600CC", // Koyu Mor
]

interface SpinResult {
  product: Product
  angle: number
}

export function WheelOfFortune({ products }: WheelOfFortuneProps) {
  const [activePresetId, setActivePresetId] = useState(WHEEL_PRESETS[0].id)
  const [wheelItems, setWheelItems] = useState<Product[]>([])
  
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<SpinResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const totalRotationRef = useRef(0)

  // Preset değiştiğinde çarktaki ürünleri güncelle
  useEffect(() => {
    const preset = WHEEL_PRESETS.find((p) => p.id === activePresetId) || WHEEL_PRESETS[0]
    
    // Aktif preset'in kategorilerine göre ürünleri filtrele
    const filteredProducts = products.filter((p) => {
      if (!p.is_active) return false
      const catName = p.categories?.name
      if (!catName) return false
      return preset.categories.includes(catName)
    })

    // Ürünleri karıştır (Fisher-Yates) ve çarkın dolu görünmesi için maksimum 12 tane seç
    const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random())
    const selectedItems = shuffled.slice(0, Math.min(12, Math.max(4, shuffled.length)))
    
    setWheelItems(selectedItems)
    
    // Preset değiştiğinde çarkı sıfırla
    setRotation(0)
    totalRotationRef.current = 0
    setShowResult(false)
    setResult(null)
  }, [activePresetId, products])

  const sliceAngle = wheelItems.length > 0 ? 360 / wheelItems.length : 360

  const spinWheel = () => {
    if (isSpinning || wheelItems.length === 0) return
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
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Arka plan efekti */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="section-title mb-2 text-center">Ne İçeyim? 🎰</h2>
        <p className="section-subtitle text-center mb-8">
          Karar veremedin mi? Kategorini seç, çarkı çevir!
        </p>

        {/* ─── KATEGORİ FİLTRE BUTONLARI ─── */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {WHEEL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                if (!isSpinning) setActivePresetId(preset.id)
              }}
              disabled={isSpinning}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                activePresetId === preset.id
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25 scale-105"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105"
              } ${isSpinning ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {wheelItems.length < 2 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-3xl bg-secondary/10">
            <Dices className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground font-medium">
              Bu kategoride çarkı çevirmek için yeterli ürün yok (En az 2 ürün gerekli).
            </p>
          </div>
        ) : (
          <div className="relative flex flex-col items-center gap-12">
            
            {/* ─── ÇARK KONTEYNERİ (DAHA BÜYÜK) ─── */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[450px] md:h-[450px]">
              
              {/* Çarkın etrafındaki parıltı/çerçeve */}
              <div className="absolute inset-[-10px] bg-gradient-to-tr from-accent/40 via-transparent to-accent/40 rounded-full blur-md" />
              <div className="absolute inset-0 border-[8px] border-white/10 rounded-full shadow-2xl pointer-events-none z-10" />

              {/* Üst Gösterge (Ok) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-30 flex flex-col items-center drop-shadow-2xl">
                <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-foreground" />
                <div className="w-4 h-4 bg-foreground rounded-full -mt-2 shadow-inner" />
              </div>

              {/* Dönen Çark */}
              <motion.div
                className="w-full h-full rounded-full shadow-2xl overflow-hidden relative border-4 border-background"
                animate={{ rotate: rotation }}
                transition={{
                  duration: 4.5,
                  ease: [0.2, 0.1, 0.05, 1.0], // Daha pürüzsüz durma hissi
                }}
                style={{ willChange: "transform" }}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {wheelItems.map((item, i) => {
                    const startAngle = (i * sliceAngle - 90) * (Math.PI / 180)
                    const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180)
                    const x1 = 100 + 100 * Math.cos(startAngle)
                    const y1 = 100 + 100 * Math.sin(startAngle)
                    const x2 = 100 + 100 * Math.cos(endAngle)
                    const y2 = 100 + 100 * Math.sin(endAngle)
                    const largeArc = sliceAngle > 180 ? 1 : 0

                    const midAngle = ((i + 0.5) * sliceAngle - 90) * (Math.PI / 180)
                    const textR = 60 // Metni biraz daha merkeze çektik (SVG scale 0-100 radius)
                    const tx = 100 + textR * Math.cos(midAngle)
                    const ty = 100 + textR * Math.sin(midAngle)
                    const textRotation = (i + 0.5) * sliceAngle

                    return (
                      <g key={item.id}>
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="1.5"
                        />
                        <text
                          x={tx}
                          y={ty}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={wheelItems.length > 8 ? "6" : "7.5"}
                          fontWeight="700"
                          fill="white"
                          transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                          style={{ fontFamily: "var(--font-inter), sans-serif", pointerEvents: "none", textShadow: "0px 1px 3px rgba(0,0,0,0.4)" }}
                        >
                          {item.name.length > 12 ? item.name.slice(0, 11) + "…" : item.name}
                        </text>
                      </g>
                    )
                  })}
                </svg>

                {/* ─── MERKEZ LOGO ─── */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-[6px] border-background shadow-2xl bg-white flex items-center justify-center"
                    // Logo çarkla birlikte dönmesin diye ters yöne çevirebiliriz, 
                    // ama en sağlıklısı logoyu çarkın GÖRSELİNİN (svg) üzerine değil, 
                    // motion.div'in DIŞINA koymaktır. Ancak relative konumlandırma için buradayız.
                    // React Framer Motion ile logoyu ters döndürelim ki sabit kalsın:
                  >
                    <motion.div
                      animate={{ rotate: -rotation }}
                      transition={{ duration: 4.5, ease: [0.2, 0.1, 0.05, 1.0] }}
                      className="w-full h-full p-2"
                    >
                      <Image
                        src="/picklepublogo.png"
                        alt="Pickle Pub"
                        width={96}
                        height={96}
                        className="w-full h-full object-contain"
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Çevir Butonu */}
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="group relative px-8 py-4 bg-accent text-accent-foreground rounded-full font-bold text-xl shadow-[0_0_40px_rgba(var(--accent-rgb),0.4)] hover:shadow-[0_0_60px_rgba(var(--accent-rgb),0.6)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <div className="flex items-center gap-3">
                <RotateCcw className={`w-6 h-6 ${isSpinning ? "animate-spin" : "group-hover:-rotate-180 transition-transform duration-500"}`} />
                {isSpinning ? "Heyecan Dorukta..." : "Çarkı Çevir!"}
              </div>
            </button>
          </div>
        )}

        {/* ─── SONUÇ MODALI ─── */}
        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
              onClick={() => setShowResult(false)}
            >
              <div
                className="bg-card rounded-[2rem] p-8 sm:p-10 max-w-md w-full shadow-2xl text-center relative border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowResult(false)}
                  className="absolute top-5 right-5 text-muted-foreground hover:text-foreground hover:rotate-90 transition-all bg-secondary/50 p-2 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-6xl mb-6 animate-bounce">🎉</div>
                <h3
                  className="text-3xl font-bold mb-3 text-foreground"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {result.product.name}
                </h3>
                {result.product.price > 0 && (
                  <p className="text-accent font-bold text-2xl mb-4">
                    ₺{result.product.price.toFixed(2)}
                  </p>
                )}
                
                <div className="w-16 h-1 bg-accent/50 mx-auto rounded-full mb-6" />

                <p className="text-muted-foreground text-sm sm:text-base mb-8">
                  Kaderin bu eşsiz lezzeti seçti. Barmene bu ekranı göstermen yeterli 😄
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => { setShowResult(false); spinWheel() }}
                    className="flex-1 px-6 py-4 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-accent/90 transition-colors"
                  >
                    Tekrar Çevir
                  </button>
                  <button
                    onClick={() => setShowResult(false)}
                    className="flex-1 px-6 py-4 rounded-xl border-2 border-border text-foreground hover:bg-secondary font-bold transition-colors"
                  >
                    Kabul Ediyorum!
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
