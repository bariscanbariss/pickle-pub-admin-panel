'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Upload, Trash2, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react'
import { getAboutImages, createAboutImage, deleteAboutImage, updateAboutImage, uploadImage, deleteImage, type AboutImage } from '@/lib/supabase'
import Image from 'next/image'

export default function AboutImagesPage() {
  const [images, setImages] = useState<AboutImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      const data = await getAboutImages()
      setImages(data)
    } catch (error) {
      console.error('Failed to load images:', error)
      toast.error('Resimler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check max limit
    if (images.length >= 10) {
      toast.error('Maksimum 10 fotoğraf yükleyebilirsiniz')
      e.target.value = ''
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları yükleyebilirsiniz')
      e.target.value = ''
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu maksimum 5MB olabilir')
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      // Upload to Supabase Storage
      const imageUrl = await uploadImage(file, 'about')

      // Get next display order
      const nextOrder = images.length > 0 ? Math.max(...images.map(img => img.display_order)) + 1 : 0

      // Create database entry
      await createAboutImage(imageUrl, nextOrder)

      toast.success('Fotoğraf başarıyla yüklendi')
      await loadImages()
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Fotoğraf yüklenirken hata oluştu')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (image: AboutImage) => {
    if (!confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) return

    try {
      // Delete from database
      await deleteAboutImage(image.id)

      // Delete from storage
      await deleteImage(image.image_url)

      toast.success('Fotoğraf silindi')
      await loadImages()
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Fotoğraf silinirken hata oluştu')
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return

    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[index - 1]
    newImages[index - 1] = temp

    // Update display orders
    try {
      await Promise.all([
        updateAboutImage(newImages[index].id, index),
        updateAboutImage(newImages[index - 1].id, index - 1)
      ])

      setImages(newImages)
      toast.success('Sıralama güncellendi')
    } catch (error) {
      console.error('Reorder failed:', error)
      toast.error('Sıralama güncellenirken hata oluştu')
    }
  }

  const handleMoveDown = async (index: number) => {
    if (index === images.length - 1) return

    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[index + 1]
    newImages[index + 1] = temp

    // Update display orders
    try {
      await Promise.all([
        updateAboutImage(newImages[index].id, index),
        updateAboutImage(newImages[index + 1].id, index + 1)
      ])

      setImages(newImages)
      toast.success('Sıralama güncellendi')
    } catch (error) {
      console.error('Reorder failed:', error)
      toast.error('Sıralama güncellenirken hata oluştu')
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Hakkımızda Görselleri</h1>
              <p className="text-muted-foreground">
                Hakkımızda sayfasında gösterilecek fotoğrafları yönetin (Maksimum 10 adet)
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {images.length} / 10 fotoğraf
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading || images.length >= 10}
                className="flex-1"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                  uploading || images.length >= 10
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Fotoğraf Yükle
                  </>
                )}
              </label>
            </div>
            {images.length >= 10 && (
              <p className="text-sm text-destructive mt-2">
                Maksimum fotoğraf limitine ulaştınız. Yeni fotoğraf yüklemek için önce mevcut fotoğraflardan birini silin.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Images Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Yükleniyor...</div>
          </div>
        ) : images.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Henüz fotoğraf yüklenmedi</h3>
              <p className="text-muted-foreground mb-4">
                Hakkımızda sayfasında gösterilecek ilk fotoğrafı yükleyin
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <Card key={image.id} className="group relative overflow-hidden">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={image.image_url}
                      alt={`About image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Controls */}
                  <div className="p-4 space-y-3">
                    {/* Order Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Sıra: {index + 1}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === images.length - 1}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(image)}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Sil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
