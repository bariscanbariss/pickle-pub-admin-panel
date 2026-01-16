'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Upload, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Plus, X } from 'lucide-react'
import { getCampaignImages, createCampaignImage, deleteCampaignImage, updateCampaignImage, uploadImage, deleteImage, type CampaignImage } from '@/lib/supabase'
import Image from 'next/image'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    imageFile: null as File | null
  })

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      const data = await getCampaignImages()
      setCampaigns(data)
    } catch (error) {
      console.error('Failed to load campaigns:', error)
      toast.error('Kampanyalar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      imageFile: null
    })
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (campaigns.length >= 10) {
      toast.error('Maksimum 10 kampanya ekleyebilirsiniz')
      return
    }

    if (!formData.title || !formData.price || !formData.imageFile) {
      toast.error('Başlık, fiyat ve görsel zorunludur')
      return
    }

    const price = parseFloat(formData.price)
    const originalPrice = formData.originalPrice ? parseFloat(formData.originalPrice) : null

    if (isNaN(price) || price <= 0) {
      toast.error('Geçerli bir fiyat girin')
      return
    }

    if (originalPrice !== null && (isNaN(originalPrice) || originalPrice <= price)) {
      toast.error('Karşılaştırma fiyatı, kampanya fiyatından büyük olmalıdır')
      return
    }

    setUploading(true)
    try {
      // Upload image
      console.log('Uploading image...')
      const imageUrl = await uploadImage(formData.imageFile, 'campaigns')
      console.log('Image uploaded:', imageUrl)

      // Get next display order
      const nextOrder = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.display_order)) + 1 : 0
      console.log('Next order:', nextOrder)

      // Create campaign
      console.log('Creating campaign with:', {
        title: formData.title,
        description: formData.description || null,
        imageUrl,
        price,
        originalPrice,
        nextOrder
      })

      const result = await createCampaignImage(
        formData.title,
        formData.description || null,
        imageUrl,
        price,
        originalPrice,
        nextOrder
      )
      console.log('Campaign created:', result)

      toast.success('Kampanya başarıyla eklendi')
      resetForm()
      await loadCampaigns()
    } catch (error) {
      console.error('Failed to create campaign:', error)
      // Show more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata'
      toast.error(`Kampanya eklenirken hata oluştu: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (campaign: CampaignImage) => {
    if (!confirm('Bu kampanyayı silmek istediğinizden emin misiniz?')) return

    try {
      await deleteCampaignImage(campaign.id)
      await deleteImage(campaign.image_url)
      toast.success('Kampanya silindi')
      await loadCampaigns()
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Kampanya silinirken hata oluştu')
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return

    const newCampaigns = [...campaigns]
    ;[newCampaigns[index], newCampaigns[index - 1]] = [newCampaigns[index - 1], newCampaigns[index]]

    try {
      await Promise.all([
        updateCampaignImage(newCampaigns[index].id, index),
        updateCampaignImage(newCampaigns[index - 1].id, index - 1)
      ])
      setCampaigns(newCampaigns)
      toast.success('Sıralama güncellendi')
    } catch (error) {
      console.error('Reorder failed:', error)
      toast.error('Sıralama güncellenirken hata oluştu')
    }
  }

  const handleMoveDown = async (index: number) => {
    if (index === campaigns.length - 1) return

    const newCampaigns = [...campaigns]
    ;[newCampaigns[index], newCampaigns[index + 1]] = [newCampaigns[index + 1], newCampaigns[index]]

    try {
      await Promise.all([
        updateCampaignImage(newCampaigns[index].id, index),
        updateCampaignImage(newCampaigns[index + 1].id, index + 1)
      ])
      setCampaigns(newCampaigns)
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Kampanyalar</h1>
            <p className="text-muted-foreground">
              Kampanya ekleyin ve yönetin (Maksimum 10 adet, 9:16 oranı önerilir)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {campaigns.length} / 10 kampanya
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              disabled={campaigns.length >= 10}
              size="lg"
            >
              {showForm ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  İptal
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Kampanya
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Add Campaign Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Yeni Kampanya Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Başlık *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Örn: Pizza ve Şarap Kampanyası"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Açıklama</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Kampanya detaylarını girin..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Kampanya Fiyatı (₺) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0.00"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="originalPrice">Karşılaştırma Fiyatı (₺)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                          placeholder="Eski fiyat"
                        />
                      </div>
                    </div>

                    {formData.price && formData.originalPrice && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          İndirim Oranı: <span className="font-bold text-accent">
                            %{Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.price)) / parseFloat(formData.originalPrice)) * 100)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Image Upload */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image">Kampanya Görseli (9:16) *</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        💡 En iyi görünüm için 1080x1920 boyutunda görsel kullanın (Max 5MB)
                      </p>
                    </div>

                    {/* Image Preview */}
                    {formData.imageFile && (
                      <div className="relative aspect-[9/16] bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={URL.createObjectURL(formData.imageFile)}
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
                        Ekleniyor...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Kampanya Ekle
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Campaigns List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Yükleniyor...</div>
          </div>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Henüz kampanya eklenmedi</h3>
              <p className="text-muted-foreground mb-4">
                İlk kampanyanızı ekleyerek başlayın
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Kampanya Ekle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign, index) => (
              <Card key={campaign.id} className="group relative overflow-hidden">
                <CardContent className="p-0">
                  {/* Campaign Image - 9:16 */}
                  <div className="relative aspect-[9/16] bg-muted">
                    <Image
                      src={campaign.image_url}
                      alt={campaign.title}
                      fill
                      className="object-cover"
                    />
                    {campaign.discount_percentage > 0 && (
                      <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-bold">
                        %{campaign.discount_percentage} İndirim
                      </div>
                    )}
                  </div>

                  {/* Campaign Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-1">{campaign.title}</h3>
                      {campaign.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {campaign.description}
                        </p>
                      )}
                    </div>

                    {campaign.price != null && (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-accent">
                          ₺{campaign.price.toFixed(2)}
                        </span>
                        {campaign.original_price && campaign.original_price > campaign.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₺{campaign.original_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Order Controls */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Sıra: {index + 1}</span>
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
                          disabled={index === campaigns.length - 1}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(campaign)}
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
