// handles interactions with Supabase Storage for uploading and retrieving images
// components should use these not sb directly
// helper file

import { supabase } from './supabase'

export async function uploadImage(file, userId, contentType) {
  const fileName = `${userId}/${Date.now()}_${file.name}`

  const { data, error } = await supabase.storage
    .from('image')
    .upload(fileName, file, { contentType: contentType || file.type })

  if (error) {
    console.error('Supabase upload error:', error.message, error)
    return null
  }
  return data.path
}

export function getImageUrl(path) {
  return supabase.storage.from('image').getPublicUrl(path).data.publicUrl
}