<script setup>
import { onMounted, watch, onUnmounted, computed, ref } from 'vue'
import { useInventoryStore } from '../../stores/inventory'
import { useUIStore } from '../../stores/ui'
import { useI18n } from 'vue-i18n'
import AddProductModal from '../../components/AddProductModal.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
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
    toast.add({ severity: 'success', summary: t('success'), detail: t('product_added'), life: 3000 })
    await inventoryStore.fetchInventory()
    showAddModal.value = false
  } catch (err) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('product_failed'), life: 3000 })
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
        <h1 class="text-3xl md:text-4xl font-black flex items-center gap-4 text-slate-900 dark:text-white">
          <div class="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
            <Package class="w-6 h-6 md:w-8 md:h-8 text-primary-500" />
          </div>
          {{ t('inventory') }}
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium opacity-80 text-sm md:text-base">
          {{ t('inventory_tracking') }} | <span class="text-primary-500 font-bold">{{ inventoryStore.warehouses.length }} {{ t('warehouses') }}</span>
        </p>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <!-- Advanced Dropdown with Search/Filter -->
        <Dropdown 
          v-model="inventoryStore.selectedWarehouseId" 
          :options="inventoryStore.warehouses" 
          optionLabel="name" 
          optionValue="id"
          filter
          class="!bg-white dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !rounded-2xl !w-full md:!w-64"
          :placeholder="t('warehouses')"
          :pt="{
            filterInput: { class: '!bg-slate-50 dark:!bg-white/10 !border-none !rounded-xl !p-3 !text-sm' }
          }"
        >
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-primary-500"></div>
              <span>{{ slotProps.option.name }}</span>
            </div>
          </template>
        </Dropdown>
        
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
            <span class="hidden sm:inline">{{ t('transfers') }}</span>
          </Button>

          <Button 
            v-can="'edit_inventory'"
            @click="showAddModal = true"
            class="!bg-primary-500 hover:!bg-primary-600 !border-none !text-white !px-8 !py-3 !rounded-2xl !font-black shadow-xl shadow-primary-500/20 flex items-center gap-2 transform hover:-translate-y-1 transition-all flex-1 md:flex-none"
          >
            <Plus class="w-5 h-5" />
            <span>{{ t('add_product') }}</span>
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
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{{ t('total_items') }}</p>
            <p class="text-2xl font-black text-slate-900 dark:text-white">{{ inventoryStore.totalStockItems }}</p>
          </div>
       </div>
       <div class="glass p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex items-center gap-5">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <BarChart3 class="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{{ t('estimated_value') }}</p>
            <p class="text-2xl font-black text-slate-900 dark:text-white">
              {{ inventoryStore.totalEstimatedValue.toLocaleString() }} 
              <small class="text-xs font-bold text-slate-400">{{ t('egp') }}</small>
            </p>
          </div>
       </div>
       <div class="glass p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex items-center gap-5">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <History class="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{{ t('low_stock') }}</p>
            <p class="text-2xl font-black text-amber-500">
              {{ inventoryStore.products.filter(p => p.stock <= p.reorder_point).length }}
            </p>
          </div>
       </div>
       <div class="glass p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex items-center justify-center gap-5 relative overflow-hidden group">
          <Button text class="w-full h-full !p-0 !rounded-none">
            <div class="flex items-center gap-3">
              <FileText class="w-6 h-6 text-slate-400 group-hover:text-primary-500 transition-colors" />
              <span class="font-bold text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{{ t('item_ledger') }}</span>
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
           :placeholder="t('search_placeholder')"
           class="w-full !pl-12 !py-3 !bg-transparent !border-none !rounded-xl focus:!ring-0 !text-slate-700 dark:!text-slate-200"
         />
       </div>
       <Button text class="!text-slate-400 hidden sm:flex items-center gap-2">
         <Filter class="w-4 h-4" />
         <span class="font-bold">{{ t('filters') }}</span>
       </Button>
    </div>

    <!-- Main Table / Mobile View -->
    <div class="glass rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl">
      <!-- Desktop View -->
      <DataTable 
        :value="filteredProducts" 
        :loading="inventoryStore.loading"
        paginator :rows="10" 
        class="hidden md:block !bg-transparent"
        responsiveLayout="scroll"
        :pt="{
          table: { class: 'w-full text-left border-collapse' },
          thead: { class: 'bg-slate-50 dark:bg-white/5' },
          column: {
            headerCell: { class: '!bg-transparent !text-slate-500 dark:!text-slate-400 !font-bold !p-6 !border-b !border-slate-200 dark:!border-white/10 uppercase text-[10px] tracking-widest' },
            bodyCell: { class: '!p-6 !border-b !border-slate-100 dark:!border-white/5 !text-slate-700 dark:!text-slate-200' }
          },
          paginator: {
             root: { class: '!bg-slate-50 dark:!bg-white/5 !border-t !border-slate-200 dark:!border-white/5 !p-4' }
          }
        }"
      >
        <template #empty>
          <div class="py-32 text-center text-slate-500 italic flex flex-col items-center gap-4">
            <Package class="w-16 h-16 opacity-10" />
            <p class="text-xl font-bold opacity-30">{{ t('no_products') }}</p>
          </div>
        </template>

        <Column field="name" :header="t('add_product')" sortable>
          <template #body="slotProps">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                 <Smartphone v-if="slotProps.data.category === 'Smartphones'" class="w-5 h-5 text-slate-500" />
                 <Laptop v-else class="w-5 h-5 text-slate-500" />
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-slate-900 dark:text-white leading-tight">{{ slotProps.data.name }}</span>
                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{{ slotProps.data.brand }}</span>
              </div>
            </div>
          </template>
        </Column>
        
        <Column field="category" :header="t('category')" sortable>
          <template #body="slotProps">
            <span class="px-3 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20 text-[10px] font-black text-primary-500 uppercase tracking-tighter">
              {{ slotProps.data.category }}
            </span>
          </template>
        </Column>

        <Column field="stock" :header="t('stock')" sortable>
          <template #body="slotProps">
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full shadow-[0_0_10px]" :class="slotProps.data.stock <= slotProps.data.reorder_point ? 'bg-amber-500 shadow-amber-500/50' : 'bg-emerald-500 shadow-emerald-500/50'"></div>
                <span class="font-black text-lg" :class="slotProps.data.stock <= slotProps.data.reorder_point ? 'text-amber-500' : 'text-emerald-500'">{{ slotProps.data.stock }}</span>
              </div>
              <span v-if="slotProps.data.stock <= slotProps.data.reorder_point" class="text-[8px] font-black uppercase text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full self-start">
                {{ t('low_stock') }}
              </span>
            </div>
          </template>
        </Column>

        <Column field="sell_price" :header="t('price')" sortable>
           <template #body="slotProps">
             <div class="flex flex-col">
                <span class="font-black text-slate-900 dark:text-white">{{ slotProps.data.sell_price.toLocaleString() }}</span>
                <span class="text-[10px] text-slate-500">{{ t('egp') }}</span>
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
      </DataTable>

      <!-- Mobile View: Cards -->
      <div class="md:hidden divide-y divide-slate-100 dark:divide-white/5">
        <div v-for="product in filteredProducts" :key="product.id" class="p-6 space-y-4 active:bg-slate-50 dark:active:bg-white/5 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                 <Smartphone v-if="product.category === 'Smartphones'" class="w-6 h-6 text-slate-500" />
                 <Laptop v-else class="w-6 h-6 text-slate-500" />
              </div>
              <div class="flex flex-col">
                <span class="font-black text-slate-900 dark:text-white text-lg">{{ product.name }}</span>
                <span class="text-xs text-slate-500 font-bold uppercase tracking-widest">{{ product.brand }}</span>
              </div>
            </div>
            <Button text rounded severity="secondary">
              <MoreVertical class="w-5 h-5" />
            </Button>
          </div>

          <div class="flex items-center justify-between pt-2">
            <div class="flex flex-col gap-1">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ t('stock') }}</span>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :class="product.stock <= product.reorder_point ? 'bg-amber-500' : 'bg-emerald-500'"></div>
                <span class="font-black text-xl" :class="product.stock <= product.reorder_point ? 'text-amber-500' : 'text-emerald-500'">{{ product.stock }}</span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ t('price') }}</span>
              <span class="font-black text-xl text-primary-500">{{ product.sell_price.toLocaleString() }} <small class="text-xs">{{ t('egp') }}</small></span>
            </div>
          </div>
        </div>
      </div>
    </div>

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
