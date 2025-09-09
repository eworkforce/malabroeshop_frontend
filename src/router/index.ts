import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/uikit',
      name: 'UIKit',
      component: () => import('../views/UIKitView.vue')
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: () => import('../views/ProductDetail.vue'),
      props: true
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/Cart.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('../views/Checkout.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/order-confirmation/:orderReference',
      name: 'OrderConfirmation',
      component: () => import('../views/OrderConfirmation.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/admin',
      component: () => import('../components/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '', redirect: '/admin/overview' },
        { path: 'overview', name: 'AdminOverview', component: () => import('../views/admin/AdminOverview.vue') },
        { path: 'products', name: 'AdminProducts', component: () => import('../views/admin/ProductManager.vue') },
        { path: 'categories', name: 'AdminCategories', component: () => import('../views/admin/CategoryManager.vue') },
        { path: 'units-of-measure', name: 'AdminUnitsOfMeasure', component: () => import('../views/admin/UnitOfMeasureManager.vue') },
        { path: 'orders', name: 'AdminOrders', component: () => import('../components/admin/AdminOrders.vue') },
        { path: 'users', name: 'AdminUsers', component: () => import('../components/admin/AdminUsers.vue') },
        { path: 'payments', name: 'AdminPayments', component: () => import('../components/admin/AdminPayments.vue') },
        { path: 'inventory-reports', name: 'AdminInventoryReports', component: () => import('../views/admin/InventoryReports.vue') },
      ]
    }
  ]
})

// Route guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      // Redirect to login with return URL
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
  }
  
  // Check if route requires admin privileges
  if (to.meta.requiresAdmin) {
    if (!userStore.user?.is_admin) {
      // Redirect to home if not admin
      next({ name: 'Home' })
      return
    }
  }
  
  // Routes that should redirect if already authenticated
  const guestOnlyRoutes = ['Login', 'Register']
  if (guestOnlyRoutes.includes(to.name as string)) {
    if (userStore.isAuthenticated) {
      // Redirect to home if already authenticated
      next({ name: 'Home' })
      return
    }
  }
  
  next()
})

export default router
