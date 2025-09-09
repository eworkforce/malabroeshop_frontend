<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-auto flex justify-center">
          <img src="/logo_malabro.jpg" alt="MALABRO" class="h-12 w-auto" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créez votre compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <router-link to="/login" class="font-medium text-green-600 hover:text-green-500">
            connectez-vous à votre compte existant
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="full_name" class="sr-only">Nom complet</label>
            <input
              id="full_name"
              v-model="form.full_name"
              name="full_name"
              type="text"
              autocomplete="name"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Nom complet"
            />
          </div>
          <div>
            <label for="email" class="sr-only">Adresse email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Adresse email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              minlength="8"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe (min. 8 caractères)"
            />
          </div>
          <div>
            <label for="confirm_password" class="sr-only">Confirmer le mot de passe</label>
            <input
              id="confirm_password"
              v-model="form.confirm_password"
              name="confirm_password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Confirmer le mot de passe"
            />
          </div>
        </div>

        <div v-if="userStore.error || passwordError" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Erreur d'inscription
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ userStore.error || passwordError }}
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="userStore.isLoading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="userStore.isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ userStore.isLoading ? 'Création du compte...' : 'Créer le compte' }}
          </button>
        </div>

        <div class="text-xs text-gray-500 text-center">
          En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  full_name: '',
  email: '',
  password: '',
  confirm_password: ''
})

const passwordError = computed(() => {
  if (form.password && form.confirm_password && form.password !== form.confirm_password) {
    return 'Les mots de passe ne correspondent pas'
  }
  return null
})

const isFormValid = computed(() => {
  return form.full_name && 
         form.email && 
         form.password && 
         form.confirm_password && 
         form.password === form.confirm_password &&
         form.password.length >= 8
})

const handleRegister = async () => {
  if (!isFormValid.value) return
  
  userStore.error = null
  
  const result = await userStore.register({
    email: form.email,
    password: form.password,
    full_name: form.full_name
  })

  if (result.success) {
    // Redirect to home page after successful registration
    router.push('/')
  }
}

onMounted(() => {
  // Clear any previous errors
  userStore.error = null
  
  // Initialize auth and check if already authenticated
  userStore.initializeAuth().then(() => {
    if (userStore.isAuthenticated) {
      router.push('/')
    }
  })
})
</script>
