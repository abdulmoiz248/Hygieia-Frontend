// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const token = req.cookies.get('token')?.value
  const role = req.cookies.get('role')?.value

  // Example: protect dashboard routes
  if (url.pathname.includes('/lab-technician')) {
    if (!token) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Example: redirect logged-in users away from login/signup pages
  if (url.pathname === '/login' || url.pathname === '/signup') {
    if (token && role) {
      url.pathname = `/${role}/dashboard`
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Apply middleware only to relevant paths
export const config = {
  matcher: ['/login', '/signup',  '/lab-technician/:path*'],
}
