// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const token = req.cookies.get('token')?.value
  const role = req.cookies.get('role')?.value

  // ── Protect role-specific routes ──────────────────────────────────────────
const protectedRoutes = ['admin', 'doctor', 'pathologist', 'nutritionist']

const matchedRoute = protectedRoutes.find(route =>
  url.pathname.startsWith(`/${route}`)
)

if (matchedRoute) {
  if (!token) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (role !== matchedRoute) {
    url.pathname = role ? `/${role}/dashboard` : '/login'
    return NextResponse.redirect(url)
  }
}

  // ── Redirect logged-in users away from login/signup ───────────────────────
  if ((url.pathname === '/login' || url.pathname === '/signup') && token && role) {
    url.pathname = role ? `/${role}/dashboard` : '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/admin/:path*',
    '/pathologist/:path*',
    '/nutritionist/:path*',
    '/doctor/:path*',
  ],
}