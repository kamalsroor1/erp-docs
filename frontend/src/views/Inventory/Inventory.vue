<script setup>
/**
 * @file Inventory.vue
 * @description Smart component for managing inventory. 
 * Follows ERP standards: i18n (Modular), RBAC, Keyboard-First, Base Components.
 */
import { onMounted, watch, onUnmounted, computed, ref } from 'vue'
import { useInventoryStore } from '../../stores/inventory'
import { useUIStore } from '../../stores/ui'
import { useI18n } from 'vue-i18n'
import AddProductModal from '../../components/AddProductModal.vue'
import InputText from 'primevue/inputtext'
import BaseTable from '../../components/base/BaseTable.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseText from '../../components/base/BaseText.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { 
  Package, 
  RefreshCw, 
  Plus, 
  Truck, 
  BarChart3, 
  Search, 
  FileText, 
  Filter,
  MoreVertical,
  History,
  Smartphone,
  Laptop
} from 'lucide-vue-next'
import { useKeyboardShortcuts } from '../../utils/keyboard'
import { db } from '../../database/db'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const toast = useToast()
const inventoryStore = useInventoryStore()
const uiStore = useUIStore()

const showAddModal = ref(false)
const isSaving = ref(false)
const searchQuery = ref('')

// Filtered products for search
const filteredProducts = computed(() => {
  if (!searchQuery.value) return inventoryStore.products
  const q = searchQuery.value.toLowerCase()
  return inventoryStore.products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.brand.toLowerCase().includes(q) || 
    p.barcode?.includes(q)
  )
})

// Keyboard shortcuts
const { register, unregister } = useKeyboardShortcuts({
  onSave: () => { showAddModal.value = true },
  onSearch: () => { document.querySelector('#inventory-search')?.focus() }
})

onMounted(async () => {
  await inventoryStore.loadWarehouses()
  await inventoryStore.fetchInventory()
  register()
})

onUnmounted(() => {
  unregister()
})

const handleSaveProduct = async (productData) => {
  isSaving.value = true
  try {
    await db.products.add(productData)
    toast.add({ severity: 'success', summary: t('common.success'), detail: t('inventory.product_added'), life: 3000 })
    await inventoryStore.fetchInventory()
    showAddModal.value = false
  } catch (err) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('inventory.product_failed'), life: 3000 })
  } finally {
    isSaving.value = false
  }
}

// Re-fetch when warehouse OR branch changes
watch(() => [inventoryStore.selectedWarehouseId, uiStore.selectedBranchId], async () => {
  await inventoryStore.loadWarehouses()
  await inventoryStore.fetchInventory()
}, { deep: true })
</script>

<template>
  <div class="p-4 md:p-8 space-y-6 md:space-y-8">
    <!-- Header & Actions -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
            <Package class="w-6 h-6 md:w-8 md:h-8 text-primary-500" />
          </div>
          <BaseText type="h1">{{ t('common.inventory') }}</BaseText>
        </div>
        <div class="mt-2 opacity-80 flex items-center gap-2">
           <BaseText type="muted">{{ t('inventory.inventory_tracking') }}</BaseText>
           <BaseText weight="bold" color="primary">| {{ inventoryStore.warehouses.length }} {{ t('inventory.warehouses') }}</BaseText>
        </div>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <!-- Advanced BaseSelect -->
        <BaseSelect 
          v-model="inventoryStore.selectedWarehouseId" 
          :options="inventoryStore.warehouses" 
          optionLabel="name" 
          optionValue="id"
          class="!w-full md:!w-72"
          :placeholder="t('inventory.warehouses')"
        />
        
        <div class="flex gap-3 w-full md:w-auto">
          <Button 
            class="!bg-slate-100 dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !text-slate-600 dark:!text-slate-300 !px-4 !rounded-2xl flex-1 md:flex-none"
            @click="inventoryStore.fetchInventory()"
            :loading="inventoryStore.loading"
          >
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': inventoryStore.loading }" />
          </Button>

          <Button 
            v-can="'manage_warehouses'"
            severity="secondary"
            @click="$router.push('/inventory/transfer')"
            class="!bg-indigo-500/10 !border-indigo-500/20 !text-indigo-600 dark:!text-indigo-400 !px-5 !rounded-2xl font-bold flex items-center gap-2 flex-1 md:flex-none"
          >
            <Truck class="w-4 h-4" />
            <BaseText weight="bold" class="hidden sm:inline !text-indigo-600 dark:!text-indigo-400">{{ t('inventory.transfers') }}</BaseText>
          </Button>

          <Button 
            v-can="'edit_inventory'"
            @click="showAddModal = true"
            class="!bg-primary-500 hover:!bg-primary-600 !border-none !text-white !px-8 !py-3 !rounded-2xl !font-black shadow-xl shadow-primary-500/20 flex items-center gap-2 transform hover:-translate-y-1 transition-all flex-1 md:flex-none"
          >
            <Plus class="w-5 h-5" />
            <BaseText weight="black" class="!text-white">{{ t('inventory.add_product') }}</BaseText>
          </Button>
        </div>
      </div>
    </div>

    <!-- Live Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
       <div class="glass p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex items-center gap-5">
          <div class="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center">
            <Package class="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <BaseText type="label" class="mb-1">{{ t('inventory.total_items') }}</BaseText>
            <BaseText type="h3">{{ inventoryStore.totalStockItems }}</BaseText>
          </div>
       </div>
       <div class="glass p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex items-center gap-5">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <BarChart3 class="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <BaseText type="label" class="mb-1">{{ t('inventory.estimated_value') }}</BaseText>
            <div class="flex items-baseline gap-1">
              <BaseText type="h3">
                {{ inventoryStore.totalEstimatedValue.toLocaleString() }} 
              </BaseText>
              <BaseText type="label" size="text-[10px]">{{ t('common.egp') }}</BaseText>
            </div>
          </div>
       </div>
       <div class="glass p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex items-center gap-5">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <History class="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <BaseText type="label" class="mb-1">{{ t('inventory.low_stock') }}</BaseText>
            <BaseText type="h3" color="amber">
              {{ inventoryStore.products.filter(p => p.stock <= p.reorder_point).length }}
            </BaseText>
          </div>
       </div>
       <div class="glass p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex items-center justify-center gap-5 relative overflow-hidden group">
          <Button text class="w-full h-full !p-0 !rounded-none">
            <div class="flex items-center gap-3">
              <FileText class="w-6 h-6 text-slate-400 group-hover:text-primary-500 transition-colors" />
              <BaseText type="body" weight="bold" class="group-hover:!text-primary-500 transition-colors">{{ t('inventory.item_ledger') }}</BaseText>
            </div>
          </Button>
       </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex items-center gap-4 bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
       <div class="relative flex-1">
         <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
         <InputText 
           id="inventory-search"
           v-model="searchQuery" 
           :placeholder="t('common.search_placeholder')"
           class="w-full !pl-12 !py-3 !bg-transparent !border-none !rounded-xl focus:!ring-0 !text-slate-700 dark:!text-slate-200"
         />
       </div>
       <Button text class="!text-slate-400 hidden sm:flex items-center gap-2">
         <Filter class="w-4 h-4" />
         <BaseText weight="bold" class="!text-slate-400">{{ t('common.filters') }}</BaseText>
       </Button>
    </div>

    <!-- Main Table / Mobile View -->
    <BaseTable 
      :value="filteredProducts" 
      :loading="inventoryStore.loading"
      :emptyMessage="t('pos.no_products')"
    >
      <Column field="name" :header="t('inventory.add_product')" sortable>
          <template #body="slotProps">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                 <Smartphone v-if="slotProps.data.category === 'Smartphones' || slotProps.data.category === 'هواتف ذكية'" class="w-5 h-5 text-slate-500" />
                 <Laptop v-else class="w-5 h-5 text-slate-500" />
              </div>
              <div class="flex flex-col">
                <BaseText type="body" weight="bold">{{ slotProps.data.name }}</BaseText>
                <BaseText type="label" size="text-[8px]">{{ slotProps.data.brand }}</BaseText>
              </div>
            </div>
          </template>
        </Column>
        
        <Column field="category" :header="t('inventory.category')" sortable>
          <template #body="slotProps">
            <div class="px-3 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20 inline-block">
               <BaseText weight="black" color="primary" size="text-[10px]" class="uppercase tracking-tighter">{{ slotProps.data.category }}</BaseText>
            </div>
          </template>
        </Column>

        <Column field="stock" :header="t('inventory.stock')" sortable>
          <template #body="slotProps">
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full shadow-[0_0_10px]" :class="slotProps.data.stock <= slotProps.data.reorder_point ? 'bg-amber-500 shadow-amber-500/50' : 'bg-emerald-500 shadow-emerald-500/50'"></div>
                <BaseText type="h3" :color="slotProps.data.stock <= slotProps.data.reorder_point ? 'amber' : 'emerald'">{{ slotProps.data.stock }}</BaseText>
              </div>
              <div v-if="slotProps.data.stock <= slotProps.data.reorder_point" class="bg-amber-500/10 px-2 py-0.5 rounded-full self-start">
                <BaseText weight="black" color="amber" size="text-[8px]" class="uppercase">{{ t('inventory.low_stock') }}</BaseText>
              </div>
            </div>
          </template>
        </Column>

        <Column field="sell_price" :header="t('pos.price')" sortable>
           <template #body="slotProps">
             <div class="flex flex-col">
                <BaseText type="body" weight="black">{{ slotProps.data.sell_price.toLocaleString() }}</BaseText>
                <BaseText type="label" size="text-[8px]">{{ t('common.egp') }}</BaseText>
             </div>
           </template>
        </Column>

        <Column class="w-20">
          <template #body>
            <Button text rounded severity="secondary" class="!p-2">
              <MoreVertical class="w-5 h-5 text-slate-400" />
            </Button>
          </template>
        </Column>

      <template #mobile-card="{ data: product }">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                 <Smartphone v-if="product.category === 'Smartphones' || product.category === 'هواتف ذكية'" class="w-6 h-6 text-slate-500" />
                 <Laptop v-else class="w-6 h-6 text-slate-500" />
              </div>
              <div class="flex flex-col">
                <BaseText type="body" weight="black" size="text-lg">{{ product.name }}</BaseText>
                <BaseText type="label">{{ product.brand }}</BaseText>
              </div>
            </div>
            <Button text rounded severity="secondary">
              <MoreVertical class="w-5 h-5" />
            </Button>
          </div>

          <div class="flex items-center justify-between pt-2">
            <div class="flex flex-col gap-1">
              <BaseText type="label">{{ t('inventory.stock') }}</BaseText>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :class="product.stock <= product.reorder_point ? 'bg-amber-500' : 'bg-emerald-500'"></div>
                <BaseText type="h2" :color="product.stock <= product.reorder_point ? 'amber' : 'emerald'">{{ product.stock }}</BaseText>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <BaseText type="label">{{ t('pos.price') }}</BaseText>
              <div class="flex items-baseline gap-1">
                <BaseText type="h2" color="primary">{{ product.sell_price.toLocaleString() }}</BaseText>
                <BaseText type="label" size="text-[10px]">{{ t('common.egp') }}</BaseText>
              </div>
            </div>
          </div>
      </template>
    </BaseTable>

    <!-- Dumb Modal -->
    <AddProductModal 
      v-model:visible="showAddModal" 
      :loading="isSaving"
      @save="handleSaveProduct" 
    />
  </div>
</template>

<style scoped>
/* Scoped styles removed to avoid Tailwind v4 @apply issues */
</style>
