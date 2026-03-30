import { supabase } from '../lib/supabase'

// Share a book with another user by their user ID
export async function shareBook({ bookId, sharedWithUserId }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('shared_books')
    .insert({
      book_id: bookId,
      shared_by_user_id: user.id,
      shared_with_user_id: sharedWithUserId,
    })
    .select()
    .single()

  return { data, error }
}

// Share a book with a user by their email address
export async function shareBookByEmail({ bookId, email }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  // Look up the target user by email
  const { data: targetUser, error: lookupError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (lookupError || !targetUser) {
    return { data: null, error: { message: 'User not found with that email' } }
  }

  return shareBook({ bookId, sharedWithUserId: targetUser.id })
}

// Get all shares for a book (who it's been shared with)
export async function getSharesByBookId(bookId) {
  const { data, error } = await supabase
    .from('shared_books')
    .select('*, shared_with_user:users!shared_books_shared_with_user_id_fkey(id, email, username)')
    .eq('book_id', bookId)
    .order('shared_at', { ascending: false })

  return { data, error }
}

// Get all books shared with the current user
export async function getBooksSharedWithMe() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('shared_books')
    .select('*, book:books(*), shared_by_user:users!shared_books_shared_by_user_id_fkey(id, email, username)')
    .eq('shared_with_user_id', user.id)
    .order('shared_at', { ascending: false })

  return { data, error }
}

// Remove a share (unshare a book from a user)
export async function removeShare(shareId) {
  const { error } = await supabase
    .from('shared_books')
    .delete()
    .eq('id', shareId)

  return { error }
}

// Remove a share by book and user IDs
export async function removeShareByBookAndUser(bookId, sharedWithUserId) {
  const { error } = await supabase
    .from('shared_books')
    .delete()
    .eq('book_id', bookId)
    .eq('shared_with_user_id', sharedWithUserId)

  return { error }
}
