// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const token = req.cookies.get('token')?.value
  const role = req.cookies.get('role')?.value

  // ── Protect role-specific routes ──────────────────────────────────────────

  // Admin routes → must be logged in AND role === "admin"
  if (url.pathname.startsWith('/admin')) {
    if (!token) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    if (role !== 'admin') {
      // Logged in but wrong role → send to their own dashboard
      url.pathname = `/${role}/dashboard`
      return NextResponse.redirect(url)
    }
  }

  // Pathologist / Nutritionist routes → must be logged in
  if (
    (url.pathname.startsWith('/pathologist') || url.pathname.startsWith('/nutritionist')) &&
    !token
  ) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ── Redirect logged-in users away from login/signup ───────────────────────
  if ((url.pathname === '/login' || url.pathname === '/signup') && token && role) {
    url.pathname = `/${role}/dashboard`
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
  ],
}