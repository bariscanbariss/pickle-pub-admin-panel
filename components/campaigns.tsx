import Image from "next/image"
import { type CampaignImage } from "@/lib/supabase"

interface CampaignsProps {
  campaigns: CampaignImage[]
}

export function Campaigns({ campaigns }: CampaignsProps) {
  // Kampanya yoksa küçük bir bilgi kartı göster
  if (campaigns.length === 0) {
    return (
      <section id="campaigns" className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">Kampanyalar</h2>
          <p className="section-subtitle">Özel tekliflerimizi ve indirimlerimizi keşfedin</p>
          <div className="flex items-center justify-center h-32 rounded-2xl border border-dashed border-border text-muted-foreground text-sm">
            Yakında kampanyalar burada görünecek 🎉
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="campaigns" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-8">
          <h2 className="section-title">Kampanyalar</h2>
          <p className="section-subtitle">Özel tekliflerimizi ve indirimlerimizi keşfedin</p>
        </div>

        {/* Horizontal scroll slider */}
        <div className="flex overflow-x-auto gap-5 hide-scrollbar snap-x snap-mandatory pb-4 -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-16 lg:px-16">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex-shrink-0 w-72 md:w-80 snap-start group cursor-pointer"
            >
              <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-card">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={campaign.image_url}
                    alt={campaign.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Discount badge */}
                  {campaign.discount_percentage > 0 && (
                    <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      %{campaign.discount_percentage} İndirim
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-base text-foreground mb-1 line-clamp-1">
                    {campaign.title}
                  </h3>
                  {campaign.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {campaign.description}
                    </p>
                  )}
                  {campaign.price != null && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-accent">
                        ₺{campaign.price.toFixed(2)}
                      </span>
                      {campaign.original_price && campaign.original_price > campaign.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₺{campaign.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
