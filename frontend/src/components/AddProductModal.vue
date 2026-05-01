<script setup>
import { ref } from 'vue'
import { db } from '../database/db'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'
import { Save, X } from 'lucide-vue-next'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'saved'])

const toast = useToast()
const loading = ref(false)

const product = ref({
  name: '',
  category: '',
  sku: '',
})

const categories = [
  'Smartphones', 'Laptops', 'Accessories', 'Tablets', 'Networking'
]

const close = () => {
  emit('update:visible', false)
}

const save = async () => {
  if (!product.value.name || !product.value.sku) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields', life: 3000 })
    return
  }

  loading.value = true
  try {
    await db.products.add({ ...product.value })
    toast.add({ severity: 'success', summary: 'Success', detail: 'Product added successfully', life: 3000 })
    emit('saved')
    close()
    // Reset form
    product.value = { name: '', category: '', sku: '' }
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product', life: 3000 })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Dialog 
    :visible="visible" 
    @update:visible="emit('update:visible', $event)"
    header="Add New Product" 
    modal 
    class="w-full max-w-lg !bg-[#0f172a] !border-white/10"
    :pt="{
      root: { class: 'glass-dark' },
      header: { class: '!bg-transparent !border-b !border-white/5 !p-6' },
      title: { class: '!text-white !text-xl !font-bold' },
      content: { class: '!bg-transparent !p-6' },
      closeButton: { class: '!text-slate-400 hover:!bg-white/5' }
    }"
  >
    <div class="space-y-6">
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-400">Product Name *</label>
        <InputText 
          v-model="product.name" 
          placeholder="e.g. iPhone 15 Pro"
          class="w-full !bg-white/5 !border-white/10 !text-white !p-3 !rounded-xl focus:!border-primary-500/50" 
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-400">Category</label>
          <Select 
            v-model="product.category" 
            :options="categories"
            placeholder="Select Category"
            class="w-full !bg-white/5 !border-white/10 !text-white !rounded-xl focus:!border-primary-500/50"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-400">SKU *</label>
          <InputText 
            v-model="product.sku" 
            placeholder="IP15P-BLK"
            class="w-full !bg-white/5 !border-white/10 !text-white !p-3 !rounded-xl focus:!border-primary-500/50" 
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3 justify-end mt-4">
        <Button 
          @click="close"
          class="!bg-transparent hover:!bg-white/5 !border-white/10 !text-slate-400 !px-6 !py-2 !rounded-xl"
        >
          <X class="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button 
          @click="save"
          :loading="loading"
          class="!bg-primary-500 hover:!bg-primary-600 !border-none !text-white !px-8 !py-2 !rounded-xl !font-bold shadow-lg shadow-primary-500/20"
        >
          <Save class="w-4 h-4 mr-2" />
          Save Product
        </Button>
      </div>
    </template>
  </Dialog>
</template>
