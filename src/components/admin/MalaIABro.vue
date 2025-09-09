<template>
  <div class="mala-ia-bro-widget">
    <!-- Floating Chat Bubble (Collapsed State) -->
    <Transition name="bubble">
      <div
        v-if="!isExpanded"
        @click="toggleChat"
        class="chat-bubble"
        :class="{ 'has-notification': hasUnreadMessages }"
      >
        <div class="bubble-content">
          <div class="ai-avatar">🤖</div>
          <div class="bubble-text">Mala-IA-Bro</div>
          <div v-if="hasUnreadMessages" class="notification-badge">{{ unreadCount }}</div>
        </div>
      </div>
    </Transition>

    <!-- Expanded Chat Window -->
    <Transition name="chat-window">
      <div v-if="isExpanded" class="chat-window">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="header-left">
            <div class="ai-avatar">🤖</div>
            <div class="header-info">
              <h3>Mala-IA-Bro</h3>
              <p class="status">{{ isTyping ? 'En train d\'écrire...' : 'Assistant IA MALABRO' }}</p>
            </div>
          </div>
          <div class="header-actions">
            <button @click="clearChat" class="action-btn" title="Effacer la conversation">
              🗑️
            </button>
            <button @click="toggleChat" class="action-btn close-btn" title="Fermer">
              ✕
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <div class="chat-messages" ref="messagesContainer">
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="welcome-message">
            <div class="ai-avatar">🤖</div>
            <div class="message-content">
              <p>Bonjour! Je suis <strong>Mala-IA-Bro</strong>, votre assistant IA pour MALABRO eShop.</p>
              <p>Posez-moi des questions sur:</p>
              <ul>
                <li>📦 État des stocks et inventaire</li>
                <li>💰 Paiements en attente</li>
                <li>📊 Analyses et métriques</li>
                <li>🔍 Recherche de produits</li>
                <li>🚨 Alertes business</li>
              </ul>
            </div>
          </div>

          <!-- Chat Messages -->
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="{ 'user-message': message.isUser, 'ai-message': !message.isUser }"
          >
            <div class="message-avatar">
              {{ message.isUser ? '👤' : '🤖' }}
            </div>
            <div class="message-content">
              <div class="message-text" v-html="formatMessage(message.text)"></div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="message ai-message typing">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions" v-if="messages.length === 0">
          <button
            v-for="action in quickActions"
            :key="action.id"
            @click="sendQuickAction(action)"
            class="quick-action-btn"
          >
            {{ action.icon }} {{ action.text }}
          </button>
        </div>

        <!-- Chat Input -->
        <div class="chat-input">
          <div class="input-container">
            <input
              v-model="currentMessage"
              @keyup.enter="sendMessage"
              @input="handleTyping"
              placeholder="Posez votre question à Mala-IA-Bro..."
              class="message-input"
              :disabled="isTyping"
            />
            <button
              @click="sendMessage"
              :disabled="!currentMessage.trim() || isTyping"
              class="send-btn"
            >
              <span v-if="isTyping">⏳</span>
              <span v-else>🚀</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { useGroqChat } from '@/composables/useGroqChat'

// Component state
const isExpanded = ref(false)
const currentMessage = ref('')
const messages = reactive([])
const messagesContainer = ref(null)
const hasUnreadMessages = ref(false)
const unreadCount = ref(0)
const isTyping = ref(false)

// Groq chat integration
const { sendChatMessage, isLoading } = useGroqChat()

// Quick action buttons
const quickActions = [
  { id: 1, icon: '📦', text: 'État des stocks', query: 'Quel est l\'état actuel des stocks?' },
  { id: 2, icon: '💰', text: 'Paiements en attente', query: 'Combien de paiements sont en attente?' },
  { id: 3, icon: '📊', text: 'Résumé du jour', query: 'Donne-moi le résumé des ventes d\'aujourd\'hui' },
  { id: 4, icon: '🚨', text: 'Alertes business', query: 'Y a-t-il des alertes importantes?' }
]

// Toggle chat window
const toggleChat = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    hasUnreadMessages.value = false
    unreadCount.value = 0
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// Send message
const sendMessage = async () => {
  if (!currentMessage.value.trim() || isTyping.value) return

  const userMessage = {
    id: Date.now(),
    text: currentMessage.value,
    isUser: true,
    timestamp: new Date()
  }

  messages.push(userMessage)
  const query = currentMessage.value
  currentMessage.value = ''
  isTyping.value = true

  scrollToBottom()

  try {
    const response = await sendChatMessage(query)
    
    const aiMessage = {
      id: Date.now() + 1,
      text: response,
      isUser: false,
      timestamp: new Date()
    }

    messages.push(aiMessage)
    
    if (!isExpanded.value) {
      hasUnreadMessages.value = true
      unreadCount.value++
    }
  } catch (error) {
    console.error('Error sending message:', error)
    const errorMessage = {
      id: Date.now() + 1,
      text: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
      isUser: false,
      timestamp: new Date()
    }
    messages.push(errorMessage)
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

// Send quick action
const sendQuickAction = (action) => {
  currentMessage.value = action.query
  sendMessage()
}

// Clear chat
const clearChat = () => {
  messages.length = 0
  hasUnreadMessages.value = false
  unreadCount.value = 0
}

// Scroll to bottom
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Format message with basic HTML support
const formatMessage = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

// Format timestamp
const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Handle typing (could add typing indicators later)
const handleTyping = () => {
  // Future: implement typing indicators
}

// Watch for loading state changes
watch(isLoading, (newValue) => {
  isTyping.value = newValue
})
</script>

<style scoped>
.mala-ia-bro-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Chat Bubble (Collapsed) */
.chat-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50px;
  padding: 12px 20px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.chat-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.chat-bubble.has-notification {
  animation: pulse 2s infinite;
}

.bubble-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 600;
}

.ai-avatar {
  font-size: 20px;
}

.bubble-text {
  font-size: 14px;
  white-space: nowrap;
}

.notification-badge {
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  margin-left: 4px;
}

/* Chat Window (Expanded) */
.chat-window {
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

/* Chat Header */
.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.header-info .status {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8fafc;
}

.welcome-message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.welcome-message .message-content {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.welcome-message ul {
  margin: 8px 0 0 0;
  padding-left: 16px;
}

.welcome-message li {
  margin: 4px 0;
  font-size: 14px;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  font-size: 24px;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
}

.user-message .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 16px 16px 4px 16px;
}

.ai-message .message-content {
  background: white;
  padding: 12px 16px;
  border-radius: 16px 16px 16px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.message-time {
  font-size: 11px;
  opacity: 0.6;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e0;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

/* Quick Actions */
.quick-actions {
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.quick-action-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #475569;
}

.quick-action-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

/* Chat Input */
.chat-input {
  padding: 16px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #667eea;
}

.message-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animations */
.bubble-enter-active, .bubble-leave-active {
  transition: all 0.3s ease;
}

.bubble-enter-from, .bubble-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.chat-window-enter-active, .chat-window-leave-active {
  transition: all 0.3s ease;
}

.chat-window-enter-from, .chat-window-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Mobile Responsiveness */
@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 40px);
    height: calc(100vh - 100px);
    max-height: 500px;
  }
  
  .mala-ia-bro-widget {
    bottom: 10px;
    right: 10px;
  }
}
</style>
