import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const token = req.cookies.get('token')?.value
  const id = req.cookies.get('id')?.value
  const rawRole = req.cookies.get('role')?.value

  const normalizeRole = (role?: string) => {
    if (!role) return role

    const value = role.toLowerCase()
    return value.includes('lab') ? 'pathologist' : value
  }

  const role = normalizeRole(rawRole)
  const hasCompleteSession = Boolean(token && id && role)
  const protectedRoutes = ['admin', 'doctor', 'pathologist', 'nutritionist', 'patient']

  const matchedRoute = protectedRoutes.find(
    (route) =>
      url.pathname.startsWith(`/${route}`) ||
      (route === 'pathologist' && url.pathname.startsWith('/lab-tech'))
  )

  if (!matchedRoute) {
    return NextResponse.next()
  }

  if (!hasCompleteSession) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (role !== matchedRoute) {
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
    '/patient/:path*',
  ],
}
