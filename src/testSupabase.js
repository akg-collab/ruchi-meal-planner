import { supabase } from './supabaseClient'

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('clients').select('*')
    if (error) {
      console.error('❌ Supabase Error:', error)
      return { success: false, error }
    } else {
      console.log('✅ Supabase Connected! Clients:', data)
      return { success: true, data }
    }
  } catch (err) {
    console.error('❌ Connection Error:', err)
    return { success: false, error: err }
  }
}