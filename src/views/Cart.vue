<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Mon Panier</h1>
      <p class="text-gray-600">
        {{ cartStore.itemCount }} article{{ cartStore.itemCount !== 1 ? 's' : '' }} dans votre panier
      </p>
    </div>

    <!-- Empty Cart State -->
    <div v-if="cartStore.items.length === 0" class="text-center py-16">
      <div class="mb-6">
        <ShoppingCart class="w-24 h-24 text-gray-300 mx-auto mb-4" />
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Votre panier est vide</h2>
        <p class="text-gray-500">Découvrez nos produits et ajoutez-les à votre panier</p>
      </div>
      <Button @click="$router.push('/')" class="bg-green-600 hover:bg-green-700">
        Continuer mes achats
      </Button>
    </div>

    <!-- Cart Items -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
      <!-- Cart Items List -->
      <div class="lg:col-span-2">
        <Card class="p-3 sm:p-6">
          <div class="space-y-3 sm:space-y-6">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <!-- Product Image and Info -->
              <div class="flex items-center gap-3 sm:gap-4 flex-grow">
                <!-- Product Image Thumbnail -->
                <div class="flex-shrink-0">
                  <img
                    :src="getImageUrl(item.image_url)"
                    :alt="item.name"
                    class="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md border border-gray-200"
                    loading="lazy"
                  />
                </div>

                <!-- Product Info -->
                <div class="flex-grow min-w-0">
                  <h3 class="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">{{ item.name }}</h3>
                  <p class="text-green-600 font-bold text-sm sm:text-base">{{ formatPriceWithUnit(item) }}</p>
                </div>
              </div>

              <!-- Quantity Controls and Actions -->
              <div class="flex items-center justify-between sm:justify-end sm:gap-4 w-full sm:w-auto">
                <!-- Quantity Controls -->
                <div class="flex items-center gap-2 sm:gap-3">
                  <Button
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    variant="outline"
                    size="sm"
                    class="w-8 h-8 sm:w-9 sm:h-9 p-0 touch-manipulation"
                    :disabled="item.quantity <= 1"
                  >
                    <Minus class="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <span class="font-medium min-w-[2rem] text-center text-sm sm:text-base">{{ item.quantity }}</span>
                  <Button
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                    variant="outline"
                    size="sm"
                    class="w-8 h-8 sm:w-9 sm:h-9 p-0 touch-manipulation"
                    :disabled="item.quantity >= item.stock_quantity"
                  >
                    <Plus class="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                <!-- Remove Button -->
                <Button
                  @click="cartStore.removeItem(item.id)"
                  variant="destructive"
                  size="sm"
                  class="w-8 h-8 sm:w-9 sm:h-9 p-0 touch-manipulation"
                >
                  <Trash2 class="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <Card class="p-4 sm:p-6 lg:sticky lg:top-4">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">Résumé de la commande</h3>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-gray-700 text-sm sm:text-base">
              <span>Sous-total ({{ cartStore.itemCount }} article{{ cartStore.itemCount !== 1 ? 's' : '' }})</span>
              <span>{{ cartStore.subtotalPriceFormatted }}</span>
            </div>
            
            <div class="flex justify-between text-gray-700 text-sm sm:text-base">
              <span>Livraison</span>
              <span>{{ cartStore.deliveryFeeFormatted }}</span>
            </div>
            
            <hr class="my-4" />
            
            <div class="flex justify-between text-base sm:text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{{ cartStore.totalPriceFormatted }}</span>
            </div>
            
            <!-- Minimum Order Progress -->
            <div v-if="cartStore.items.length > 0" class="mt-3 pt-3 border-t border-gray-200">
              <div class="flex justify-between text-xs text-gray-600 mb-1">
                <span>Commande minimum</span>
                <span>{{ formatPrice(MINIMUM_ORDER_AMOUNT) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300 ease-out"
                  :class="meetsMinimumOrder ? 'bg-green-500' : 'bg-amber-400'"
                  :style="{ width: Math.min((cartStore.totalPrice / MINIMUM_ORDER_AMOUNT) * 100, 100) + '%' }"
                ></div>
              </div>
              <div class="flex justify-between text-xs mt-1">
                <span :class="meetsMinimumOrder ? 'text-green-600 font-medium' : 'text-amber-600'">
                  {{ meetsMinimumOrder ? '✓ Minimum atteint' : `Reste ${remainingAmountFormatted}` }}
                </span>
                <span class="text-gray-500">
                  {{ Math.round((cartStore.totalPrice / MINIMUM_ORDER_AMOUNT) * 100) }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Validation Errors -->
          <div v-if="cartStore.validationErrors.length > 0" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-800 text-sm font-medium mb-2">Problèmes détectés :</p>
            <ul class="text-red-700 text-sm space-y-1">
              <li v-for="error in cartStore.validationErrors" :key="error.productId">
                • {{ error.message }}
              </li>
            </ul>
          </div>

          <!-- Minimum Order Warning -->
          <div v-if="!meetsMinimumOrder && cartStore.items.length > 0" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <AlertCircle class="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p class="text-amber-800 text-sm font-medium">Commande minimale requise</p>
            </div>
            <p class="text-amber-700 text-sm">
              Ajoutez encore <strong>{{ remainingAmountFormatted }}</strong> pour atteindre le minimum de <strong>{{ formatPrice(MINIMUM_ORDER_AMOUNT) }}</strong>
            </p>
          </div>

          <!-- Checkout Button -->
          <Button 
            @click="proceedToCheckout"
            :disabled="cartStore.validationErrors.length > 0 || cartStore.items.length === 0 || !meetsMinimumOrder"
            :class="{
              'bg-green-600 hover:bg-green-700': meetsMinimumOrder && cartStore.validationErrors.length === 0,
              'bg-gray-400 cursor-not-allowed': !meetsMinimumOrder || cartStore.validationErrors.length > 0
            }"
            class="w-full text-white py-3 touch-manipulation min-h-[44px] transition-colors"
          >
            <span v-if="meetsMinimumOrder">
              Procéder au paiement
            </span>
            <span v-else>
              Commande minimum {{ formatPrice(MINIMUM_ORDER_AMOUNT) }} requise
            </span>
          </Button>
          
          <Button 
            @click="$router.push('/')" 
            variant="outline" 
            class="w-full mt-3 touch-manipulation min-h-[44px]"
          >
            Continuer mes achats
          </Button>
        </Card>
      </div>
    </div>

    <!-- Continue Shopping Section -->
    <div v-if="cartStore.items.length > 0" class="mt-12 text-center">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Vous pourriez aussi aimer</h3>
      <Button 
        @click="$router.push('/')"
        variant="outline"
        class="border-green-600 text-green-600 hover:bg-green-50"
      >
        Découvrir plus de produits
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { formatPriceWithUnit } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus, Trash2, Shield, AlertCircle } from 'lucide-vue-next'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

// Minimum order amount in CFA
const MINIMUM_ORDER_AMOUNT = 12000

// Check if total meets minimum order requirement
const meetsMinimumOrder = computed(() => {
  return cartStore.totalPrice >= MINIMUM_ORDER_AMOUNT
})

// Calculate remaining amount to reach minimum order
const remainingAmount = computed(() => {
  const remaining = MINIMUM_ORDER_AMOUNT - cartStore.totalPrice
  return remaining > 0 ? remaining : 0
})

// Format the remaining amount
const remainingAmountFormatted = computed(() => {
  return formatPrice(remainingAmount.value)
})

// Format price in FCFA
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('XOF', 'FCFA')
}

// Get proper image URL with fallback
const getImageUrl = (url: string | null): string => {
  if (!url) return '/placeholder.png'; // Default placeholder
  const serverBaseUrl = (api.defaults.baseURL || '').replace('/api/v1', '');
  return url.startsWith('http') ? url : `${serverBaseUrl}${url}`;
};

// Proceed to checkout
const proceedToCheckout = () => {
  // Navigate to checkout page (works for both authenticated and guest users)
  router.push('/checkout')
}
</script>

<style scoped>
/* Additional custom styles if needed */
.container {
  max-width: 1200px;
}
</style>
