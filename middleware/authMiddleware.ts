// middleware/authMiddleware.ts
import { verifyToken } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server';

export async function authmiddleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;
  
  if (!token) {
    // For API routes, return JSON error
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }
    // For pages, redirect to login
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Add user info to request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', decoded.id.toString());
  requestHeaders.set('x-user-role', decoded.role || '');
  if(decoded.companyId){
    requestHeaders.set('x-company-id', decoded.companyId.toString());
  }

  // Continue with the request
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}