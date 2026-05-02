<script setup>
/**
 * @file StockAudit.vue
 * @description Smart component for inventory reconciliation using scanning. 
 * Follows ERP standards: Modular i18n, BaseText, Keyboard-First, Loading states.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ScanLine, Camera, CheckCircle, AlertCircle } from 'lucide-vue-next'
import Button from 'primevue/button'
import { useKeyboardShortcuts } from '../../utils/keyboard'
import BaseText from '../../components/base/BaseText.vue'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
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
  // Simulate logic to save audit
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
</script>

<template>
  <div class="h-full flex flex-col bg-slate-50 dark:bg-midnight">
    <header class="p-6 flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50">
      <div class="flex items-center gap-4">
        <Button @click="router.back()" text class="!text-slate-400">
          <ArrowLeft class="w-6 h-6" />
        </Button>
        <BaseText type="h1">{{ t('inventory.stock_audit') }}</BaseText>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
         <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
         <BaseText weight="black" color="emerald" size="text-[10px]" class="uppercase tracking-widest">{{ t('inventory.main_warehouse') }}</BaseText>
      </div>
    </header>

    <main class="flex-1 p-6 space-y-6 overflow-y-auto">
      <!-- Camera Placeholder -->
      <div class="aspect-video max-w-2xl mx-auto glass-dark rounded-[2.5rem] border-4 border-primary-500/30 flex flex-col items-center justify-center relative overflow-hidden group">
         <div class="absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent"></div>
         <ScanLine class="w-20 h-20 text-primary-500 mb-4 animate-bounce" />
         <BaseText type="body" weight="bold" size="text-lg" class="!text-white mb-8 uppercase tracking-widest">
           {{ t('inventory.waiting_scan') }}
         </BaseText>
         
         <Button 
           @click="scanning = !scanning"
           class="!bg-primary-500 hover:!bg-primary-600 !border-none !text-white !px-10 !py-4 !rounded-2xl !font-black shadow-2xl shadow-primary-500/40 flex items-center gap-3 transition-all transform active:scale-95"
         >
           <Camera class="w-6 h-6" />
           <BaseText weight="black" class="!text-white">
             {{ scanning ? t('inventory.stop_camera') : t('inventory.start_scanning') }}
           </BaseText>
         </Button>

         <!-- Scanner Beam Animation -->
         <div v-if="scanning" class="absolute top-0 left-0 right-0 h-1 bg-primary-500 shadow-[0_0_20px_#4f46e5] animate-[scan_2s_ease-in-out_infinite]"></div>
      </div>

      <!-- Scanned List -->
      <div class="max-w-2xl mx-auto space-y-4">
         <div class="flex items-center justify-between px-2">
            <BaseText weight="bold" class="!text-slate-500 uppercase tracking-widest text-xs">{{ t('inventory.last_scanned') }}</BaseText>
            <BaseText weight="bold" color="primary" size="text-xs">{{ scannedItems.length }} {{ t('common.units') }}</BaseText>
         </div>

         <div v-for="item in scannedItems" :key="item.serial" class="glass p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div class="flex items-center gap-4">
               <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="item.status === 'match' ? 'bg-emerald-500/10' : 'bg-red-500/10'">
                  <CheckCircle v-if="item.status === 'match'" class="w-5 h-5 text-emerald-500" />
                  <AlertCircle v-else class="w-5 h-5 text-red-500" />
               </div>
               <div class="flex flex-col">
                  <BaseText weight="bold">{{ item.name }}</BaseText>
                  <BaseText type="label" size="text-xs" class="font-mono">{{ item.serial }}</BaseText>
               </div>
            </div>
            <div 
              class="px-2 py-1 rounded-lg"
              :class="item.status === 'match' ? 'bg-emerald-500/5' : 'bg-red-500/5'"
            >
              <BaseText weight="black" size="text-[10px]" class="uppercase" :color="item.status === 'match' ? 'emerald' : 'danger'">
                {{ t('common.' + item.status) }}
              </BaseText>
            </div>
         </div>
      </div>
    </main>

    <footer class="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/5 flex justify-center">
       <Button 
         v-can="'edit_inventory'"
         @click="finishAudit"
         :loading="loading"
         class="w-full max-w-lg !bg-slate-900 dark:!bg-white !text-white dark:!text-slate-900 !py-4 !rounded-2xl !font-black shadow-xl transition-all transform active:scale-95"
       >
         <BaseText weight="black" class="!text-white dark:!text-slate-900">
           {{ t('inventory.finish_audit') }} (F9)
         </BaseText>
       </Button>
    </footer>
  </div>
</template>

<style scoped>
@keyframes scan {
  0% { top: 0; }
  50% { top: 100%; }
  100% { top: 0; }
}
</style>
