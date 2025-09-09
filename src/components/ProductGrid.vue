<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import ProductService, { type Product } from '@/services/ProductService'

const products = ref<Product[]>([])

onMounted(async () => {
  try {
    products.value = await ProductService.getProducts()
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
})
</script>

<template>
  <div>
    <h2 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Nos Produits</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>
