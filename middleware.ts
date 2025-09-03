// middleware.ts
import { NextRequest } from 'next/server';
import { authmiddleware } from './middleware/authMiddleware';

export async function middleware(request: NextRequest) {
  return await authmiddleware(request);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/users/:path*',
    '/api/inventory/:path*',
    '/api/sales/:path*',
    '/api/orders/:path*',
  ],
};