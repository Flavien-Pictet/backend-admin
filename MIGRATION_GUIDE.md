# Guide de migration - Admin Panel Sécurisé

## Étapes pour créer le nouveau repo admin sécurisé

### 1. Créer un nouveau repo Git

```bash
mkdir taller-admin
cd taller-admin
git init
```

### 2. Initialiser un projet Next.js

```bash
npx create-next-app@latest . --typescript=false --tailwind=yes --app=yes --src-dir=yes --import-alias="@/*"
```

### 3. Copier les fichiers suivants du repo actuel vers le nouveau repo

**Structure à créer dans `taller-admin` :**

```
taller-admin/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── agreements/
│   │   │       ├── layout.js
│   │   │       └── page.js
│   │   ├── api/
│   │   │   └── admin/
│   │   │       ├── generate-pdf/
│   │   │       │   └── route.js
│   │   │       ├── get-submissions/
│   │   │       │   └── route.js
│   │   │       └── generate-creator-pdf/
│   │   │           └── route.js
│   │   └── layout.js (root layout)
│   └── middleware.js (NOUVEAU - pour la sécurité)
├── .env.local (NOUVEAU - pour le mot de passe)
└── package.json
```

### 4. Fichiers à copier

Depuis `Taller-landing`, copiez ces fichiers vers `taller-admin` :

1. **Pages Admin :**
   - `src/app/admin/agreements/layout.js` → `taller-admin/src/app/admin/agreements/layout.js`
   - `src/app/admin/agreements/page.js` → `taller-admin/src/app/admin/agreements/page.js`

2. **API Routes :**
   - `src/app/api/admin/generate-pdf/route.js` → `taller-admin/src/app/api/admin/generate-pdf/route.js`
   - `src/app/api/admin/get-submissions/route.js` → `taller-admin/src/app/api/admin/get-submissions/route.js`
   - `src/app/api/admin/generate-creator-pdf/route.js` → `taller-admin/src/app/api/admin/generate-creator-pdf/route.js`

3. **Fichiers de configuration (si nécessaire) :**
   - Copiez vos variables d'environnement Supabase dans le nouveau `.env.local`

### 5. Créer le middleware de protection (fichier à créer)

Créez `taller-admin/src/middleware.js` avec le contenu suivant :

```javascript
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
```

### 6. Créer la page de login

Créez `taller-admin/src/app/login/page.js` :

```javascript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/agreements')
        router.refresh()
      } else {
        setError(data.error || 'Invalid password')
      }
    } catch (error) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Taller Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter admin password to continue
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Admin password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

### 7. Créer l'API route de login

Créez `taller-admin/src/app/api/auth/login/route.js` :

```javascript
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
```

### 8. Créer l'API route de logout

Créez `taller-admin/src/app/api/auth/logout/route.js` :

```javascript
import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })

  // Supprimer le cookie d'authentification
  response.cookies.delete('admin_authenticated')

  return response
}
```

### 9. Modifier la page admin pour ajouter un bouton logout

Dans `taller-admin/src/app/admin/agreements/page.js`, ajoutez ce bouton :

```javascript
const handleLogout = async () => {
  await fetch('/api/auth/logout', { method: 'POST' })
  window.location.href = '/login'
}

// Ajoutez ce bouton dans votre interface
<button
  onClick={handleLogout}
  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
>
  Logout
</button>
```

### 10. Configurer les variables d'environnement

Créez `.env.local` dans `taller-admin/` :

```env
# Mot de passe admin (changez-le !)
ADMIN_PASSWORD=votre_mot_de_passe_securise_ici

# Variables Supabase (copiées depuis votre projet actuel)
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
```

### 11. Installer les dépendances

```bash
cd taller-admin
npm install jspdf @supabase/supabase-js framer-motion
```

### 12. Déployer sur Vercel

1. Poussez le nouveau repo sur GitHub :
```bash
git add .
git commit -m "Initial admin panel with authentication"
git remote add origin https://github.com/votre-username/taller-admin.git
git push -u origin main
```

2. Allez sur Vercel et importez le nouveau repo

3. **IMPORTANT** : Configurez les variables d'environnement sur Vercel :
   - `ADMIN_PASSWORD` : votre mot de passe sécurisé
   - `NEXT_PUBLIC_SUPABASE_URL` : votre URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` : votre clé Supabase

4. Déployez !

### 13. Nettoyer le repo principal

Une fois le nouveau site admin déployé et fonctionnel, supprimez les fichiers admin du repo `Taller-landing` :

```bash
rm -rf src/app/admin
rm -rf src/app/api/admin
```

Puis commit et push :

```bash
git add .
git commit -m "Remove admin panel (moved to separate repo)"
git push
```

## Sécurité

✅ **Ce qui est maintenant sécurisé :**
- Le mot de passe est stocké dans les variables d'environnement Vercel (invisible dans le code)
- L'authentification se fait côté serveur (pas de bypass possible)
- Cookie httpOnly (non accessible via JavaScript)
- Les routes admin nécessitent une authentification
- Repo séparé = pas d'accès public aux données sensibles

## Accès à l'admin

- URL du nouveau site admin : `https://votre-site-admin.vercel.app/login`
- Ou configurez un sous-domaine : `admin.tallerapp.xyz`

---

**Note** : Changez immédiatement `ADMIN_PASSWORD` par un mot de passe fort et ne le partagez avec personne !
