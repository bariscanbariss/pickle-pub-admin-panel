'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Pencil, Trash2, Calendar, Clock, Upload, X } from 'lucide-react'
import {
  getAllActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  uploadImage,
  deleteImage,
  type Activity
} from '@/lib/supabase'
import { toast } from 'sonner'
import Image from 'next/image'

const DAYS = [
  { value: 'monday', label: 'Pazartesi' },
  { value: 'tuesday', label: 'Salı' },
  { value: 'wednesday', label: 'Çarşamba' },
  { value: 'thursday', label: 'Perşembe' },
  { value: 'friday', label: 'Cuma' },
  { value: 'saturday', label: 'Cumartesi' },
  { value: 'sunday', label: 'Pazar' }
]

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'weekday' | 'weekend'>('all')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    day_type: 'all' as 'weekday' | 'weekend' | 'all',
    specific_day: '',
    time_slot: '',
    imageFile: null as File | null,
    existingImageUrl: '' as string,
    is_active: true,
    display_order: 0
  })

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      const data = await getAllActivities()
      setActivities(data)
    } catch (error) {
      toast.error('Aktiviteler yüklenirken hata oluştu')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = formData.existingImageUrl

      // Upload new image if selected
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile, 'activities')
      }

      const activityData = {
        title: formData.title,
        description: formData.description || null,
        day_type: formData.day_type,
        specific_day: formData.specific_day || null,
        time_slot: formData.time_slot || null,
        image_url: imageUrl || null,
        is_active: formData.is_active,
        display_order: formData.display_order
      }

      if (editingId) {
        // Delete old image if a new one was uploaded
        if (formData.imageFile && formData.existingImageUrl) {
          await deleteImage(formData.existingImageUrl)
        }
        await updateActivity(editingId, activityData)
        toast.success('Aktivite güncellendi')
      } else {
        await createActivity(activityData)
        toast.success('Aktivite eklendi')
      }

      resetForm()
      await loadActivities()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata'
      toast.error(`İşlem başarısız: ${errorMessage}`)
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (activity: Activity) => {
    setFormData({
      title: activity.title,
      description: activity.description || '',
      day_type: activity.day_type,
      specific_day: activity.specific_day || '',
      time_slot: activity.time_slot || '',
      imageFile: null,
      existingImageUrl: activity.image_url || '',
      is_active: activity.is_active,
      display_order: activity.display_order
    })
    setEditingId(activity.id)
    setShowForm(true)

    // Sayfayı yukarı kaydır
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handleDelete = async (activity: Activity) => {
    if (!confirm('Bu aktiviteyi silmek istediğinizden emin misiniz?')) return

    setLoading(true)
    try {
      await deleteActivity(activity.id)
      if (activity.image_url) {
        await deleteImage(activity.image_url)
      }
      toast.success('Aktivite silindi')
      await loadActivities()
    } catch (error) {
      toast.error('Silme işlemi başarısız')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      day_type: 'all',
      specific_day: '',
      time_slot: '',
      imageFile: null,
      existingImageUrl: '',
      is_active: true,
      display_order: 0
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredActivities = activities.filter(activity => {
    if (filterType === 'all') return true
    return activity.day_type === filterType || activity.day_type === 'all'
  })

  const getDayTypeLabel = (type: string) => {
    switch (type) {
      case 'weekday': return 'Hafta İçi'
      case 'weekend': return 'Hafta Sonu'
      case 'all': return 'Her Gün'
      default: return type
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Aktiviteler</h1>
            <p className="text-muted-foreground mt-1">
              Haftalık aktivite programınızı yönetin
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg">
            {showForm ? (
              <>
                <X className="w-4 h-4 mr-2" />
                İptal
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Aktivite
              </>
            )}
          </Button>
        </div>

        {/* Filtreler */}
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            Tümü ({activities.length})
          </Button>
          <Button
            variant={filterType === 'weekday' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('weekday')}
          >
            Hafta İçi ({activities.filter(a => a.day_type === 'weekday' || a.day_type === 'all').length})
          </Button>
          <Button
            variant={filterType === 'weekend' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('weekend')}
          >
            Hafta Sonu ({activities.filter(a => a.day_type === 'weekend' || a.day_type === 'all').length})
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'Aktivite Düzenle' : 'Yeni Aktivite Ekle'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Aktivite Adı *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Örn: Canlı Müzik"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Açıklama</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Aktivite detayları..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="day_type">Gün Tipi *</Label>
                        <select
                          id="day_type"
                          value={formData.day_type}
                          onChange={(e) => setFormData({ ...formData, day_type: e.target.value as any })}
                          className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                          required
                        >
                          <option value="all">Her Gün</option>
                          <option value="weekday">Hafta İçi</option>
                          <option value="weekend">Hafta Sonu</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="specific_day">Belirli Gün</Label>
                        <select
                          id="specific_day"
                          value={formData.specific_day}
                          onChange={(e) => setFormData({ ...formData, specific_day: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                        >
                          <option value="">Seçiniz</option>
                          {DAYS.map((day) => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="time_slot">Saat Aralığı</Label>
                      <Input
                        id="time_slot"
                        value={formData.time_slot}
                        onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                        placeholder="Örn: 18:00-22:00"
                      />
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
                        Aktif (Ana sayfada göster)
                      </label>
                    </div>
                  </div>

                  {/* Right Column - Image Upload */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image">Aktivite Görseli (9:16)</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        💡 En iyi görünüm için 1080x1920 boyutunda görsel kullanın (Max 5MB)
                      </p>
                    </div>

                    {/* Image Preview */}
                    {(formData.imageFile || formData.existingImageUrl) && (
                      <div className="relative aspect-[9/16] bg-muted rounded-lg overflow-hidden max-w-xs">
                        <Image
                          src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.existingImageUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={uploading}
                  >
                    İptal
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        {editingId ? 'Güncelleniyor...' : 'Ekleniyor...'}
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {editingId ? 'Güncelle' : 'Aktivite Ekle'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Aktiviteler Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              {/* Activity Image - 9:16 */}
              {activity.image_url && (
                <div className="relative aspect-[9/16] bg-muted">
                  <Image
                    src={activity.image_url}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />
                  {!activity.is_active && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold">Pasif</span>
                    </div>
                  )}
                </div>
              )}

              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {getDayTypeLabel(activity.day_type)}
                  </span>
                  {activity.specific_day && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 font-medium">
                      {DAYS.find(d => d.value === activity.specific_day)?.label}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg mb-2 line-clamp-1">{activity.title}</h3>

                {activity.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {activity.description}
                  </p>
                )}

                {activity.time_slot && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4" />
                    {activity.time_slot}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(activity)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(activity)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredActivities.length === 0 && !loading && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  {filterType === 'all'
                    ? 'Henüz aktivite eklenmemiş'
                    : 'Bu kategoride aktivite bulunamadı'}
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Aktiviteyi Ekle
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
