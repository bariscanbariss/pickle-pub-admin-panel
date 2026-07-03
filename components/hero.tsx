import Image from "next/image"
import { ChevronDown } from "lucide-react"

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center relative overflow-hidden">
      {/* Subtle decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, oklch(0.25 0.05 60) 1px, transparent 0)", backgroundSize: "40px 40px" }}
      />

      {/* Logo */}
      <div className="relative mb-8 group">
        <div className="absolute -inset-8 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <Image
          src="/picklepublogo.png"
          alt="Pickle Pub"
          width={320}
          height={320}
          className="w-56 md:w-72 lg:w-80 object-contain relative z-10 drop-shadow-sm"
          priority
        />
      </div>

      {/* Divider */}
      <div className="w-16 h-px bg-border mb-8" />

      {/* Tagline */}
      <p
        className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-sm leading-relaxed"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic" }}
      >
        Lezzetin ve eğlencenin buluştuğu nokta
      </p>

      {/* CTA */}
      <a href="#campaigns" className="btn-primary">
        Menüyü Keşfet
        <ChevronDown className="w-4 h-4" />
      </a>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary/20 to-transparent pointer-events-none" />
    </section>
  )
}
