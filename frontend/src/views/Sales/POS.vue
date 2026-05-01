<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useCartStore } from '../../stores/cart'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '../../stores/ui'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ShoppingCart, ScanLine, Trash2, CreditCard, ArrowLeft, Sun, Moon, Languages } from 'lucide-vue-next'
import { useKeyboardShortcuts } from '../../utils/keyboard'

const cartStore = useCartStore()
const uiStore = useUIStore()
const router = useRouter()
const toast = useToast()
const { t, locale } = useI18n()

const serialInput = ref('')
const inputRef = ref(null)
const isProcessing = ref(false)

const handleScan = async () => {
  if (!serialInput.value) return
  
  try {
    await cartStore.addItemBySerial(serialInput.value)
    serialInput.value = ''
    toast.add({ severity: 'success', summary: t('pos'), detail: t('loading'), life: 1000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: err.message, life: 3000 })
  }
}

const handlePayment = async () => {
  if (cartStore.items.length === 0) return
  isProcessing.value = true
  // Simulate API call
  setTimeout(() => {
    isProcessing.value = false
    toast.add({ severity: 'success', summary: t('success'), detail: t('pos_success'), life: 3000 })
    cartStore.clearCart()
  }, 2000)
}

const toggleLocale = () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  uiStore.setLocale(newLocale)
  locale.value = newLocale
}

// Keyboard shortcuts for POS
const { register, unregister } = useKeyboardShortcuts({
  onSave: handlePayment, // F9 for payment
  onCancel: () => cartStore.clearCart(), // Esc to clear
  onSearch: () => inputRef.value?.$el.focus() // F2 focus scanner
})

onMounted(() => {
  inputRef.value?.$el.focus()
  register()
})

onUnmounted(() => {
  unregister()
})
</script>

<template>
  <div class="h-full flex flex-col transition-colors duration-300 overflow-hidden" :class="uiStore.isDark ? 'bg-midnight text-slate-200' : 'bg-slate-50 text-slate-900'">
    <!-- POS Header -->
    <header class="h-20 flex items-center justify-between px-8 border-b glass-dark z-50" :class="uiStore.isDark ? 'border-white/5' : 'border-slate-200'">
      <div class="flex items-center gap-6">
        <Button @click="router.push('/')" text class="!text-slate-400 hover:!bg-white/5 !px-4 !py-2 !rounded-xl">
          <ArrowLeft class="w-5 h-5" :class="uiStore.isRTL ? 'rotate-180' : ''" />
          <span class="mx-2 font-bold">{{ t('dashboard') }}</span>
        </Button>
        <div class="h-8 w-[1px]" :class="uiStore.isDark ? 'bg-white/10' : 'bg-slate-200'"></div>
        <h1 class="text-2xl font-black text-gradient">{{ t('pos') }}</h1>
      </div>
      
      <div class="flex items-center gap-4">
         <!-- Theme/Lang Toggles -->
        <Button @click="uiStore.toggleTheme" text rounded class="!text-slate-400">
          <Sun v-if="uiStore.isDark" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </Button>
        <Button @click="toggleLocale" text rounded class="!text-slate-400 font-bold uppercase">
          {{ locale === 'ar' ? 'EN' : 'عربي' }}
        </Button>

        <div class="h-8 w-[1px] mx-2" :class="uiStore.isDark ? 'bg-white/10' : 'bg-slate-200'"></div>

        <div class="text-right hidden sm:block">
          <p class="text-sm font-bold" :class="uiStore.isDark ? 'text-white' : 'text-slate-900'">{{ t('cashier') }} #01</p>
          <p class="text-xs text-emerald-400 font-bold uppercase tracking-widest">{{ t('active_session') }}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <ShoppingCart class="w-6 h-6 text-emerald-400" />
        </div>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- Left: Cart & Scanner -->
      <div class="flex-1 flex flex-col p-8 space-y-8 overflow-hidden">
        <!-- Scanner Input -->
        <div class="relative group">
          <div class="absolute inset-0 bg-primary-500/10 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <ScanLine class="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-primary-400 z-10" />
          <InputText 
            ref="inputRef"
            v-model="serialInput" 
            @keyup.enter="handleScan"
            :placeholder="t('scan_placeholder')" 
            class="w-full !pl-16 !p-6 !text-2xl !bg-white/5 !border-white/10 !rounded-3xl focus:!border-primary-500/50 shadow-2xl relative z-10 transition-all"
            :class="uiStore.isDark ? '!text-white !bg-white/5' : '!text-slate-900 !bg-white !border-slate-200'"
          />
        </div>

        <!-- Cart Table -->
        <div class="flex-1 glass rounded-3xl overflow-hidden border flex flex-col shadow-inner" :class="uiStore.isDark ? 'border-white/5' : 'border-slate-200'">
          <DataTable 
            :value="cartStore.items" 
            scrollable 
            scrollHeight="flex"
            class="!bg-transparent"
            :pt="{
              table: { class: 'w-full text-left border-collapse' },
              thead: { class: uiStore.isDark ? 'bg-white/5 sticky top-0 z-10' : 'bg-slate-50 sticky top-0 z-10' },
              column: {
                headerCell: { class: '!bg-transparent !text-slate-400 !font-bold !p-5 !border-b !border-white/10 uppercase text-xs' },
                bodyCell: { class: '!p-5 !border-b !border-white/5' }
              }
            }"
          >
            <template #empty>
              <div class="flex flex-col items-center justify-center py-32 text-slate-500">
                <ShoppingCart class="w-20 h-20 mb-6 opacity-10" />
                <p class="text-xl font-bold opacity-30 italic">{{ t('no_products') }}</p>
              </div>
            </template>
            <Column field="name" :header="t('add_product')"></Column>
            <Column field="serial_number" :header="t('serial')"></Column>
            <Column field="price" :header="t('estimated_value')">
              <template #body="slotProps">
                <span class="font-black text-lg" :class="uiStore.isDark ? 'text-white' : 'text-slate-900'">{{ slotProps.data.price }} <small class="text-[10px] text-slate-500">{{ t('egp') }}</small></span>
              </template>
            </Column>
            <Column class="w-20">
              <template #body="slotProps">
                <Button 
                  @click="cartStore.removeItem(slotProps.data.serial_number)"
                  text rounded severity="danger" 
                  class="hover:!bg-red-500/10 !p-3"
                >
                  <Trash2 class="w-5 h-5" />
                </Button>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

      <!-- Right: Summary & Checkout -->
      <aside class="w-[420px] glass-dark p-10 flex flex-col shadow-2xl relative z-20 border-white/5" :class="[uiStore.isRTL ? 'border-r' : 'border-l', uiStore.isDark ? 'bg-slate-900/50' : 'bg-white']">
        <div class="flex items-center gap-3 mb-10">
           <div class="w-2 h-8 bg-primary-500 rounded-full"></div>
           <h2 class="text-3xl font-black" :class="uiStore.isDark ? 'text-white' : 'text-slate-900'">{{ t('invoice') }}</h2>
        </div>
        
        <div class="space-y-6 flex-1">
          <div class="flex justify-between items-center text-slate-400">
            <span class="font-bold text-lg">{{ t('subtotal') }}</span>
            <span class="font-black text-xl" :class="uiStore.isDark ? 'text-white' : 'text-slate-900'">{{ cartStore.subtotal }} <small class="text-[10px]">{{ t('egp') }}</small></span>
          </div>
          <div class="flex justify-between items-center text-slate-400">
            <span class="font-bold text-lg">{{ t('vat') }}</span>
            <span class="font-black text-xl" :class="uiStore.isDark ? 'text-white' : 'text-slate-900'">{{ cartStore.tax.toFixed(2) }} <small class="text-[10px]">{{ t('egp') }}</small></span>
          </div>
          <div class="pt-8 border-t flex flex-col gap-2" :class="uiStore.isDark ? 'border-white/10' : 'border-slate-100'">
            <span class="text-slate-500 font-bold uppercase tracking-widest text-xs">{{ t('total_due') }}</span>
            <div class="flex justify-between items-end">
                <span class="text-5xl font-black text-primary-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">{{ cartStore.total.toFixed(0) }}</span>
                <span class="text-2xl font-black text-slate-500 mb-1 ml-2">{{ t('egp') }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-10">
          <Button 
            v-can="'make_sales'"
            @click="handlePayment"
            :loading="isProcessing"
            :disabled="cartStore.items.length === 0"
            class="w-full !bg-primary-500 hover:!bg-primary-600 !border-none !p-6 !rounded-3xl !font-black !text-white !text-2xl shadow-2xl shadow-primary-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-4 disabled:!opacity-30"
          >
            <CreditCard class="w-8 h-8" />
            <span>{{ t('pay_now') }}</span>
          </Button>
          
          <Button 
            @click="cartStore.clearCart"
            text
            class="w-full !text-slate-500 hover:!text-red-400 !font-bold !py-4"
          >
            {{ t('cancel_transaction') }}
          </Button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-datatable-header) { background: transparent !important; border: none !important; }
</style>
