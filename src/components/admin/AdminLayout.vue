<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <header class="lg:hidden bg-white shadow-sm border-b sticky top-0 z-40">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-3">
          <button
            @click="toggleMobileMenu"
            class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
          >
            <Menu v-if="!mobileMenuOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>
          <h1 class="text-lg font-bold text-green-600">MALABRO Admin</h1>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600 hidden sm:inline">{{ userStore.user?.full_name }}</span>
          <button
            @click="logout"
            class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Desktop Sidebar -->
      <aside class="hidden lg:flex lg:w-64 bg-white shadow-md flex-shrink-0">
        <div class="w-full">
          <div class="flex items-center justify-center h-16 bg-green-600 text-white">
            <h1 class="text-xl font-bold">MALABRO Admin</h1>
          </div>
          <nav class="mt-5">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              active-class="bg-green-100 text-green-700 border-r-4 border-green-600"
            >
              <component :is="item.icon" class="h-5 w-5 mr-3" />
              <span class="text-sm font-medium">{{ item.name }}</span>
            </router-link>
          </nav>
        </div>
      </aside>

      <!-- Mobile Sidebar Overlay -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mobileMenuOpen"
          class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          @click="closeMobileMenu"
        />
      </Transition>

      <!-- Mobile Sidebar -->
      <Transition
        enter-active-class="transition-transform duration-300"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <aside
          v-if="mobileMenuOpen"
          class="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg lg:hidden"
        >
          <div class="flex items-center justify-center h-16 bg-green-600 text-white">
            <h1 class="text-xl font-bold">MALABRO Admin</h1>
          </div>
          <nav class="mt-5">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              @click="closeMobileMenu"
              class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              active-class="bg-green-100 text-green-700 border-r-4 border-green-600"
            >
              <component :is="item.icon" class="h-5 w-5 mr-3" />
              <span class="text-sm font-medium">{{ item.name }}</span>
            </router-link>
          </nav>
        </aside>
      </Transition>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Desktop Header -->
        <header class="hidden lg:block bg-white shadow-sm border-b">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
              <div>
                <!-- Placeholder for breadcrumbs or page title -->
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600">Bonjour, {{ userStore.user?.full_name }}</span>
                <button
                  @click="logout"
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </header>

        <main class="flex-1 p-3 sm:p-4 lg:p-6">
          <router-view />
        </main>
      </div>
    </div>
    
    <!-- Mala-IA-Bro Chat Widget -->
    <MalaIABro />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { Home, ShoppingBag, Users, BarChart, Settings, Package, Tag, TrendingUp, Menu, X } from 'lucide-vue-next';
import MalaIABro from './MalaIABro.vue';

const router = useRouter();
const userStore = useUserStore();
const mobileMenuOpen = ref(false);

const navigation = [
  { name: 'Vue d\'ensemble', href: '/admin/overview', icon: Home },
  { name: 'Produits', href: '/admin/products', icon: Package },
  { name: 'Catégories', href: '/admin/categories', icon: Tag },
  { name: 'Unités de Mesure', href: '/admin/units-of-measure', icon: Settings },
  { name: 'Commandes', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Rapports Inventaire', href: '/admin/inventory-reports', icon: TrendingUp },
  { name: 'Paiements', href: '/admin/payments', icon: BarChart },
];

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>
