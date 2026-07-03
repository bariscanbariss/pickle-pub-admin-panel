"use client"

import Image from "next/image"
import { type AboutImage } from "@/lib/supabase"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface AboutProps {
  images: AboutImage[]
}

export function About({ images }: AboutProps) {
  return (
    <section id="about" className="section-padding bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Text column */}
          <div>
            <h2 className="section-title mb-4">Hakkımızda</h2>
            <div className="w-12 h-px bg-accent mb-6" />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Pickle Pub, lezzetin, eğlencenin ve samimiyetin buluştuğu bir mekan olarak sizlere kapılarını açıyor!
                Bizler, tutkuyla hazırlanan nefis pickle'lar ve birbirinden özel pub lezzetleriyle, damaklarınızı
                şenlendirmek için buradayız.
              </p>
              <p>
                Pickle Pub, sadece bir mekan değil, aynı zamanda bir buluşma noktasıdır. Arkadaşlarınızla bir araya
                gelip sohbet edebileceğiniz, yeni insanlarla tanışıp keyifli vakit geçirebileceğiniz bir yer.
              </p>
              <p>
                Sizleri ağırlamaktan ve sizlere en iyi hizmeti sunmaktan büyük mutluluk duyacağız. Gelin, Pickle Pub'un
                sıcak atmosferine dahil olun ve lezzet dolu bir yolculuğa birlikte çıkalım!
              </p>
            </div>
          </div>

          {/* Carousel column */}
          <div>
            {images.length === 0 ? (
              <div className="h-80 rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Henüz fotoğraf eklenmedi</span>
              </div>
            ) : (
              <Carousel
                opts={{ align: "start", loop: true }}
                plugins={[Autoplay({ delay: 4000 })]}
                className="w-full"
              >
                <CarouselContent>
                  {images.map((image) => (
                    <CarouselItem key={image.id}>
                      <div className="relative h-80 rounded-2xl overflow-hidden">
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
                <CarouselPrevious className="left-3 bg-white/80 border-border hover:bg-white" />
                <CarouselNext className="right-3 bg-white/80 border-border hover:bg-white" />
              </Carousel>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
