// Token 管理
const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const TOKEN_EXPIRES_KEY = 'token_expires'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function getTokenExpires(): number | null {
  const expires = localStorage.getItem(TOKEN_EXPIRES_KEY)
  return expires ? parseInt(expires, 10) : null
}

export function setTokenExpires(expires: number): void {
  localStorage.setItem(TOKEN_EXPIRES_KEY, expires.toString())
}

export function removeTokenExpires(): void {
  localStorage.removeItem(TOKEN_EXPIRES_KEY)
}

export function isTokenExpired(): boolean {
  const expires = getTokenExpires()
  if (!expires) return true
  return Date.now() > expires
}

export function clearAuth(): void {
  removeToken()
  removeRefreshToken()
  removeTokenExpires()
}

