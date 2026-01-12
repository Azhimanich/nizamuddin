// Auth helper untuk token management dengan tab isolation

// Inactivity timeout (15 menit)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 menit dalam milidetik
let inactivityTimer: NodeJS.Timeout | null = null

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
  
  // Start inactivity timer
  startInactivityTimer()
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
  
  // Clear inactivity timer
  clearInactivityTimer()
}

export const syncSessionStorage = (): void => {
  // Sync sessionStorage dari localStorage backup jika ada
  if (!sessionStorage.getItem('auth_token') && localStorage.getItem('auth_token_backup')) {
    sessionStorage.setItem('auth_token', localStorage.getItem('auth_token_backup')!)
    sessionStorage.setItem('user', localStorage.getItem('user_backup')!)
    // Start timer untuk tab yang baru dibuka
    startInactivityTimer()
  }
}

// Inactivity management
const startInactivityTimer = (): void => {
  clearInactivityTimer()
  
  inactivityTimer = setTimeout(() => {
    console.log('Session expired due to inactivity')
    clearAuthData()
    // Redirect ke login page
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
  }, INACTIVITY_TIMEOUT)
}

const clearInactivityTimer = (): void => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
    inactivityTimer = null
  }
}

// Reset timer on user activity
export const resetInactivityTimer = (): void => {
  if (getAuthToken()) {
    startInactivityTimer()
  }
}

// Setup event listeners untuk user activity
export const setupInactivityListeners = (): void => {
  if (typeof window === 'undefined') return
  
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
  
  const handleActivity = () => {
    resetInactivityTimer()
  }
  
  events.forEach(event => {
    window.addEventListener(event, handleActivity, true)
  })
  
  // Start timer jika user sudah login
  if (getAuthToken()) {
    startInactivityTimer()
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
