import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
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

// Helper functions for CRUD operations

// Categories
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data as Category[]
}

export const createCategory = async (category: Partial<Category>) => {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single()

  if (error) throw error
  return data as Category
}

export const updateCategory = async (id: string, category: Partial<Category>) => {
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Category
}

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Products
export const getProducts = async (categoryId?: string) => {
  let query = supabase
    .from('products')
    .select('*, categories(*)')
    .order('display_order', { ascending: true })

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export const getActiveProducts = async (categoryId?: string) => {
  let query = supabase
    .from('products')
    .select('*, categories(*)')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export const createProduct = async (product: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Popular Items
export const getPopularItems = async () => {
  const { data, error } = await supabase
    .from('popular_items')
    .select('*, products(*)')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data
}

export const addToPopular = async (productId: string, displayOrder: number = 0) => {
  const { data, error } = await supabase
    .from('popular_items')
    .insert({ product_id: productId, display_order: displayOrder })
    .select()
    .single()

  if (error) throw error
  return data
}

export const removeFromPopular = async (id: string) => {
  const { error } = await supabase
    .from('popular_items')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Activities
export const getActivities = async (dayType?: 'weekday' | 'weekend' | 'all') => {
  let query = supabase
    .from('activities')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (dayType && dayType !== 'all') {
    query = query.or(`day_type.eq.${dayType},day_type.eq.all`)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Activity[]
}

export const getAllActivities = async () => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data as Activity[]
}

export const createActivity = async (activity: Partial<Activity>) => {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single()

  if (error) throw error
  return data as Activity
}

export const updateActivity = async (id: string, activity: Partial<Activity>) => {
  const { data, error } = await supabase
    .from('activities')
    .update(activity)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Activity
}

export const deleteActivity = async (id: string) => {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Image Upload
export const uploadImage = async (file: File, folder: string = 'products') => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { error: uploadError, data } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  return publicUrl
}

export const deleteImage = async (imageUrl: string) => {
  // Extract file path from URL
  const url = new URL(imageUrl)
  const pathParts = url.pathname.split('/product-images/')
  if (pathParts.length < 2) return

  const filePath = pathParts[1]

  const { error } = await supabase.storage
    .from('product-images')
    .remove([filePath])

  if (error) throw error
}
