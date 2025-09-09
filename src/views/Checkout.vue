<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Progress Steps -->
    <div class="mb-6 sm:mb-8">
      <div class="flex items-center justify-center space-x-2 sm:space-x-4">
        <div class="flex items-center">
          <div :class="['w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium', 
                       currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600']">
            1
          </div>
          <span class="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">Informations</span>
          <span class="ml-1 text-xs font-medium text-gray-700 sm:hidden">Info</span>
        </div>
        <div class="w-8 sm:w-16 h-0.5 bg-gray-200"></div>
        <div class="flex items-center">
          <div :class="['w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium', 
                       currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600']">
            2
          </div>
          <span class="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">Révision</span>
          <span class="ml-1 text-xs font-medium text-gray-700 sm:hidden">Rev</span>
        </div>
        <div class="w-8 sm:w-16 h-0.5 bg-gray-200"></div>
        <div class="flex items-center">
          <div :class="['w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium', 
                       currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600']">
            3
          </div>
          <span class="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-700">Paiement</span>
        </div>
      </div>
    </div>

    <!-- Step 1: Customer Information -->
    <div v-if="currentStep === 1" class="max-w-2xl mx-auto">
      <Card class="p-4 sm:p-6">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Informations de livraison</h2>
        
        <form @submit.prevent="goToStep2" class="space-y-4 sm:space-y-6">
          <!-- Customer Name -->
          <div>
            <label for="customerName" class="block text-sm font-medium text-gray-700 mb-2">
              Nom complet *
            </label>
            <input
              id="customerName"
              v-model="orderForm.customer_name"
              type="text"
              required
              class="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base sm:text-sm"
              placeholder="Votre nom complet"
            />
          </div>

          <!-- Customer Email -->
          <div>
            <label for="customerEmail" class="block text-sm font-medium text-gray-700 mb-1">
              Adresse email *
            </label>
            <input
              id="customerEmail"
              v-model="orderForm.customer_email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="votre@email.com"
            />
          </div>

          <!-- Customer Phone -->
          <div>
            <label for="customerPhone" class="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone
            </label>
            <input
              id="customerPhone"
              v-model="orderForm.customer_phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+225 XX XXX XX XX"
            />
          </div>

          <!-- Shipping Address -->
          <div>
            <label for="shippingAddress" class="block text-sm font-medium text-gray-700 mb-1">
              Adresse de livraison *
            </label>
            <textarea
              id="shippingAddress"
              v-model="orderForm.shipping_address"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Adresse complète de livraison"
            ></textarea>
          </div>

          <!-- Shipping City -->
          <div>
            <label for="shippingCity" class="block text-sm font-medium text-gray-700 mb-1">
              Ville *
            </label>
            <input
              id="shippingCity"
              v-model="orderForm.shipping_city"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Abidjan"
            />
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between pt-6">
            <Button 
              @click="$router.push('/cart')"
              variant="outline"
              type="button"
            >
              Retour au panier
            </Button>
            <Button 
              type="submit"
              class="bg-green-600 hover:bg-green-700"
            >
              Continuer
            </Button>
          </div>
        </form>
      </Card>
    </div>

    <!-- Step 2: Order Review -->
    <div v-if="currentStep === 2" class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Order Summary -->
        <Card class="p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Récapitulatif de la commande</h2>
          
          <div class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
            >
              <img
                :src="getImageUrl(item.image_url)"
                :alt="item.name"
                class="w-12 h-12 object-cover rounded-md"
              />
              <div class="flex-grow">
                <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
                <p class="text-sm text-gray-600">{{ formatPrice(item.price) }} x {{ item.quantity }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">{{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
            
            <hr class="my-4" />
            
            <!-- Subtotal -->
            <div class="flex justify-between text-gray-700">
              <span>Sous-total</span>
              <span>{{ cartStore.subtotalPriceFormatted }}</span>
            </div>
            
            <!-- Delivery Fee -->
            <div class="flex justify-between text-gray-700">
              <span>Livraison</span>
              <span>{{ cartStore.deliveryFeeFormatted }}</span>
            </div>
            
            <hr class="my-2" />
            
            <div class="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{{ cartStore.totalPriceFormatted }}</span>
            </div>
          </div>
        </Card>

        <!-- Customer Information -->
        <Card class="p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Informations de livraison</h2>
          
          <div class="space-y-3">
            <div>
              <span class="font-medium text-gray-700">Nom:</span>
              <span class="ml-2 text-gray-900">{{ orderForm.customer_name }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Email:</span>
              <span class="ml-2 text-gray-900">{{ orderForm.customer_email }}</span>
            </div>
            <div v-if="orderForm.customer_phone">
              <span class="font-medium text-gray-700">Téléphone:</span>
              <span class="ml-2 text-gray-900">{{ orderForm.customer_phone }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Adresse:</span>
              <div class="ml-2 text-gray-900">
                {{ orderForm.shipping_address }}<br>
                {{ orderForm.shipping_city }}, {{ orderForm.shipping_country }}
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between pt-6">
            <Button 
              @click="currentStep = 1"
              variant="outline"
              type="button"
            >
              Modifier
            </Button>
            <Button 
              @click="proceedToPayment"
              class="bg-green-600 hover:bg-green-700"
              :disabled="isCreatingOrder"
            >
              <span v-if="isCreatingOrder">Création...</span>
              <span v-else>Procéder au paiement</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>

    <!-- Step 3: Payment Method Selection -->
    <div v-if="currentStep === 3 && !selectedPaymentMethod" class="max-w-2xl mx-auto">
      <Card class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Choisissez votre méthode de paiement</h2>
        
        <div v-if="orderReference" class="mb-6">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p class="text-green-800 font-medium text-center">Commande créée avec succès!</p>
            <p class="text-green-700 text-center">Référence: <strong>{{ orderReference }}</strong></p>
          </div>
        </div>

        <!-- Payment Method Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <!-- Wave Payment Option -->
          <div 
            @click="selectPaymentMethod('wave')"
            class="border-2 border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center"
          >
            <img src="/logowave.jpeg" alt="Wave Logo" class="w-20 h-20 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Wave</h3>
            <p class="text-sm text-gray-600">Paiement mobile sécurisé</p>
          </div>

          <!-- Orange Money Payment Option -->
          <div 
            @click="selectPaymentMethod('orange')"
            class="border-2 border-gray-300 rounded-lg p-6 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 text-center"
          >
            <img src="/orangeLogo.png" alt="Orange Money Logo" class="w-20 h-20 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Orange Money</h3>
            <p class="text-sm text-gray-600">Paiement mobile Orange</p>
          </div>
        </div>

        <!-- Payment Amount -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
          <p class="text-gray-700">Montant à payer:</p>
          <p class="text-3xl font-bold text-green-600">{{ cartStore.totalPriceFormatted }} FCFA</p>
          <p class="text-sm text-gray-600 mt-1">Référence: {{ orderReference }}</p>
        </div>

        <!-- Back Button -->
        <div class="text-center">
          <Button 
            @click="currentStep = 2"
            variant="outline"
            class="w-full"
          >
            Retour
          </Button>
        </div>
      </Card>
    </div>

    <!-- Step 3b: Wave Payment -->
    <div v-if="currentStep === 3 && selectedPaymentMethod === 'wave'" class="max-w-2xl mx-auto">
      <Card class="p-6 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Paiement Wave</h2>
        
        <div v-if="orderReference" class="mb-6">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p class="text-green-800 font-medium">Commande créée avec succès!</p>
            <p class="text-green-700">Référence: <strong>{{ orderReference }}</strong></p>
          </div>
        </div>

        <!-- Wave Logo and Payment Link -->
        <div class="mb-6">
          <div class="bg-white border-2 border-gray-300 rounded-lg p-6 inline-block">
            <img src="/logowave.jpeg" alt="Wave Logo" class="w-32 h-32 mx-auto mb-4" />
            <a 
              href="https://pay.wave.com/m/M_ci_4uG7I-EoQ9GD/c/ci/" 
              target="_blank"
              @click="handlePaymentLinkClick('wave')"
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Cliquez ici pour effectuer votre paiement via Wave
            </a>
          </div>
        </div>

        <!-- Payment Instructions -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
          <h3 class="font-bold text-blue-900 mb-3">Instructions de paiement:</h3>
          <ol class="list-decimal list-inside space-y-2 text-gray-700">
            <li>Cliquez sur le lien <strong>Wave</strong> ci-dessus et suivez les instructions de paiement WAVE</li>
             <li>Sauvegardez la référence <strong>{{ orderReference }}</strong> pour vérification ultérieure</li>
            <li>Vous serez notifié par email une fois le paiement confirmé</li>
          </ol>
        </div>

        <!-- Payment Amount -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p class="text-gray-700">Montant à payer:</p>
          <p class="text-3xl font-bold text-green-600">{{ cartStore.totalPriceFormatted }} FCFA</p>
          <p class="text-sm text-gray-600 mt-1">Référence: {{ orderReference }}</p>
        </div>

        <!-- Confirmation Button -->
        <div class="space-y-4">
          <Button 
            @click="confirmPayment"
            class="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            Cliquez ici pour valider votre opération
          </Button>
          
          <Button 
            @click="selectedPaymentMethod = null"
            variant="outline"
            class="w-full"
          >
            Changer de méthode
          </Button>
        </div>
      </Card>
    </div>

    <!-- Step 3c: Orange Money Payment -->
    <div v-if="currentStep === 3 && selectedPaymentMethod === 'orange'" class="max-w-2xl mx-auto">
      <Card class="p-6 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Paiement Orange Money</h2>
        
        <div v-if="orderReference" class="mb-6">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p class="text-green-800 font-medium">Commande créée avec succès!</p>
            <p class="text-green-700">Référence: <strong>{{ orderReference }}</strong></p>
          </div>
        </div>

        <!-- Orange Money Logo and Payment Link -->
        <div class="mb-6">
          <div class="bg-white border-2 border-gray-300 rounded-lg p-6 inline-block">
            <img src="/orangeLogo.png" alt="Orange Money Logo" class="w-32 h-32 mx-auto mb-4" />
            <a 
              href="https://multi.app.orange-money.com/app/v1/kapptivate/qrcode/odyssee/?id=codgen38-a0d8deaa635f4a979cfaaa4a8a4d018b&v=1" 
              target="_blank"
              @click="handlePaymentLinkClick('orange')"
              class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Cliquez ici pour effectuer votre paiement via Orange Money
            </a>
          </div>
        </div>

        <!-- Payment Instructions -->
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6 text-left">
          <h3 class="font-bold text-orange-900 mb-3">Instructions de paiement:</h3>
          <ol class="list-decimal list-inside space-y-2 text-gray-700">
            <li>Cliquez sur le lien <strong>Orange Money</strong> ci-dessus et suivez les instructions de paiement</li>
             <li>Sauvegardez la référence <strong>{{ orderReference }}</strong> pour vérification ultérieure</li>
            <li>Vous serez notifié par email une fois le paiement confirmé</li>
          </ol>
        </div>

        <!-- Payment Amount -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p class="text-gray-700">Montant à payer:</p>
          <p class="text-3xl font-bold text-green-600">{{ cartStore.totalPriceFormatted }} FCFA</p>
          <p class="text-sm text-gray-600 mt-1">Référence: {{ orderReference }}</p>
        </div>

        <!-- Confirmation Button -->
        <div class="space-y-4">
          <Button 
            @click="confirmPayment"
            class="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            Cliquez ici pour valider votre opération
          </Button>
          
          <Button 
            @click="selectedPaymentMethod = null"
            variant="outline"
            class="w-full"
          >
            Changer de méthode
          </Button>
        </div>
      </Card>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="max-w-2xl mx-auto mt-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import apiClient from '@/services/api'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

// Component state
const currentStep = ref(1)
const isCreatingOrder = ref(false)
const orderReference = ref('')
const errorMessage = ref('')
const selectedPaymentMethod = ref<string | null>(null)

// Order form data
const orderForm = reactive({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  shipping_address: '',
  shipping_city: 'Abidjan',
  shipping_country: 'Côte d\'Ivoire'
})

// Watch for user data changes and update form
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    orderForm.customer_name = newUser.full_name || ''
    orderForm.customer_email = newUser.email || ''
  }
}, { immediate: true })

// Initialize form with user data on mount
onMounted(async () => {
  // Ensure user data is loaded
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser()
  }
  
  // Prefill form if user is authenticated
  if (authStore.user) {
    orderForm.customer_name = authStore.user.full_name || ''
    orderForm.customer_email = authStore.user.email || ''
  }
})

// Format price in FCFA
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('XOF', 'FCFA')
}

// Get proper image URL with fallback
const getImageUrl = (url: string | null): string => {
  if (!url) return '/placeholder.png'; // Default placeholder
  const serverBaseUrl = (apiClient.defaults.baseURL || '').replace('/api/v1', '');
  return url.startsWith('http') ? url : `${serverBaseUrl}${url}`;
};

// Handle QR code image error
const handleQRError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjY0IiB5PSI2NCIgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiM5Q0E0QUYiLz4KPHRleHQgeD0iMTI4IiB5PSIxNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPkNvZGUgUVI8L3RleHQ+Cjwvc3ZnPg=='
}

// Step navigation functions
const goToStep2 = () => {
  if (cartStore.items.length === 0) {
    errorMessage.value = 'Votre panier est vide'
    return
  }
  currentStep.value = 2
  errorMessage.value = ''
}

const proceedToPayment = async () => {
  isCreatingOrder.value = true
  errorMessage.value = ''
  
  try {
    // Prepare order data
    const orderData = {
      ...orderForm,
      items: cartStore.items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }))
    }
    
    // Create order
    const response = await apiClient.post('/orders/', orderData)
    orderReference.value = response.data.order_reference
    currentStep.value = 3
    
  } catch (error: any) {
    console.error('Error creating order:', error)
    errorMessage.value = error.response?.data?.detail || 'Erreur lors de la création de la commande'
  } finally {
    isCreatingOrder.value = false
  }
}

const selectPaymentMethod = (method: string) => {
  selectedPaymentMethod.value = method
}

const handlePaymentLinkClick = async (paymentMethod: string) => {
  try {
    // Send notifications when user clicks payment link
    await sendPaymentNotifications(paymentMethod)
  } catch (error) {
    console.error('Error sending notifications:', error)
  }
}

const sendPaymentNotifications = async (paymentMethod: string) => {
  try {
    const notificationData = {
      order_reference: orderReference.value,
      customer_name: orderForm.customer_name,
      customer_email: orderForm.customer_email,
      customer_phone: orderForm.customer_phone,
      total_amount: cartStore.totalPrice,
      payment_method: paymentMethod,
      admin_email: 'sergeziehi@eworkforce.africa'
    }
    
    // Send notification to backend
    await apiClient.post('/notifications/payment-started', notificationData)
    
    console.log(`Payment notifications sent successfully for ${paymentMethod}`)
  } catch (error) {
    console.error('Failed to send payment notifications:', error)
  }
}

const confirmPayment = () => {
  // Clear cart and redirect to success page
  cartStore.clearCart()
  router.push({
    name: 'OrderConfirmation',
    params: { orderReference: orderReference.value }
  })
}

// Check if cart is empty on mount
if (cartStore.items.length === 0) {
  router.push('/cart')
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
