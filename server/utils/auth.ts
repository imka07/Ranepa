import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import type { H3Event } from 'h3'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d'

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return bcryptjs.hash(password, 10)
}

// Compare password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcryptjs.compare(password, hashedPassword)
}

// Generate JWT token
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  )
}

// Verify JWT token
export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}

// Get token from cookie
export const getTokenFromCookie = (event: H3Event): string | null => {
  const token = getCookie(event, 'auth-token')
  return token || null
}

// Get user from token
export const getUserIdFromToken = (event: H3Event): string | null => {
  const token = getTokenFromCookie(event)
  if (!token) return null

  const decoded = verifyToken(token)
  return decoded?.userId || null
}

// Set auth cookie
export const setAuthCookie = (event: H3Event, token: string): void => {
  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  })
}

// Remove auth cookie
export const clearAuthCookie = (event: H3Event): void => {
  deleteCookie(event, 'auth-token')
}
