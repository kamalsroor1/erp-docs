<script setup>
/**
 * @file StockAudit.vue
 * @description Smart component for inventory reconciliation using scanning. 
 * Fixed: Tailwind v4 utility reference issues.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ScanLine, Camera, CheckCircle, AlertCircle, ArrowRight } from 'lucide-vue-next'
import Button from 'primevue/button'
import { useKeyboardShortcuts } from '../../utils/keyboard'
import BaseText from '../../components/base/BaseText.vue'
import { useToast } from 'primevue/usetoast'
import { useUIStore } from '../../stores/ui'

const router = useRouter()
const uiStore = useUIStore()
const { t } = useI18n()
const toast = useToast()

const scanning = ref(false)
const loading = ref(false)
const scannedItems = ref([
  { serial: 'SN123456789', status: 'match', name: 'iPhone 15 Pro' },
  { serial: 'SN987654321', status: 'mismatch', name: 'Samsung S24 Ultra' }
])

const finishAudit = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    toast.add({ severity: 'success', summary: t('common.success'), detail: t('inventory.stock_audit_success'), life: 3000 })
    router.push('/inventory')
  }, 1000)
}

const { register, unregister } = useKeyboardShortcuts({
  onSave: finishAudit,
  onCancel: () => router.back()
})

onMounted(() => {
  register()
})

onUnmounted(() => {
  unregister()
})

const glassClass = computed(() => {
  return [
    'backdrop-blur-xl border shadow-2xl transition-all duration-300',
    uiStore.isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200'
  ]
})
</script>

<template>
  <div class="h-full flex flex-col bg-slate-50 dark:bg-midnight animate-in fade-in duration-500 pb-32 md:pb-0">
    <header class="px-6 py-6 md:p-8 flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 sticky top-0 z-20">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-90">
          <component :is="uiStore.isRTL ? ArrowRight : ArrowLeft" class="w-6 h-6" />
        </button>
        <BaseText weight="black" size="text-xl md:text-2xl">{{ t('inventory.stock_audit') }}</BaseText>
      </div>
      <div class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
         <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
         <BaseText weight="black" color="emerald" size="text-[10px]" class="uppercase tracking-widest">{{ t('inventory.main_warehouse') }}</BaseText>
      </div>
    </header>

    <main class="flex-1 px-6 py-8 space-y-8 overflow-y-auto">
      <div :class="glassClass" class="aspect-video max-w-2xl mx-auto rounded-[2.5rem] border-4 !border-primary-500/30 flex flex-col items-center justify-center relative overflow-hidden group">
         <div class="absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent"></div>
         <ScanLine class="w-16 md:w-20 h-16 md:h-20 text-primary-500 mb-4 animate-bounce" />
         <BaseText weight="black" size="text-base md:text-lg" class="!text-white mb-8 uppercase tracking-widest text-center">
           {{ t('inventory.waiting_scan') }}
         </BaseText>
         
         <button 
           @click="scanning = !scanning"
           class="w-auto px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-2xl shadow-primary-500/40 flex items-center gap-3 transition-all active:scale-95 z-10"
         >
           <Camera class="w-6 h-6" />
           {{ scanning ? t('inventory.stop_camera') : t('inventory.start_scanning') }}
         </button>

         <div v-if="scanning" class="absolute top-0 left-0 right-0 h-1 bg-primary-500 shadow-[0_0_20px_#4f46e5] animate-[scan_2s_ease-in-out_infinite]"></div>
      </div>

      <div class="max-w-2xl mx-auto space-y-4">
         <div class="flex items-center justify-between px-2 mb-6">
            <BaseText weight="black" class="!text-slate-500 uppercase tracking-widest text-xs opacity-40">{{ t('inventory.last_scanned') }}</BaseText>
            <BaseText weight="black" color="primary" size="text-xs" class="bg-primary-500/10 px-3 py-1 rounded-lg">
                {{ scannedItems.length }} {{ t('common.units') }}
            </BaseText>
         </div>

         <div v-for="item in scannedItems" :key="item.serial" :class="glassClass" class="p-6 rounded-[2rem] flex items-center justify-between active:scale-[0.98] cursor-pointer">
            <div class="flex items-center gap-4">
               <div class="w-12 h-12 rounded-2xl flex items-center justify-center" :class="item.status === 'match' ? 'bg-emerald-500/10' : 'bg-red-500/10'">
                  <CheckCircle v-if="item.status === 'match'" class="w-6 h-6 text-emerald-500" />
                  <AlertCircle v-else class="w-6 h-6 text-red-500" />
               </div>
               <div class="flex flex-col">
                  <BaseText weight="black" size="text-base">{{ item.name }}</BaseText>
                  <BaseText type="label" size="text-[10px]" class="font-mono opacity-40 uppercase tracking-tighter">{{ item.serial }}</BaseText>
               </div>
            </div>
            <div 
              class="px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest"
              :class="item.status === 'match' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'"
            >
              {{ t('common.' + item.status) }}
            </div>
         </div>
      </div>
    </main>

    <div class="fixed bottom-6 left-6 right-6 md:static md:p-8 md:bg-white md:dark:bg-slate-900 md:border-t md:border-slate-200 md:dark:border-white/5 z-30">
       <div class="max-w-2xl mx-auto w-full">
         <button 
           @click="finishAudit"
           :disabled="loading"
           class="w-full h-18 md:h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-lg shadow-2xl shadow-black/20 active:scale-95 transition-all flex items-center justify-center border border-white/10 dark:border-slate-200"
         >
           <template v-if="loading">
              <div class="w-6 h-6 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
           </template>
           <template v-else>
              {{ t('inventory.finish_audit') }} (F9)
           </template>
         </button>
       </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scan {
  0% { top: 0; }
  50% { top: 100%; }
  100% { top: 0; }
}
</style>
