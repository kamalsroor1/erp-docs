<script setup>
/**
 * @file BaseFilterSidebar.vue
 * @description Universal Filter Sidebar for any Data Table.
 * Supports dynamic filter schemas and strictly adheres to FRONTEND_AI_INSTRUCTIONS.md.
 */
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Sidebar from 'primevue/sidebar'
import { Filter } from 'lucide-vue-next'
import BaseText from './BaseText.vue'
import BaseSelect from './BaseSelect.vue'

const props = defineProps({
  visible: Boolean,
  title: { type: String, default: '' },
  filters: {
    type: Array,
    required: true,
    /**
     * Schema: [{ key: String, label: String, options: Array, placeholder: String }]
     */
  },
  initialValues: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'apply', 'reset'])

const { t } = useI18n()
const tempValues = ref({ ...props.initialValues })

// Sync when visibility changes
watch(() => props.visible, (newVal) => {
  if (newVal) {
    tempValues.value = { ...props.initialValues }
  }
})

const handleApply = () => {
  emit('apply', { ...tempValues.value })
  emit('update:visible', false)
}

const handleReset = () => {
  const resetObj = {}
  props.filters.forEach(f => resetObj[f.key] = null)
  tempValues.value = resetObj
  emit('reset')
  emit('update:visible', false)
}
</script>

<template>
  <Sidebar 
    :visible="visible" 
    @update:visible="emit('update:visible', $event)" 
    position="left" 
    class="!w-full sm:!w-[400px] !bg-slate-900/90 !backdrop-blur-2xl !border-r !border-white/10"
  >
    <template #header>
       <div class="flex items-center gap-3">
          <Filter class="w-6 h-6 text-primary-500" />
          <BaseText weight="black" size="text-xl">{{ title || t('common.filters') }}</BaseText>
       </div>
    </template>

    <div class="p-4 space-y-10">
       <!-- Dynamic Filters Generation -->
       <div v-for="filter in filters" :key="filter.key" class="space-y-4">
          <BaseText weight="black" size="text-xs" class="uppercase opacity-40 tracking-widest">{{ filter.label }}</BaseText>
          <BaseSelect 
            v-model="tempValues[filter.key]" 
            :options="filter.options" 
            optionLabel="label" 
            optionValue="value" 
            :placeholder="filter.placeholder || t('common.select_placeholder')" 
          />
       </div>

       <!-- Actions -->
       <div class="pt-10 space-y-4">
          <button 
            @click="handleApply" 
            class="w-full py-5 bg-primary-600 text-white rounded-2xl active:scale-95 transition-all shadow-xl shadow-primary-500/20 border border-white/10"
          >
             <BaseText weight="black" class="text-white">{{ t('inventory.apply_filters') || t('common.apply') }}</BaseText>
          </button>
          <button 
            @click="handleReset" 
            class="w-full py-5 bg-white/5 border border-white/10 rounded-2xl active:scale-95 transition-all"
          >
             <BaseText weight="black" size="text-xs" class="uppercase tracking-widest">{{ t('inventory.reset_filters') || t('common.reset') }}</BaseText>
          </button>
       </div>
    </div>
  </Sidebar>
</template>
