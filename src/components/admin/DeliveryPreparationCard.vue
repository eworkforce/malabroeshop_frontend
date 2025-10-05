<template>
  <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-4 sm:p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <Package class="w-5 h-5 mr-2 text-green-600" />
        📦 Préparation Livraison
      </h3>
      <button
        @click="loadData"
        :disabled="loading"
        class="text-green-600 hover:text-green-700 transition-colors"
        title="Actualiser"
      >
        <RefreshCw :class="['w-5 h-5', { 'animate-spin': loading }]" />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !data" class="text-center py-4">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <p class="mt-2 text-sm text-gray-600">Chargement...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-4">
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button
        @click="loadData"
        class="mt-2 text-sm text-green-600 hover:text-green-700 underline"
      >
        Réessayer
      </button>
    </div>

    <!-- Summary Stats -->
    <div v-else-if="data" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div class="bg-white rounded-lg p-3 sm:p-4 border border-green-100">
          <div class="text-xs sm:text-sm text-gray-600 mb-1">Commandes payées</div>
          <div class="text-xl sm:text-2xl font-bold text-green-600">
            {{ data.summary.total_paid_orders }}
          </div>
        </div>
        <div class="bg-white rounded-lg p-3 sm:p-4 border border-blue-100">
          <div class="text-xs sm:text-sm text-gray-600 mb-1">Produits à préparer</div>
          <div class="text-xl sm:text-2xl font-bold text-blue-600">
            {{ data.summary.total_unique_products }}
          </div>
        </div>
        <div class="bg-white rounded-lg p-3 sm:p-4 border border-purple-100">
          <div class="text-xs sm:text-sm text-gray-600 mb-1">Revenus</div>
          <div class="text-xl sm:text-2xl font-bold text-purple-600">
            {{ formatCurrency(data.summary.total_revenue) }}
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          @click="showModal = true"
          class="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center touch-manipulation min-h-[44px]"
        >
          <FileText class="w-4 h-4 mr-2" />
          Voir Détails Complets
        </button>
        <button
          @click="exportToCSV"
          :disabled="!data.products.length"
          class="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download class="w-4 h-4 mr-2" />
          Exporter CSV
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="data.summary.total_paid_orders === 0" class="text-center py-4 text-gray-500 text-sm">
        Aucune commande payée pour le moment
      </div>
    </div>

    <!-- Detailed Modal -->
    <DeliveryPreparationModal
      v-if="showModal && data"
      :data="data"
      @close="showModal = false"
      @refresh="loadData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Package, RefreshCw, FileText, Download } from 'lucide-vue-next'
import DeliveryPreparationService from '@/services/DeliveryPreparationService'
import DeliveryPreparationModal from './DeliveryPreparationModal.vue'
import type { PreparationSummaryResponse } from '@/types/delivery'

const data = ref<PreparationSummaryResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const showModal = ref(false)

const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    data.value = await DeliveryPreparationService.getPreparationSummary()
  } catch (err: any) {
    console.error('Error loading preparation summary:', err)
    error.value = 'Erreur lors du chargement des données. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount).replace('XOF', 'FCFA')
}

const exportToCSV = () => {
  if (!data.value || !data.value.products.length) return
  
  const rows = [
    ['Produit', 'Quantité Totale', 'Unité', 'Nombre Commandes', 'Clients Uniques']
  ]
  
  data.value.products.forEach(product => {
    rows.push([
      product.product_name,
      product.total_quantity.toString(),
      product.unit || '',
      product.order_count.toString(),
      product.unique_customers.toString()
    ])
  })
  
  const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `preparation-livraison-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

onMounted(() => {
  loadData()
})
</script>
