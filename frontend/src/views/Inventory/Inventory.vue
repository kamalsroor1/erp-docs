<script setup>
/**
 * @file Inventory.vue
 * @description Full-featured Inventory Management with RBAC, Mobile UX Protocol, and Store Integration.
 * Strictly adheres to FRONTEND_AI_INSTRUCTIONS.md (Mobile-First, Touch UX, Base Components).
 */
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '../../stores/ui'
import { useInventoryStore } from '../../stores/inventory'
import { useAuthStore } from '../../stores/auth'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Warehouse, 
  AlertCircle, 
  TrendingUp, 
  History, 
  ArrowRightLeft, 
  Edit2, 
  Trash2,
  X
} from 'lucide-vue-next'
import BaseText from '../../components/base/BaseText.vue'
import BaseTable from '../../components/base/BaseTable.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseFilterSidebar from '../../components/base/BaseFilterSidebar.vue'
import AddProductModal from '../../components/AddProductModal.vue'
import Sidebar from 'primevue/sidebar'

const { t } = useI18n()
const uiStore = useUIStore()
const inventoryStore = useInventoryStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedCategory = ref(null) // Applied filter
const selectedStatus = ref(null)   // Applied filter
const showAddModal = ref(false)
const showFilterSidebar = ref(false)
const searchInput = ref(null)

const categoryOptions = computed(() => [
  { label: t('inventory.all_categories'), value: null },
  { label: t('inventory.smartphones'), value: 'Smartphones' },
  { label: t('inventory.laptops'), value: 'Laptops' },
  { label: t('inventory.accessories'), value: 'Accessories' },
  { label: t('inventory.tablets'), value: 'Tablets' }
])

const statusOptions = computed(() => [
  { label: t('inventory.all_statuses'), value: null },
  { label: t('inventory.stock'), value: 'available' },
  { label: t('inventory.low_stock'), value: 'low' },
  { label: t('inventory.out_of_stock'), value: 'out' }
])

const filterSchema = computed(() => [
  { key: 'category', label: t('inventory.category'), options: categoryOptions.value },
  { key: 'status', label: t('inventory.stock_status'), options: statusOptions.value }
])

const handleFilterApply = (values) => {
  selectedCategory.value = values.category
  selectedStatus.value = values.status
}

const handleFilterReset = () => {
  selectedCategory.value = null
  selectedStatus.value = null
  searchQuery.value = ''
}

// Data fetching
onMounted(async () => {
  await inventoryStore.loadWarehouses()
  await inventoryStore.fetchInventory()
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

const handleGlobalKeydown = (e) => {
  if (e.key === 'F2') {
    e.preventDefault()
    searchInput.value?.focus()
  }
  if (e.key === 'Escape') {
    showFilterSidebar.value = false
    showAddModal.value = false
  }
}

// Refetch when warehouse or branch changes
watch(() => inventoryStore.selectedWarehouseId, async () => {
  await inventoryStore.fetchInventory()
})

watch(() => uiStore.selectedBranchId, async () => {
  await inventoryStore.loadWarehouses()
})

const columns = [
  { key: 'name', label: t('inventory.product_name'), class: 'min-w-[250px]', sortable: true },
  { key: 'sku', label: t('inventory.sku'), class: 'font-mono text-xs opacity-60', sortable: true },
  { key: 'category', label: t('inventory.category'), sortable: true },
  { key: 'stock', label: t('inventory.stock_count'), class: 'text-center', sortable: true },
  { key: 'sell_price', label: t('pos.price'), class: 'text-left font-black', headerClass: 'text-left', sortable: true },
  { key: 'actions', label: t('common.actions'), class: 'text-left', headerClass: 'text-left', sortable: false },
]

const filteredProducts = computed(() => {
  let products = inventoryStore.products

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }

  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value)
  }

  if (selectedStatus.value) {
    products = products.filter(p => {
      if (selectedStatus.value === 'out') return p.stock === 0
      if (selectedStatus.value === 'low') return p.stock > 0 && p.stock <= p.reorder_point
      if (selectedStatus.value === 'available') return p.stock > p.reorder_point
      return true
    })
  }

  return products
})

const stats = computed(() => [
  { label: t('inventory.total_items'), value: inventoryStore.totalStockItems, icon: Package, color: 'text-primary-500' },
  { label: t('inventory.estimated_value'), value: inventoryStore.totalEstimatedValue.toLocaleString() + ' ' + t('common.egp'), icon: TrendingUp, color: 'text-emerald-500' },
  { label: t('inventory.low_stock'), value: inventoryStore.products.filter(p => p.stock <= p.reorder_point).length, icon: AlertCircle, color: 'text-amber-500' }
])

const getStatusColor = (stock, reorder) => {
  if (stock === 0) return 'text-red-500 bg-red-500/10'
  if (stock <= reorder) return 'text-amber-500 bg-amber-500/10'
  return 'text-emerald-500 bg-emerald-500/10'
}

const getStatusLabel = (stock, reorder) => {
  if (stock === 0) return t('inventory.out_of_stock')
  if (stock <= reorder) return t('inventory.low_stock')
  return t('inventory.stock')
}

const glassClass = computed(() => {
  return [
    'backdrop-blur-xl border transition-all duration-300 shadow-2xl',
    uiStore.isDark ? 'bg-slate-900/40 border-white/10 shadow-black/20' : 'bg-white/5 border-white/10 shadow-slate-200/50'
  ]
})
</script>

<template>
  <div class="px-6 py-8 md:p-10 space-y-10 animate-in fade-in duration-500 pb-32 md:pb-10">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
      <div>
        <BaseText weight="black" size="text-3xl md:text-5xl" class="tracking-tight">{{ t('common.inventory') }}</BaseText>
        <div class="flex items-center gap-2 mt-3">
           <Warehouse class="w-4 h-4 opacity-40" />
           <BaseText type="muted" size="text-sm" class="font-black opacity-60">{{ t('inventory.inventory_tracking') }}</BaseText>
        </div>
      </div>
      
      <!-- Warehouse Selector & Desktop Actions -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <BaseSelect 
          v-model="inventoryStore.selectedWarehouseId"
          :options="inventoryStore.warehouses"
          optionLabel="name"
          optionValue="id"
          class="w-full sm:w-64"
          :placeholder="t('inventory.warehouses')"
        />
        
        <div class="hidden md:flex items-center gap-4">
          <button class="header-icon !bg-white/5 !border-white/10 hover:!bg-white/10 transition-all active:scale-95 border border-white/5 w-12 h-12 flex items-center justify-center rounded-2xl">
            <Download class="w-6 h-6 opacity-40" />
          </button>
          <button 
            v-if="authStore.hasPermission('edit_inventory')"
            @click="showAddModal = true"
            class="px-8 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-[1.5rem] transition-all shadow-2xl shadow-primary-500/30 active:scale-95 flex items-center gap-3"
          >
            <Plus class="w-6 h-6" />
            <BaseText size="text-sm" weight="black" class="text-white">{{ t('inventory.add_product') }}</BaseText>
          </button>
        </div>
      </div>
    </div>

    <!-- Inventory Overview Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
       <div v-for="stat in stats" :key="stat.label" :class="glassClass" class="p-6 md:p-8 rounded-[2.5rem] flex items-center gap-6 active:scale-[0.98] transition-all cursor-pointer">
          <div :class="[stat.color, 'w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner']">
             <component :is="stat.icon" class="w-7 h-7" />
          </div>
          <div>
             <BaseText type="muted" size="text-[10px]" class="uppercase font-black opacity-40 mb-1 tracking-widest">{{ stat.label }}</BaseText>
             <BaseText weight="black" size="text-2xl">{{ stat.value }}</BaseText>
          </div>
       </div>
    </div>

    <!-- Filters & Search -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <!-- Search Input -->
      <div class="md:col-span-9 relative group">
        <div class="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 opacity-20 group-focus-within:opacity-100 transition-opacity">
          <Search />
        </div>
        <input 
          ref="searchInput"
          v-model="searchQuery"
          type="text" 
          :placeholder="t('common.search_placeholder')"
          class="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pr-16 pl-8 text-base focus:outline-none focus:border-primary-500/50 focus:ring-8 focus:ring-primary-500/5 transition-all font-bold placeholder:opacity-30"
        />
      </div>

      <!-- Filter Toggle Button -->
      <div class="md:col-span-3">
        <button 
          @click="showFilterSidebar = true"
          class="w-full h-full flex items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-[2rem] py-6 px-8 transition-all active:scale-95"
        >
          <Filter class="w-6 h-6 opacity-40" />
          <BaseText size="text-xs" weight="black" class="uppercase tracking-widest">{{ t('common.filters') }}</BaseText>
          <div v-if="selectedCategory || selectedStatus" class="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(79,70,229,0.8)] animate-pulse"></div>
        </button>
      </div>
    </div>

    <!-- Main Table -->
    <BaseTable :columns="columns" :items="filteredProducts" :loading="inventoryStore.loading">
      <template #cell(name)="{ item }">
        <div class="flex items-center gap-5">
           <div class="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 border border-primary-500/10 shadow-inner overflow-hidden relative">
              <Package class="w-7 h-7" />
              <div v-if="item.stock === 0" class="absolute inset-0 bg-red-500/20 backdrop-blur-[2px]"></div>
           </div>
           <div>
              <BaseText weight="black" size="text-base" class="block">{{ item.name }}</BaseText>
              <div class="flex items-center gap-2 mt-2">
                 <BaseText type="muted" size="text-[10px]" class="font-black uppercase tracking-tighter">{{ item.brand }}</BaseText>
                 <div :class="[getStatusColor(item.stock, item.reorder_point), 'px-2 py-0.5 rounded-lg text-[9px] font-black uppercase']">
                    <BaseText size="text-[9px]" weight="black">{{ getStatusLabel(item.stock, item.reorder_point) }}</BaseText>
                 </div>
              </div>
           </div>
        </div>
      </template>

      <template #cell(sell_price)="{ value }">
         <div class="flex flex-col items-end">
            <BaseText weight="black" size="text-base">{{ value.toLocaleString() }} {{ t('common.egp') }}</BaseText>
            <BaseText size="text-[10px]" type="muted" class="opacity-30 font-bold uppercase">{{ t('pos.price') }}</BaseText>
         </div>
      </template>

      <template #cell(actions)="{ item }">
         <div class="flex items-center justify-end gap-2">
            <button v-if="authStore.hasPermission('edit_inventory')" class="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all border border-white/5 text-primary-500">
               <Edit2 class="w-5 h-5" />
            </button>
            <button v-if="authStore.hasPermission('manage_warehouses')" class="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all border border-white/5 text-emerald-500">
               <ArrowRightLeft class="w-5 h-5" />
            </button>
            <button v-if="authStore.hasPermission('delete_inventory')" class="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 active:scale-95 transition-all border border-red-500/10 text-red-500">
               <Trash2 class="w-5 h-5" />
            </button>
         </div>
      </template>

      <!-- Mobile Card Overrides -->
      <template #card-header="{ item }">
        <div class="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 border border-primary-500/10 shadow-inner">
            <Package class="w-7 h-7" />
        </div>
        <div>
          <BaseText weight="black" size="text-lg" class="leading-tight">{{ item.name }}</BaseText>
          <div class="flex items-center gap-2 mt-1.5">
             <BaseText type="muted" size="text-[10px]" class="font-black uppercase">{{ item.brand }}</BaseText>
             <div :class="[getStatusColor(item.stock, item.reorder_point), 'px-2 py-0.5 rounded-lg text-[9px] font-black uppercase']">
                <BaseText size="text-[9px]" weight="black">{{ getStatusLabel(item.stock, item.reorder_point) }}</BaseText>
             </div>
          </div>
        </div>
      </template>

      <template #card-actions="{ item }">
         <div class="flex items-center gap-2 w-full">
            <button v-if="authStore.hasPermission('edit_inventory')" class="flex-1 h-12 bg-white/5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/5">
               <Edit2 class="w-4 h-4 opacity-40 text-primary-500" />
               <BaseText size="text-[10px]" weight="black" class="uppercase">{{ t('common.edit') }}</BaseText>
            </button>
            <button v-if="authStore.hasPermission('manage_warehouses')" class="flex-1 h-12 bg-white/5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/5">
               <ArrowRightLeft class="w-4 h-4 opacity-40 text-emerald-500" />
               <BaseText size="text-[10px]" weight="black" class="uppercase">{{ t('inventory.stock_transfer') }}</BaseText>
            </button>
            <button v-if="authStore.hasPermission('delete_inventory')" class="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center active:scale-95 transition-all border border-red-500/10">
               <Trash2 class="w-5 h-5" />
            </button>
            <button v-if="authStore.hasPermission('view_reports')" class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center active:scale-95 transition-all border border-white/5">
               <History class="w-5 h-5 opacity-40" />
            </button>
         </div>
      </template>
    </BaseTable>

    <!-- Mobile Sticky Action Bar -->
    <div v-if="authStore.hasPermission('edit_inventory')" class="md:hidden fixed bottom-6 left-6 right-6 z-50 flex items-center justify-center pointer-events-none">
       <button @click="showAddModal = true" class="pointer-events-auto w-full max-w-md h-20 bg-primary-600 text-white rounded-[2.5rem] shadow-[0_25px_50px_rgba(79,70,229,0.4)] flex items-center justify-center gap-4 active:scale-95 transition-all border border-white/20">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
             <Plus class="w-6 h-6" />
          </div>
          <BaseText weight="black" size="text-xl" class="text-white">{{ t('inventory.add_product') }}</BaseText>
       </button>
    </div>

    <!-- Universal Filter Sidebar -->
    <BaseFilterSidebar 
      v-model:visible="showFilterSidebar"
      :title="t('inventory.filter_products')"
      :filters="filterSchema"
      :initialValues="{ category: selectedCategory, status: selectedStatus }"
      @apply="handleFilterApply"
      @reset="handleFilterReset"
    />

    <AddProductModal v-model:visible="showAddModal" @saved="inventoryStore.fetchInventory" />
  </div>
</template>
