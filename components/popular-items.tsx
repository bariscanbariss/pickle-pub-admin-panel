import { Card, CardContent } from "@/components/ui/card"

const popularItems = [
  {
    name: "Pizza and 75CL Gatonegro Wine",
    price: "1100TL",
    image: "/artisan-pizza-with-wine-bottle.jpg",
    description: "Özel tarifimizle hazırlanan pizza ve premium şarap",
  },
  {
    name: "Signature Hot Dog",
    price: "250TL",
    image: "/gourmet-hot-dog-with-toppings.jpg",
    description: "Özenle seçilmiş malzemelerle hazırlanan hot dog",
  },
  {
    name: "Barbie Cocktail",
    price: "300TL",
    image: "/pink-cocktail-in-fancy-glass.jpg",
    description: "Renkli ve ferahlatıcı özel kokteylimiz",
  },
  {
    name: "Happy Hour Special",
    price: "350TL",
    image: "/beer-glasses-and-pub-snacks.jpg",
    description: "Özel saatlerde cazip fırsatlarımız",
  },
]

export function PopularItems() {
  return (
    <section id="populars" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Populars</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            En çok tercih edilen lezzetlerimiz ve özel kombinasyonlarımız
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularItems.map((item, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-64 overflow-hidden bg-muted">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2 text-balance">{item.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">{item.price}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
