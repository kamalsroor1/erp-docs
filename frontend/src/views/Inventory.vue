<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../database/db'
import { generateDummyData } from '../services/dataGenerator'
import AddProductModal from '../components/AddProductModal.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { Package, RefreshCw, Plus } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const products = ref([])
const loading = ref(false)
const showAddModal = ref(false)

const loadData = async () => {
  loading.value = true
  const allProducts = await db.products.toArray()
  
  const productsWithStock = await Promise.all(allProducts.map(async (p) => {
    const stockCount = await db.items.where('product_id').equals(p.id).and(item => item.status === 'available').count()
    return { ...p, stock: stockCount }
  }))
  
  products.value = productsWithStock
  loading.value = false
}

const handleGenerate = async () => {
  loading.value = true
  await generateDummyData()
  await loadData()
  loading.value = false
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="p-8 space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-black flex items-center gap-4 text-slate-900 dark:text-white">
          <div class="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
            <Package class="w-7 h-7 text-primary-500" />
          </div>
          {{ t('inventory') }}
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium opacity-80">نظام إدارة المخزون والمستودعات الذكي</p>
      </div>
      
      <div class="flex flex-wrap gap-4">
        <Button 
          @click="handleGenerate"
          class="!bg-slate-100 dark:!bg-white/5 hover:!bg-slate-200 dark:hover:!bg-white/10 border !border-slate-200 dark:!border-white/10 !text-slate-600 dark:!text-slate-300 !px-5 !py-3 !rounded-2xl transition-all flex items-center gap-2 shadow-sm"
        >
          <RefreshCw class="w-4 h-4" />
          <span>{{ t('generate_data') }}</span>
        </Button>
        <Button 
          @click="showAddModal = true"
          class="!bg-primary-500 hover:!bg-primary-600 !border-none !text-white !px-8 !py-3 !rounded-2xl !font-black shadow-xl shadow-primary-500/20 flex items-center gap-2 transform hover:-translate-y-1 transition-all"
        >
          <Plus class="w-5 h-5" />
          <span>{{ t('add_product') }}</span>
        </Button>
      </div>
    </div>

    <AddProductModal v-model:visible="showAddModal" @saved="loadData" />

    <div class="glass rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl">
      <DataTable 
        :value="products" 
        :loading="loading"
        paginator :rows="10" 
        responsiveLayout="stack"
        class="!bg-transparent"
        :pt="{
          table: { class: 'w-full text-left border-collapse' },
          thead: { class: 'bg-slate-50 dark:bg-white/5' },
          column: {
            headerCell: { class: '!bg-transparent !text-slate-500 dark:!text-slate-400 !font-bold !p-5 !border-b !border-slate-200 dark:!border-white/10 uppercase text-xs tracking-wider' },
            bodyCell: { class: '!p-5 !border-b !border-slate-100 dark:!border-white/5 !text-slate-700 dark:!text-slate-200' }
          },
          paginator: {
             root: { class: '!bg-slate-50 dark:!bg-white/5 !border-t !border-slate-200 dark:!border-white/5 !p-4' }
          }
        }"
      >
        <Column field="name" :header="t('add_product')" sortable></Column>
        <Column field="category" :header="t('category')" sortable>
          <template #body="slotProps">
            <span class="px-3 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20 text-xs font-bold text-primary-400">
              {{ slotProps.data.category }}
            </span>
          </template>
        </Column>
        <Column field="sku" :header="t('sku')" sortable>
          <template #body="slotProps">
            <code class="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{{ slotProps.data.sku }}</code>
          </template>
        </Column>
        <Column field="stock" :header="t('stock')" sortable>
          <template #body="slotProps">
            <div v-if="slotProps.data.stock > 0" class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span class="font-bold text-emerald-400">{{ slotProps.data.stock }} {{ t('stock') }}</span>
            </div>
            <div v-else class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-red-500"></div>
              <span class="font-bold text-red-400">{{ t('out_of_stock') }}</span>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
