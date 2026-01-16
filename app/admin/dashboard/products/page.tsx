'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Pencil, Trash2, Upload, X, Tag } from 'lucide-react'
import {
  getCategories,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  deleteImage,
  type Category,
  type Product
} from '@/lib/supabase'
import { toast } from 'sonner'
import Image from 'next/image'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    discount_percentage: '0',
    category_id: '',
    image_url: '',
    is_active: true
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts()
      ])
      setCategories(categoriesData)
      setProducts(productsData)
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = formData.image_url

      // Yeni resim yüklendiyse
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'products')

        // Eski resmi sil (düzenleme modundaysa)
        if (editingId && formData.image_url) {
          try {
            await deleteImage(formData.image_url)
          } catch (err) {
            console.log('Eski resim silinirken hata:', err)
          }
        }
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        discount_percentage: parseInt(formData.discount_percentage),
        category_id: formData.category_id || null,
        image_url: imageUrl,
        is_active: formData.is_active
      }

      if (editingId) {
        await updateProduct(editingId, productData)
        toast.success('Ürün güncellendi')
      } else {
        await createProduct(productData)
        toast.success('Ürün eklendi')
      }

      resetForm()
      await loadData()
    } catch (error) {
      toast.error('İşlem başarısız')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      discount_percentage: product.discount_percentage.toString(),
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      is_active: product.is_active
    })
    setImagePreview(product.image_url)
    setEditingId(product.id)
    setShowForm(true)

    // Sayfayı yukarı kaydır
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    setLoading(true)
    try {
      console.log('Deleting product:', id)
      await deleteProduct(id)
      console.log('Product deleted successfully')

      // Resmi de sil
      if (imageUrl) {
        try {
          console.log('Deleting image:', imageUrl)
          await deleteImage(imageUrl)
          console.log('Image deleted successfully')
        } catch (err) {
          console.log('Resim silinirken hata:', err)
        }
      }

      toast.success('Ürün silindi')
      await loadData()
    } catch (error) {
      console.error('Delete error details:', error)
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata'
      toast.error(`Silme işlemi başarısız: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      discount_percentage: '0',
      category_id: '',
      image_url: '',
      is_active: true
    })
    setEditingId(null)
    setShowForm(false)
    setImageFile(null)
    setImagePreview(null)
  }

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menü Ürünleri</h1>
          <p className="text-muted-foreground mt-1">
            Menü ürünlerinizi yönetin
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Ürün
        </Button>
      </div>

      {/* Kategori Filtresi */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          Tümü ({products.length})
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name} ({products.filter(p => p.category_id === cat.id).length})
          </Button>
        ))}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ürün Adı *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                    placeholder="Örn: Signature Hot Dog"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background min-h-[80px]"
                  placeholder="Ürün açıklaması..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fiyat (TL) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                    placeholder="250"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Karşılaştırma Fiyatı (TL)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                    placeholder="300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">İndirim (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Resim Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ürün Resmi</label>
                <div className="flex flex-col gap-4">
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null)
                          setImageFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button type="button" variant="outline" asChild>
                        <span className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Resim Seç
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                  Aktif (Menüde göster)
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'İşleniyor...' : editingId ? 'Güncelle' : 'Ekle'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ürünler Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-muted">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Resim Yok
                </div>
              )}

              {product.discount_percentage > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  %{product.discount_percentage}
                </div>
              )}

              {!product.is_active && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold">Pasif</span>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <div className="mb-2">
                {product.categories && (
                  <span className="text-xs text-muted-foreground">
                    {product.categories.name}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>

              {product.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">
                    {product.price} TL
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.original_price} TL
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(product)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Düzenle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product.id, product.image_url)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProducts.length === 0 && !loading && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                {selectedCategory === 'all'
                  ? 'Henüz ürün eklenmemiş'
                  : 'Bu kategoride ürün bulunamadı'}
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                İlk Ürünü Ekle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
