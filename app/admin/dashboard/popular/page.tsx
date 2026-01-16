'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Star, GripVertical } from 'lucide-react'
import {
  getProducts,
  getPopularItems,
  addToPopular,
  removeFromPopular,
  updateProduct
} from '@/lib/supabase'
import { toast } from 'sonner'
import Image from 'next/image'

export default function PopularPage() {
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [popularItems, setPopularItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [products, popular] = await Promise.all([
        getProducts(),
        getPopularItems()
      ])

      setAllProducts(products.filter(p => p.is_active))
      setPopularItems(popular)
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToPopular = async (productId: string) => {
    setLoading(true)
    try {
      const maxOrder = Math.max(...popularItems.map(p => p.display_order), -1)
      await addToPopular(productId, maxOrder + 1)

      // Ürünün is_popular özelliğini güncelle
      await updateProduct(productId, { is_popular: true })

      toast.success('Ürün popüler listesine eklendi')
      setShowAddModal(false)
      await loadData()
    } catch (error) {
      toast.error('İşlem başarısız')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromPopular = async (popularItemId: string, productId: string) => {
    if (!confirm('Bu ürünü popüler listesinden çıkarmak istediğinizden emin misiniz?')) return

    setLoading(true)
    try {
      await removeFromPopular(popularItemId)

      // Ürünün is_popular özelliğini güncelle
      await updateProduct(productId, { is_popular: false })

      toast.success('Ürün popüler listesinden çıkarıldı')
      await loadData()
    } catch (error) {
      toast.error('İşlem başarısız')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Popüler olmayan ürünleri filtrele
  const availableProducts = allProducts.filter(
    product => !popularItems.some(popular => popular.product_id === product.id)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Popüler Ürünler</h1>
          <p className="text-muted-foreground mt-1">
            Ana sayfada slider olarak gösterilecek ürünleri yönetin
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ürün Ekle
        </Button>
      </div>

      {/* Bilgilendirme */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Ana Sayfa Slider
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Buraya eklediğiniz ürünler ana sayfada "Popüler Ürünler" bölümünde slider olarak görünecektir.
                Sıralamayı değiştirmek için ürünleri sürükleyebilirsiniz.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popüler Ürünler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularItems.map((item) => (
          <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-muted">
              {item.products?.image_url ? (
                <Image
                  src={item.products.image_url}
                  alt={item.products?.name || ''}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Resim Yok
                </div>
              )}

              <div className="absolute top-2 left-2 bg-yellow-500 text-white p-2 rounded-full">
                <Star className="w-4 h-4 fill-current" />
              </div>

              <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/90 p-2 rounded-lg cursor-move">
                <GripVertical className="w-4 h-4" />
              </div>
            </div>

            <CardContent className="p-4">
              {item.products?.categories && (
                <span className="text-xs text-muted-foreground">
                  {item.products.categories.name}
                </span>
              )}

              <h3 className="font-bold text-lg mb-2 line-clamp-1">
                {item.products?.name}
              </h3>

              {item.products?.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.products.description}
                </p>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">
                    {item.products?.price} TL
                  </span>
                  {item.products?.original_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {item.products.original_price} TL
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-red-600 hover:text-red-700"
                onClick={() => handleRemoveFromPopular(item.id, item.product_id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Listeden Çıkar
              </Button>
            </CardContent>
          </Card>
        ))}

        {popularItems.length === 0 && !loading && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Star className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Henüz popüler ürün eklenmemiş
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                İlk Ürünü Ekle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ürün Ekleme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Popüler Ürün Ekle</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
              {availableProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Eklenebilecek ürün kalmadı. Tüm aktif ürünler zaten popüler listesinde.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleAddToPopular(product.id)}
                    >
                      <div className="flex gap-4 p-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              Resim Yok
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {product.categories && (
                            <span className="text-xs text-muted-foreground">
                              {product.categories.name}
                            </span>
                          )}
                          <h4 className="font-semibold mb-1 line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">
                              {product.price} TL
                            </span>
                            {product.original_price && (
                              <span className="text-xs text-muted-foreground line-through">
                                {product.original_price} TL
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
