<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Vérification des Paiements</h3>
        
        <button
          @click="fetchPendingOrders"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Actualiser
        </button>
      </div>

      <!-- Pending Orders for Payment Verification -->
      <div class="mb-6">
        <h4 class="text-md font-medium text-gray-900 mb-4">Commandes en attente de paiement</h4>
        
        <div class="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[240px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in pendingOrders" :key="order.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ order.order_reference }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.customer_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.customer_email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {{ formatCurrency(order.total_amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex flex-nowrap space-x-2">
                    <button
                      @click="openPaymentModal(order, 'paid')"
                      class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      Confirmer Paiement
                    </button>
                    <button
                      @click="openPaymentModal(order, 'cancelled')"
                      class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      Annuler
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State for Pending Orders -->
        <div v-if="!loading && pendingOrders.length === 0" class="text-center py-8">
          <div class="text-green-600 mb-2">
            <CheckCircle class="w-12 h-12 mx-auto" />
          </div>
          <p class="text-gray-500">Aucune commande en attente de paiement.</p>
        </div>
      </div>

      <!-- Payment Instructions -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="text-sm font-medium text-blue-900 mb-2">Instructions de vérification</h4>
        <ul class="text-sm text-blue-800 space-y-1">
          <li>• Vérifiez votre application Wave pour les paiements reçus</li>
          <li>• Comparez le montant et la référence de commande</li>
          <li>• Confirmez le paiement si tout correspond</li>
          <li>• Ajoutez des notes si nécessaire pour le suivi</li>
        </ul>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-sm text-gray-600">Chargement des commandes...</p>
      </div>
    </div>

    <!-- Payment Verification Modal -->
    <div v-if="paymentModal.show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ paymentModal.action === 'paid' ? 'Confirmer le paiement' : 'Annuler la commande' }}
          </h3>
          
          <div class="space-y-4">
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-sm font-medium text-gray-700">Référence: {{ paymentModal.order?.order_reference }}</p>
              <p class="text-sm text-gray-600">Client: {{ paymentModal.order?.customer_name }}</p>
              <p class="text-sm text-gray-600">Montant: {{ formatCurrency(paymentModal.order?.total_amount || 0) }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ paymentModal.action === 'paid' ? 'Notes de vérification' : 'Raison de l\'annulation' }}
              </label>
              <textarea
                v-model="paymentModal.notes"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                :placeholder="paymentModal.action === 'paid' ? 'Paiement vérifié via Wave...' : 'Raison de l\'annulation...'"
              ></textarea>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="paymentModal.show = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Annuler
            </button>
            <button
              @click="updatePaymentStatus"
              :disabled="paymentModal.updating"
              :class="[
                'px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50',
                paymentModal.action === 'paid' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              ]"
            >
              {{ paymentModal.updating ? 'Mise à jour...' : (paymentModal.action === 'paid' ? 'Confirmer' : 'Annuler') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CheckCircle } from 'lucide-vue-next'
import api from '@/services/api'

const pendingOrders = ref<any[]>([])
const loading = ref(true)

const paymentModal = ref({
  show: false,
  order: null as any,
  action: 'paid' as 'paid' | 'cancelled',
  notes: '',
  updating: false
})

const fetchPendingOrders = async () => {
  try {
    loading.value = true
    const response = await api.get('/admin/pending-orders')
    pendingOrders.value = response.data
  } catch (error) {
    console.error('Error fetching pending orders:', error)
  } finally {
    loading.value = false
  }
}

const openPaymentModal = (order: any, action: 'paid' | 'cancelled') => {
  paymentModal.value = {
    show: true,
    order,
    action,
    notes: '',
    updating: false
  }
}

const updatePaymentStatus = async () => {
  try {
    paymentModal.value.updating = true
    
    // Create query parameters for the PUT request
    const params = new URLSearchParams()
    params.append('status', paymentModal.value.action)
    if (paymentModal.value.notes) {
      params.append('payment_notes', paymentModal.value.notes)
    }
    
    await api.put(`/admin/orders/${paymentModal.value.order.id}/status?${params.toString()}`)
    
    // Remove the order from pending list
    const orderIndex = pendingOrders.value.findIndex(o => o.id === paymentModal.value.order.id)
    if (orderIndex !== -1) {
      pendingOrders.value.splice(orderIndex, 1)
    }
    
    paymentModal.value.show = false
    
    // Show success message
    console.log(`Order ${paymentModal.value.order.order_reference} status updated to ${paymentModal.value.action}`)
  } catch (error) {
    console.error('Error updating payment status:', error)
    alert('Erreur lors de la mise à jour du statut. Veuillez réessayer.')
  } finally {
    paymentModal.value.updating = false
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

onMounted(() => {
  fetchPendingOrders()
})
</script>
