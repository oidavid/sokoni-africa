import { supabase } from './supabase'

export async function uploadProductImage(file: File, merchantId?: string | null): Promise<string | null> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  // Use merchant folder if available, otherwise just timestamp
  const filename = merchantId ? `${merchantId}/${timestamp}.${ext}` : `${timestamp}.${ext}`

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filename, file, { upsert: true, contentType: file.type })

  if (error) {
    console.error('Upload error:', error.message)
    // Try without folder as fallback
    const fallbackFilename = `${timestamp}.${ext}`
    const { error: fallbackError } = await supabase.storage
      .from('product-images')
      .upload(fallbackFilename, file, { upsert: true, contentType: file.type })
    if (fallbackError) {
      console.error('Fallback upload error:', fallbackError.message)
      return null
    }
    const { data: fallbackData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fallbackFilename)
    return fallbackData.publicUrl
  }

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename)

  return urlData.publicUrl
}
