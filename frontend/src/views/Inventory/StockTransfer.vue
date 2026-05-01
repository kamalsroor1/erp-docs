<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useInventoryStore } from '../../stores/inventory'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { db } from '../../database/db'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { Truck, ArrowLeft, Plus, Trash2, CheckCircle, Info } from 'lucide-vue-next'
import { useToast } from 'primevue/usetoast'
import { useKeyboardShortcuts } from '../../utils/keyboard'

const { t } = useI18n()
const router = useRouter()
const inventoryStore = useInventoryStore()
const toast = useToast()

const fromWarehouse = ref(null)
const toWarehouse = ref(null)
const transferItems = ref([])
const loading = ref(false)

const addItem = async () => {
  if (!fromWarehouse.value) {
    toast.add({ severity: 'warn', summary: t('loading'), detail: t('select_source'), life: 3000 })
    return
  }
  
  const allItems = await db.items.where({ warehouse_id: fromWarehouse.value, status: 'available' }).limit(5).toArray()
  if (allItems.length === 0) {
    toast.add({ severity: 'warn', summary: t('loading'), detail: t('out_of_stock'), life: 3000 })
    return
  }
  
  const item = allItems[0]
  if (!transferItems.value.find(i => i.serial_number === item.serial_number)) {
    const product = await db.products.get(item.product_id)
    transferItems.value.push({
      product_id: item.product_id,
      name: product.name,
      serial_number: item.serial_number,
      quantity: 1
    })
  }
}

const removeItem = (serial) => {
  transferItems.value = transferItems.value.filter(i => i.serial_number !== serial)
}

const submitTransfer = async () => {
  if (!fromWarehouse.value || !toWarehouse.value || transferItems.value.length === 0) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('loading'), life: 3000 })
    return
  }
  
  if (fromWarehouse.value === toWarehouse.value) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('same_warehouse_error'), life: 3000 })
    return
  }

  loading.value = true
  try {
    await inventoryStore.transferStock(fromWarehouse.value, toWarehouse.value, transferItems.value)
    toast.add({ severity: 'success', summary: t('success'), detail: t('transfer_success'), life: 3000 })
    router.push('/inventory')
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('transfer_error'), life: 3000 })
  } finally {
    loading.value = false
  }
}

const { register, unregister } = useKeyboardShortcuts({
  onSave: submitTransfer,
  onCancel: () => router.back()
})

onMounted(() => {
  inventoryStore.loadWarehouses()
  register()
})

onUnmounted(() => {
  unregister()
})
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button @click="router.back()" text class="!text-slate-400">
          <ArrowLeft class="w-6 h-6" />
        </Button>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white">{{ t('new_transfer') }}</h1>
      </div>
      <Button 
        v-can="'manage_warehouses'"
        @click="submitTransfer" 
        :loading="loading"
        class="!bg-emerald-500 hover:!bg-emerald-600 !border-none !text-white !px-10 !py-3 !rounded-2xl !font-black shadow-xl shadow-emerald-500/20 flex items-center gap-2"
      >
        <CheckCircle class="w-5 h-5" />
        <span>{{ t('confirm_and_ship') }} (F9)</span>
      </Button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Transfer Setup -->
      <div class="lg:col-span-1 space-y-6">
        <div class="glass p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ t('from_warehouse') }}</label>
            <Dropdown 
              v-model="fromWarehouse" 
              :options="inventoryStore.warehouses" 
              optionLabel="name" 
              optionValue="id"
              :placeholder="t('select_source')"
              class="w-full !bg-slate-50 dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !rounded-2xl"
            />
          </div>

          <div class="flex justify-center py-2">
            <div class="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
               <Truck class="w-5 h-5 text-primary-500" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ t('to_warehouse') }}</label>
            <Dropdown 
              v-model="toWarehouse" 
              :options="inventoryStore.warehouses" 
              optionLabel="name" 
              optionValue="id"
              :placeholder="t('select_destination')"
              class="w-full !bg-slate-50 dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !rounded-2xl"
            />
          </div>
        </div>

        <div class="p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 text-sm text-indigo-600 dark:text-indigo-400">
           <p class="font-bold flex items-center gap-2 mb-2">
             <Info class="w-4 h-4" /> {{ t('dashboard') }}
           </p>
           {{ t('transfer_note') }}
        </div>
      </div>

      <!-- Items List -->
      <div class="lg:col-span-2 space-y-6">
        <div class="glass rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col min-h-[400px]">
           <div class="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <h3 class="font-bold text-slate-900 dark:text-white">{{ t('items_to_transfer') }}</h3>
              <Button @click="addItem" text class="!text-primary-500 !font-bold flex items-center gap-2">
                <Plus class="w-4 h-4" />
                {{ t('add_item') }}
              </Button>
           </div>

           <DataTable 
            :value="transferItems" 
            class="!bg-transparent"
            :pt="{
              table: { class: 'w-full text-left' },
              thead: { class: 'hidden' },
              column: {
                bodyCell: { class: '!p-6 !border-b !border-slate-100 dark:!border-white/5 !text-slate-700 dark:!text-slate-200' }
              }
            }"
           >
             <template #empty>
               <div class="py-20 text-center text-slate-400 italic">{{ t('no_items_transfer') }}</div>
             </template>
             
             <Column field="name">
                <template #body="slotProps">
                   <div class="flex flex-col">
                     <span class="font-bold">{{ slotProps.data.name }}</span>
                     <span class="text-xs text-slate-500">{{ slotProps.data.serial_number }}</span>
                   </div>
                </template>
             </Column>
             
             <Column class="w-20">
                <template #body="slotProps">
                   <Button @click="removeItem(slotProps.data.serial_number)" text rounded severity="danger" class="hover:!bg-red-500/10">
                     <Trash2 class="w-5 h-5" />
                   </Button>
                </template>
             </Column>
           </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>
