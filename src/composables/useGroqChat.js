import { ref } from 'vue'
import apiClient from '@/services/api'

export function useGroqChat() {
  const isLoading = ref(false)
  const error = ref(null)

  // MCP tools context for the AI
  const getMCPContext = async () => {
    try {
      // Fetch current shop data to provide context to the AI
      const [inventory, payments, alerts] = await Promise.all([
        apiClient.get('/ai-tools/inventory/summary'),
        apiClient.get('/ai-tools/payments/pending'),
        apiClient.get('/ai-tools/alerts/business')
      ])

      return {
        inventory: inventory.data,
        payments: payments.data,
        alerts: alerts.data,
        timestamp: new Date().toISOString()
      }
    } catch (err) {
      console.warn('Could not fetch MCP context:', err)
      return null
    }
  }

  // Format system prompt with shop context
  const createSystemPrompt = (context) => {
    const basePrompt = `Tu es Mala-IA-Bro, assistant IA intelligent de MALABRO eShop. Tu aides les administrateurs avec des informations en temps réel sur leur boutique.

CONTEXTE ACTUEL DE LA BOUTIQUE (${context?.timestamp || 'Non disponible'}):

INVENTAIRE:
- Total produits: ${context?.inventory?.total_products || 'N/A'}
- Catégories: ${context?.inventory?.categories?.join(', ') || 'N/A'}
- Produits en rupture: ${context?.inventory?.out_of_stock_items?.length || 0}
- Produits en stock faible: ${context?.inventory?.low_stock_items?.length || 0}
- Valeur totale: ${context?.inventory?.total_value || 'N/A'} FCFA

PAIEMENTS:
- Commandes en attente: ${context?.payments?.count || 0}
- Montant en attente: ${context?.payments?.total_amount || 0} FCFA

ALERTES BUSINESS:
- Nombre d'alertes: ${context?.alerts?.alerts_count || 0}
- Statut: ${context?.alerts?.status || 'N/A'}

INSTRUCTIONS:
1. Réponds toujours en français
2. Sois concis et professionnel
3. Utilise des emojis appropriés (📦 📊 💰 🚨)
4. Fournis des données précises basées sur le contexte
5. Propose des actions concrètes quand pertinent
6. Si tu ne peux pas répondre avec les données disponibles, explique comment obtenir l'information
7. IMPORTANT: Utilise toujours FCFA comme devise, jamais € (Euro)

CAPACITÉS:
- Analyse des stocks et inventaire
- Suivi des paiements en attente
- Métriques et analyses business
- Recherche de produits
- Alertes et notifications
- Conseils d'optimisation

Réponds de manière utile et actionnable pour aider l'administrateur MALABRO.`

    return basePrompt
  }

  // Send chat message to Groq via our backend
  const sendChatMessage = async (message) => {
    isLoading.value = true
    error.value = null

    try {
      // Get current shop context
      const context = await getMCPContext()
      
      // Create system prompt with context
      const systemPrompt = createSystemPrompt(context)

      // Send request to our backend which will proxy to Groq
      const response = await apiClient.post('/ai-tools/chat', {
        message: message,
        system_prompt: systemPrompt,
        context: context
      })

      return response.data.response
    } catch (err) {
      console.error('Chat error:', err)
      error.value = err.response?.data?.detail || 'Erreur de communication avec Mala-IA-Bro'
      
      // Fallback response
      return 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants. 🤖'
    } finally {
      isLoading.value = false
    }
  }

  // Get quick insights for dashboard
  const getQuickInsights = async () => {
    try {
      const context = await getMCPContext()
      if (!context) return []

      const insights = []

      // Stock insights
      if (context.inventory?.low_stock_items?.length > 0) {
        insights.push({
          type: 'warning',
          icon: '📦',
          title: 'Stock faible',
          message: `${context.inventory.low_stock_items.length} produit(s) en stock faible`,
          action: 'Voir les détails'
        })
      }

      // Payment insights
      if (context.payments?.count > 0) {
        insights.push({
          type: 'info',
          icon: '💰',
          title: 'Paiements en attente',
          message: `${context.payments.count} commande(s) - €${context.payments.total_amount}`,
          action: 'Traiter'
        })
      }

      // Alert insights
      if (context.alerts?.alerts_count > 0) {
        insights.push({
          type: 'alert',
          icon: '🚨',
          title: 'Alertes business',
          message: `${context.alerts.alerts_count} alerte(s) nécessitent votre attention`,
          action: 'Voir alertes'
        })
      }

      return insights
    } catch (err) {
      console.error('Error getting insights:', err)
      return []
    }
  }

  return {
    sendChatMessage,
    getQuickInsights,
    isLoading,
    error
  }
}
