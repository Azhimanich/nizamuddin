// Auth helper untuk token management dengan tab isolation

export const getAuthToken = (): string | null => {
  // Prioritas sessionStorage (tab-specific), fallback ke localStorage
  return sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token_backup') || localStorage.getItem('auth_token')
}

export const getUserData = (): any | null => {
  const userData = sessionStorage.getItem('user') || localStorage.getItem('user_backup') || localStorage.getItem('user')
  return userData ? JSON.parse(userData) : null
}

export const setAuthData = (token: string, user: any): void => {
  // Set sessionStorage (tab-specific)
  sessionStorage.setItem('auth_token', token)
  sessionStorage.setItem('user', JSON.stringify(user))
  
  // Set localStorage backup untuk sync logout
  localStorage.setItem('auth_token_backup', token)
  localStorage.setItem('user_backup', JSON.stringify(user))
}

export const clearAuthData = (): void => {
  // Hapus sessionStorage (tab ini)
  sessionStorage.removeItem('auth_token')
  sessionStorage.removeItem('user')
  
  // Hapus localStorage backup (trigger logout di tab lain)
  localStorage.removeItem('auth_token_backup')
  localStorage.removeItem('user_backup')
  
  // Hapus legacy localStorage (backward compatibility)
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
}

export const syncSessionStorage = (): void => {
  // Sync sessionStorage dari localStorage backup jika ada
  if (!sessionStorage.getItem('auth_token') && localStorage.getItem('auth_token_backup')) {
    sessionStorage.setItem('auth_token', localStorage.getItem('auth_token_backup')!)
    sessionStorage.setItem('user', localStorage.getItem('user_backup')!)
  }
}

// Hook untuk API calls dengan automatic token handling
export const useAuthenticatedFetch = () => {
  const token = getAuthToken()
  
  return async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      ...options.headers,
    }
    
    return fetch(url, {
      ...options,
      headers,
    })
  }
}
