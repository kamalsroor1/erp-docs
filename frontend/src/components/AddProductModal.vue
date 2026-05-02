<script setup>
/**
 * @file AddProductModal.vue
 * @description A "Dumb" component for creating a new product. 
 * Follows ERP standards: i18n (Modular), Keyboard-First, Loading states, and emitting data.
 */
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { Save, X, Info } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useKeyboardShortcuts } from '../utils/keyboard'
import BaseText from './base/BaseText.vue'
import BaseModal from './base/BaseModal.vue'
import BaseSelect from './base/BaseSelect.vue'

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

const errors = reactive({
  name: '',
  sku: '',
  category: ''
})

const categories = [
  t('inventory.smartphones'), t('inventory.laptops'), t('inventory.accessories'), t('inventory.tablets'), t('inventory.networking')
]

const types = [
  { label: t('inventory.serial'), value: 'serial' },
  { label: t('inventory.bulk'), value: 'bulk' },
  { label: t('inventory.service'), value: 'service' }
]

const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.sku = ''
  errors.category = ''

  if (!product.value.name.trim()) {
    errors.name = t('validation.field_required')
    isValid = false
  }
  if (!product.value.sku.trim()) {
    errors.sku = t('validation.field_required')
    isValid = false
  }
  if (!product.value.category) {
    errors.category = t('validation.field_required')
    isValid = false
  }

  return isValid
}

const close = () => {
  emit('update:visible', false)
}

const handleSave = () => {
  if (validateForm()) {
    emit('save', { ...product.value })
  }
}

// Reset form and errors when modal opens
const resetForm = () => {
  product.value = { name: '', category: '', sku: '', type: 'serial', brand: '' }
  errors.name = ''
  errors.sku = ''
  errors.category = ''
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
  <BaseModal 
    :visible="visible" 
    @update:visible="emit('update:visible', $event)"
    :title="t('inventory.add_product')"
    @show="resetForm"
  >
    <div class="space-y-6">
      <!-- Help Alert -->
      <div class="p-4 bg-primary-500/5 rounded-2xl border border-primary-500/10 flex items-start gap-4 mb-4">
          <Info class="w-5 h-5 text-primary-500 mt-1" />
          <div class="flex flex-col">
            <BaseText type="muted" size="text-xs">
              {{ t('inventory.product_help_text') }}
            </BaseText>
            <BaseText type="body" weight="bold" color="primary" size="text-xs">
              {{ t('inventory.keyboard_tip') }}
            </BaseText>
          </div>
       </div>

      <!-- Form Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Product Name -->
        <div class="space-y-2 col-span-1 md:col-span-2">
          <BaseText type="label">{{ t('inventory.add_product') }} *</BaseText>
          <InputText 
            v-model="product.name" 
            :placeholder="t('inventory.add_product')"
            :class="[
              'w-full !bg-slate-50 dark:!bg-white/5 !p-4 !rounded-2xl transition-all focus:!ring-2 focus:!ring-primary-500/20',
              errors.name ? '!border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : '!border-slate-200 dark:!border-white/10'
            ]"
          />
          <BaseText v-if="errors.name" color="danger" size="text-[10px]" weight="bold" class="px-2 animate-pulse">{{ errors.name }}</BaseText>
        </div>

        <!-- Brand -->
        <div class="space-y-2">
          <BaseText type="label">{{ t('inventory.brand') }}</BaseText>
          <InputText 
            v-model="product.brand" 
            :placeholder="t('inventory.brand_placeholder')"
            class="w-full !bg-slate-50 dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !text-slate-900 dark:!text-white !p-4 !rounded-2xl focus:!border-primary-500" 
          />
        </div>

        <!-- Category -->
        <div class="space-y-2">
          <BaseText type="label">{{ t('inventory.category') }} *</BaseText>
          <BaseSelect 
            v-model="product.category" 
            :options="categories"
            :placeholder="t('inventory.category')"
            class="w-full"
            :class="{ '!border-red-500': errors.category }"
          />
          <BaseText v-if="errors.category" color="danger" size="text-[10px]" weight="bold" class="px-2 animate-pulse">{{ errors.category }}</BaseText>
        </div>

        <!-- Tracking Type -->
        <div class="space-y-2">
          <BaseText type="label">{{ t('inventory.tracking_type') }}</BaseText>
          <BaseSelect 
            v-model="product.type" 
            :options="types"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>

        <!-- SKU -->
        <div class="space-y-2">
          <BaseText type="label">{{ t('inventory.sku') }} *</BaseText>
          <InputText 
            v-model="product.sku" 
            :placeholder="t('inventory.sku_placeholder')"
            :class="[
              'w-full !bg-slate-50 dark:!bg-white/5 !p-4 !rounded-2xl transition-all focus:!ring-2 focus:!ring-primary-500/20',
              errors.sku ? '!border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : '!border-slate-200 dark:!border-white/10'
            ]"
          />
          <BaseText v-if="errors.sku" color="danger" size="text-[10px]" weight="bold" class="px-2 animate-pulse">{{ errors.sku }}</BaseText>
        </div>
      </div>
    </div>

    <template #footer>
      <Button 
        @click="close"
        class="!bg-transparent hover:!bg-slate-100 dark:hover:!bg-white/5 !border-slate-200 dark:!border-white/10 !text-slate-500 !px-8 !py-3 !rounded-2xl"
      >
        <X class="w-4 h-4 mr-2" />
        <BaseText weight="bold" size="text-sm" class="!text-slate-500">{{ t('common.cancel') }}</BaseText>
      </Button>
      <Button 
        @click="handleSave"
        :loading="loading"
        class="!bg-primary-500 hover:!bg-primary-600 !border-none !text-white !px-10 !py-3 !rounded-2xl shadow-xl shadow-primary-500/30"
      >
        <Save v-if="!loading" class="w-4 h-4 mr-2" />
        <BaseText weight="black" class="!text-white">{{ t('inventory.save_product') }}</BaseText>
      </Button>
    </template>
  </BaseModal>
</template>
