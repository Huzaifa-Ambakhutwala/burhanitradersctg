const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

function getToken() {
  return localStorage.getItem('bt_admin_token')
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('bt_admin_token', token)
  } else {
    localStorage.removeItem('bt_admin_token')
  }
}

export function getAuthHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      headers,
    })
    if (!res.ok) {
      let message = 'Request failed'
      try {
        const data = await res.json()
        if (data?.error) message = data.error
      } catch {
        // ignore
      }
      throw new Error(message)
    }
    try {
      return await res.json()
    } catch {
      return null
    }
  } catch (err) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new Error(`Cannot connect to backend server at ${BACKEND_URL}. Make sure the backend is running.`)
    }
    throw err
  }
}

export async function apiRequestWithAuth(path, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  }
  return apiRequest(path, { ...options, headers })
}

export function getBackendFileUrl(relativeUrl) {
  if (!relativeUrl) return null
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl
  }
  return `${BACKEND_URL}${relativeUrl}`
}

