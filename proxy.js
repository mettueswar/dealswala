import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/dw_token=([^;]+)/);
    const session = match ? verifyToken(match[1]) : null;
    if (!session || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/login?next=' + encodeURIComponent(pathname), request.url));
    }
  }

  // Security headers
  const res = NextResponse.next();
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|api/media/serve).*)',
  ],
};
