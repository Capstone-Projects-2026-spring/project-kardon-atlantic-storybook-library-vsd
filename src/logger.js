// Hotspot activity logger — writes structured rows to the `hotspot_logs`
// table in Supabase. All writes are fire-and-forget: a logging failure must
// never block reading or editing.

import { supabase } from "./lib/supabase";

const TABLE = "hotspot_logs";

const SESSION_ID =
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

async function currentUserId() {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id ?? null;
  } catch {
    return null;
  }
}

async function insertLog(row) {
  try {
    const user_id = await currentUserId();
    const payload = {
      user_id,
      session_id: SESSION_ID,
      ...row,
    };
    const { error } = await supabase.from(TABLE).insert(payload);
    if (error) {
      console.warn("[logger] insert failed:", error.message);
    } else if (import.meta.env?.DEV) {
      console.log(`[logger] ${row.event_type}`, payload);
    }
  } catch (err) {
    console.warn("[logger] unexpected error:", err);
  }
}

export function logHotspotClick({ hotspotId, pageId, bookId, word }) {
  return insertLog({
    event_type: "hotspot_click",
    hotspot_id: hotspotId ?? null,
    page_id: pageId ?? null,
    book_id: bookId ?? null,
    word: word ?? null,
  });
}

export function logHotspotCreate({
  hotspotId,
  pageId,
  bookId,
  word,
  shapeType,
  coordinates,
}) {
  return insertLog({
    event_type: "hotspot_create",
    hotspot_id: hotspotId ?? null,
    page_id: pageId ?? null,
    book_id: bookId ?? null,
    word: word ?? null,
    shape_type: shapeType ?? null,
    coordinates: coordinates ?? null,
  });
}

export function logHotspotEdit({
  hotspotId,
  pageId,
  bookId,
  word,
  shapeType,
  coordinates,
}) {
  return insertLog({
    event_type: "hotspot_edit",
    hotspot_id: hotspotId ?? null,
    page_id: pageId ?? null,
    book_id: bookId ?? null,
    word: word ?? null,
    shape_type: shapeType ?? null,
    coordinates: coordinates ?? null,
  });
}

export function logHotspotDelete({ hotspotId, pageId, bookId, word }) {
  return insertLog({
    event_type: "hotspot_delete",
    hotspot_id: hotspotId ?? null,
    page_id: pageId ?? null,
    book_id: bookId ?? null,
    word: word ?? null,
  });
}

export function logHotspotTtsError({ hotspotId, word, errorMessage }) {
  return insertLog({
    event_type: "hotspot_tts_error",
    hotspot_id: hotspotId ?? null,
    word: word ?? null,
    coordinates: errorMessage ? { error: String(errorMessage) } : null,
  });
}

export const __SESSION_ID__ = SESSION_ID;
