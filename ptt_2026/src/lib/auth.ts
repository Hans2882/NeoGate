export type AuthUser = {
  name: string
  email: string
}

const REGISTERED_USER_KEY = 'neogate_registered_user'
const SESSION_USER_KEY = 'neogate_session_user'

function readStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(key)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return null
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getRegisteredUser() {
  return readStorage<AuthUser>(REGISTERED_USER_KEY)
}

export function getSessionUser() {
  return readStorage<AuthUser>(SESSION_USER_KEY)
}

export function isAuthenticated() {
  return Boolean(getSessionUser())
}

export function registerUser(user: AuthUser) {
  writeStorage(REGISTERED_USER_KEY, user)
  writeStorage(SESSION_USER_KEY, user)
}

export function loginUser(email: string, name?: string) {
  const registeredUser = getRegisteredUser()
  const resolvedName = name?.trim() || registeredUser?.name || 'User'
  const sessionUser = {
    name: resolvedName,
    email,
  }

  writeStorage(SESSION_USER_KEY, sessionUser)
}

export function logoutUser() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(SESSION_USER_KEY)
}
