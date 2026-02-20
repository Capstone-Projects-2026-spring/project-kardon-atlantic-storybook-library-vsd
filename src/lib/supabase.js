import { createClient } from '@supabase/supabase-js'

//connection from backend to frontend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

//tester
console.log("SUPABASE URL:", supabaseUrl)

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)