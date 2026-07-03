"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
    }, 1000)

    const removeTimer = setTimeout(() => {
      setVisible(false)
    }, 1600) // 1s hold + 0.6s fade

    return () => {
      clearTimeout(timer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center transition-opacity duration-600 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <Image
        src="/picklepublogo.png"
        alt="Pickle Pub"
        width={280}
        height={280}
        className="w-48 md:w-64 object-contain animate-[scaleIn_0.5s_ease-out]"
        priority
      />
    </div>
  )
}
