import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Allow admin login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // For admin routes, check if user is authenticated
  if (pathname.startsWith('/admin')) {
    // This will be handled by the page component itself
    // as we can't access localStorage in middleware
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

