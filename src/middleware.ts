// middleware.ts (at project root, same level as package.json)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  
  const url = req.nextUrl.clone()
  const token = req.cookies.get('token')?.value
  const role = req.cookies.get('role')?.value

  // Protect dashboard routes
  if ((url.pathname.startsWith('/pathologist') || url.pathname.startsWith('/nutritionist')) && !token) {

   url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from login/signup
  if ((url.pathname === '/login' || url.pathname === '/signup') && token && role) {
    url.pathname = `/${role}/dashboard`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Apply to these paths only
export const config = {
  matcher: ['/login', '/signup',  '/pathologist/:path*','/nutritionist/:path*'],
}
