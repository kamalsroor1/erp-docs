<script setup>
/**
 * @file Inventory.vue
 * @description Full-featured Inventory Management with RBAC, Mobile UX Protocol, and Store Integration.
 * Implements Section 10: Card transformation, Sticky actions, and Finger rule.
 */
import { ref, computed, onMounted, watch } from 'vue'
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
  MoreHorizontal,
  ArrowUpDown,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Warehouse,
  AlertCircle,
  TrendingUp,
  History,
  ArrowRightLeft,
  Edit2
} from 'lucide-vue-next'
import BaseText from '../../components/base/BaseText.vue'
import BaseTable from '../../components/base/BaseTable.vue'
import AddProductModal from '../../components/AddProductModal.vue'
import Dropdown from 'primevue/dropdown'

const { t } = useI18n()
const uiStore = useUIStore()
const inventoryStore = useInventoryStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const showAddModal = ref(false)

// Data fetching
onMounted(async () => {
  await inventoryStore.loadWarehouses()
  await inventoryStore.fetchInventory()
})

// Refetch when warehouse or branch changes
watch(() => inventoryStore.selectedWarehouseId, async () => {
  await inventoryStore.fetchInventory()
})

watch(() => uiStore.selectedBranchId, async () => {
  await inventoryStore.loadWarehouses()
})

const columns = [
  { key: 'name', label: 'المنتج', class: 'min-w-[250px]' },
  { key: 'sku', label: 'SKU', class: 'font-mono text-xs opacity-60' },
  { key: 'category', label: 'التصنيف' },
  { key: 'stock', label: 'المخزون', class: 'text-center' },
  { key: 'sell_price', label: 'سعر البيع', class: 'text-left font-black' },
]

const filteredProducts = computed(() => {
  if (!searchQuery.value) return inventoryStore.products
  return inventoryStore.products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const stats = computed(() => [
  { label: 'إجمالي الأصناف', value: inventoryStore.totalStockItems, icon: Package, color: 'text-primary-500' },
  { label: 'القيمة التقديرية', value: inventoryStore.totalEstimatedValue.toLocaleString() + ' ج.م', icon: TrendingUp, color: 'text-emerald-500' },
  { label: 'نواقص المخزن', value: inventoryStore.products.filter(p => p.stock <= p.reorder_point).length, icon: AlertCircle, color: 'text-amber-500' }
])

const getStatusColor = (stock, reorder) => {
  if (stock === 0) return 'text-red-500 bg-red-500/10'
  if (stock <= reorder) return 'text-amber-500 bg-amber-500/10'
  return 'text-emerald-500 bg-emerald-500/10'
}

const getStatusLabel = (stock, reorder) => {
  if (stock === 0) return 'نفذ المخزون'
  if (stock <= reorder) return 'مخزون منخفض'
  return 'متوفر'
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
           <BaseText type="muted" size="text-sm" class="font-black opacity-60">إدارة المخزون في الفرع الحالي</BaseText>
        </div>
      </div>
      
      <!-- Warehouse Selector & Desktop Actions -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <Dropdown 
          v-model="inventoryStore.selectedWarehouseId"
          :options="inventoryStore.warehouses"
          optionLabel="name"
          optionValue="id"
          class="!rounded-2xl !bg-white/5 !border-white/10 !px-4 !py-1 w-full sm:w-64"
          placeholder="اختر المخزن"
        />
        
        <div class="hidden md:flex items-center gap-4">
          <button class="header-icon !bg-white/5 !border-white/10 hover:!bg-white/10 transition-all active:scale-95">
            <Download class="w-6 h-6" />
          </button>
          <button 
            v-if="authStore.hasPermission('edit_inventory')"
            @click="showAddModal = true"
            class="px-8 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-[1.5rem] font-black text-sm transition-all shadow-2xl shadow-primary-500/30 active:scale-95 flex items-center gap-3"
          >
            <Plus class="w-6 h-6" />
            {{ t('inventory.add_product') }}
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
      <div class="md:col-span-8 relative group">
        <div class="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 opacity-20 group-focus-within:opacity-100 transition-opacity">
          <Search />
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="ابحث عن منتج، كود SKU، أو تصنيف..."
          class="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pr-16 pl-8 text-base focus:outline-none focus:border-primary-500/50 focus:ring-8 focus:ring-primary-500/5 transition-all font-bold placeholder:opacity-30"
        />
      </div>
      <div class="md:col-span-4">
        <button class="w-full flex items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-[2rem] py-6 px-8 font-black text-xs uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all">
          <Filter class="w-6 h-6 opacity-40" />
          تصفية النتائج
        </button>
      </div>
    </div>

    <!-- Main Table / Card View -->
    <BaseTable :columns="columns" :items="filteredProducts" :loading="inventoryStore.loading">
      <!-- Desktop Cell Overrides -->
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
                    {{ getStatusLabel(item.stock, item.reorder_point) }}
                 </div>
              </div>
           </div>
        </div>
      </template>

      <template #cell(sell_price)="{ value }">
         <div class="flex flex-col items-end">
            <BaseText weight="black" size="text-base">{{ value.toLocaleString() }} ج.م</BaseText>
            <BaseText size="text-[10px]" class="opacity-30 font-bold uppercase">سعر البيع المقترح</BaseText>
         </div>
      </template>

      <!-- Mobile Card Customization -->
      <template #card-header="{ item }">
        <div class="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 border border-primary-500/10 shadow-inner">
            <Package class="w-7 h-7" />
        </div>
        <div>
          <BaseText weight="black" size="text-lg" class="leading-tight">{{ item.name }}</BaseText>
          <div class="flex items-center gap-2 mt-1.5">
             <BaseText type="muted" size="text-[10px]" class="font-black uppercase">{{ item.brand }}</BaseText>
             <div :class="[getStatusColor(item.stock, item.reorder_point), 'px-2 py-0.5 rounded-lg text-[9px] font-black uppercase']">
                {{ getStatusLabel(item.stock, item.reorder_point) }}
             </div>
          </div>
        </div>
      </template>

      <template #card-actions="{ item }">
         <div class="flex items-center gap-2 w-full">
            <button class="flex-1 h-12 bg-white/5 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all">
               <Edit2 class="w-4 h-4 opacity-40" />
               تعديل
            </button>
            <button class="flex-1 h-12 bg-white/5 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all">
               <ArrowRightLeft class="w-4 h-4 opacity-40" />
               تحويل
            </button>
            <button class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center active:scale-90 transition-all">
               <History class="w-5 h-5 opacity-40" />
            </button>
         </div>
      </template>
    </BaseTable>

    <!-- Mobile Sticky Action Bar -->
    <div v-if="authStore.hasPermission('edit_inventory')" class="md:hidden fixed bottom-6 left-6 right-6 z-50 flex items-center justify-center pointer-events-none">
       <button @click="showAddModal = true" class="pointer-events-auto w-full max-w-md h-20 bg-primary-600 text-white rounded-[2.5rem] shadow-[0_25px_50px_rgba(79,70,229,0.4)] flex items-center justify-center gap-4 font-black text-xl active:scale-95 transition-all border border-white/20">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
             <Plus class="w-6 h-6" />
          </div>
          {{ t('inventory.add_product') }}
       </button>
    </div>

    <!-- Modals -->
    <AddProductModal v-model:visible="showAddModal" @saved="inventoryStore.fetchInventory" />
  </div>
</template>

<style scoped>
/* Removed glass class to fix Tailwind v4 @apply issues */
</style>
