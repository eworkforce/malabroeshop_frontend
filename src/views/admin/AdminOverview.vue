<template>
  <div class="space-y-4 sm:space-y-6">
    <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <div
        v-for="metric in metrics"
        :key="metric.label"
        class="bg-white rounded-lg shadow p-4 sm:p-6"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div :class="['w-8 h-8 rounded-md flex items-center justify-center', metric.bgColor]">
              <component :is="metric.icon" :class="['w-4 h-4 sm:w-5 sm:h-5', metric.iconColor]" />
            </div>
          </div>
          <div class="ml-3 sm:ml-5 w-0 flex-1">
            <dl>
              <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">{{ metric.label }}</dt>
              <dd class="text-base sm:text-lg font-medium text-gray-900">{{ metric.value }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-3 py-4 sm:px-4 sm:py-5 lg:p-6">
        <h3 class="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4">Commandes Récentes</h3>
        
        <!-- Mobile Card View -->
        <div class="block sm:hidden space-y-3">
          <div v-for="order in recentOrders" :key="order.id" class="bg-gray-50 rounded-lg p-3">
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ order.order_reference }}</p>
                <p class="text-xs text-gray-500">{{ order.customer_name }}</p>
              </div>
              <span :class="getStatusBadgeClass(order.status)">{{ getStatusText(order.status) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <p class="text-sm font-medium text-gray-900">{{ formatCurrency(order.total_amount) }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(order.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.order_reference }}</td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.customer_name }}</td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(order.total_amount) }}</td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(order.status)">{{ getStatusText(order.status) }}</span>
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(order.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ShoppingBag, Users, DollarSign, TrendingUp } from 'lucide-vue-next';
import api from '@/services/api';

const dashboardData = ref<any>(null);
const loading = ref(true);

const metrics = computed(() => {
  if (!dashboardData.value) return [];
  const data = dashboardData.value.metrics;
  return [
    { label: 'Total Commandes', value: data.total_orders, icon: ShoppingBag, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'En Attente', value: data.pending_orders, icon: TrendingUp, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { label: 'Utilisateurs', value: data.total_users, icon: Users, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'Revenus', value: formatCurrency(data.total_revenue), icon: DollarSign, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];
});

const recentOrders = computed(() => {
  return dashboardData.value?.recent_orders || [];
});

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    const response = await api.get('/admin/dashboard');
    dashboardData.value = response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount).replace('XOF', 'FCFA');
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = { 'pending': 'En attente', 'paid': 'Payé', 'shipped': 'Expédié', 'delivered': 'Livré', 'cancelled': 'Annulé' };
  return statusMap[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const statusClasses: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'paid': 'bg-green-100 text-green-800',
    'shipped': 'bg-blue-100 text-blue-800',
    'delivered': 'bg-purple-100 text-purple-800',
    'cancelled': 'bg-red-100 text-red-800',
  };
  return `${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;
};

onMounted(() => {
  fetchDashboardData();
});
</script>
