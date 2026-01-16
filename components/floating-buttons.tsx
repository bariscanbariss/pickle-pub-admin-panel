'use client'

import { Instagram, MapPin } from 'lucide-react'
import { useState } from 'react'

export function FloatingButtons() {
  const [showMap, setShowMap] = useState(false)

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Instagram Button */}
        <a
          href="https://www.instagram.com/picklepub.cy/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="Instagram'da bizi takip edin"
        >
          <Instagram className="w-6 h-6" />
        </a>

        {/* Location Button */}
        <button
          onClick={() => setShowMap(true)}
          className="group flex items-center justify-center w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="Konumumuzu görüntüle"
        >
          <MapPin className="w-6 h-6" />
        </button>
      </div>

      {/* Map Modal */}
      {showMap && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowMap(false)}
        >
          <div
            className="relative bg-background rounded-lg shadow-2xl max-w-4xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="text-xl font-bold">Pickle Pub Konumu</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Bizi ziyaret edin!
                </p>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label="Kapat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Map */}
            <div className="relative w-full" style={{ height: '500px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3263.2527632404835!2d33.93817437623975!3d35.125365360308066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14dfc90005dd81c9%3A0x2ca1d3d80a59612f!2sPickle%20Pub!5e0!3m2!1str!2s!4v1768574502489!5m2!1str!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pickle Pub Konumu"
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/50">
              <a
                href="https://www.google.com/maps/place/Pickle+Pub/@35.1253654,33.9381744,17z/data=!3m1!4b1!4m6!3m5!1s0x14dfc90005dd81c9:0x2ca1d3d80a59612f!8m2!3d35.1253654!4d33.9407493!16s%2Fg%2F11ts0rglk5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <MapPin className="w-4 h-4" />
                Google Maps'te Aç
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
