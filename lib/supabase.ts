'use server'

import { prisma } from './prisma'

// Types mapping (close to original supabase types)
export type Category = {
  id: string
  name: string
  description: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export type Product = {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  original_price: number | null
  discount_percentage: number
  image_url: string | null
  is_popular: boolean
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  categories?: Category | null
}

export type PopularItem = {
  id: string
  product_id: string
  display_order: number
  created_at: string
  products?: Product
}

export type Activity = {
  id: string
  title: string
  description: string | null
  day_type: 'weekday' | 'weekend' | 'all'
  specific_day: string | null
  time_slot: string | null
  image_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export type AboutImage = {
  id: string
  image_url: string
  display_order: number
  created_at: string
}

export type CampaignImage = {
  id: string
  title: string
  description: string | null
  image_url: string
  price: number
  original_price: number | null
  discount_percentage: number
  display_order: number
  created_at: string
}

// Helper function to serialize Prisma Date and Decimal
const serialize = (obj: any): any => {
  if (obj === null || obj === undefined) return obj
  if (obj instanceof Date) return obj.toISOString()
  if (typeof obj === 'object' && obj.constructor?.name === 'Decimal') return Number(obj)
  if (Array.isArray(obj)) return obj.map(serialize)
  if (typeof obj === 'object') {
    const newObj: any = {}
    for (const key in obj) {
      newObj[key] = serialize(obj[key])
    }
    return newObj
  }
  return obj
}

// Categories
export const getCategories = async () => {
  const data = await prisma.categories.findMany({
    orderBy: { display_order: 'asc' }
  })
  return serialize(data) as Category[]
}

export const createCategory = async (category: Partial<Category>) => {
  const data = await prisma.categories.create({
    data: {
      name: category.name!,
      description: category.description,
      display_order: category.display_order ?? 0,
    }
  })
  return serialize(data) as Category
}

export const updateCategory = async (id: string, category: Partial<Category>) => {
  const data = await prisma.categories.update({
    where: { id },
    data: {
      name: category.name,
      description: category.description,
      display_order: category.display_order,
      updated_at: new Date()
    }
  })
  return serialize(data) as Category
}

export const deleteCategory = async (id: string) => {
  await prisma.categories.delete({ where: { id } })
}

// Products
export const getProducts = async (categoryId?: string) => {
  const data = await prisma.products.findMany({
    where: categoryId ? { category_id: categoryId } : undefined,
    orderBy: { display_order: 'asc' },
    include: { categories: true }
  })
  return serialize(data)
}

export const getActiveProducts = async (categoryId?: string) => {
  const data = await prisma.products.findMany({
    where: {
      is_active: true,
      ...(categoryId ? { category_id: categoryId } : {})
    },
    orderBy: { display_order: 'asc' },
    include: { categories: true }
  })
  return serialize(data)
}

export const createProduct = async (product: Partial<Product>) => {
  const data = await prisma.products.create({
    data: {
      name: product.name!,
      description: product.description,
      price: product.price ?? 0,
      original_price: product.original_price,
      discount_percentage: product.discount_percentage ?? 0,
      image_url: product.image_url,
      is_popular: product.is_popular ?? false,
      display_order: product.display_order ?? 0,
      is_active: product.is_active ?? true,
      category_id: product.category_id
    }
  })
  return serialize(data) as Product
}

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const data = await prisma.products.update({
    where: { id },
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.original_price,
      discount_percentage: product.discount_percentage,
      image_url: product.image_url,
      is_popular: product.is_popular,
      display_order: product.display_order,
      is_active: product.is_active,
      category_id: product.category_id,
      updated_at: new Date()
    }
  })
  return serialize(data) as Product
}

export const deleteProduct = async (id: string) => {
  await prisma.products.delete({ where: { id } })
}

// Popular Items
export const getPopularItems = async () => {
  const data = await prisma.popular_items.findMany({
    orderBy: { display_order: 'asc' },
    include: { products: true }
  })
  return serialize(data)
}

export const addToPopular = async (productId: string, displayOrder: number = 0) => {
  const data = await prisma.popular_items.create({
    data: {
      product_id: productId,
      display_order: displayOrder
    }
  })
  return serialize(data)
}

export const removeFromPopular = async (id: string) => {
  await prisma.popular_items.delete({ where: { id } })
}

// Activities
export const getActivities = async (dayType?: 'weekday' | 'weekend' | 'all') => {
  const whereClause: any = { is_active: true }
  if (dayType && dayType !== 'all') {
    whereClause.OR = [
      { day_type: dayType },
      { day_type: 'all' }
    ]
  }

  const data = await prisma.activities.findMany({
    where: whereClause,
    orderBy: { display_order: 'asc' }
  })
  return serialize(data) as Activity[]
}

export const getAllActivities = async () => {
  const data = await prisma.activities.findMany({
    orderBy: { display_order: 'asc' }
  })
  return serialize(data) as Activity[]
}

export const createActivity = async (activity: Partial<Activity>) => {
  const data = await prisma.activities.create({
    data: {
      title: activity.title!,
      description: activity.description,
      day_type: activity.day_type!,
      specific_day: activity.specific_day,
      time_slot: activity.time_slot,
      image_url: activity.image_url,
      is_active: activity.is_active ?? true,
      display_order: activity.display_order ?? 0
    }
  })
  return serialize(data) as Activity
}

export const updateActivity = async (id: string, activity: Partial<Activity>) => {
  const data = await prisma.activities.update({
    where: { id },
    data: {
      title: activity.title,
      description: activity.description,
      day_type: activity.day_type,
      specific_day: activity.specific_day,
      time_slot: activity.time_slot,
      image_url: activity.image_url,
      is_active: activity.is_active,
      display_order: activity.display_order,
      updated_at: new Date()
    }
  })
  return serialize(data) as Activity
}

export const deleteActivity = async (id: string) => {
  await prisma.activities.delete({ where: { id } })
}

// About Images
export const getAboutImages = async () => {
  const data = await prisma.about_images.findMany({
    orderBy: { display_order: 'asc' }
  })
  return serialize(data) as AboutImage[]
}

export const createAboutImage = async (imageUrl: string, displayOrder: number) => {
  const data = await prisma.about_images.create({
    data: {
      image_url: imageUrl,
      display_order: displayOrder
    }
  })
  return serialize(data) as AboutImage
}

export const updateAboutImage = async (id: string, displayOrder: number) => {
  const data = await prisma.about_images.update({
    where: { id },
    data: { display_order: displayOrder }
  })
  return serialize(data) as AboutImage
}

export const deleteAboutImage = async (id: string) => {
  await prisma.about_images.delete({ where: { id } })
}

// Campaign Images
export const getCampaignImages = async () => {
  const data = await prisma.campaigns_images.findMany({
    orderBy: { display_order: 'asc' }
  })
  return serialize(data) as CampaignImage[]
}

export const createCampaignImage = async (
  title: string,
  description: string | null,
  imageUrl: string,
  price: number,
  originalPrice: number | null,
  displayOrder: number
) => {
  const discountPercentage = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const data = await prisma.campaigns_images.create({
    data: {
      title,
      description,
      image_url: imageUrl,
      price,
      original_price: originalPrice,
      discount_percentage: discountPercentage,
      display_order: displayOrder
    }
  })
  return serialize(data) as CampaignImage
}

export const updateCampaignImage = async (id: string, displayOrder: number) => {
  const data = await prisma.campaigns_images.update({
    where: { id },
    data: { display_order: displayOrder }
  })
  return serialize(data) as CampaignImage
}

export const editCampaignImage = async (
  id: string,
  title: string,
  description: string | null,
  imageUrl: string,
  price: number,
  originalPrice: number | null
) => {
  const discountPercentage = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const data = await prisma.campaigns_images.update({
    where: { id },
    data: {
      title,
      description,
      image_url: imageUrl,
      price,
      original_price: originalPrice,
      discount_percentage: discountPercentage
    }
  })
  return serialize(data) as CampaignImage
}

export const deleteCampaignImage = async (id: string) => {
  await prisma.campaigns_images.delete({ where: { id } })
}

// Cloudinary konfigürasyonu
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Image Upload using Cloudinary (Server Action)
export const uploadImage = async (formDataOrFile: FormData | File, folder: string = 'products') => {
  try {
    let file: File;
    if (formDataOrFile instanceof FormData) {
      file = formDataOrFile.get('file') as File;
    } else {
      file = formDataOrFile;
    }

    if (!file) throw new Error("Dosya bulunamadı");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buffer'ı Base64'e çevir
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Cloudinary'ye yükle
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: `pickle-pub/${folder}`,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

export const deleteImage = async (imageUrl: string) => {
  try {
    if (!imageUrl) return;
    
    // Eğer Cloudinary resmiyse oradan sil
    if (imageUrl.includes('cloudinary.com')) {
      const urlParts = imageUrl.split('/');
      const filenameWithExt = urlParts[urlParts.length - 1];
      const filename = filenameWithExt.split('.')[0];
      
      // upload/... sonrasındaki klasör yolunu bul
      const uploadIndex = urlParts.findIndex(p => p === 'upload');
      if (uploadIndex !== -1) {
        // v1234543... gibi version numarasını atla (uploadIndex + 2'den başla)
        const folderPath = urlParts.slice(uploadIndex + 2, -1).join('/');
        const publicId = folderPath ? `${folderPath}/${filename}` : filename;
        await cloudinary.uploader.destroy(publicId);
      }
    } else if (imageUrl.startsWith('/uploads/')) {
      // Lokal/eski dosya. Vercel üzerinde readonly olduğu için silinemez, es geçiyoruz.
      console.log("Eski lokal dosya bağlantısı kopartıldı:", imageUrl);
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
}
