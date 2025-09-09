<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from './stores/user'
import { useCartStore } from './stores/cart'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { ShoppingCart, Menu, X } from 'lucide-vue-next'

const userStore = useUserStore()
const cartStore = useCartStore()
const breakpoints = useBreakpoints(breakpointsTailwind)

const isMobile = breakpoints.smaller('md')
const mobileMenuOpen = ref(false)

const handleLogout = () => {
  userStore.logout()
  mobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-green-600 text-white shadow-lg">
    <div class="container mx-auto px-4 py-3">
      <!-- Mobile Header -->
      <div class="flex items-center justify-between">
        <!-- Logo and Brand -->
        <div class="flex items-center space-x-2 sm:space-x-4">
          <img alt="MALABRO Logo" class="h-8 sm:h-10" src="/logo_malabro.jpg" />
          <RouterLink 
            to="/" 
            @click="closeMobileMenu"
            class="text-lg sm:text-2xl font-bold hover:text-green-200 transition-colors"
          >
            MALABRO
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <nav v-if="!isMobile" class="flex items-center space-x-4">
          <RouterLink to="/" class="hover:text-green-200 transition-colors">
            Accueil
          </RouterLink>
          
          <!-- Cart Icon with Badge - Only show for authenticated users -->
          <RouterLink 
            v-if="userStore.isAuthenticated" 
            to="/cart" 
            class="relative p-2 hover:bg-green-700 rounded-lg transition-colors"
          >
            <ShoppingCart class="w-6 h-6 text-white" />
            <span 
              v-if="cartStore.itemCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              {{ cartStore.itemCount }}
            </span>
          </RouterLink>
          
          <div v-if="userStore.isAuthenticated" class="flex items-center space-x-4">
            <!-- Admin Dashboard Link -->
            <RouterLink 
              v-if="userStore.user?.is_admin"
              to="/admin" 
              class="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm transition-colors"
            >
              Admin
            </RouterLink>
            
            <span class="text-sm hidden lg:inline">Bonjour, {{ userStore.user?.full_name }}</span>
            <button 
              @click="handleLogout" 
              class="bg-green-700 hover:bg-green-800 px-3 py-2 rounded text-sm transition-colors"
            >
              Déconnexion
            </button>
          </div>
          
          <div v-else class="flex items-center space-x-2">
            <RouterLink 
              to="/login" 
              class="bg-green-700 hover:bg-green-800 px-3 py-2 rounded text-sm transition-colors"
            >
              Connexion
            </RouterLink>
            <RouterLink 
              to="/register" 
              class="bg-white text-green-600 hover:bg-green-50 px-3 py-2 rounded text-sm transition-colors"
            >
              Inscription
            </RouterLink>
          </div>
        </nav>

        <!-- Mobile Menu Button and Cart -->
        <div v-if="isMobile" class="flex items-center space-x-2">
          <!-- Cart Icon for Mobile -->
          <RouterLink 
            v-if="userStore.isAuthenticated" 
            to="/cart" 
            @click="closeMobileMenu"
            class="relative p-2 hover:bg-green-700 rounded-lg transition-colors"
          >
            <ShoppingCart class="w-6 h-6 text-white" />
            <span 
              v-if="cartStore.itemCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              {{ cartStore.itemCount }}
            </span>
          </RouterLink>

          <!-- Hamburger Menu Button -->
          <button 
            @click="toggleMobileMenu"
            class="p-2 hover:bg-green-700 rounded-lg transition-colors"
            :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
          >
            <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <nav 
          v-if="isMobile && mobileMenuOpen" 
          class="mt-4 pt-4 border-t border-green-500 space-y-2"
        >
          <RouterLink 
            to="/" 
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Accueil
          </RouterLink>
          
          <div v-if="userStore.isAuthenticated" class="space-y-2">
            <div class="px-3 py-2 text-sm text-green-200">
              Bonjour, {{ userStore.user?.full_name }}
            </div>
            
            <RouterLink 
              v-if="userStore.user?.is_admin"
              to="/admin" 
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Admin
            </RouterLink>
            
            <button 
              @click="handleLogout" 
              class="w-full text-left px-3 py-2 rounded-lg bg-green-700 hover:bg-green-800 transition-colors"
            >
              Déconnexion
            </button>
          </div>
          
          <div v-else class="space-y-2">
            <RouterLink 
              to="/login" 
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-lg bg-green-700 hover:bg-green-800 transition-colors"
            >
              Connexion
            </RouterLink>
            <RouterLink 
              to="/register" 
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-lg bg-white text-green-600 hover:bg-green-50 transition-colors"
            >
              Inscription
            </RouterLink>
          </div>
        </nav>
      </Transition>
    </div>
  </header>

  <main class="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
    <RouterView />
  </main>

  <footer class="p-4 mt-8 bg-secondary text-secondary-foreground">
    <div class="container mx-auto text-center">
      <p>&copy; 2025 MALABRO. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
</style>
