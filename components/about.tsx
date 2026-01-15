export function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center text-balance">Hakkımızda</h2>

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

            <div className="relative h-96 rounded-lg overflow-hidden">
              <img src="/cozy-pub-interior-with-friends-socializing.jpg" alt="Pickle Pub Interior" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
