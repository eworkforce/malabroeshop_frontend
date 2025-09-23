<template>
  <div class="space-y-6">
    <!-- Product Management Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
      <button
        @click="showCreateProduct = true"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
      >
        <Plus class="w-4 h-4 mr-2" />
        Ajouter un Produit
      </button>
    </div>

    <!-- Product Search and Filters -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="productSearch"
            type="text"
            placeholder="Rechercher des produits..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div class="flex gap-2">
          <select
            v-model="productFilter"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Tous les produits</option>
            <option value="active">Produits actifs</option>
            <option value="inactive">Produits inactifs</option>
            <option value="low_stock">Stock faible</option>
          </select>
          <button
            @click="refreshProducts"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition-colors"
          >
            <RefreshCw class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in filteredProducts" :key="product.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <img :src="getImageUrl(product.image_url)" :alt="product.name" class="h-12 w-12 rounded-lg object-cover" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">{{ product.category?.name || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(product.price) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.unit_of_measure?.name || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span :class="getStockBadgeClass(product)">{{ product.stock_quantity ?? 'N/A' }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ product.is_active ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button @click="showHistory(product)" class="text-blue-600 hover:text-blue-900 transition-colors">
                    <History class="w-4 h-4" />
                  </button>
                  <button @click="editProduct(product)" class="text-indigo-600 hover:text-indigo-900 transition-colors">
                    <Edit class="w-4 h-4" />
                  </button>
                  <button @click="confirmDeleteProduct(product)" class="text-red-600 hover:text-red-900 transition-colors">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <Package class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun produit trouvé</h3>
          <p class="mt-1 text-sm text-gray-500">Commencez par ajouter un nouveau produit.</p>
        </div>
      </div>
    </div>

    <!-- Product Creation Modal -->
    <InventoryLedgerModal 
      :show="showHistoryModal" 
      :product-id="selectedProductForHistory?.id" 
      :product-name="selectedProductForHistory?.name" 
      @close="showHistoryModal = false" 
    />

    <div v-if="showCreateProduct" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">{{ editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit' }}</h3>
            <button @click="closeProductModal" class="text-gray-400 hover:text-gray-600"><X class="w-6 h-6" /></button>
          </div>
          <form @submit.prevent="saveProduct" class="space-y-4">
            <!-- Form fields will be updated in a later step -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom du produit</label>
              <input v-model="productForm.name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="productForm.description" required rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Prix (FCFA)</label>
              <input v-model="productForm.price" type="number" required min="0" step="0.01" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Catégorie</label>
              <select v-model="productForm.category_id" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option :value="null">Sélectionner une catégorie</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Unité de Mesure</label>
              <select v-model="productForm.unit_of_measure_id" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option :value="null">Sélectionner une unité</option>
                <option v-for="unit in unitsOfMeasure" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Stock</label>
                <input v-model="productForm.stock_quantity" type="number" min="0" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Seuil de stock bas</label>
                <input v-model="productForm.low_stock_threshold" type="number" min="0" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <div v-if="editingProduct">
              <label class="block text-sm font-medium text-gray-700">Raison de la modification du stock (si modifié)</label>
              <textarea v-model="productForm.notes" rows="2" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Image du produit</label>
              <input type="file" @change="handleImageUpload" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
              <div v-if="imagePreviewUrl" class="mt-4">
                <p class="text-sm text-gray-500">Aperçu :</p>
                <img :src="imagePreviewUrl" alt="Aperçu de l'image" class="h-20 w-20 rounded-lg object-cover"/>
              </div>
              <div v-else-if="productForm.image_url" class="mt-4">
                <p class="text-sm text-gray-500">Image actuelle :</p>
                <img :src="getImageUrl(productForm.image_url)" alt="Image actuelle" class="h-20 w-20 rounded-lg object-cover"/>
              </div>
            </div>
            <div class="flex items-center">
              <input v-model="productForm.is_active" type="checkbox" class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-900">Produit actif</label>
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeProductModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">Annuler</button>
              <button type="submit" :disabled="productSaving" class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50">{{ productSaving ? 'Enregistrement...' : (editingProduct ? 'Modifier' : 'Ajouter') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Plus, RefreshCw, Edit, Trash2, Package, X, History } from 'lucide-vue-next';
import InventoryLedgerModal from '@/components/admin/InventoryLedgerModal.vue';
import api from '@/services/api';
import CategoryService, { type Category } from '@/services/CategoryService';
import UnitOfMeasureService, { type UnitOfMeasure } from '@/services/UnitOfMeasureService';

const products = ref<any[]>([]);
const categories = ref<Category[]>([]);
const unitsOfMeasure = ref<UnitOfMeasure[]>([]);
const productSearch = ref('');
const productFilter = ref('all');
const showCreateProduct = ref(false);
const editingProduct = ref<any>(null);
const productLoading = ref(false);
const productSaving = ref(false);
const showHistoryModal = ref(false);
const selectedProductForHistory = ref<any>(null);

const productForm = ref({
  id: null as number | null,
  name: '',
  description: '',
  price: 0,
  category_id: null as number | null,
  unit_of_measure_id: null as number | null,
  image_url: '',
  stock_quantity: 0,
  low_stock_threshold: 10,
  is_active: true,
  notes: ''
});

const productImageFile = ref<File | null>(null);
const imagePreviewUrl = ref<string | null>(null);

const filteredProducts = computed(() => {
  let filtered = products.value;
  if (productSearch.value) {
    const search = productSearch.value.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search) || p.category?.name.toLowerCase().includes(search));
  }
  switch (productFilter.value) {
    case 'active': return filtered.filter(p => p.is_active);
    case 'inactive': return filtered.filter(p => !p.is_active);
    case 'low_stock': return filtered.filter(p => (p.stock_quantity || 0) <= (p.low_stock_threshold || 10));
    default: return filtered;
  }
});

const fetchProducts = async () => {
  try {
    productLoading.value = true;
    const response = await api.get('/products/');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    productLoading.value = false;
  }
};

const refreshProducts = () => fetchProducts();

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    productImageFile.value = file;
    imagePreviewUrl.value = URL.createObjectURL(file);
  } else {
    productImageFile.value = null;
    imagePreviewUrl.value = null;
  }
};

const editProduct = (product: any) => {
  editingProduct.value = { ...product };
  productForm.value = { ...product, category_id: product.category?.id, unit_of_measure_id: product.unit_of_measure?.id, notes: '' };
  productImageFile.value = null;
  imagePreviewUrl.value = null;
  showCreateProduct.value = true;
};

const closeProductModal = () => {
  showCreateProduct.value = false;
  editingProduct.value = null;
  productForm.value = {
    id: null,
    name: '',
    description: '',
    price: 0,
    category_id: null,
    unit_of_measure_id: null,
    image_url: '',
    stock_quantity: 0,
    low_stock_threshold: 10,
    is_active: true,
    notes: ''
  };
  productImageFile.value = null;
  imagePreviewUrl.value = null;
};

const saveProduct = async () => {
  productSaving.value = true;

  const formData = new FormData();
  formData.append('name', productForm.value.name);
  formData.append('description', productForm.value.description);
  formData.append('price', productForm.value.price.toString());
  formData.append('stock_quantity', productForm.value.stock_quantity.toString());
  formData.append('low_stock_threshold', productForm.value.low_stock_threshold.toString());
  formData.append('is_active', String(productForm.value.is_active));
  if (productForm.value.category_id) {
    formData.append('category_id', productForm.value.category_id.toString());
  }
  if (productForm.value.unit_of_measure_id) {
    formData.append('unit_of_measure_id', productForm.value.unit_of_measure_id.toString());
  }
  if (productImageFile.value) {
    formData.append('image', productImageFile.value);
  }
  if (editingProduct.value && productForm.value.notes) {
    formData.append('notes', productForm.value.notes);
  }

  try {
    if (editingProduct.value) {
      // NOTE: FastAPI doesn't directly support PUT with multipart/form-data for partial updates.
      // A common workaround is to use POST with a method override or a dedicated POST endpoint for updates.
      // For simplicity here, we'll use a POST request to an 'update' endpoint if we were to build one.
      // However, the provided backend uses PUT, so we will use a POST request with a `_method` field if the backend is adapted,
      // or we can just use the PUT endpoint if the server handles it correctly (e.g. with a library).
      // For now, we assume the PUT endpoint can handle FormData, which many servers do.
      await api.put(`/products/${editingProduct.value.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      await api.post('/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    await fetchProducts();
    closeProductModal();
  } catch (error) {
    console.error('Error saving product:', error);
    // You might want to show a user-friendly error message here
  } finally {
    productSaving.value = false;
  }
};

const showHistory = (product: any) => {
  selectedProductForHistory.value = product;
  showHistoryModal.value = true;
};

const confirmDeleteProduct = async (product: any) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
    try {
      await api.delete(`/products/${product.id}`);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
};

const getImageUrl = (url: string | null) => {
  if (!url) return '/placeholder.png'; // Or a default image
  const serverBaseUrl = (api.defaults.baseURL || '').replace('/api/v1', '');
  return url.startsWith('http') ? url : `${serverBaseUrl}${url}`;
};
const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
const getStockBadgeClass = (product: any) => {
  const stock = product.stock_quantity ?? 0;
  const threshold = product.low_stock_threshold ?? 10;
  if (stock === 0) return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
  if (stock <= threshold) return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800';
  return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
};

onMounted(() => {
  fetchProducts();
  fetchRelatedData();
});

const fetchRelatedData = async () => {
  try {
    [categories.value, unitsOfMeasure.value] = await Promise.all([
      CategoryService.getCategories(),
      UnitOfMeasureService.getUnitsOfMeasure(),
    ]);
  } catch (error) {
    console.error('Error fetching related data:', error);
  }
};
</script>
