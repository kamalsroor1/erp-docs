<script setup>
/**
 * @file Dashboard.vue
 * @description High-fidelity dashboard for Ebraa ERP.
 * Follows ERP standards: Modular i18n, BaseText, Premium UX, Dexie.js.
 */
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '../../stores/ui'
import { db } from '../../database/db'
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ChevronRight,
  RefreshCcw
} from 'lucide-vue-next'
import Button from 'primevue/button'
import BaseText from '../../components/base/BaseText.vue'
import { Line } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  LineElement, 
  LinearScale, 
  PointElement, 
  CategoryScale,
  Filler
} from 'chart.js'
import { generateRealisticData } from '../../services/dataGenerator'
import { useToast } from 'primevue/usetoast'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler)

const { t } = useI18n()
const uiStore = useUIStore()
const toast = useToast()

const stats = ref({
  totalSales: 0,
  customersCount: 0,
  productsCount: 0,
  todayProfit: 0
})

const loading = ref(true)

const fetchDashboardStats = async () => {
  loading.value = true
  const branchId = parseInt(uiStore.selectedBranchId)
  
  // 1. Get total products
  stats.value.productsCount = await db.products.count()
  
  // 2. Get total customers
  stats.value.customersCount = await db.customers.count()
  
  // 3. Get Sales & Profit (Simulated from invoices tied to branch)
  const invoices = await db.invoices.where('branch_id').equals(branchId).toArray()
  stats.value.totalSales = invoices.reduce((acc, inv) => acc + inv.total, 0)
  stats.value.todayProfit = stats.value.totalSales * 0.15 // Simulate 15% profit
  
  loading.value = false
}

const handleResetData = async () => {
  await generateRealisticData()
  toast.add({ severity: 'success', summary: t('common.success'), detail: t('common.loading'), life: 3000 })
  await fetchDashboardStats()
}

onMounted(() => {
  fetchDashboardStats()
})

watch(() => uiStore.selectedBranchId, () => {
  fetchDashboardStats()
})

const chartData = computed(() => ({
  labels: [t('dashboard.sun'), t('dashboard.mon'), t('dashboard.tue'), t('dashboard.wed'), t('dashboard.thu'), t('dashboard.fri'), t('dashboard.sat')],
  datasets: [
    {
      label: t('dashboard.revenue'),
      data: [30, 45, 25, 60, 40, 85, 50],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { display: false },
    y: { display: false }
  }
}
</script>

<template>
  <div class="p-4 md:p-8 space-y-6 md:space-y-10">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <BaseText type="h1">{{ t('common.dashboard') }}</BaseText>
        <div class="flex items-center gap-2 mt-2">
          <Clock class="w-4 h-4 text-primary-500" />
          <BaseText type="muted">{{ t('dashboard.performance_overview') }}</BaseText>
        </div>
      </div>
      <div class="flex gap-3">
        <Button 
          @click="handleResetData"
          :loading="loading"
          text class="!text-slate-400 hover:!bg-white/5 !px-4 !py-2 !rounded-xl !border !border-slate-200 dark:!border-white/10"
        >
          <RefreshCcw class="w-4 h-4 mr-2" />
          <BaseText weight="bold" size="text-xs" class="!text-slate-400">{{ t('common.refresh_data') }}</BaseText>
        </Button>
        <div class="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <BaseText weight="black" color="emerald" size="text-[10px]" class="uppercase tracking-widest">{{ t('common.just_now') }}</BaseText>
        </div>
      </div>
    </div>

    <!-- Stats Grid (PWA optimized) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
      <div class="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl dark:bg-white/5 dark:border-white/10 p-5 md:p-8 rounded-3xl md:rounded-[2rem] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-inner group bg-white/80 border-slate-200 shadow-sm dark:bg-white/5 dark:border-white/10">
        <div class="flex items-start justify-between mb-4">
          <div class="p-3 md:p-4 rounded-2xl bg-primary-500/10 border border-primary-500/20 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500">
            <TrendingUp class="w-6 h-6" />
          </div>
          <div class="flex items-center gap-1 text-emerald-500 font-bold text-[10px] md:text-xs">
            <ArrowUpRight class="w-3 h-3 md:w-4 md:h-4" />
            <BaseText weight="bold" color="emerald" size="text-xs">12%</BaseText>
          </div>
        </div>
        <BaseText type="label" class="mb-1">{{ t('dashboard.revenue') }}</BaseText>
        <div class="flex items-baseline gap-1">
          <BaseText type="h2" class="!text-2xl md:!text-3xl">
            {{ stats.totalSales.toLocaleString() }} 
          </BaseText>
          <BaseText type="label" size="text-[10px]">{{ t('common.egp') }}</BaseText>
        </div>
      </div>

      <div class="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl dark:bg-white/5 dark:border-white/10 p-5 md:p-8 rounded-3xl md:rounded-[2rem] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-inner group bg-white/80 border-slate-200 shadow-sm dark:bg-white/5 dark:border-white/10">
        <div class="flex items-start justify-between mb-4">
          <div class="p-3 md:p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
            <Users class="w-6 h-6" />
          </div>
          <div class="flex items-center gap-1 text-emerald-500 font-bold text-[10px] md:text-xs">
            <ArrowUpRight class="w-3 h-3 md:w-4 md:h-4" />
            <BaseText weight="bold" color="emerald" size="text-xs">5.2%</BaseText>
          </div>
        </div>
        <BaseText type="label" class="mb-1">{{ t('common.customers') }}</BaseText>
        <BaseText type="h2" class="!text-2xl md:!text-3xl">{{ stats.customersCount }}</BaseText>
      </div>

      <div class="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl dark:bg-white/5 dark:border-white/10 p-5 md:p-8 rounded-3xl md:rounded-[2rem] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-inner group bg-white/80 border-slate-200 shadow-sm dark:bg-white/5 dark:border-white/10">
        <div class="flex items-start justify-between mb-4">
          <div class="p-3 md:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
            <Package class="w-6 h-6" />
          </div>
          <div class="flex items-center gap-1 text-red-500 font-bold text-[10px] md:text-xs">
            <ArrowDownRight class="w-3 h-3 md:w-4 md:h-4" />
            <BaseText weight="bold" color="danger" size="text-xs">2.1%</BaseText>
          </div>
        </div>
        <BaseText type="label" class="mb-1">{{ t('common.inventory') }}</BaseText>
        <BaseText type="h2" class="!text-2xl md:!text-3xl">{{ stats.productsCount }}</BaseText>
      </div>

      <div class="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl dark:bg-white/5 dark:border-white/10 p-5 md:p-8 rounded-3xl md:rounded-[2rem] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-inner group bg-white/80 border-slate-200 shadow-sm dark:bg-white/5 dark:border-white/10">
        <div class="flex items-start justify-between mb-4">
          <div class="p-3 md:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
            <DollarSign class="w-6 h-6" />
          </div>
          <div class="flex items-center gap-1 text-emerald-500 font-bold text-[10px] md:text-xs">
            <ArrowUpRight class="w-3 h-3 md:w-4 md:h-4" />
            <BaseText weight="bold" color="emerald" size="text-xs">18%</BaseText>
          </div>
        </div>
        <BaseText type="label" class="mb-1">{{ t('dashboard.profit') }}</BaseText>
        <div class="flex items-baseline gap-1">
          <BaseText type="h2" class="!text-2xl md:!text-3xl">
            {{ stats.todayProfit.toLocaleString() }} 
          </BaseText>
          <BaseText type="label" size="text-[10px]">{{ t('common.egp') }}</BaseText>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sales Chart Tile -->
      <div class="lg:col-span-2 glass-dark p-8 md:p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group min-h-[400px] flex flex-col">
        <div class="relative z-10 flex items-center justify-between mb-10">
          <div>
            <BaseText type="h3" class="!text-white mb-2">{{ t('dashboard.sales_analysis') }}</BaseText>
            <BaseText type="muted" class="!text-slate-400">{{ t('dashboard.weekly_performance') }}</BaseText>
          </div>
          <div class="flex gap-2">
            <Button text class="!text-xs !font-bold !text-primary-400 !bg-primary-500/10 !px-4 !py-2 !rounded-xl">
              <BaseText weight="black" color="primary" size="text-[10px]">7 {{ t('dashboard.days') }}</BaseText>
            </Button>
            <Button text class="!text-xs !font-bold !text-slate-500 !px-4 !py-2 !rounded-xl">
              <BaseText weight="bold" size="text-[10px]" class="!text-slate-500">30 {{ t('dashboard.days') }}</BaseText>
            </Button>
          </div>
        </div>
        
        <div class="flex-1 w-full mt-auto">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Quick Action Tiles -->
      <div class="grid grid-cols-1 gap-6">
        <div @click="$router.push('/pos')" class="p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-br from-primary-600 to-indigo-700 cursor-pointer group">
          <div class="flex items-center justify-between w-full">
            <div class="p-4 rounded-2xl bg-white/10 border border-white/10 group-hover:scale-110 transition-transform">
              <TrendingUp class="w-8 h-8 text-white" />
            </div>
            <ChevronRight class="w-6 h-6 text-white/50" />
          </div>
          <div>
            <BaseText type="h3" class="!text-white mb-1">{{ t('common.pos') }}</BaseText>
            <BaseText type="muted" class="!text-white/60">{{ t('common.new_transaction') }}</BaseText>
          </div>
        </div>

        <div @click="$router.push('/inventory')" class="p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl bg-slate-900 border border-white/5 group cursor-pointer overflow-hidden">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl"></div>
          <div class="flex items-center justify-between w-full relative z-10">
            <div class="p-4 rounded-2xl bg-primary-500/10 border border-primary-500/20 group-hover:rotate-12 transition-transform">
              <Package class="w-8 h-8 text-primary-400" />
            </div>
            <ChevronRight class="w-6 h-6 text-slate-600" />
          </div>
          <div class="relative z-10">
            <BaseText type="h3" class="!text-white mb-1">{{ t('common.inventory') }}</BaseText>
            <BaseText type="muted" class="!text-slate-400">{{ t('inventory.stock_audit') }}</BaseText>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No more complex @apply rules here to avoid Tailwind v4 build issues */
</style>
