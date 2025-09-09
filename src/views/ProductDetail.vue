<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProductService, { type Product } from '@/services/ProductService'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quantity = ref(1)
const isAddingToCart = ref(false)

onMounted(async () => {
  const productId = route.params.id as string
  
  if (!productId) {
    error.value = 'Product ID is required'
    loading.value = false
    return
  }

  try {
    product.value = await ProductService.getProduct(parseInt(productId))
    loading.value = false
  } catch (err) {
    console.error('Failed to fetch product:', err)
    error.value = 'Failed to load product details'
    loading.value = false
  }
})

const goBack = () => {
  router.push('/')
}

const formatPrice = (price: number) => {
  return `${price} FCFA`
}

const getImageUrl = (url: string | null) => {
  if (!url) return '/placeholder.png';
  const serverBaseUrl = (api.defaults.baseURL || '').replace('/api/v1', '');
  return url.startsWith('http') ? url : `${serverBaseUrl}${url}`;
};

const addToCart = () => {
  if (!product.value) return
  
  isAddingToCart.value = true
  
  try {
    cartStore.addItem({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image_url: product.value.image_url,
      description: product.value.description,
      stock_quantity: product.value.stock_quantity
    }, quantity.value)
    
    // Success feedback
    console.log(`Added ${quantity.value} ${product.value.name} to cart`)
  } catch (error) {
    console.error('Failed to add to cart:', error)
  } finally {
    isAddingToCart.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="text-lg">Chargement...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[400px]">
      <div class="text-red-600 text-lg mb-4">{{ error }}</div>
      <Button @click="goBack" variant="outline">
        Retour aux produits
      </Button>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="max-w-6xl mx-auto">
      <!-- Back Button -->
      <Button @click="goBack" variant="outline" class="mb-6">
        &larr; Retour aux produits
      </Button>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Product Image -->
        <div class="space-y-4">
          <Card class="overflow-hidden">
            <CardContent class="p-0">
              <img 
                :src="getImageUrl(product.image_url)" 
                :alt="product.name"
                class="w-full h-96 lg:h-[500px] object-cover"
              />
            </CardContent>
          </Card>
        </div>

        <!-- Product Information -->
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {{ product.name }}
            </h1>
            <p class="text-2xl font-semibold text-primary">
              {{ formatPrice(product.price) }}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-gray-700 leading-relaxed">
                {{ product.description }}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations produit</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <div class="flex justify-between">
                <span class="font-medium">ID Produit:</span>
                <span class="text-gray-600">#{{ product.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Prix:</span>
                <span class="text-primary font-semibold">{{ formatPrice(product.price) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Disponibilité:</span>
                <span :class="{
                  'text-green-600': product.stock_quantity > 0,
                  'text-red-600': product.stock_quantity === 0
                }" class="font-medium">
                  {{ product.stock_quantity > 0 ? 'En stock (' + product.stock_quantity + ')' : 'Rupture de stock' }}
                </span>
              </div>
            </CardContent>
          </Card>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <!-- Add to Cart Section -->
            <div class="flex gap-3 items-center">
              <div class="flex items-center border rounded-lg">
                <label class="px-3 py-2 text-sm font-medium">Qté:</label>
                <input 
                  v-model.number="quantity" 
                  type="number" 
                  min="1" 
                  :max="product.stock_quantity"
                  class="w-16 px-2 py-2 text-center border-l focus:outline-none"
                />
              </div>
              <Button 
                @click="addToCart" 
                :disabled="isAddingToCart || !product.is_active || product.stock_quantity === 0"
                class="flex-1" 
                size="lg"
              >
                <span v-if="isAddingToCart">Ajout...</span>
                <span v-else>Ajouter au panier</span>
              </Button>
            </div>
            
            <!-- Favorites Button (placeholder for Phase 2) -->
            <Button variant="outline" class="w-full" size="lg" disabled>
              Ajouter aux favoris
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
