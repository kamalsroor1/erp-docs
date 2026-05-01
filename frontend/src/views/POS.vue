<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCartStore } from '../store/cart'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '../store/ui'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ShoppingCart, ScanLine, Trash2, CreditCard, ArrowLeft, Sun, Moon, Languages } from 'lucide-vue-next'

const cartStore = useCartStore()
const uiStore = useUIStore()
const router = useRouter()
const toast = useToast()
const { t, locale } = useI18n()

const serialInput = ref('')
const inputRef = ref(null)

const handleScan = async () => {
  if (!serialInput.value) return
  
  try {
    await cartStore.addItemBySerial(serialInput.value)
    serialInput.value = ''
    toast.add({ severity: 'success', summary: t('pos'), detail: 'تمت الإضافة بنجاح', life: 1000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: 'خطأ', detail: err.message, life: 3000 })
  }
}

const toggleLocale = () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  uiStore.setLocale(newLocale)
  locale.value = newLocale
}

onMounted(() => {
  inputRef.value?.$el.focus()
})
</script>

<template>
  <div class="h-full flex flex-col bg-midnight text-slate-200 overflow-hidden">
    <!-- POS Header -->
    <header class="h-20 flex items-center justify-between px-8 border-b border-white/5 glass-dark z-50">
      <div class="flex items-center gap-6">
        <Button @click="router.push('/')" text class="!text-slate-400 hover:!bg-white/5 !px-4 !py-2 !rounded-xl">
          <ArrowLeft class="w-5 h-5" :class="uiStore.isRTL ? 'rotate-180' : ''" />
          <span class="mx-2 font-bold">{{ t('dashboard') }}</span>
        </Button>
        <div class="h-8 w-[1px] bg-white/10"></div>
        <h1 class="text-2xl font-black text-gradient">{{ t('pos') }}</h1>
      </div>
      
      <div class="flex items-center gap-4">
         <!-- Theme/Lang Toggles -->
        <Button @click="uiStore.toggleTheme" text rounded class="!text-slate-400">
          <Sun v-if="uiStore.isDark" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </Button>
        <Button @click="toggleLocale" text rounded class="!text-slate-400 font-bold">
          {{ locale === 'ar' ? 'EN' : 'AR' }}
        </Button>

        <div class="h-8 w-[1px] bg-white/10 mx-2"></div>

        <div class="text-right hidden sm:block">
          <p class="text-sm font-bold text-white">{{ t('cashier') }} #01</p>
          <p class="text-xs text-emerald-400 font-bold uppercase tracking-widest">Active Session</p>
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
            :placeholder="uiStore.isRTL ? 'امسح الباركود أو أدخل الرقم التسلسلي...' : 'Scan barcode or enter serial number...'" 
            class="w-full !pl-16 !p-6 !text-2xl !bg-white/5 !border-white/10 !rounded-3xl focus:!border-primary-500/50 !text-white shadow-2xl relative z-10 transition-all"
          />
        </div>

        <!-- Cart Table -->
        <div class="flex-1 glass rounded-3xl overflow-hidden border border-white/5 flex flex-col shadow-inner">
          <DataTable 
            :value="cartStore.items" 
            scrollable 
            scrollHeight="flex"
            class="!bg-transparent"
            :pt="{
              table: { class: 'w-full text-left border-collapse' },
              thead: { class: 'bg-white/5 sticky top-0 z-10' },
              column: {
                headerCell: { class: '!bg-transparent !text-slate-400 !font-bold !p-5 !border-b !border-white/10 uppercase text-xs' },
                bodyCell: { class: '!p-5 !border-b !border-white/5 !text-slate-200' }
              }
            }"
          >
            <template #empty>
              <div class="flex flex-col items-center justify-center py-32 text-slate-500">
                <ShoppingCart class="w-20 h-20 mb-6 opacity-10" />
                <p class="text-xl font-bold opacity-30 italic">{{ uiStore.isRTL ? 'السلة فارغة.. ابدأ البيع' : 'Cart is empty. Start scanning!' }}</p>
              </div>
            </template>
            <Column field="name" :header="uiStore.isRTL ? 'المنتج' : 'Product'"></Column>
            <Column field="serial_number" :header="uiStore.isRTL ? 'السيريال' : 'Serial'"></Column>
            <Column field="price" :header="uiStore.isRTL ? 'السعر' : 'Price'">
              <template #body="slotProps">
                <span class="font-black text-white text-lg">{{ slotProps.data.price }} <small class="text-[10px] text-slate-500">EGP</small></span>
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
      <aside class="w-[420px] glass-dark border-white/5 p-10 flex flex-col shadow-2xl relative z-20" :class="uiStore.isRTL ? 'border-r' : 'border-l'">
        <div class="flex items-center gap-3 mb-10">
           <div class="w-2 h-8 bg-primary-500 rounded-full"></div>
           <h2 class="text-3xl font-black text-white">{{ uiStore.isRTL ? 'الفاتورة' : 'Invoice' }}</h2>
        </div>
        
        <div class="space-y-6 flex-1">
          <div class="flex justify-between items-center text-slate-400">
            <span class="font-bold text-lg">{{ uiStore.isRTL ? 'المجموع الفرعي' : 'Subtotal' }}</span>
            <span class="text-white font-black text-xl">{{ cartStore.subtotal }} <small class="text-[10px]">EGP</small></span>
          </div>
          <div class="flex justify-between items-center text-slate-400">
            <span class="font-bold text-lg">{{ uiStore.isRTL ? 'الضريبة (14%)' : 'VAT (14%)' }}</span>
            <span class="text-white font-black text-xl">{{ cartStore.tax.toFixed(2) }} <small class="text-[10px]">EGP</small></span>
          </div>
          <div class="pt-8 border-t border-white/10 flex flex-col gap-2">
            <span class="text-slate-500 font-bold uppercase tracking-widest text-xs">{{ uiStore.isRTL ? 'إجمالي المستحق' : 'Total Amount' }}</span>
            <div class="flex justify-between items-end">
                <span class="text-5xl font-black text-primary-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">{{ cartStore.total.toFixed(0) }}</span>
                <span class="text-2xl font-black text-slate-500 mb-1 ml-2">EGP</span>
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-10">
          <Button 
            :disabled="cartStore.items.length === 0"
            class="w-full !bg-primary-500 hover:!bg-primary-600 !border-none !p-6 !rounded-3xl !font-black !text-white !text-2xl shadow-2xl shadow-primary-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-4 disabled:!opacity-30"
          >
            <CreditCard class="w-8 h-8" />
            <span>{{ uiStore.isRTL ? 'إتمام الدفع' : 'PAY NOW' }}</span>
          </Button>
          
          <Button 
            @click="cartStore.clearCart"
            text
            class="w-full !text-slate-500 hover:!text-red-400 !font-bold !py-4"
          >
            {{ uiStore.isRTL ? 'إلغاء العملية' : 'Cancel Transaction' }}
          </Button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-datatable-header) { background: transparent !important; border: none !important; }
</style>
