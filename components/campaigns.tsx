"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getCampaignImages, type CampaignImage } from "@/lib/supabase"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignImage[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleSlides, setVisibleSlides] = useState(1)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const data = await getCampaignImages()
      setCampaigns(data)
    } catch (error) {
      console.error("Failed to load campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % campaigns.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length)
  }

  // Auto-play
  useEffect(() => {
    if (campaigns.length === 0) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // 5 saniyede bir değişir

    return () => clearInterval(interval)
  }, [campaigns.length, currentIndex])

  // Responsive visible slides
  useEffect(() => {
    const getVisibleSlides = () => {
      if (typeof window === 'undefined') return 1
      if (window.innerWidth >= 1024) return 3 // lg breakpoint
      if (window.innerWidth >= 768) return 2 // md breakpoint
      return 1
    }

    const handleResize = () => {
      setVisibleSlides(getVisibleSlides())
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="flex justify-center gap-4">
            <Skeleton className="aspect-[9/16] w-full max-w-xs rounded-2xl" />
            <Skeleton className="aspect-[9/16] w-full max-w-xs rounded-2xl hidden md:block" />
            <Skeleton className="aspect-[9/16] w-full max-w-xs rounded-2xl hidden lg:block" />
          </div>
        </div>
      </section>
    )
  }

  if (campaigns.length === 0) {
    return null
  }

  return (
    <section id="campaigns" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Kampanyalar</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Özel kampanyalarımızı ve indirimli ürünlerimizi keşfedin
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Slider Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-4 md:gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)`,
              }}
            >
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
                  style={{ maxWidth: `calc(${100 / visibleSlides}% - ${visibleSlides > 1 ? '1rem' : '0rem'})` }}
                >
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl group">
                    <Image
                      src={campaign.image_url}
                      alt={campaign.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={currentIndex === 0}
                    />

                    {/* Overlay with campaign info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">
                          {campaign.title}
                        </h3>
                        {campaign.description && (
                          <p className="text-sm text-white/90 mb-4 line-clamp-3">
                            {campaign.description}
                          </p>
                        )}
                        {campaign.price != null && (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-bold text-accent">
                                ₺{campaign.price.toFixed(2)}
                              </span>
                              {campaign.original_price && campaign.original_price > campaign.price && (
                                <span className="text-lg text-white/60 line-through">
                                  ₺{campaign.original_price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {campaign.discount_percentage > 0 && (
                              <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold inline-block w-fit">
                                %{campaign.discount_percentage} İndirim
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Always visible discount badge */}
                    {campaign.discount_percentage > 0 && (
                      <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                        %{campaign.discount_percentage}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {campaigns.length > visibleSlides && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm text-primary p-3 rounded-full transition-all shadow-lg z-10 disabled:opacity-50"
                aria-label="Önceki kampanya"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm text-primary p-3 rounded-full transition-all shadow-lg z-10 disabled:opacity-50"
                aria-label="Sonraki kampanya"
                disabled={currentIndex >= campaigns.length - visibleSlides}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {campaigns.length > visibleSlides && (
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(Math.ceil(campaigns.length - visibleSlides + 1))].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all rounded-full ${
                    index === currentIndex
                      ? "bg-primary w-8 h-3"
                      : "bg-muted-foreground/40 w-3 h-3 hover:bg-muted-foreground/60"
                  }`}
                  aria-label={`${index + 1}. pozisyona git`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
