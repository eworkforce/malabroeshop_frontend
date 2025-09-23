<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Gestion des Catégories</h2>
      <button @click="openModal()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
        <Plus class="w-4 h-4 mr-2" />
        Ajouter une Catégorie
      </button>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="category in categories" :key="category.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ category.is_active ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button @click="openModal(category)" class="text-indigo-600 hover:text-indigo-900 transition-colors"><Edit class="w-4 h-4" /></button>
                  <button @click="confirmDelete(category)" class="text-red-600 hover:text-red-900 transition-colors"><Trash2 class="w-4 h-4" /></button>
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
            <h3 class="text-lg font-medium text-gray-900">{{ editingCategory ? 'Modifier la Catégorie' : 'Ajouter une Catégorie' }}</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600"><X class="w-6 h-6" /></button>
          </div>
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input v-model="form.name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="form.description" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
            </div>
            <div class="flex items-center">
              <input v-model="form.is_active" type="checkbox" class="h-4 w-4 text-green-600 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-900">Active</label>
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
import CategoryService, { type Category } from '@/services/CategoryService';

const categories = ref<Category[]>([]);
const showModal = ref(false);
const editingCategory = ref<Category | null>(null);
const saving = ref(false);

const form = ref({
  name: '',
  description: '',
  is_active: true,
});

const fetchCategories = async () => {
  try {
    categories.value = await CategoryService.getCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const openModal = (category: Category | null = null) => {
  if (category) {
    editingCategory.value = category;
    form.value = { 
      name: category.name, 
      description: category.description || '', 
      is_active: category.is_active 
    };
  } else {
    editingCategory.value = null;
    form.value = { name: '', description: '', is_active: true };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveCategory = async () => {
  saving.value = true;
  try {
    const categoryData = { name: form.value.name, description: form.value.description, is_active: form.value.is_active };
    if (editingCategory.value) {
      await CategoryService.updateCategory(editingCategory.value.id, categoryData);
    } else {
      await CategoryService.createCategory(categoryData);
    }
    await fetchCategories();
    closeModal();
  } catch (error) {
    console.error('Error saving category:', error);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (category: Category) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
    try {
      await CategoryService.deleteCategory(category.id);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
