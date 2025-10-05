<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click.self="$emit('close')">
    <div class="relative top-10 sm:top-20 mx-auto p-4 sm:p-5 border w-11/12 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white mb-10">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4 sm:mb-6">
          <h3 class="text-lg sm:text-xl font-medium text-gray-900">
            📦 Récapitulatif de Préparation - Commandes Payées
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 touch-manipulation p-2"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Date Filters -->
        <div class="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-end">
            <div class="flex-1 w-full sm:w-auto">
              <label class="block text-sm font-medium text-gray-700 mb-1">Date début</label>
              <input
                v-model="dateFrom"
                type="date"
                class="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div class="flex-1 w-full sm:w-auto">
              <label class="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
              <input
                v-model="dateTo"
                type="date"
                class="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <button
              @click="applyFilter"
              :disabled="filtering"
              class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation min-h-[44px] disabled:opacity-50"
            >
              {{ filtering ? 'Filtrage...' : 'Filtrer' }}
            </button>
            <button
              v-if="dateFrom || dateTo"
              @click="clearFilter"
              class="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation min-h-[44px]"
            >
              Effacer
            </button>
          </div>
        </div>

        <!-- Products List -->
        <div class="space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
          <div v-if="!localData.products.length" class="text-center py-8 text-gray-500">
            Aucun produit à préparer pour la période sélectionnée
          </div>
          
          <div
            v-for="product in localData.products"
            :key="product.product_id"
            class="bg-white border border-gray-200 rounded-lg p-3 sm:p-4"
          >
            <!-- Product Header -->
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="text-base sm:text-lg font-medium text-gray-900">
                  {{ product.product_name }}
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  {{ product.unique_customers }} client{{ product.unique_customers > 1 ? 's' : '' }}
                </p>
              </div>
              <div class="text-right">
                <div class="text-lg sm:text-xl font-bold text-green-600">
                  {{ product.total_quantity }} {{ product.unit || '' }}
                </div>
                <div class="text-xs sm:text-sm text-gray-500">
                  {{ product.order_count }} commande{{ product.order_count > 1 ? 's' : '' }}
                </div>
              </div>
            </div>

            <!-- Expandable Orders List -->
            <div class="border-t border-gray-100 pt-3">
              <button
                @click="toggleProduct(product.product_id)"
                class="w-full flex justify-between items-center text-sm text-gray-700 hover:text-gray-900 touch-manipulation py-2"
              >
                <span class="font-medium">
                  {{ expandedProducts.has(product.product_id) ? 'Masquer' : 'Afficher' }} les détails
                </span>
                <ChevronDown
                  :class="['w-5 h-5 transition-transform', {
                    'transform rotate-180': expandedProducts.has(product.product_id)
                  }]"
                />
              </button>

              <div v-if="expandedProducts.has(product.product_id)" class="mt-2 space-y-2">
                <div
                  v-for="order in product.orders"
                  :key="order.order_id"
                  class="flex justify-between items-center bg-gray-50 rounded px-3 py-2 text-xs sm:text-sm"
                >
                  <div class="flex-1">
                    <span class="font-medium text-gray-900">{{ order.order_reference }}</span>
                    <span class="text-gray-500 ml-2">{{ order.customer_name }}</span>
                    <div class="text-xs text-gray-400 mt-1">
                      {{ formatDate(order.created_at) }}
                    </div>
                  </div>
                  <div class="font-medium text-gray-900 ml-3">
                    {{ order.quantity }} {{ product.unit || '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex flex-col sm:flex-row justify-between gap-3 mt-6 pt-4 border-t">
          <button
            @click="printPreparation"
            class="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center touch-manipulation min-h-[44px]"
          >
            <Printer class="w-4 h-4 mr-2" />
            Imprimer
          </button>
          <button
            @click="$emit('close')"
            class="flex-1 sm:flex-none bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation min-h-[44px]"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X, ChevronDown, Printer } from 'lucide-vue-next'
import DeliveryPreparationService from '@/services/DeliveryPreparationService'
import type { PreparationSummaryResponse } from '@/types/delivery'

interface Props {
  data: PreparationSummaryResponse
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  refresh: []
}>()

const dateFrom = ref('')
const dateTo = ref('')
const filtering = ref(false)
const expandedProducts = ref(new Set<number>())
const localData = reactive<PreparationSummaryResponse>(JSON.parse(JSON.stringify(props.data)))

const toggleProduct = (productId: number) => {
  if (expandedProducts.value.has(productId)) {
    expandedProducts.value.delete(productId)
  } else {
    expandedProducts.value.add(productId)
  }
}

const applyFilter = async () => {
  filtering.value = true
  try {
    const newData = await DeliveryPreparationService.getPreparationSummary(
      dateFrom.value || undefined,
      dateTo.value || undefined
    )
    
    // Update local data
    Object.assign(localData, newData)
    
    // Clear expanded products
    expandedProducts.value.clear()
  } catch (error) {
    console.error('Error applying filter:', error)
  } finally {
    filtering.value = false
  }
}

const clearFilter = async () => {
  dateFrom.value = ''
  dateTo.value = ''
  
  // Reload without filters
  filtering.value = true
  try {
    const newData = await DeliveryPreparationService.getPreparationSummary()
    Object.assign(localData, newData)
    expandedProducts.value.clear()
  } catch (error) {
    console.error('Error clearing filter:', error)
  } finally {
    filtering.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const printPreparation = () => {
  window.print()
}
</script>

<style scoped>
@media print {
  .fixed {
    position: static;
  }
  button {
    display: none !important;
  }
  .bg-gray-50 {
    background-color: white !important;
  }
}
</style>
