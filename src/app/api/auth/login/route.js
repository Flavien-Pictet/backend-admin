import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { password } = await request.json()

    // Vérifier le mot de passe (stocké dans les variables d'environnement)
    if (password === process.env.ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true })

      // Définir un cookie d'authentification
      response.cookies.set('admin_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
      })

      return response
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
