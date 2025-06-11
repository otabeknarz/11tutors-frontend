import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register';
  
  // Get the token from cookies or localStorage (stored in cookies by the client-side code)
  const token = request.cookies.get('accessToken')?.value || '';
  
  // Redirect logic
  if (isPublicPath && token) {
    // If user is on a public path but has a token, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!isPublicPath && !token) {
    // If user is not on a public path and has no token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Continue with the request if no redirects are needed
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/(protected)/:path*',  // All routes in the protected folder
    '/login',
    '/register',
  ],
};
