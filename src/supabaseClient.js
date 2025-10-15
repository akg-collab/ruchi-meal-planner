// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// DEBUG: Check what's loaded
console.log('🔍 Supabase URL:', supabaseUrl)
console.log('🔍 Anon Key:', supabaseAnonKey ? 'Loaded ✅' : 'Missing ❌')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Environment variables not loaded!')
  console.error('Make sure .env.local exists in project root')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)