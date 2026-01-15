export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">Pickle Pub</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Lezzetin ve eğlencenin buluştuğu nokta. Sizleri ağırlamaktan mutluluk duyarız.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">İletişim</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <p>Adres: Kıbrıs</p>
              <p>Telefon: +90 XXX XXX XX XX</p>
              <p>Email: info@picklepubcy.com</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Çalışma Saatleri</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <p>Pazartesi - Perşembe: 17:00 - 01:00</p>
              <p>Cuma - Cumartesi: 17:00 - 03:00</p>
              <p>Pazar: 17:00 - 00:00</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/80">
          <p>&copy; 2026 Pickle Pub. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
