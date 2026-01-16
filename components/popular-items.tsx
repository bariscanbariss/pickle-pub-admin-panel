'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { getCampaignImages, type CampaignImage } from '@/lib/supabase'
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
  const [campaigns, setCampaigns] = useState<CampaignImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await getCampaignImages()
        setCampaigns(data)
      } catch (error) {
        console.log('Campaign images not loaded (table may not exist yet)')
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
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

  if (campaigns.length === 0) {
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
            {campaigns.map((campaign) => (
              <CarouselItem key={campaign.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Card className="overflow-hidden group hover:shadow-lg transition-shadow h-full">
                  {/* Campaign Image - 9:16 */}
                  <div className="relative aspect-[9/16] overflow-hidden bg-muted">
                    <Image
                      src={campaign.image_url}
                      alt={campaign.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount Badge */}
                    {campaign.discount_percentage > 0 && (
                      <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                        <Tag className="w-4 h-4" />
                        %{campaign.discount_percentage}
                      </div>
                    )}
                  </div>

                  {/* Campaign Info */}
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-balance line-clamp-1">
                      {campaign.title}
                    </h3>
                    {campaign.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {campaign.description}
                      </p>
                    )}
                    {campaign.price != null && (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-accent">
                          ₺{campaign.price.toFixed(2)}
                        </span>
                        {campaign.original_price && campaign.original_price > campaign.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₺{campaign.original_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  )
}
