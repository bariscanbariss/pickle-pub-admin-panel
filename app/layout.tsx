import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { LenisProvider } from "@/components/lenis-provider"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Pickle Pub | Lezzetin ve Eğlencenin Buluştuğu Nokta",
  description: "Pickle Pub - Tutkuyla hazırlanan nefis lezzetler ve özel pub menümüzle sizlere hizmet veriyoruz.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <LenisProvider>
          {children}
          <Toaster position="top-right" richColors />
          <Analytics />
        </LenisProvider>
      </body>
    </html>
  )
}
