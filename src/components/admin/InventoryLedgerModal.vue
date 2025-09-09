<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click.self="close">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Historique du stock pour : {{ productName }}</h3>
          <button @click="close" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        <div v-if="loading" class="text-center py-8">
          <p>Chargement de l'historique...</p>
        </div>
        <div v-else-if="error" class="text-center py-8 text-red-500">
          <p>{{ error }}</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Changement</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Nouveau Stock</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="entry in ledgerEntries" :key="entry.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(entry.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ entry.change_type }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right" :class="entry.quantity_change > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ entry.quantity_change > 0 ? '+' : '' }}{{ entry.quantity_change }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{{ entry.new_quantity }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ entry.user?.email || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ entry.notes || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import api from '@/services/api';

const props = defineProps({
  show: Boolean,
  productId: Number,
  productName: String,
});

const emit = defineEmits(['close']);

const ledgerEntries = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchLedgerHistory = async (productId: number) => {
  if (!productId) return;
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/products/${productId}/ledger`);
    ledgerEntries.value = response.data;
  } catch (err) {
    console.error('Error fetching ledger history:', err);
    error.value = "Impossible de charger l'historique du stock.";
  } finally {
    loading.value = false;
  }
};

watch(() => props.productId, (newVal) => {
  if (newVal) {
    fetchLedgerHistory(newVal);
  }
}, { immediate: true });

const close = () => {
  emit('close');
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};
</script>
