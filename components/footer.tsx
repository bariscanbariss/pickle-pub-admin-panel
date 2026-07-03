import { MapPin, Phone, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3
              className="text-xl font-bold text-foreground mb-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Pickle Pub
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Lezzetin ve eğlencenin buluştuğu nokta. Sizleri ağırlamaktan mutluluk duyarız.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">İletişim</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                <span>Kıbrıs</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span>+90 XXX XXX XX XX</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Çalışma Saatleri</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p>Pazartesi – Perşembe: 17:00 – 01:00</p>
                  <p>Cuma – Cumartesi: 17:00 – 03:00</p>
                  <p>Pazar: 17:00 – 00:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Pickle Pub. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
