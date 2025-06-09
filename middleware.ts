import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = false

  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/info')) {
    return NextResponse.redirect(new URL('/auth/signup', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/info/:path*'],
}
