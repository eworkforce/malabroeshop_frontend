import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import type { UnitOfMeasure } from '@/services/ProductService'

export interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  quantity: number
  description?: string
  stock_quantity: number
  unit_of_measure?: UnitOfMeasure
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const itemCount = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const subtotalPrice = computed(() => 
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  )

  const deliveryFee = computed(() => 
    items.value.length > 0 ? 2000 : 0
  )

  const totalPrice = computed(() => 
    subtotalPrice.value + deliveryFee.value
  )

  const subtotalPriceFormatted = computed(() => 
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(subtotalPrice.value).replace('XOF', 'F CFA')
  )

  const deliveryFeeFormatted = computed(() => 
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(deliveryFee.value).replace('XOF', 'F CFA')
  )

  const totalPriceFormatted = computed(() => 
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(totalPrice.value).replace('XOF', 'F CFA')
  )

  const isEmpty = computed(() => items.value.length === 0)

  const getItemQuantity = (productId: number) => {
    const item = items.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const isInCart = (productId: number) => {
    return items.value.some(item => item.id === productId)
  }

  const validationErrors = computed(() => {
    const errors: { productId: number; message: string }[] = [];
    for (const item of items.value) {
        if (item.quantity > item.stock_quantity) {
            errors.push({
                productId: item.id,
                message: `Stock insuffisant. Disponible: ${item.stock_quantity}`
            });
        }
    }
    return errors;
  });

  const isCartValid = computed(() => validationErrors.value.length === 0);

  // Actions
  const addItem = (product: Omit<CartItem, 'quantity'> & { stock_quantity: number }, quantity: number = 1) => {
    try {
      error.value = null
      
      // Validate product data
      if (!product || !product.id) {
        error.value = 'Produit invalide'
        return
      }
      
      const existingItem = items.value.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity: quantity,
          description: product.description,
          stock_quantity: product.stock_quantity,
          unit_of_measure: (product as any).unit_of_measure
        }
        items.value.push(cartItem)
      }
      
      saveToStorage()
    } catch (err) {
      console.error('Cart addItem error:', err)
      error.value = 'Erreur lors de l\'ajout au panier'
    }
  }

  const removeItem = (productId: number) => {
    try {
      error.value = null
      items.value = items.value.filter(item => item.id !== productId)
      saveToStorage()
    } catch (err) {
      error.value = 'Erreur lors de la suppression du panier'
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    try {
      error.value = null
      
      if (quantity <= 0) {
        removeItem(productId)
        return
      }
      
      const item = items.value.find(item => item.id === productId)
      if (item) {
        // Prevent updating quantity beyond available stock
        if (quantity > item.stock_quantity) {
            error.value = `Stock insuffisant pour ${item.name}. Quantité maximale: ${item.stock_quantity}`;
            item.quantity = item.stock_quantity; // Correct quantity to max available
        } else {
            item.quantity = quantity
        }
        saveToStorage()
      }
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour de la quantité'
    }
  }

  const incrementQuantity = (productId: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      updateQuantity(productId, item.quantity + 1)
    }
  }

  const decrementQuantity = (productId: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      updateQuantity(productId, item.quantity - 1)
    }
  }

  const clearCart = () => {
    try {
      error.value = null
      items.value = []
      saveToStorage()
    } catch (err) {
      error.value = 'Erreur lors de la vidange du panier'
    }
  }

  const saveToStorage = () => {
    try {
      const userStore = useUserStore()
      const storageKey = userStore.isAuthenticated 
        ? `cart_${userStore.user?.id}` 
        : 'cart_guest'
      
      localStorage.setItem(storageKey, JSON.stringify(items.value))
    } catch (err) {
      console.error('Failed to save cart to storage:', err)
    }
  }

  const loadFromStorage = () => {
    try {
      const userStore = useUserStore()
      const storageKey = userStore.isAuthenticated 
        ? `cart_${userStore.user?.id}` 
        : 'cart_guest'
      
      const savedCart = localStorage.getItem(storageKey)
      if (savedCart) {
        items.value = JSON.parse(savedCart)
      }
    } catch (err) {
      console.error('Failed to load cart from storage:', err)
      items.value = []
    }
  }

  const migrateGuestCart = () => {
    try {
      const userStore = useUserStore()
      if (userStore.isAuthenticated && userStore.user) {
        // Load guest cart
        const guestCart = localStorage.getItem('cart_guest')
        if (guestCart) {
          const guestItems = JSON.parse(guestCart)
          
          // Merge with user cart
          guestItems.forEach((guestItem: CartItem) => {
            const existingItem = items.value.find(item => item.id === guestItem.id)
            if (existingItem) {
              existingItem.quantity += guestItem.quantity
            } else {
              items.value.push(guestItem)
            }
          })
          
          // Save merged cart and remove guest cart
          saveToStorage()
          localStorage.removeItem('cart_guest')
        }
      }
    } catch (err) {
      console.error('Failed to migrate guest cart:', err)
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize cart
  const initializeCart = () => {
    loadFromStorage()
  }

  return {
    // State
    items,
    isLoading,
    error,
    // Getters
    itemCount,
    subtotalPrice,
    subtotalPriceFormatted,
    deliveryFee,
    deliveryFeeFormatted,
    totalPrice,
    totalPriceFormatted,
    isEmpty,
    getItemQuantity,
    isInCart,
    validationErrors,
    isCartValid,
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    saveToStorage,
    loadFromStorage,
    migrateGuestCart,
    clearError,
    initializeCart
  }
})
