<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto text-center">
      <!-- Success Icon -->
      <div class="mb-6">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle class="w-12 h-12 text-green-600" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Commande Transmise</h1>
        <p class="text-gray-600">Merci pour votre commande. Nous avons bien reçu votre demande de paiement.</p>
      </div>

      <!-- Order Reference -->
      <Card class="p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Détails de votre commande</h2>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p class="text-green-800 font-medium">Référence de commande</p>
          <p class="text-2xl font-bold text-green-900">{{ orderReference }}</p>
        </div>

        <div class="text-left space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Statut:</span>
            <span class="font-medium text-orange-600">Paiement en attente de confirmation</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Date:</span>
            <span class="font-medium text-gray-900">{{ formatDate(new Date()) }}</span>
          </div>
        </div>
      </Card>

      <!-- Next Steps -->
      <Card class="p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Prochaines étapes</h3>
        
        <div class="text-left space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-xs font-bold text-blue-600">1</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">Vérification du paiement</p>
              <p class="text-sm text-gray-600">Notre équipe vérifie votre paiement Wave dans les plus brefs délais.</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-xs font-bold text-blue-600">2</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">Confirmation par email</p>
              <p class="text-sm text-gray-600">Vous recevrez un email de confirmation une fois le paiement validé.</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-xs font-bold text-blue-600">3</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">Préparation et livraison</p>
              <p class="text-sm text-gray-600">Votre commande sera préparée et livrée selon nos délais habituels.</p>
            </div>
          </div>
        </div>
      </Card>

      <!-- Contact Information -->
      <Card class="p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Besoin d'aide?</h3>
        
        <div class="text-sm text-gray-600 space-y-2">
          <p>Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter:</p>
          <div class="flex items-center justify-center gap-4 mt-4">
            <div class="flex items-center gap-2">
              <Mail class="w-4 h-4 text-gray-500" />
              <span>contact@malabro.com</span>
            </div>
            <div class="flex items-center gap-2">
              <Phone class="w-4 h-4 text-gray-500" />
              <span>+221 XX XXX XX XX</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <Button 
          @click="$router.push('/')"
          class="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          Continuer mes achats
        </Button>
        
        <Button 
          v-if="authStore.isAuthenticated"
          @click="$router.push('/orders')"
          variant="outline"
          class="w-full"
        >
          Voir mes commandes
        </Button>
      </div>

      <!-- Order Reference Note -->
      <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-start gap-2">
          <AlertCircle class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div class="text-left">
            <p class="text-sm font-medium text-yellow-800">Important</p>
            <p class="text-sm text-yellow-700">
              Conservez votre référence de commande <strong>{{ orderReference }}</strong> 
              pour toute correspondance future.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Mail, Phone, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Get order reference from route params
const orderReference = route.params.orderReference as string

// If no order reference, redirect to home
if (!orderReference) {
  router.push('/')
}

// Format date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
