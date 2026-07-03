export const dynamic = "force-dynamic"

import { getCampaignImages, getAboutImages, getCategories, getActiveProducts } from "@/lib/supabase"
import { Header } from "@/components/header"
import { SplashScreen } from "@/components/splash-screen"
import { Campaigns } from "@/components/campaigns"
import { MenuCategories } from "@/components/menu-categories"
import { WheelOfFortune } from "@/components/wheel-of-fortune"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"
import { FloatingButtons } from "@/components/floating-buttons"

export default async function Home() {
  const [campaigns, aboutImages, categories, products] = await Promise.all([
    getCampaignImages().catch(() => []),
    getAboutImages().catch(() => []),
    getCategories().catch(() => []),
    getActiveProducts().catch(() => []),
  ])

  return (
    <div className="min-h-screen bg-background">
      <SplashScreen />
      <Header />
      <main>
        <Campaigns campaigns={campaigns} />
        <MenuCategories categories={categories} />
        <WheelOfFortune products={products} />
        <About images={aboutImages} />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  )
}
