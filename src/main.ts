import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'
import { useCartStore } from './stores/cart'

// Create app and pinia instance
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize stores and authentication state asynchronously
const initializeApp = async () => {
  const userStore = useUserStore()
  const cartStore = useCartStore()

  // Initialize authentication state before mounting the app
  await userStore.initializeAuth()
  cartStore.initializeCart()

  // Mount the app after stores are initialized
  app.mount('#app')
}

// Initialize the application
initializeApp().catch(console.error)
