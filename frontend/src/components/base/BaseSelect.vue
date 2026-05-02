<script setup>
/**
 * @file BaseSelect.vue
 * @description Advanced Select component for Ebraa ERP.
 * Features: Searchable, Custom styling, and Theme support.
 */
import Select from 'primevue/select'
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number, Object],
  options: Array,
  optionLabel: String,
  optionValue: String,
  placeholder: String,
  filter: {
    type: Boolean,
    default: true
  },
  loading: Boolean,
  class: String
})

const emit = defineEmits(['update:modelValue'])

const ptOptions = {
  root: { 
    class: '!bg-[var(--input-bg)] !border-[var(--input-border)] !rounded-2xl !p-1 transition-all focus:!border-primary-500' 
  },
  label: { 
    class: '!text-[var(--text-main)] !font-bold !text-sm !p-3' 
  },
  panel: { 
    class: 'glass-dark !border-[var(--border-color)] !rounded-2xl !shadow-2xl overflow-hidden' 
  },
  header: { 
    class: '!bg-transparent !border-b !border-[var(--border-color)] !p-4' 
  },
  filterInput: { 
    class: '!bg-slate-50 dark:!bg-white/5 !border-none !rounded-xl !p-4 !text-sm !text-[var(--text-main)] focus:!ring-0' 
  },
  item: { 
    class: '!p-4 !text-sm !font-medium !text-[var(--text-muted)] hover:!bg-primary-500/10 hover:!text-primary-500 transition-colors' 
  },
  itemGroup: {
    class: '!font-black !text-[10px] !uppercase !tracking-widest !text-primary-500 !p-4 !bg-primary-500/5'
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Select
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder"
      :filter="filter"
      :loading="loading"
      class="w-full"
      :class="props.class"
      :pt="ptOptions"
    >
      <!-- Custom Search Icon / Template can be added here -->
       <template #option="slotProps">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
            <span>{{ optionLabel ? slotProps.option[optionLabel] : slotProps.option }}</span>
          </div>
       </template>
    </Select>
  </div>
</template>
