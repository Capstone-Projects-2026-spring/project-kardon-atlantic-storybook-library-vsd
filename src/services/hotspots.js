import { supabase } from '../lib/supabase'

// Create a hotspot on a page
export async function createHotspot({ pageId, word, coordinates, shapeType }) {
  const { data, error } = await supabase
    .from('hotspots')
    .insert({
      page_id: pageId,
      word,
      coordinates,
      shape_type: shapeType ?? 'rectangle',
    })
    .select()
    .single()

  return { data, error }
}

// Get all hotspots for a page
export async function getHotspotsByPageId(pageId) {
  const { data, error } = await supabase
    .from('hotspots')
    .select('*')
    .eq('page_id', pageId)

  return { data, error }
}

// Get a single hotspot by ID
export async function getHotspotById(hotspotId) {
  const { data, error } = await supabase
    .from('hotspots')
    .select('*')
    .eq('id', hotspotId)
    .single()

  return { data, error }
}

// Update a hotspot (word, coordinates, shape type)
export async function updateHotspot(hotspotId, updates) {
  const { data, error } = await supabase
    .from('hotspots')
    .update({
      ...(updates.word !== undefined && { word: updates.word }),
      ...(updates.coordinates !== undefined && { coordinates: updates.coordinates }),
      ...(updates.shapeType !== undefined && { shape_type: updates.shapeType }),
    })
    .eq('id', hotspotId)
    .select()
    .single()

  return { data, error }
}

// Delete a single hotspot
export async function deleteHotspot(hotspotId) {
  const { error } = await supabase
    .from('hotspots')
    .delete()
    .eq('id', hotspotId)

  return { error }
}

// Delete all hotspots for a page (useful when resetting a page's hotspots)
export async function deleteHotspotsByPageId(pageId) {
  const { error } = await supabase
    .from('hotspots')
    .delete()
    .eq('page_id', pageId)

  return { error }
}
