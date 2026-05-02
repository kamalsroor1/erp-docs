<script setup>
/**
 * @file BaseTable.vue
 * @description Smart Responsive Table component with automatic Card Transformation on mobile.
 * Fixed: Tailwind v4 utility reference issues.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '../../stores/ui'
import BaseText from './BaseText.vue'
import { ChevronRight, MoreVertical } from 'lucide-vue-next'

const props = defineProps({
  columns: { type: Array, required: true },
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false }
})

const uiStore = useUIStore()
const isMobile = ref(false)

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

const glassClass = computed(() => {
  return [
    'backdrop-blur-xl shadow-2xl border border-white/10',
    uiStore.isDark ? 'bg-slate-900/40' : 'bg-white/5'
  ]
})
</script>

<template>
  <div class="w-full">
    <!-- Desktop Table View -->
    <div v-if="!isMobile" :class="glassClass" class="overflow-hidden rounded-[2rem]">
      <table class="w-full text-right border-collapse">
        <thead class="bg-white/5 border-b border-white/10">
          <tr>
            <th 
              v-for="col in columns" 
              :key="col.key"
              class="px-8 py-6 text-xs font-black uppercase tracking-widest opacity-40 text-right"
              :class="col.headerClass"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr 
            v-for="(item, idx) in items" 
            :key="idx"
            class="hover:bg-white/5 transition-colors group cursor-pointer"
          >
            <td 
              v-for="col in columns" 
              :key="col.key"
              class="px-8 py-6 text-sm font-bold"
              :class="col.class"
            >
              <slot :name="`cell(${col.key})`" :item="item" :value="item[col.key]">
                {{ item[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div v-else class="space-y-4">
      <div 
        v-for="(item, idx) in items" 
        :key="idx"
        :class="glassClass"
        class="p-6 rounded-[2rem] active:scale-[0.98] transition-all duration-300"
      >
        <!-- Card Header -->
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
          <div class="flex items-center gap-3">
             <slot name="card-header" :item="item"></slot>
          </div>
          <button class="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5">
             <MoreVertical class="w-5 h-5 opacity-40" />
          </button>
        </div>

        <!-- Card Body -->
        <div class="grid grid-cols-2 gap-y-4 gap-x-2">
           <div v-for="col in columns.slice(1)" :key="col.key" class="flex flex-col gap-1">
              <BaseText size="text-[10px]" class="uppercase font-black opacity-30 tracking-tighter">{{ col.label }}</BaseText>
              <div class="text-sm font-bold truncate">
                 <slot :name="`cell(${col.key})`" :item="item" :value="item[col.key]">
                   {{ item[col.key] }}
                 </slot>
              </div>
           </div>
        </div>

        <!-- Card Footer -->
        <div class="mt-6 pt-4 border-t border-white/5 flex justify-end">
           <slot name="card-actions" :item="item">
              <button class="flex items-center gap-2 text-primary-500 font-black text-xs uppercase tracking-widest">
                 التفاصيل
                 <ChevronRight class="w-4 h-4" />
              </button>
           </slot>
        </div>
      </div>
    </div>
  </div>
</template>
