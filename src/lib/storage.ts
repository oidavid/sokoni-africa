import { supabase } from './supabase'

export async function uploadProductImage(file: File, merchantId: string): Promise<string | null> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${merchantId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, file, { upsert: true, contentType: file.type })

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename)

  return data.publicUrl
}
