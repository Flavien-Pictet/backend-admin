import { NextResponse } from 'next/server'

export function middleware(request) {
  // Vérifier si l'utilisateur est authentifié
  const authCookie = request.cookies.get('admin_authenticated')
  const { pathname } = request.nextUrl

  // Page de login
  if (pathname === '/login') {
    // Si déjà authentifié, rediriger vers admin
    if (authCookie?.value === 'true') {
      return NextResponse.redirect(new URL('/admin/agreements', request.url))
    }
    return NextResponse.next()
  }

  // Routes protégées (admin et API admin)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (authCookie?.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/login']
}
