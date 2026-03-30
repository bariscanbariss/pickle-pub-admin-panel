export function Hero() {
  return (
    <section className="relative bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-[url('/cozy-pub-interior-with-warm-lighting.jpg')] bg-cover bg-center opacity-20" />
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Lezzetin ve Eğlencenin Buluştuğu Nokta</h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Tutkuyla hazırlanan nefis pickle'lar ve birbirinden özel pub lezzetleriyle damaklarınızı şenlendiriyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#menu"
              className="inline-flex items-center justify-center px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-medium transition-colors"
            >
              Menüyü İncele
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-lg font-medium transition-colors"
            >
              Hakkımızda
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
