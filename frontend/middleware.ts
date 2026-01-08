import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['id', 'en', 'ar']
const defaultLocale = 'id'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip if already has locale or is API/static file or admin routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.') ||
    pathname.startsWith('/logo') ||
    locales.some(locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
  ) {
    return NextResponse.next()
  }

  // Redirect root to default locale
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}`, request.url)
    )
  }

  // Redirect paths without locale
  return NextResponse.redirect(
    new URL(`/${defaultLocale}${pathname}`, request.url)
  )
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin routes - skip locale)
     * - files with extensions (e.g. .png, .jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
}

