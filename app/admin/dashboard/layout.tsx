'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Package, Tags, Star, Calendar, ImageIcon, LogOut } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Kategoriler', href: '/admin/dashboard/categories', icon: Tags },
  { name: 'Menü Ürünleri', href: '/admin/dashboard/products', icon: Package },
  { name: 'Kampanyalar', href: '/admin/dashboard/popular', icon: Star },
  { name: 'Aktiviteler', href: '/admin/dashboard/activities', icon: Calendar },
  { name: 'Hakkımızda Görselleri', href: '/admin/dashboard/about-images', icon: ImageIcon },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <Image
              src="/picklepublogo.png"
              alt="Pickle Pub"
              width={120}
              height={40}
              className="h-10 w-auto mb-2"
            />
            <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              onClick={handleLogout}
              disabled={loading}
              variant="outline"
              className="w-full justify-start"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {loading ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
