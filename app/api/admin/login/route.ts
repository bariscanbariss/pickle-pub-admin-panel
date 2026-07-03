import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()


export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre zorunludur' }, { status: 400 })
    }

    const adminUser = await prisma.admin_users.findUnique({
      where: { username }
    })

    if (!adminUser) {
      return NextResponse.json({ error: 'Hatalı kullanıcı adı veya şifre' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, adminUser.password_hash)

    if (passwordMatch) {
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
      return NextResponse.json({ error: 'Hatalı kullanıcı adı veya şifre' }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}

