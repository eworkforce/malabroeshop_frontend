<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Rapports d'Inventaire</h1>
        <p class="mt-2 text-gray-600">Analyse complète de votre stock et mouvements d'inventaire</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <div class="flex">
          <AlertCircle class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Erreur</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div v-if="summary" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Package class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Produits</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ summary.total_products }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <DollarSign class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Valeur du Stock</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ formatCurrency(summary.total_stock_value) }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <AlertTriangle class="h-6 w-6 text-yellow-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Stock Faible</dt>
                  <dd class="text-lg font-medium text-yellow-600">{{ summary.low_stock_count }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <XCircle class="h-6 w-6 text-red-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Hors Stock</dt>
                  <dd class="text-lg font-medium text-red-600">{{ summary.out_of_stock_count }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Tables Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Stock Distribution Chart -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Distribution des Niveaux de Stock</h3>
          <div v-if="stockDistribution" class="space-y-3">
            <div v-for="item in stockDistribution.distribution" :key="item.range" class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ item.range }}</span>
              <div class="flex items-center">
                <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    class="bg-green-600 h-2 rounded-full" 
                    :style="{ width: getPercentage(item.count, getTotalProducts()) + '%' }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 w-8">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Products by Value -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Top Produits par Valeur</h3>
          <div v-if="topProducts" class="space-y-3">
            <div v-for="product in topProducts" :key="product.id" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
                <p class="text-xs text-gray-500">{{ product.stock_quantity }} unités × {{ formatCurrency(product.price) }}</p>
              </div>
              <span class="text-sm font-medium text-green-600">{{ formatCurrency(product.stock_value) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts and Recent Movements -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Low Stock Alerts -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Alertes Stock Faible</h3>
            <button 
              @click="refreshLowStock"
              class="text-sm text-green-600 hover:text-green-500"
            >
              <RefreshCw class="h-4 w-4" />
            </button>
          </div>
          <div v-if="lowStockProducts.length === 0" class="text-center py-8">
            <CheckCircle class="mx-auto h-12 w-12 text-green-400" />
            <p class="mt-2 text-sm text-gray-500">Aucun produit en stock faible</p>
          </div>
          <div v-else class="space-y-3 max-h-64 overflow-y-auto">
            <div v-for="product in lowStockProducts" :key="product.id" class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                <p class="text-xs text-gray-500">Seuil: {{ product.low_stock_threshold }}</p>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {{ product.stock_quantity }} restant{{ product.stock_quantity > 1 ? 's' : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Recent Stock Movements -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Mouvements Récents</h3>
            <select v-model="movementDays" @change="refreshMovements" class="text-sm border-gray-300 rounded-md">
              <option value="7">7 derniers jours</option>
              <option value="14">14 derniers jours</option>
              <option value="30">30 derniers jours</option>
            </select>
          </div>
          <div v-if="recentMovements.length === 0" class="text-center py-8">
            <Activity class="mx-auto h-12 w-12 text-gray-400" />
            <p class="mt-2 text-sm text-gray-500">Aucun mouvement récent</p>
          </div>
          <div v-else class="space-y-3 max-h-64 overflow-y-auto">
            <div v-for="movement in recentMovements" :key="movement.id" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ movement.change_type }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(movement.created_at) }}</p>
              </div>
              <div class="text-right">
                <span :class="movement.quantity_change > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                  {{ movement.quantity_change > 0 ? '+' : '' }}{{ movement.quantity_change }}
                </span>
                <p class="text-xs text-gray-500">→ {{ movement.new_quantity }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Overview -->
      <div v-if="summary && summary.categories.length > 0" class="mt-8 bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Aperçu par Catégorie</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Total</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="category in summary.categories" :key="category.name">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.product_count }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.total_stock }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  XCircle, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Activity
} from 'lucide-vue-next'
import axios from 'axios'

// Reactive data
const loading = ref(true)
const error = ref<string | null>(null)
const summary = ref<any>(null)
const stockDistribution = ref<any>(null)
const topProducts = ref<any[]>([])
const lowStockProducts = ref<any[]>([])
const recentMovements = ref<any[]>([])
const movementDays = ref(7)

// API base URL
const API_BASE = 'http://localhost:8000/api/v1'

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

// API headers
const getHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json'
})

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPercentage = (value: number, total: number) => {
  return total > 0 ? Math.round((value / total) * 100) : 0
}

const getTotalProducts = () => {
  return stockDistribution.value?.distribution.reduce((sum: number, item: any) => sum + item.count, 0) || 0
}

// API calls
const fetchSummary = async () => {
  try {
    const response = await axios.get(`${API_BASE}/inventory-reports/summary`, {
      headers: getHeaders()
    })
    summary.value = response.data
  } catch (err) {
    console.error('Error fetching summary:', err)
    throw err
  }
}

const fetchStockDistribution = async () => {
  try {
    const response = await axios.get(`${API_BASE}/inventory-reports/stock-levels`, {
      headers: getHeaders()
    })
    stockDistribution.value = response.data
  } catch (err) {
    console.error('Error fetching stock distribution:', err)
    throw err
  }
}

const fetchTopProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE}/inventory-reports/top-products?limit=5`, {
      headers: getHeaders()
    })
    topProducts.value = response.data
  } catch (err) {
    console.error('Error fetching top products:', err)
    throw err
  }
}

const fetchLowStockProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE}/inventory-reports/low-stock?limit=10`, {
      headers: getHeaders()
    })
    lowStockProducts.value = response.data
  } catch (err) {
    console.error('Error fetching low stock products:', err)
    throw err
  }
}

const fetchRecentMovements = async () => {
  try {
    const response = await axios.get(`${API_BASE}/inventory-reports/stock-movements?days=${movementDays.value}&limit=10`, {
      headers: getHeaders()
    })
    recentMovements.value = response.data
  } catch (err) {
    console.error('Error fetching recent movements:', err)
    throw err
  }
}

// Refresh functions
const refreshLowStock = async () => {
  await fetchLowStockProducts()
}

const refreshMovements = async () => {
  await fetchRecentMovements()
}

// Load all data
const loadAllData = async () => {
  try {
    loading.value = true
    error.value = null
    
    await Promise.all([
      fetchSummary(),
      fetchStockDistribution(),
      fetchTopProducts(),
      fetchLowStockProducts(),
      fetchRecentMovements()
    ])
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Erreur lors du chargement des données'
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  loadAllData()
})
</script>
