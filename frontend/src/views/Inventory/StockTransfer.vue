<script setup>
/**
 * @file StockTransfer.vue
 * @description Smart component for inter-warehouse stock transfers.
 * Follows ERP standards: Modular i18n, BaseText, BaseTable, Keyboard-First.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useInventoryStore } from '../../stores/inventory'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { db } from '../../database/db'
import Button from 'primevue/button'
import Column from 'primevue/column'
import { Truck, ArrowLeft, Plus, Trash2, CheckCircle, Info } from 'lucide-vue-next'
import { useToast } from 'primevue/usetoast'
import { useKeyboardShortcuts } from '../../utils/keyboard'
import BaseText from '../../components/base/BaseText.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseTable from '../../components/base/BaseTable.vue'

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
    toast.add({ severity: 'warn', summary: t('common.loading'), detail: t('inventory.select_source'), life: 3000 })
    return
  }
  
  const allItems = await db.items.where({ warehouse_id: fromWarehouse.value, status: 'available' }).limit(5).toArray()
  if (allItems.length === 0) {
    toast.add({ severity: 'warn', summary: t('common.loading'), detail: t('inventory.out_of_stock'), life: 3000 })
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
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('common.loading'), life: 3000 })
    return
  }
  
  if (fromWarehouse.value === toWarehouse.value) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('inventory.same_warehouse_error'), life: 3000 })
    return
  }

  loading.value = true
  try {
    await inventoryStore.transferStock(fromWarehouse.value, toWarehouse.value, transferItems.value)
    toast.add({ severity: 'success', summary: t('common.success'), detail: t('inventory.transfer_success'), life: 3000 })
    router.push('/inventory')
  } catch (err) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('inventory.transfer_error'), life: 3000 })
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
        <BaseText type="h1">{{ t('inventory.new_transfer') }}</BaseText>
      </div>
      <Button 
        v-can="'manage_warehouses'"
        @click="submitTransfer" 
        :loading="loading"
        class="!bg-emerald-500 hover:!bg-emerald-600 !border-none !text-white !px-10 !py-3 !rounded-2xl !font-black shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-all transform active:scale-95"
      >
        <CheckCircle v-if="!loading" class="w-5 h-5" />
        <BaseText weight="black" class="!text-white">{{ t('inventory.confirm_and_ship') }} (F9)</BaseText>
      </Button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Transfer Setup -->
      <div class="lg:col-span-1 space-y-6">
        <div class="glass p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-6">
          <div class="space-y-2">
            <BaseText type="label">{{ t('inventory.from_warehouse') }}</BaseText>
            <BaseSelect 
              v-model="fromWarehouse" 
              :options="inventoryStore.warehouses" 
              optionLabel="name" 
              optionValue="id"
              :placeholder="t('inventory.select_source')"
              class="w-full"
            />
          </div>

          <div class="flex justify-center py-2">
            <div class="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
               <Truck class="w-5 h-5 text-primary-500" />
            </div>
          </div>

          <div class="space-y-2">
            <BaseText type="label">{{ t('inventory.to_warehouse') }}</BaseText>
            <BaseSelect 
              v-model="toWarehouse" 
              :options="inventoryStore.warehouses" 
              optionLabel="name" 
              optionValue="id"
              :placeholder="t('inventory.select_destination')"
              class="w-full"
            />
          </div>
        </div>

        <div class="p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 space-y-2">
           <div class="flex items-center gap-2">
             <Info class="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 
             <BaseText weight="bold" color="primary">{{ t('common.dashboard') }}</BaseText>
           </div>
           <BaseText size="text-xs" class="!text-indigo-600 dark:!text-indigo-400">
             {{ t('inventory.transfer_note') }}
           </BaseText>
        </div>
      </div>

      <!-- Items List -->
      <div class="lg:col-span-2 space-y-6">
        <div class="glass rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col min-h-[400px]">
           <div class="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <BaseText weight="bold">{{ t('inventory.items_to_transfer') }}</BaseText>
              <Button @click="addItem" text class="!text-primary-500 !font-bold flex items-center gap-2">
                <Plus class="w-4 h-4" />
                <BaseText weight="bold" color="primary">{{ t('inventory.add_item') }}</BaseText>
              </Button>
           </div>

           <BaseTable 
            :value="transferItems" 
            :emptyMessage="t('inventory.no_items_transfer')"
            class="h-full"
           >
             <Column field="name" :header="t('inventory.add_product')">
                <template #body="slotProps">
                   <div class="flex flex-col">
                     <BaseText weight="bold">{{ slotProps.data.name }}</BaseText>
                     <BaseText type="label" size="text-xs">{{ slotProps.data.serial_number }}</BaseText>
                   </div>
                </template>
             </Column>
             
             <Column class="w-20">
                <template #body="slotProps">
                   <Button @click="removeItem(slotProps.data.serial_number)" text rounded severity="danger" class="hover:!bg-red-500/10">
                     <Trash2 class="w-5 h-5 text-red-500" />
                   </Button>
                </template>
             </Column>

             <template #mobile-card="{ data: item }">
                <div class="flex justify-between items-start">
                   <div class="flex flex-col">
                     <BaseText weight="bold">{{ item.name }}</BaseText>
                     <BaseText type="label" size="text-xs">{{ item.serial_number }}</BaseText>
                   </div>
                   <Button @click="removeItem(item.serial_number)" text rounded severity="danger">
                     <Trash2 class="w-4 h-4" />
                   </Button>
                </div>
             </template>
           </BaseTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* BaseTable handles the internal styling */
</style>
