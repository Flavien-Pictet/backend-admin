import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialiser le client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  try {
    // Récupérer toutes les soumissions depuis Supabase
    // Adaptez le nom de la table selon votre structure
    const { data, error } = await supabase
      .from('submissions') // Changez le nom de la table selon votre base de données
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
