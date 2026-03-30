import { supabase } from '../lib/supabase'

// Create a new book for the authenticated user
export async function createBook({ title, coverImageUrl, pageCount }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('books')
    .insert({
      user_id: user.id,
      title,
      cover_image_url: coverImageUrl ?? null,
      page_count: pageCount ?? 0,
    })
    .select()
    .single()

  return { data, error }
}

// Get all books owned by the authenticated user
export async function getMyBooks() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Get all books that have been shared with the authenticated user
export async function getSharedWithMe() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('shared_books')
    .select('*, book:books(*)')
    .eq('shared_with_user_id', user.id)
    .order('shared_at', { ascending: false })

  return { data, error }
}

// Get a single book by ID (works for owned and shared books via RLS)
export async function getBookById(bookId) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single()

  return { data, error }
}

// Update a book's details (title, cover image, page count)
export async function updateBook(bookId, updates) {
  const { data, error } = await supabase
    .from('books')
    .update({
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.coverImageUrl !== undefined && { cover_image_url: updates.coverImageUrl }),
      ...(updates.pageCount !== undefined && { page_count: updates.pageCount }),
    })
    .eq('id', bookId)
    .select()
    .single()

  return { data, error }
}

// Delete a book (cascades to pages, hotspots, comments, shares)
export async function deleteBook(bookId) {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', bookId)

  return { error }
}
