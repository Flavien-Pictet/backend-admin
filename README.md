# Taller Admin Panel

Secure admin panel for managing Taller agreements and submissions.

## Features

- Password-protected authentication
- View all submissions from Supabase
- Generate PDF agreements
- Secure middleware protection
- Clean, responsive UI

## Project Structure

```
backend-admin/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── agreements/         # Main admin page
│   │   ├── api/
│   │   │   ├── admin/              # Protected admin API routes
│   │   │   │   ├── generate-pdf/
│   │   │   │   ├── get-submissions/
│   │   │   │   └── generate-creator-pdf/
│   │   │   └── auth/               # Authentication routes
│   │   │       ├── login/
│   │   │       └── logout/
│   │   └── login/                  # Login page
│   └── middleware.js               # Route protection
├── .env.local                      # Environment variables
└── MIGRATION_GUIDE.md              # Full migration guide
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create/update `.env.local` with:

```env
# Admin password (CHANGE THIS!)
ADMIN_PASSWORD=your_secure_password_here

# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Customize API routes

Update the following files to match your Supabase schema:

- [src/app/api/admin/get-submissions/route.js](src/app/api/admin/get-submissions/route.js) - Change table name and fields
- [src/app/api/admin/generate-pdf/route.js](src/app/api/admin/generate-pdf/route.js) - Customize PDF layout
- [src/app/api/admin/generate-creator-pdf/route.js](src/app/api/admin/generate-creator-pdf/route.js) - Customize creator PDF

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login)

## Deployment on Vercel

1. Push to GitHub:
```bash
git add .
git commit -m "Initial admin panel setup"
git push
```

2. Import project on Vercel

3. Configure environment variables on Vercel:
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Deploy!

## Security Features

- Password stored in environment variables (not in code)
- Server-side authentication
- HttpOnly cookies (not accessible via JavaScript)
- Protected routes with middleware
- Secure by default in production

## Usage

1. Navigate to `/login`
2. Enter admin password
3. Access admin panel at `/admin/agreements`
4. View submissions and generate PDFs
5. Logout when done

## Customization

- Update [src/app/admin/agreements/page.js](src/app/admin/agreements/page.js) for UI customization
- Modify PDF templates in `/api/admin/generate-*-pdf/` routes
- Adjust authentication in [src/middleware.js](src/middleware.js)

## Important Notes

- Change `ADMIN_PASSWORD` immediately!
- Keep `.env.local` out of version control
- Update Supabase table names in API routes
- Test authentication before deploying to production

See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed migration instructions.
