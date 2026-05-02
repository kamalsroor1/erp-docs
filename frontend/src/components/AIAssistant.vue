<script setup>
/**
 * @file AIAssistant.vue
 * @description Premium Floating AI Smart Assistant for Ebraa ERP.
 * Features: Mobile-First Full Screen, High-fidelity animations, and glassmorphism.
 */
import { ref } from 'vue'
import { useUIStore } from '../stores/ui'
import { useI18n } from 'vue-i18n'
import { 
  Bot, 
  X, 
  Send, 
  TrendingUp, 
  Package, 
  Zap,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-vue-next'
import BaseText from './base/BaseText.vue'

const uiStore = useUIStore()
const { t } = useI18n()
const isOpen = ref(false)
const message = ref('')

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const quickActions = [
  { id: 1, label: t('dashboard.revenue'), icon: TrendingUp },
  { id: 2, label: t('common.inventory'), icon: Package },
  { id: 3, label: t('dashboard.quick_access'), icon: Zap },
]

const messages = ref([
  { id: 1, text: 'أهلاً بك في إبراء الذكي! أنا هنا لمساعدتك في تحليل البيانات وإدارة المنشأة. كيف يمكنني خدمتك؟', sender: 'ai' }
])

const sendMessage = () => {
  if (!message.value.trim()) return
  messages.value.push({ id: Date.now(), text: message.value, sender: 'user' })
  message.value = ''
  
  setTimeout(() => {
    messages.value.push({ 
      id: Date.now() + 1, 
      text: 'جاري مراجعة طلبك... أنا في طور التعلم الآن لتقديم أفضل تجربة إدارة ذكية.', 
      sender: 'ai' 
    })
  }, 1200)
}
</script>

<template>
  <div 
    class="fixed z-[1000] pointer-events-none"
    :class="[
      uiStore.isRTL ? 'left-4 lg:left-8' : 'right-4 lg:right-8',
      'bottom-4 lg:bottom-8'
    ]"
  >
    <!-- Toggle Button (FAB) -->
    <div class="pointer-events-auto flex flex-col items-end gap-4">
      <Transition name="fade-scale">
        <div 
          v-if="isOpen"
          class="fixed lg:absolute inset-0 lg:inset-auto lg:bottom-24 lg:w-[420px] lg:h-[600px] bg-slate-950 lg:glass-dark lg:rounded-[2.5rem] lg:border lg:border-white/10 lg:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col z-[1001]"
          :class="uiStore.isRTL ? 'lg:right-0' : 'lg:left-0'"
        >
          <!-- Header (Responsive) -->
          <div class="p-8 bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-700 text-white relative overflow-hidden shrink-0">
            <!-- Mobile Back Button -->
            <button @click="isOpen = false" class="lg:hidden absolute top-8 left-8 text-white/50 hover:text-white">
               <component :is="uiStore.isRTL ? ArrowRight : ArrowLeft" class="w-6 h-6" />
            </button>

            <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div class="relative z-10 flex flex-col lg:flex-row items-center lg:items-center gap-5 mt-4 lg:mt-0 text-center lg:text-right">
              <div class="w-16 lg:w-14 h-16 lg:h-14 rounded-2xl bg-white/20 backdrop-blur-2xl flex items-center justify-center shadow-inner border border-white/20">
                <Bot class="w-9 lg:w-8 h-9 lg:h-8 animate-bounce" />
              </div>
              <div>
                <div class="flex items-center justify-center lg:justify-start gap-2">
                  <BaseText weight="black" size="text-xl lg:text-lg" class="!text-white">مساعد إبراء الذكي</BaseText>
                  <Sparkles class="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <div class="flex items-center justify-center lg:justify-start gap-1.5 opacity-80 mt-1">
                  <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <BaseText size="text-[10px]" weight="black" class="!text-white uppercase tracking-widest">متصل الآن</BaseText>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Bar -->
          <div class="px-6 py-4 flex gap-3 border-b border-white/5 bg-white/5 overflow-x-auto no-scrollbar shrink-0">
            <button 
              v-for="action in quickActions" 
              :key="action.id"
              class="flex-shrink-0 flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary-500/30 transition-all group"
            >
              <component :is="action.icon" class="w-4 h-4 text-primary-400 group-hover:scale-110 transition-transform" />
              <BaseText size="text-xs lg:text-[10px]" weight="black" class="!text-white/70 whitespace-nowrap uppercase tracking-tighter">{{ action.label }}</BaseText>
            </button>
          </div>

          <!-- Messages -->
          <div class="flex-1 p-8 space-y-8 overflow-y-auto no-scrollbar bg-gradient-to-b from-transparent to-black/30">
            <div 
              v-for="msg in messages" 
              :key="msg.id"
              :class="[
                'flex items-end gap-4',
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              ]"
            >
              <div v-if="msg.sender === 'ai'" class="w-10 h-10 rounded-xl bg-primary-500/20 flex-shrink-0 flex items-center justify-center border border-primary-500/20">
                <Bot class="w-5 h-5 text-primary-500" />
              </div>
              <div 
                :class="[
                  'max-w-[85%] p-6 rounded-[1.5rem] text-sm md:text-base leading-relaxed shadow-2xl transition-all',
                  msg.sender === 'user' 
                    ? 'bg-primary-600 text-white rounded-br-none' 
                    : 'bg-white/10 text-slate-100 border border-white/5 rounded-bl-none backdrop-blur-3xl'
                ]"
              >
                {{ msg.text }}
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 bg-black/50 border-t border-white/10 backdrop-blur-3xl lg:p-4 pb-12 lg:pb-6">
            <div class="relative">
              <input 
                v-model="message"
                @keyup.enter="sendMessage"
                type="text" 
                placeholder="اسألني عن مبيعات اليوم..."
                class="w-full bg-white/5 border border-white/10 rounded-3xl py-6 lg:py-5 px-8 pr-20 text-white text-base lg:text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-bold shadow-inner"
              />
              <button 
                @click="sendMessage"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-14 lg:w-12 h-14 lg:h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary-500/30"
              >
                <Send class="w-7 lg:w-6 h-7 lg:h-6" />
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- FAB -->
      <button 
        v-if="!isOpen"
        @click="toggleOpen"
        class="pointer-events-auto w-18 h-18 rounded-[1.5rem] bg-gradient-to-br from-primary-500 via-primary-600 to-indigo-700 text-white shadow-[0_20px_50px_rgba(79,70,229,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 relative group overflow-hidden border border-white/20"
      >
        <div class="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
        <Bot class="w-9 h-9 relative z-10 group-hover:rotate-12 transition-transform" />
        <div class="absolute top-4 right-4 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-midnight animate-pulse shadow-[0_0_10px_#10b981]"></div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

@media (max-width: 1023px) {
  .fade-scale-enter-from,
  .fade-scale-leave-to {
    transform: translateX(100%);
  }
}
</style>
