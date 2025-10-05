<template>
  <div>
    <!-- Delivery Preparation Card -->
    <DeliveryPreparationCard />
    
    <div class="bg-white shadow rounded-lg">
      <div class="px-3 py-4 sm:px-4 sm:py-5 lg:p-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h3 class="text-base sm:text-lg leading-6 font-medium text-gray-900">Gestion des Commandes</h3>
        
        <!-- Filters -->
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            v-model="statusFilter"
            @change="fetchOrders"
            class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="paid">Payé</option>
            <option value="shipped">Expédié</option>
            <option value="delivered">Livré</option>
            <option value="cancelled">Annulé</option>
          </select>
          
          <button
            @click="fetchOrders"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation min-h-[44px]"
          >
            Actualiser
          </button>
        </div>
      </div>

      <!-- Mobile Card View -->
      <div class="block sm:hidden space-y-3">
        <div v-for="order in orders" :key="order.id" class="bg-gray-50 rounded-lg p-3">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ order.order_reference }}</p>
              <p class="text-xs text-gray-500">{{ order.customer_name }}</p>
              <p class="text-xs text-gray-500">{{ order.customer_email }}</p>
            </div>
            <span :class="getStatusBadgeClass(order.status)">{{ getStatusText(order.status) }}</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <p class="text-sm font-medium text-gray-900">{{ formatCurrency(order.total_amount) }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(order.created_at) }}</p>
          </div>
          <button
            @click="viewOrder(order)"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors touch-manipulation"
          >
            Voir détails
          </button>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Référence
              </th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ order.order_reference }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.customer_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.customer_email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(order.total_amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewOrder(order)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Voir
                  </button>
                  <button
                    @click="openStatusModal(order)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Modifier
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-sm text-gray-600">Chargement des commandes...</p>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && orders.length === 0" class="text-center py-8">
        <p class="text-gray-500">Aucune commande trouvée.</p>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Détails de la commande {{ selectedOrder.order_reference }}
            </h3>
            <button
              @click="selectedOrder = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <X class="w-6 h-6" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Client</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedOrder.customer_name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedOrder.customer_email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Montant Total</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatCurrency(selectedOrder.total_amount) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Statut</label>
                <span :class="getStatusBadgeClass(selectedOrder.status)">
                  {{ getStatusText(selectedOrder.status) }}
                </span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Adresse de livraison</label>
              <p class="mt-1 text-sm text-gray-900">
                {{ selectedOrder.shipping_address }}<br>
                {{ selectedOrder.shipping_city }}, {{ selectedOrder.shipping_country }}
              </p>
            </div>

            <!-- Order Items -->
            <div v-if="selectedOrder.order_items && selectedOrder.order_items.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-3">Articles commandés</label>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="space-y-3">
                  <div
                    v-for="item in selectedOrder.order_items"
                    :key="item.id"
                    class="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div class="flex items-center space-x-3">
                      <img
                        v-if="item.product && item.product.image_url"
                        :src="getImageUrl(item.product.image_url)"
                        :alt="item.product_name"
                        class="w-10 h-10 object-cover rounded-md"
                      />
                      <div class="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center" v-else>
                        <span class="text-gray-400 text-xs">IMG</span>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ item.product_name }}</p>
                        <p class="text-xs text-gray-500">{{ formatCurrency(item.product_price) }} × {{ item.quantity }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(item.subtotal) }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Order Summary -->
                <div class="mt-4 pt-3 border-t border-gray-300">
                  <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Sous-total</span>
                    <span>{{ formatCurrency(getSubtotal()) }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Livraison</span>
                    <span>{{ formatCurrency(getDeliveryFee()) }}</span>
                  </div>
                  <div class="flex justify-between text-base font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{{ formatCurrency(selectedOrder.total_amount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div v-if="statusModal.show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Modifier le statut de la commande
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nouveau statut</label>
              <select
                v-model="statusModal.newStatus"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="pending">En attente</option>
                <option value="paid">Payé</option>
                <option value="shipped">Expédié</option>
                <option value="delivered">Livré</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Notes de paiement (optionnel)</label>
              <textarea
                v-model="statusModal.paymentNotes"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Notes sur la vérification du paiement..."
              ></textarea>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="statusModal.show = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Annuler
            </button>
            <button
              @click="updateOrderStatus"
              :disabled="statusModal.updating"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
            >
              {{ statusModal.updating ? 'Mise à jour...' : 'Mettre à jour' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import api from '@/services/api'
import DeliveryPreparationCard from './DeliveryPreparationCard.vue'

const orders = ref<any[]>([])
const loading = ref(true)
const statusFilter = ref('')
const selectedOrder = ref<any>(null)

const statusModal = ref({
  show: false,
  order: null as any,
  newStatus: '',
  paymentNotes: '',
  updating: false
})

const fetchOrders = async () => {
  try {
    loading.value = true
    const params = statusFilter.value ? { status: statusFilter.value } : {}
    const response = await api.get('/admin/orders', { params })
    orders.value = response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
}

const viewOrder = async (order: any) => {
  try {
    const response = await api.get(`/admin/orders/${order.id}`)
    selectedOrder.value = response.data
  } catch (error) {
    console.error('Error fetching order details:', error)
  }
}

const openStatusModal = (order: any) => {
  statusModal.value = {
    show: true,
    order,
    newStatus: order.status,
    paymentNotes: '',
    updating: false
  }
}

const updateOrderStatus = async () => {
  try {
    statusModal.value.updating = true
    
    const data: any = { status: statusModal.value.newStatus }
    if (statusModal.value.paymentNotes) {
      data.payment_notes = statusModal.value.paymentNotes
    }
    
    await api.put(`/admin/orders/${statusModal.value.order.id}/status`, data)
    
    // Update the order in the list
    const orderIndex = orders.value.findIndex(o => o.id === statusModal.value.order.id)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = statusModal.value.newStatus
    }
    
    statusModal.value.show = false
  } catch (error) {
    console.error('Error updating order status:', error)
  } finally {
    statusModal.value.updating = false
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount).replace('XOF', 'FCFA')
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

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'En attente',
    'paid': 'Payé',
    'shipped': 'Expédié',
    'delivered': 'Livré',
    'cancelled': 'Annulé'
  }
  return statusMap[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  const statusClasses: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'paid': 'bg-green-100 text-green-800',
    'shipped': 'bg-blue-100 text-blue-800',
    'delivered': 'bg-purple-100 text-purple-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return `${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`
}

// Get proper image URL with fallback
const getImageUrl = (url: string | null): string => {
  if (!url) return '/placeholder.png'
  const serverBaseUrl = (api.defaults.baseURL || '').replace('/api/v1', '')
  return url.startsWith('http') ? url : `${serverBaseUrl}${url}`
}

// Calculate subtotal from order items
const getSubtotal = (): number => {
  if (!selectedOrder.value?.order_items) return 0
  return selectedOrder.value.order_items.reduce((sum: number, item: any) => sum + item.subtotal, 0)
}

// Get delivery fee (2000 F CFA standard)
const getDeliveryFee = (): number => {
  return selectedOrder.value?.order_items?.length > 0 ? 2000 : 0
}

onMounted(() => {
  fetchOrders()
})
</script>
