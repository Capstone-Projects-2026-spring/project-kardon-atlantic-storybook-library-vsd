import { supabase } from '../lib/supabase'

// Create a comment on a page
export async function createComment({ pageId, commentText }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('page_comments')
    .insert({
      page_id: pageId,
      user_id: user.id,
      comment_text: commentText,
    })
    .select()
    .single()

  return { data, error }
}

// Get all comments for a page, newest first
export async function getCommentsByPageId(pageId) {
  const { data, error } = await supabase
    .from('page_comments')
    .select('*, user:users(username)')
    .eq('page_id', pageId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Update a comment's text
export async function updateComment(commentId, commentText) {
  const { data, error } = await supabase
    .from('page_comments')
    .update({ comment_text: commentText })
    .eq('id', commentId)
    .select()
    .single()

  return { data, error }
}

// Delete a comment
export async function deleteComment(commentId) {
  const { error } = await supabase
    .from('page_comments')
    .delete()
    .eq('id', commentId)

  return { error }
}
