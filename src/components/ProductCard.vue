<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import api from '@/services/api'
import { formatPriceWithUnit } from '@/lib/utils'
import type { Product } from '@/services/ProductService'
import { ShoppingCart, Plus, Minus } from 'lucide-vue-next'

const props = defineProps<{
  product: Product;
}>()

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

// Computed property for cart item
const itemInCart = computed(() => {
  return cartStore.items.find(item => item.id === props.product.id)
})

const navigateToProduct = () => {
  router.push(`/product/${props.product.id}`)
}

const addToCart = (event: Event) => {
  event.stopPropagation();
  if (props.product.stock_quantity <= 0) return;

  if (!userStore.isAuthenticated) {
    router.push('/login?redirect=' + encodeURIComponent(router.currentRoute.value.fullPath));
    return;
  }

  cartStore.addItem({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    image_url: props.product.image_url,
    description: props.product.description,
    stock_quantity: props.product.stock_quantity,
    unit_of_measure: props.product.unit_of_measure
  });
};

const incrementQuantity = (event: Event) => {
  event.stopPropagation()
  
  // Enforce authentication before allowing cart modifications
  if (!userStore.isAuthenticated) {
    router.push('/login?redirect=' + encodeURIComponent(router.currentRoute.value.fullPath))
    return
  }
  
  cartStore.incrementQuantity(props.product.id)
}

const decrementQuantity = (event: Event) => {
  event.stopPropagation()
  
  // Enforce authentication before allowing cart modifications
  if (!userStore.isAuthenticated) {
    router.push('/login?redirect=' + encodeURIComponent(router.currentRoute.value.fullPath))
    return
  }
  
  cartStore.decrementQuantity(props.product.id)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(price)
}

const getImageUrl = (url: string | null) => {
  if (!url) return '/placeholder.png'; // Default placeholder
  const serverBaseUrl = (api.defaults.baseURL || '').replace('/api/v1', '');
  return url.startsWith('http') ? url : `${serverBaseUrl}${url}`;
};
</script>

<template>
  <Card 
    class="h-full cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
    @click="navigateToProduct"
  >
    <CardHeader class="p-3 sm:p-4">
      <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3 sm:mb-4">
        <img
          :src="getImageUrl(product.image_url)"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>
      <CardTitle class="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
        {{ product.name }}
      </CardTitle>
    </CardHeader>
    
    <CardContent class="p-3 sm:p-4 pt-0 flex flex-col justify-between flex-grow">
      <div class="mb-3 sm:mb-4">
        <p class="text-xl sm:text-2xl font-bold text-green-600">{{ formatPriceWithUnit(product) }}</p>
        <p class="text-xs sm:text-sm text-gray-500 mt-1">
          {{ product.stock_quantity > 0 ? `${product.stock_quantity} en stock` : 'Rupture de stock' }}
        </p>
      </div>
      
      <!-- Quantity Controls for items already in cart -->
      <div v-if="itemInCart" class="flex items-center justify-between mb-3 sm:mb-4">
        <span class="text-xs sm:text-sm text-gray-600">Dans le panier:</span>
        <div class="flex items-center space-x-1 sm:space-x-2">
          <Button
            size="sm"
            variant="outline"
            @click="decrementQuantity"
            :disabled="itemInCart.quantity <= 1"
            class="w-7 h-7 sm:w-8 sm:h-8 p-0 touch-manipulation"
          >
            <Minus class="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <span class="font-medium min-w-[1.5rem] sm:min-w-[2rem] text-center text-sm">{{ itemInCart.quantity }}</span>
          <Button
            size="sm"
            variant="outline"
            @click="incrementQuantity"
            :disabled="itemInCart.quantity >= product.stock_quantity"
            class="w-7 h-7 sm:w-8 sm:h-8 p-0 touch-manipulation"
          >
            <Plus class="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
      
      <!-- Add to Cart Button -->
      <Button 
        @click="addToCart"
        :disabled="product.stock_quantity <= 0"
        class="w-full bg-green-600 hover:bg-green-700 text-white touch-manipulation min-h-[44px]"
        size="sm"
      >
        <ShoppingCart class="w-4 h-4 mr-2" />
        <span class="text-xs sm:text-sm">
          {{ product.stock_quantity <= 0 ? 'Rupture de stock' : 'Ajouter au panier' }}
        </span>
      </Button>
    </CardContent>
  </Card>
</template>
