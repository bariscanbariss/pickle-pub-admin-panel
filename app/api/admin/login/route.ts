import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Basit şifre kontrolü (production'da daha güvenli olmalı)
    const correctPassword = process.env.ADMIN_PASSWORD || 'pickle2024'

    if (password === correctPassword) {
      // Cookie oluştur
      const cookieStore = await cookies()
      cookieStore.set('admin-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 gün
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Hatalı şifre' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
