import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  is_admin: boolean
  created_at: string
  updated_at: string | null
}

interface LoginCredentials {
  username: string
  password: string
}

interface RegisterCredentials {
  email: string
  password: string
  full_name: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userName = computed(() => user.value?.full_name || '')
  const isAdmin = computed(() => user.value?.is_admin || false)

  // Actions
  const setAuthHeader = (authToken: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
  }

  const clearAuthHeader = () => {
    delete api.defaults.headers.common['Authorization']
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true
      error.value = null

      // OAuth2PasswordRequestForm expects form-data format
      const formData = new FormData()
      formData.append('username', credentials.username)
      formData.append('password', credentials.password)
      
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      const { access_token, user: userData } = response.data

      // Store token and user data
      token.value = access_token
      user.value = userData
      localStorage.setItem('auth_token', access_token)
      
      // Set auth header for future requests
      setAuthHeader(access_token)

      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await api.post('/auth/register', credentials)
      const { access_token, user: userData } = response.data

      // Store token and user data
      token.value = access_token
      user.value = userData
      localStorage.setItem('auth_token', access_token)
      
      // Set auth header for future requests
      setAuthHeader(access_token)

      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    clearAuthHeader()
    error.value = null
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return

    try {
      setAuthHeader(token.value)
      const response = await api.get('/auth/me')
      user.value = response.data
    } catch (err) {
      // Token might be invalid, logout
      logout()
    }
  }

  const initializeAuth = async () => {
    if (token.value) {
      await fetchCurrentUser()
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userName,
    isAdmin,
    
    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    initializeAuth
  }
})
