'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Tags, Star, Calendar, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCategories, getProducts, getPopularItems, getAllActivities } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    popularItems: 0,
    activities: 0
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [categories, products, popularItems, activities] = await Promise.all([
          getCategories(),
          getProducts(),
          getPopularItems(),
          getAllActivities()
        ])

        setStats({
          categories: categories.length,
          products: products.length,
          popularItems: popularItems.length,
          activities: activities.length
        })
      } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error)
      }
    }

    loadStats()
  }, [])

  const cards = [
    {
      title: 'Kategoriler',
      value: stats.categories,
      description: 'Toplam kategori sayısı',
      icon: Tags,
      href: '/admin/dashboard/categories',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Menü Ürünleri',
      value: stats.products,
      description: 'Toplam ürün sayısı',
      icon: Package,
      href: '/admin/dashboard/products',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Popüler Ürünler',
      value: stats.popularItems,
      description: 'Öne çıkan ürünler',
      icon: Star,
      href: '/admin/dashboard/popular',
      color: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'Aktiviteler',
      value: stats.activities,
      description: 'Haftalık aktiviteler',
      icon: Calendar,
      href: '/admin/dashboard/activities',
      color: 'text-purple-600 dark:text-purple-400'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz! 👋</h1>
        <p className="text-muted-foreground">
          Pickle Pub yönetim paneline hoş geldiniz. Aşağıdan işlemlerinize başlayabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <Link key={card.href} href={card.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${card.color} group-hover:scale-110 transition-transform`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{card.value}</div>
                  <CardDescription className="text-xs">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Hızlı Başlangıç
          </CardTitle>
          <CardDescription>
            Yapmak istediğiniz işlemi seçin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/dashboard/categories">
              <div className="p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">Kategori Ekle</h3>
                <p className="text-sm text-muted-foreground">Yeni bir menü kategorisi oluşturun</p>
              </div>
            </Link>
            <Link href="/admin/dashboard/products">
              <div className="p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">Ürün Ekle</h3>
                <p className="text-sm text-muted-foreground">Menüye yeni bir ürün ekleyin</p>
              </div>
            </Link>
            <Link href="/admin/dashboard/popular">
              <div className="p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">Popüler Ürün Seç</h3>
                <p className="text-sm text-muted-foreground">Ana sayfada gösterilecek ürünleri seçin</p>
              </div>
            </Link>
            <Link href="/admin/dashboard/activities">
              <div className="p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">Aktivite Ekle</h3>
                <p className="text-sm text-muted-foreground">Haftalık aktivite programı oluşturun</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
