import { supabase } from '../lib/supabase'

// Create a new page in a book
export async function createPage({ bookId, pageNumber, imageUrl, pageText }) {
  const { data, error } = await supabase
    .from('pages')
    .insert({
      book_id: bookId,
      page_number: pageNumber,
      image_url: imageUrl,
      page_text: pageText ?? null,
    })
    .select()
    .single()

  return { data, error }
}

// Get all pages for a book, ordered by page number
export async function getPagesByBookId(bookId) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('book_id', bookId)
    .order('page_number', { ascending: true })

  return { data, error }
}

// Get a single page by ID
export async function getPageById(pageId) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .single()

  return { data, error }
}

// Update a page (image, text, page number)
export async function updatePage(pageId, updates) {
  const { data, error } = await supabase
    .from('pages')
    .update({
      ...(updates.imageUrl !== undefined && { image_url: updates.imageUrl }),
      ...(updates.pageText !== undefined && { page_text: updates.pageText }),
      ...(updates.pageNumber !== undefined && { page_number: updates.pageNumber }),
    })
    .eq('id', pageId)
    .select()
    .single()

  return { data, error }
}

// Delete a page (cascades to hotspots and comments)
export async function deletePage(pageId) {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId)

  return { error }
}
