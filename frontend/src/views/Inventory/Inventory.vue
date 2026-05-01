<script setup>
import { onMounted, watch, onUnmounted } from 'vue'
import { useInventoryStore } from '../../stores/inventory'
import { useI18n } from 'vue-i18n'
import AddProductModal from '../../components/AddProductModal.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import { Package, RefreshCw, Plus, Truck, BarChart3, Search } from 'lucide-vue-next'
import { ref } from 'vue'
import { useKeyboardShortcuts } from '../../utils/keyboard'
import { db } from '../../database/db'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const toast = useToast()
const inventoryStore = useInventoryStore()
const showAddModal = ref(false)
const isSaving = ref(false)
const searchQuery = ref('')

// Keyboard shortcuts for this view
const { register, unregister } = useKeyboardShortcuts({
  onSave: () => { showAddModal.value = true }, // F9 opens Add Modal
  onSearch: () => { /* Focus search input if implemented */ }
})

onMounted(async () => {
  await inventoryStore.loadWarehouses()
  await inventoryStore.fetchInventory()
  register()
})

onUnmounted(() => {
  unregister()
})

// Handler for saving product (Smart Logic in the View)
const handleSaveProduct = async (productData) => {
  isSaving.value = true
  try {
    await db.products.add(productData)
    toast.add({ severity: 'success', summary: t('success'), detail: t('product_added'), life: 3000 })
    await inventoryStore.fetchInventory()
    showAddModal.value = false
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('product_failed'), life: 3000 })
  } finally {
    isSaving.value = false
  }
}

// Re-fetch when warehouse changes
watch(() => inventoryStore.selectedWarehouseId, () => {
  inventoryStore.fetchInventory()
})
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- Header & Actions -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-black flex items-center gap-4 text-slate-900 dark:text-white">
          <div class="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
            <Package class="w-8 h-8 text-primary-500" />
          </div>
          {{ t('inventory') }}
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium opacity-80">
          {{ t('inventory_tracking') }} عبر <span class="text-primary-500 font-bold">{{ inventoryStore.warehouses.length }} {{ t('warehouses') }}</span>
        </p>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <Dropdown 
          v-model="inventoryStore.selectedWarehouseId" 
          :options="inventoryStore.warehouses" 
          optionLabel="name" 
          optionValue="id"
          class="!bg-white dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !rounded-2xl !min-w-[200px]"
          :placeholder="t('warehouses')"
        />
        
        <Button 
          class="!bg-slate-100 dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !text-slate-600 dark:!text-slate-300 !px-5 !rounded-2xl"
          @click="inventoryStore.fetchInventory()"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': inventoryStore.loading }" />
        </Button>

        <Button 
          v-can="'manage_warehouses'"
          severity="secondary"
          @click="$router.push('/inventory/transfer')"
          class="!bg-indigo-500/10 !border-indigo-500/20 !text-indigo-600 dark:!text-indigo-400 !px-5 !rounded-2xl font-bold flex items-center gap-2"
        >
          <Truck class="w-4 h-4" />
          <span>{{ t('transfers') }}</span>
        </Button>

        <Button 
          v-can="'edit_inventory'"
          @click="showAddModal = true"
          class="!bg-primary-500 hover:!bg-primary-600 !border-none !text-white !px-8 !py-3 !rounded-2xl !font-black shadow-xl shadow-primary-500/20 flex items-center gap-2 transform hover:-translate-y-1 transition-all"
        >
          <Plus class="w-5 h-5" />
          <span>{{ t('add_product') }}</span>
        </Button>
      </div>
    </div>

    <!-- Stats Mini-Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
       <div class="glass p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
            <Package class="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">{{ t('total_items') }}</p>
            <p class="text-xl font-black text-slate-900 dark:text-white">{{ inventoryStore.products.length }}</p>
          </div>
       </div>
       <div class="glass p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <BarChart3 class="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">{{ t('estimated_value') }}</p>
            <p class="text-xl font-black text-slate-900 dark:text-white">1,240,000 <small class="text-[10px]">{{ t('egp') }}</small></p>
          </div>
       </div>
    </div>

    <!-- Dumb Modal used by Smart Parent -->
    <AddProductModal 
      v-model:visible="showAddModal" 
      :loading="isSaving"
      @save="handleSaveProduct" 
    />

    <!-- Inventory Table -->
    <div class="glass rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl">
      <DataTable 
        :value="inventoryStore.products" 
        :loading="inventoryStore.loading"
        paginator :rows="10" 
        class="!bg-transparent"
        :pt="{
          table: { class: 'w-full text-left border-collapse' },
          thead: { class: 'bg-slate-50 dark:bg-white/5' },
          column: {
            headerCell: { class: '!bg-transparent !text-slate-500 dark:!text-slate-400 !font-bold !p-5 !border-b !border-slate-200 dark:!border-white/10 uppercase text-xs tracking-wider' },
            bodyCell: { class: '!p-5 !border-b !border-slate-100 dark:!border-white/5 !text-slate-700 dark:!text-slate-200' }
          },
          paginator: {
             root: { class: '!bg-slate-50 dark:!bg-white/5 !border-t !border-slate-200 dark:!border-white/5 !p-4' }
          }
        }"
      >
        <template #empty>
          <div class="py-20 text-center text-slate-500 italic">{{ t('no_products') }}</div>
        </template>

        <Column field="name" :header="t('add_product')" sortable>
          <template #body="slotProps">
            <div class="flex flex-col">
              <span class="font-bold text-slate-900 dark:text-white">{{ slotProps.data.name }}</span>
              <span class="text-xs text-slate-500">{{ slotProps.data.brand }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="category" :header="t('category')" sortable>
          <template #body="slotProps">
            <span class="px-3 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20 text-[10px] font-bold text-primary-500 uppercase tracking-tighter">
              {{ slotProps.data.category }}
            </span>
          </template>
        </Column>

        <Column field="stock" :header="t('stock')" sortable>
          <template #body="slotProps">
            <div v-if="slotProps.data.stock > 0" class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span class="font-black text-emerald-600 dark:text-emerald-400 text-lg">{{ slotProps.data.stock }}</span>
            </div>
            <div v-else class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-red-500"></div>
              <span class="font-bold text-red-500">{{ t('out_of_stock') }}</span>
            </div>
          </template>
        </Column>

        <Column field="type" :header="t('type')">
           <template #body="slotProps">
             <span class="text-xs font-medium text-slate-500">{{ slotProps.data.type === 'serial' ? t('serial') : t('bulk') }}</span>
           </template>
        </Column>

        <Column class="w-20">
          <template #body>
            <Button text rounded icon="pi pi-ellipsis-v" class="!text-slate-400" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
