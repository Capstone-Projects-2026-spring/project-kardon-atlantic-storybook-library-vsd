// persistent comments

import { supabase } from "../supabaseClient";

export async function createComment({ pageId, userId, content }) {
  return await supabase
    .from("page_comments")
    .insert([
      {
        page_id: pageId,
        user_id: userId,
        comment_text: content
      },
    ])
    .select()
    .single();
}