<script setup>
/**
 * @file BaseTable.vue
 * @description Unified Data Presentation component.
 * Features: Mobile Cards View, Glassmorphism, Dynamic Columns.
 */
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { computed } from 'vue'
import { useUIStore } from '../../stores/ui'
import { Package } from 'lucide-vue-next'

const props = defineProps({
  value: Array,
  loading: Boolean,
  rows: { type: Number, default: 10 },
  emptyMessage: String
})

const uiStore = useUIStore()

const ptOptions = {
  root: { class: 'glass rounded-[2rem] overflow-hidden border border-[var(--border-color)] shadow-2xl bg-[var(--card-bg)]' },
  table: { class: 'w-full text-left border-collapse' },
  thead: { class: 'bg-slate-50 dark:bg-white/5' },
  headerRow: { class: '!border-b !border-[var(--border-color)]' },
  column: {
    headerCell: { class: '!bg-transparent !text-[var(--text-muted)] !font-bold !p-6 uppercase text-[10px] tracking-widest' },
    bodyCell: { class: '!p-6 !border-b !border-[var(--border-color)] !text-[var(--text-main)]' }
  },
  paginator: {
    root: { class: '!bg-slate-50 dark:!bg-white/5 !border-t !border-[var(--border-color)] !p-4' }
  }
}
</script>

<template>
  <div class="base-table-container">
    <!-- Desktop View -->
    <DataTable 
      :value="value" 
      :loading="loading"
      paginator 
      :rows="rows" 
      class="hidden md:block !bg-transparent"
      responsiveLayout="scroll"
      :pt="ptOptions"
    >
      <template #empty>
        <div class="py-32 text-center text-slate-500 italic flex flex-col items-center gap-4">
          <Package class="w-16 h-16 opacity-10" />
          <p class="text-xl font-bold opacity-30">{{ emptyMessage || 'No records found' }}</p>
        </div>
      </template>
      <slot />
    </DataTable>

    <!-- Mobile View: Slots can be used here to build custom card layouts -->
    <div class="md:hidden divide-y divide-[var(--border-color)] glass rounded-[2rem] overflow-hidden border border-[var(--border-color)]">
      <div v-if="loading" class="p-10 text-center text-[var(--text-muted)] font-bold">
        {{ $t('common.loading') }}
      </div>
      <div v-else-if="!value || value.length === 0" class="p-20 text-center opacity-30 italic font-bold">
        {{ emptyMessage || 'No records' }}
      </div>
      <div v-for="(item, index) in value" :key="index" class="p-6 active:bg-slate-50 dark:active:bg-white/5 transition-colors">
        <slot name="mobile-card" :data="item" />
      </div>
    </div>
  </div>
</template>
