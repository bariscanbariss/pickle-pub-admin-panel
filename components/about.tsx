"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { getAboutImages, type AboutImage } from "@/lib/supabase"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function About() {
  const [images, setImages] = useState<AboutImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await getAboutImages()
        setImages(data)
      } catch (error) {
        // Table might not exist yet in Supabase, that's okay
        console.log("About images not loaded (table may not exist yet)")
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [])

  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-balance">Hakkımızda</h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Pickle Pub, lezzetin, eğlencenin ve samimiyetin buluştuğu bir mekan olarak sizlere kapılarını açıyor!
                Bizler, tutkuyla hazırlanan nefis pickle'lar ve birbirinden özel pub lezzetleriyle, damaklarınızı
                şenlendirmek için buradayız.
              </p>

              <p className="text-lg leading-relaxed">
                Pickle Pub, sadece bir mekan değil, aynı zamanda bir buluşma noktasıdır. Arkadaşlarınızla bir araya
                gelip sohbet edebileceğiniz, yeni insanlarla tanışıp keyifli vakit geçirebileceğiniz bir yer.
              </p>

              <p className="text-lg leading-relaxed">
                Sizleri ağırlamaktan ve sizlere en iyi hizmeti sunmaktan büyük mutluluk duyacağız. Gelin, Pickle Pub'un
                sıcak atmosferine dahil olun ve lezzet dolu bir yolculuğa birlikte çıkalım!
              </p>
            </div>

            <div className="relative">
              {loading ? (
                <div className="relative h-96 rounded-lg overflow-hidden bg-muted animate-pulse flex items-center justify-center">
                  <span className="text-muted-foreground">Yükleniyor...</span>
                </div>
              ) : images.length === 0 ? (
                <div className="relative h-96 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Henüz fotoğraf eklenmedi</span>
                </div>
              ) : (
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[
                    Autoplay({
                      delay: 4000,
                    }),
                  ]}
                  className="w-full"
                >
                  <CarouselContent>
                    {images.map((image) => (
                      <CarouselItem key={image.id}>
                        <div className="relative h-96 rounded-lg overflow-hidden">
                          <Image
                            src={image.image_url}
                            alt="Pickle Pub"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
