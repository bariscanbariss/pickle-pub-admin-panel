import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { PopularItems } from "@/components/popular-items"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <PopularItems />
        <About />
      </main>
      <Footer />
    </div>
  )
}
