import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../services/api'

interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  email: string
  password: string
  full_name: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userName = computed(() => user.value?.full_name || '')

  // Actions
  const setAuthHeader = (authToken: string) => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
  }

  const clearAuthHeader = () => {
    delete apiClient.defaults.headers.common['Authorization']
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post('/auth/login-json', credentials)
      const { access_token } = response.data

      // Store token
      token.value = access_token
      localStorage.setItem('auth_token', access_token)
      setAuthHeader(access_token)

      // Fetch user data
      await fetchUser()

      return true
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      isLoading.value = true
      error.value = null

      // Register user
      await apiClient.post('/auth/register', credentials)

      // Auto-login after registration
      const loginSuccess = await login({
        email: credentials.email,
        password: credentials.password
      })

      return loginSuccess
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Registration failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const fetchUser = async () => {
    try {
      if (!token.value) return

      setAuthHeader(token.value)
      const response = await apiClient.get('/auth/me')
      user.value = response.data
    } catch (err) {
      // Token might be invalid, logout
      logout()
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    clearAuthHeader()
    error.value = null
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize auth state on store creation
  const initializeAuth = async () => {
    if (token.value) {
      await fetchUser()
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
    // Actions
    login,
    register,
    logout,
    fetchUser,
    clearError,
    initializeAuth
  }
})
