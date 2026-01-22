import crypto from 'crypto'

// Используем переменную окружения или дефолтный секрет
const SECRET = process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-production'

interface TokenPayload {
  id: string
  email: string
  role: 'admin' | 'superadmin'
  iat: number
  exp: number
}

export const generateToken = (
  email: string,
  role: 'admin' | 'superadmin',
  expiresIn: number = 24 * 60 * 60 * 1000 // 24 часа
): string => {
  const now = Math.floor(Date.now() / 1000)
  const exp = Math.floor((Date.now() + expiresIn) / 1000)

  const payload: TokenPayload = {
    id: crypto.randomUUID(),
    email,
    role,
    iat: now,
    exp
  }

  // Простая реализация JWT (в продакшене используй библиотеку jsonwebtoken)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64')

  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  return `${header}.${body}.${signature}`
}

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [header, body, signature] = parts

    // Проверяем подпись
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(`${header}.${body}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    if (signature !== expectedSignature) return null

    // Декодируем payload
    const payload = JSON.parse(Buffer.from(body, 'base64').toString()) as TokenPayload

    // Проверяем срок действия
    if (payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload
  } catch (error) {
    return null
  }
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const body = parts[1]
    return JSON.parse(Buffer.from(body, 'base64').toString()) as TokenPayload
  } catch (error) {
    return null
  }
}
