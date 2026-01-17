import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Campaigns } from "@/components/campaigns"
import { MenuSection } from "@/components/menu-section"
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
        <Campaigns />
        <MenuSection />
        <Activities />
        <About />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  )
}
