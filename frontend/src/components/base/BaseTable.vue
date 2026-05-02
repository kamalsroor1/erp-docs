<script setup>
/**
 * @file BaseTable.vue
 * @description Enterprise-grade Responsive Table with Sorting, Pagination, and Card Transformation.
 * Strictly adheres to FRONTEND_AI_INSTRUCTIONS.md (Mobile-First, Touch UX, Base Components).
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUIStore } from '../../stores/ui'
import { useI18n } from 'vue-i18n'
import BaseText from './BaseText.vue'
import BaseSelect from './BaseSelect.vue'
import { 
  ChevronRight, 
  MoreVertical, 
  ChevronLeft, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-vue-next'

const props = defineProps({
  columns: { type: Array, required: true },
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  pagination: { type: Boolean, default: true }
})

const { t } = useI18n()
const uiStore = useUIStore()
const isMobile = ref(false)
const currentPage = ref(1)
const rowsPerPage = ref(10)
const sortKey = ref('')
const sortOrder = ref(1) // 1: asc, -1: desc

const rowOptions = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 }
]

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

// Sorting Logic
const handleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value * -1
  } else {
    sortKey.value = key
    sortOrder.value = 1
  }
}

const sortedItems = computed(() => {
  if (!sortKey.value) return props.items
  
  return [...props.items].sort((a, b) => {
    let v1 = a[sortKey.value]
    let v2 = b[sortKey.value]
    
    if (typeof v1 === 'string') v1 = v1.toLowerCase()
    if (typeof v2 === 'string') v2 = v2.toLowerCase()
    
    if (v1 < v2) return -1 * sortOrder.value
    if (v1 > v2) return 1 * sortOrder.value
    return 0
  })
})

// Reset pagination when items/sort change
watch([() => props.items, rowsPerPage, sortKey, sortOrder], () => {
  currentPage.value = 1
}, { deep: true })

const totalPages = computed(() => Math.ceil(sortedItems.value.length / rowsPerPage.value) || 1)

const paginatedItems = computed(() => {
  if (!props.pagination) return sortedItems.value
  const start = (currentPage.value - 1) * rowsPerPage.value
  return sortedItems.value.slice(start, start + rowsPerPage.value)
})

const glassClass = computed(() => {
  return [
    'backdrop-blur-xl shadow-2xl border border-white/10',
    uiStore.isDark ? 'bg-slate-900/40' : 'bg-white/5'
  ]
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const btnClass = (disabled) => [
  'w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-all border border-white/5',
  disabled ? 'opacity-10 grayscale cursor-not-allowed pointer-events-none' : 'active:scale-95 hover:bg-white/10 hover:border-white/10'
]
</script>

<template>
  <div class="w-full space-y-8">
    <!-- Desktop Table View -->
    <div v-if="!isMobile" :class="glassClass" class="overflow-hidden rounded-[2.5rem]">
      <table class="w-full text-right border-collapse">
        <thead class="bg-white/5 border-b border-white/10">
          <tr>
            <th 
              v-for="col in columns" 
              :key="col.key"
              @click="col.sortable !== false && handleSort(col.key)"
              class="px-8 py-6 text-xs font-black uppercase tracking-widest opacity-40 text-right transition-colors"
              :class="[col.headerClass, col.sortable !== false ? 'cursor-pointer hover:opacity-100 hover:text-primary-500' : '']"
            >
              <div class="flex items-center gap-2" :class="col.headerClass?.includes('text-left') ? 'justify-start' : 'justify-start'">
                 <BaseText size="text-[10px]" class="font-black uppercase tracking-widest">{{ col.label }}</BaseText>
                 <template v-if="col.sortable !== false">
                    <ArrowUp v-if="sortKey === col.key && sortOrder === 1" class="w-3 h-3 text-primary-500" />
                    <ArrowDown v-else-if="sortKey === col.key && sortOrder === -1" class="w-3 h-3 text-primary-500" />
                    <ArrowUpDown v-else class="w-3 h-3 opacity-20" />
                 </template>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr 
            v-for="(item, idx) in paginatedItems" 
            :key="idx"
            class="hover:bg-white/5 transition-colors group cursor-pointer border-b border-white/5 last:border-0"
          >
            <td 
              v-for="col in columns" 
              :key="col.key"
              class="px-8 py-7 text-sm font-bold"
              :class="col.class"
            >
              <slot :name="`cell(${col.key})`" :item="item" :value="item[col.key]">
                <BaseText :weight="col.key === 'name' ? 'black' : 'bold'" :size="col.key === 'name' ? 'text-[15px]' : 'text-sm'">{{ item[col.key] }}</BaseText>
              </slot>
            </td>
          </tr>
          <tr v-if="paginatedItems.length === 0">
            <td :colspan="columns.length" class="px-8 py-24 text-center">
               <BaseText type="muted" size="text-sm" class="font-black uppercase tracking-widest opacity-40">{{ t('common.no_data') }}</BaseText>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div v-else class="space-y-4 px-1">
      <div 
        v-for="(item, idx) in paginatedItems" 
        :key="idx"
        :class="glassClass"
        class="p-6 rounded-[2rem] active:scale-[0.98] transition-all duration-300 border border-white/5 shadow-xl"
      >
        <!-- Card Header -->
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
          <div class="flex items-center gap-3">
             <slot name="card-header" :item="item"></slot>
          </div>
          <button class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 active:scale-90 transition-all border border-white/5">
             <MoreVertical class="w-5 h-5 opacity-40" />
          </button>
        </div>

        <!-- Card Body -->
        <div class="grid grid-cols-2 gap-y-6 gap-x-2">
           <div v-for="col in columns.slice(1)" :key="col.key" v-show="col.key !== 'actions'" class="flex flex-col gap-1.5">
              <BaseText size="text-[10px]" class="uppercase font-black opacity-30 tracking-tighter">{{ col.label }}</BaseText>
              <div class="truncate leading-tight">
                 <slot :name="`cell(${col.key})`" :item="item" :value="item[col.key]">
                   <BaseText size="text-sm" weight="black">{{ item[col.key] }}</BaseText>
                 </slot>
              </div>
           </div>
        </div>

        <!-- Card Footer -->
        <div class="mt-8 pt-6 border-t border-white/5">
           <slot name="card-actions" :item="item">
              <button class="w-full h-12 bg-white/5 rounded-xl flex items-center justify-center gap-2 text-primary-500 font-black text-xs uppercase tracking-widest active:scale-95 transition-all border border-white/5">
                 <BaseText size="text-xs" weight="black" class="text-primary-500 uppercase tracking-widest">{{ t('common.details') }}</BaseText>
                 <ChevronRight class="w-4 h-4" />
              </button>
           </slot>
        </div>
      </div>

      <div v-if="paginatedItems.length === 0" class="glass p-10 rounded-[2rem] text-center border border-white/5">
          <BaseText type="muted" size="text-sm" class="font-black uppercase tracking-widest opacity-40">{{ t('common.no_data') }}</BaseText>
      </div>
    </div>

    <!-- Premium Pagination Bar (Section 10.1: 44px targets) -->
    <div v-if="pagination && totalPages > 0" class="flex flex-col sm:flex-row items-center justify-between gap-8 px-4 md:px-2">
       
       <!-- Page Controls -->
       <div class="flex items-center gap-2 order-2 sm:order-1">
          <button @click="currentPage = 1" :disabled="currentPage === 1" :class="btnClass(currentPage === 1)">
             <component :is="uiStore.isRTL ? ChevronsRight : ChevronsLeft" class="w-5 h-5" />
          </button>
          <button @click="prevPage" :disabled="currentPage === 1" :class="btnClass(currentPage === 1)">
             <component :is="uiStore.isRTL ? ChevronRight : ChevronLeft" class="w-5 h-5" />
          </button>
          
          <div class="flex items-center gap-1 mx-2">
             <div 
               v-for="p in totalPages" 
               :key="p"
               v-show="totalPages <= 5 || (p >= currentPage - 1 && p <= currentPage + 1) || p === 1 || p === totalPages"
               @click="currentPage = p"
               class="w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all font-black text-xs border border-white/5"
               :class="p === currentPage ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/30 scale-110 active:scale-95' : 'hover:bg-white/10 opacity-40 hover:opacity-100 active:scale-90'"
             >
                {{ p }}
             </div>
          </div>

          <button @click="nextPage" :disabled="currentPage === totalPages" :class="btnClass(currentPage === totalPages)">
             <component :is="uiStore.isRTL ? ChevronLeft : ChevronRight" class="w-5 h-5" />
          </button>
          <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" :class="btnClass(currentPage === totalPages)">
             <component :is="uiStore.isRTL ? ChevronsLeft : ChevronsRight" class="w-5 h-5" />
          </button>
       </div>

       <!-- Stats & Rows Selector -->
       <div class="order-1 sm:order-2 flex flex-col sm:flex-row items-center gap-6">
          <div class="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
             <BaseText type="muted" size="text-[10px]" class="font-black uppercase tracking-widest opacity-40">{{ t('common.rows') }}:</BaseText>
             <BaseSelect 
               v-model="rowsPerPage" 
               :options="rowOptions" 
               optionLabel="label" 
               optionValue="value" 
               class="!w-24"
             />
          </div>
          <BaseText type="muted" size="text-[10px]" class="font-black uppercase tracking-widest opacity-40">
            {{ (currentPage - 1) * rowsPerPage + 1 }}-{{ Math.min(currentPage * rowsPerPage, items.length) }} {{ t('common.of') }} {{ items.length }}
          </BaseText>
       </div>
    </div>
  </div>
</template>
