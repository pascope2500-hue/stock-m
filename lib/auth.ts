// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-very-secure-secret-key'
)
const MAX_AGE = 60 * 60 * 24 * 7 // 1 week

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

export async function generateToken(user: UserAuthPayload) {
  return await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(SECRET_KEY)
}

export function setTokenCookieApp(response: NextResponse, token: string) {
  response.cookies.set({
    name: 'authToken',
    value: token,
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
  })
  
  return response
}

export function clearTokenCookie(res: NextResponse) {
  res.cookies.set({
    name: 'authToken',
    value: '',
    maxAge: 0, // Use 0 instead of -1
    expires: new Date(0), // Explicitly set expiration to past date
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
  });
  return res;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload.user as UserAuthPayload
  } catch (error) {
    console.log(error)
    return null
  }
}