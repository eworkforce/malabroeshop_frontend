<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Gestion des Unités de Mesure</h2>
      <button @click="openModal()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
        <Plus class="w-4 h-4 mr-2" />
        Ajouter une Unité
      </button>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abréviation</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="unit in units" :key="unit.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ unit.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ unit.abbreviation }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button @click="openModal(unit)" class="text-indigo-600 hover:text-indigo-900 transition-colors"><Edit class="w-4 h-4" /></button>
                  <button @click="confirmDelete(unit)" class="text-red-600 hover:text-red-900 transition-colors"><Trash2 class="w-4 h-4" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">{{ editingUnit ? 'Modifier l\'Unité' : 'Ajouter une Unité' }}</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600"><X class="w-6 h-6" /></button>
          </div>
          <form @submit.prevent="saveUnit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input v-model="form.name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Abréviation</label>
              <input v-model="form.abbreviation" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">Annuler</button>
              <button type="submit" :disabled="saving" class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md disabled:opacity-50">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, Edit, Trash2, X } from 'lucide-vue-next';
import UnitOfMeasureService, { UnitOfMeasure } from '@/services/UnitOfMeasureService';

const units = ref<UnitOfMeasure[]>([]);
const showModal = ref(false);
const editingUnit = ref<UnitOfMeasure | null>(null);
const saving = ref(false);

const form = ref({
  name: '',
  abbreviation: '',
});

const fetchUnits = async () => {
  try {
    units.value = await UnitOfMeasureService.getUnitsOfMeasure();
  } catch (error) {
    console.error('Error fetching units:', error);
  }
};

const openModal = (unit: UnitOfMeasure | null = null) => {
  if (unit) {
    editingUnit.value = unit;
    form.value = { ...unit };
  } else {
    editingUnit.value = null;
    form.value = { name: '', abbreviation: '' };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveUnit = async () => {
  saving.value = true;
  try {
    const unitData = { name: form.value.name, abbreviation: form.value.abbreviation };
    if (editingUnit.value) {
      await UnitOfMeasureService.updateUnitOfMeasure(editingUnit.value.id, unitData);
    } else {
      await UnitOfMeasureService.createUnitOfMeasure(unitData);
    }
    await fetchUnits();
    closeModal();
  } catch (error) {
    console.error('Error saving unit:', error);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (unit: UnitOfMeasure) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'unité "${unit.name}" ?`)) {
    try {
      await UnitOfMeasureService.deleteUnitOfMeasure(unit.id);
      await fetchUnits();
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  }
};

onMounted(() => {
  fetchUnits();
});
</script>
