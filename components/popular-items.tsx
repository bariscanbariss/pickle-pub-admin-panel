'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { getPopularItems } from '@/lib/supabase'
import Image from 'next/image'
import { Tag } from 'lucide-react'
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function PopularItems() {
  const [popularItems, setPopularItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPopularItems = async () => {
      try {
        const items = await getPopularItems()
        setPopularItems(items)
      } catch (error) {
        console.error('Popüler ürünler yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPopularItems()
  }, [])

  if (loading) {
    return (
      <section id="populars" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Kampanyalar</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Özel kampanyalarımız ve indirimli ürünlerimiz
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">Yükleniyor...</div>
          </div>
        </div>
      </section>
    )
  }

  if (popularItems.length === 0) {
    return null
  }

  return (
    <section id="populars" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Kampanyalar</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Özel kampanyalarımız ve indirimli ürünlerimiz
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {popularItems.map((item) => {
              const product = item.products
              if (!product) return null

              return (
                <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="overflow-hidden group hover:shadow-lg transition-shadow h-full">
                    <div className="relative aspect-[9/16] overflow-hidden bg-muted">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Resim Yok
                        </div>
                      )}

                      {product.discount_percentage > 0 && (
                        <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                          <Tag className="w-4 h-4" />
                          %{product.discount_percentage}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-2 text-balance line-clamp-1">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-accent">
                          {product.price} TL
                        </span>
                        {product.original_price && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.original_price} TL
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  )
}
