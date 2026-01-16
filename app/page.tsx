import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { MenuSection } from "@/components/menu-section"
import { PopularItems } from "@/components/popular-items"
import { Activities } from "@/components/activities"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"
import { FloatingButtons } from "@/components/floating-buttons"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <MenuSection />
        <PopularItems />
        <Activities />
        <About />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  )
}
