<script setup>
/**
 * @file AddProductModal.vue
 * @description A "Dumb" component for creating a new product. 
 * Follows ERP standards: i18n, Keyboard-First, Loading states, and emitting data.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Select from 'primevue/select'
import { Save, X, Info } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useKeyboardShortcuts } from '../utils/keyboard'

/**
 * @typedef {Object} Product
 * @property {string} name
 * @property {string} category
 * @property {string} sku
 * @property {string} type - 'serial' | 'bulk' | 'service'
 * @property {string} brand
 */

const props = defineProps({
  visible: Boolean,
  loading: Boolean // Controlled by parent
})

const emit = defineEmits(['update:visible', 'save'])
const { t } = useI18n()

const product = ref({
  name: '',
  category: '',
  sku: '',
  type: 'serial',
  brand: ''
})

const categories = [
  t('smartphones'), t('laptops'), t('accessories'), t('tablets'), t('networking')
]

const types = [
  { label: t('serial'), value: 'serial' },
  { label: t('bulk'), value: 'bulk' },
  { label: t('service'), value: 'service' }
]

const close = () => {
  emit('update:visible', false)
}

const handleSave = () => {
  // Validation can stay here as it's UI logic
  if (!product.value.name || !product.value.sku) {
    return
  }
  emit('save', { ...product.value })
}

// Reset form when modal opens
const resetForm = () => {
  product.value = { name: '', category: '', sku: '', type: 'serial', brand: '' }
}

// Keyboard shortcuts for this modal
const { register, unregister } = useKeyboardShortcuts({
  onSave: handleSave,
  onCancel: close
})

onMounted(() => {
  if (props.visible) register()
})

onUnmounted(() => {
  unregister()
})
</script>

<template>
  <Dialog 
    :visible="visible" 
    @update:visible="emit('update:visible', $event)"
    @show="resetForm"
    :header="t('add_product')" 
    modal 
    class="w-full max-w-xl mx-4"
    :pt="{
      root: { class: 'glass-dark !border-slate-200 dark:!border-white/10' },
      header: { class: '!bg-transparent !border-b !border-slate-100 dark:!border-white/5 !p-6' },
      title: { class: '!text-slate-900 dark:!text-white !text-xl !font-black' },
      content: { class: '!bg-transparent !p-8' },
      closeButton: { class: '!text-slate-400 hover:!bg-slate-100 dark:hover:!bg-white/5' }
    }"
  >
    <div class="space-y-6">
      <!-- Help Alert -->
      <div class="p-4 bg-primary-500/5 rounded-2xl border border-primary-500/10 flex items-start gap-4 mb-4">
         <Info class="w-5 h-5 text-primary-500 mt-1" />
         <p class="text-xs text-slate-500 font-medium">
           {{ t('product_help_text') }}
           <br/>
           <span class="text-primary-500 font-bold">{{ t('keyboard_tip') }}</span>
         </p>
      </div>

      <!-- Form Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2 col-span-1 md:col-span-2">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ t('add_product') }} *</label>
          <InputText 
            v-model="product.name" 
            :placeholder="t('add_product')"
            class="w-full !bg-slate-50 dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !text-slate-900 dark:!text-white !p-4 !rounded-2xl focus:!border-primary-500" 
          />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ t('brand') }}</label>
          <InputText 
            v-model="product.brand" 
            :placeholder="t('brand_placeholder')"
            class="w-full !bg-slate-50 dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !text-slate-900 dark:!text-white !p-4 !rounded-2xl focus:!border-primary-500" 
          />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ t('category') }}</label>
          <Select 
            v-model="product.category" 
            :options="categories"
            :placeholder="t('category')"
            class="w-full !bg-slate-50 dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !text-slate-900 dark:!text-white !rounded-2xl"
          />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ t('tracking_type') }}</label>
          <Select 
            v-model="product.type" 
            :options="types"
            optionLabel="label"
            optionValue="value"
            class="w-full !bg-slate-50 dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !text-slate-900 dark:!text-white !rounded-2xl"
          />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ t('sku') }} *</label>
          <InputText 
            v-model="product.sku" 
            :placeholder="t('sku_placeholder')"
            class="w-full !bg-slate-50 dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !text-slate-900 dark:!text-white !p-4 !rounded-2xl focus:!border-primary-500" 
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-4 justify-end mt-8 border-t border-slate-100 dark:border-white/5 pt-6">
        <Button 
          @click="close"
          class="!bg-transparent hover:!bg-slate-100 dark:hover:!bg-white/5 !border-slate-200 dark:!border-white/10 !text-slate-500 !px-8 !py-3 !rounded-2xl"
        >
          <X class="w-4 h-4 mr-2" />
          {{ t('cancel') }}
        </Button>
        <Button 
          @click="handleSave"
          :loading="loading"
          class="!bg-primary-500 hover:!bg-primary-600 !border-none !text-white !px-10 !py-3 !rounded-2xl !font-black shadow-xl shadow-primary-500/30"
        >
          <Save class="w-4 h-4 mr-2" />
          {{ t('save_product') }}
        </Button>
      </div>
    </template>
  </Dialog>
</template>
