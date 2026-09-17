'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import {
  getCategories,
  getSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  type Category,
  type Subcategory
} from '@/lib/supabase'
import { toast } from 'sonner'

export default function SubcategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category_id: '',
    name: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [categoriesData, subcategoriesData] = await Promise.all([
        getCategories(),
        getSubcategories()
      ])
      setCategories(categoriesData)
      setSubcategories(subcategoriesData)
    } catch (error) {
      toast.error('Alt kategoriler yüklenirken hata oluştu')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category_id) {
      toast.error('Lütfen bir üst kategori seçin')
      return
    }
    setLoading(true)

    try {
      if (editingId) {
        await updateSubcategory(editingId, formData)
        toast.success('Alt kategori güncellendi')
      } else {
        const siblingMax = Math.max(
          0,
          ...subcategories
            .filter((s) => s.category_id === formData.category_id)
            .map((s) => s.display_order)
        )
        await createSubcategory({ ...formData, display_order: siblingMax + 1 })
        toast.success('Alt kategori eklendi')
      }

      setFormData({ category_id: '', name: '' })
      setEditingId(null)
      setShowForm(false)
      await loadData()
    } catch (error) {
      toast.error('İşlem başarısız')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (subcategory: Subcategory) => {
    setFormData({
      category_id: subcategory.category_id,
      name: subcategory.name
    })
    setEditingId(subcategory.id)
    setShowForm(true)

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu alt kategoriyi silmek istediğinizden emin misiniz? Bu alt kategorideki ürünler alt kategorisiz kalacak.')) return

    setLoading(true)
    try {
      await deleteSubcategory(id)
      toast.success('Alt kategori silindi')
      await loadData()
    } catch (error) {
      toast.error('Silme işlemi başarısız')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ category_id: '', name: '' })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alt Kategoriler</h1>
          <p className="text-muted-foreground mt-1">
            Örn: Kokteyller kategorisi altında Votka Bazlı, Cin Bazlı, Viski Bazlı, Tekila Bazlı gibi gruplar oluşturun
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm || categories.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Alt Kategori
        </Button>
      </div>

      {categories.length === 0 && !loading && (
        <Card>
          <CardContent className="py-6 text-muted-foreground">
            Alt kategori ekleyebilmek için önce en az bir kategori oluşturmalısınız.
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Alt Kategori Düzenle' : 'Yeni Alt Kategori Ekle'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Üst Kategori *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Alt Kategori Adı *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                  placeholder="Örn: Votka Bazlı"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'İşleniyor...' : editingId ? 'Güncelle' : 'Ekle'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {categories.map((category) => {
          const categorySubs = subcategories.filter((s) => s.category_id === category.id)
          if (categorySubs.length === 0) return null

          return (
            <div key={category.id} className="space-y-3">
              <h2 className="text-lg font-semibold text-muted-foreground">{category.name}</h2>
              <div className="grid gap-3">
                {categorySubs.map((subcategory) => (
                  <Card key={subcategory.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                        <h3 className="font-medium">{subcategory.name}</h3>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(subcategory)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(subcategory.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}

        {subcategories.length === 0 && !loading && categories.length > 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Henüz alt kategori eklenmemiş</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                İlk Alt Kategoriyi Ekle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
