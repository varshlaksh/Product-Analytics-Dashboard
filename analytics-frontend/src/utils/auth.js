import Cookies from 'js-cookie'

const TOKEN_KEY = 'token'

export const getToken = () => Cookies.get(TOKEN_KEY) || null

export const setToken = (token) => Cookies.set(TOKEN_KEY, token, { expires: 1 })

export const removeToken = () => Cookies.remove(TOKEN_KEY)

export const getUsername = () => {
  const token = getToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.username || payload.id || 'user'
  } catch {
    return 'user'
  }
}
