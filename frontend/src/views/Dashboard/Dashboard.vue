<script setup>
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
  toast.add({ severity: 'success', summary: t('success'), detail: 'تم تحديث البيانات التجريبية', life: 3000 })
  await fetchDashboardStats()
}

onMounted(() => {
  fetchDashboardStats()
})

watch(() => uiStore.selectedBranchId, () => {
  fetchDashboardStats()
})

const chartData = computed(() => ({
  labels: [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')],
  datasets: [
    {
      label: t('sales'),
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
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ t('dashboard') }}
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-2">
          <Clock class="w-4 h-4 text-primary-500" />
          {{ t('performance_overview') }}
        </p>
      </div>
      <div class="flex gap-3">
        <Button 
          @click="handleResetData"
          :loading="loading"
          text class="!text-slate-400 hover:!bg-white/5 !px-4 !py-2 !rounded-xl !border !border-slate-200 dark:!border-white/10"
        >
          <RefreshCcw class="w-4 h-4 mr-2" />
          <span class="text-xs font-bold">{{ t('refresh_data') }}</span>
        </Button>
        <div class="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{{ t('just_now') }}</span>
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
            12%
          </div>
        </div>
        <p class="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{{ t('total_sales') }}</p>
        <h3 class="text-xl md:text-3xl font-black text-slate-900 dark:text-white">{{ stats.totalSales.toLocaleString() }} <small class="text-xs text-slate-400 font-medium">{{ t('egp') }}</small></h3>
      </div>

      <div class="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl dark:bg-white/5 dark:border-white/10 p-5 md:p-8 rounded-3xl md:rounded-[2rem] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-inner group bg-white/80 border-slate-200 shadow-sm dark:bg-white/5 dark:border-white/10">
        <div class="flex items-start justify-between mb-4">
          <div class="p-3 md:p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
            <Users class="w-6 h-6" />
          </div>
          <div class="flex items-center gap-1 text-emerald-500 font-bold text-[10px] md:text-xs">
            <ArrowUpRight class="w-3 h-3 md:w-4 md:h-4" />
            5.2%
          </div>
        </div>
        <p class="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{{ t('customers') }}</p>
        <h3 class="text-xl md:text-3xl font-black text-slate-900 dark:text-white">{{ stats.customersCount }}</h3>
      </div>

      <div class="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl dark:bg-white/5 dark:border-white/10 p-5 md:p-8 rounded-3xl md:rounded-[2rem] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-inner group bg-white/80 border-slate-200 shadow-sm dark:bg-white/5 dark:border-white/10">
        <div class="flex items-start justify-between mb-4">
          <div class="p-3 md:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
            <Package class="w-6 h-6" />
          </div>
          <div class="flex items-center gap-1 text-red-500 font-bold text-[10px] md:text-xs">
            <ArrowDownRight class="w-3 h-3 md:w-4 md:h-4" />
            2.1%
          </div>
        </div>
        <p class="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{{ t('inventory') }}</p>
        <h3 class="text-xl md:text-3xl font-black text-slate-900 dark:text-white">{{ stats.productsCount }}</h3>
      </div>

      <div class="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl dark:bg-white/5 dark:border-white/10 p-5 md:p-8 rounded-3xl md:rounded-[2rem] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-inner group bg-white/80 border-slate-200 shadow-sm dark:bg-white/5 dark:border-white/10">
        <div class="flex items-start justify-between mb-4">
          <div class="p-3 md:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
            <DollarSign class="w-6 h-6" />
          </div>
          <div class="flex items-center gap-1 text-emerald-500 font-bold text-[10px] md:text-xs">
            <ArrowUpRight class="w-3 h-3 md:w-4 md:h-4" />
            18%
          </div>
        </div>
        <p class="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{{ t('profit') }}</p>
        <h3 class="text-xl md:text-3xl font-black text-slate-900 dark:text-white">{{ stats.todayProfit.toLocaleString() }} <small class="text-xs text-slate-400 font-medium">{{ t('egp') }}</small></h3>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sales Chart Tile -->
      <div class="lg:col-span-2 glass-dark p-8 md:p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group min-h-[400px] flex flex-col">
        <div class="relative z-10 flex items-center justify-between mb-10">
          <div>
            <h3 class="text-2xl font-black text-white mb-2">{{ t('sales_analysis') }}</h3>
            <p class="text-slate-400 text-sm font-medium">{{ t('weekly_performance') }}</p>
          </div>
          <div class="flex gap-2">
            <Button text class="!text-xs !font-bold !text-primary-400 !bg-primary-500/10 !px-4 !py-2 !rounded-xl">7 {{ t('days') }}</Button>
            <Button text class="!text-xs !font-bold !text-slate-500 !px-4 !py-2 !rounded-xl">30 {{ t('days') }}</Button>
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
            <h4 class="text-2xl font-black text-white mb-2">{{ t('pos') }}</h4>
            <p class="text-white/60 text-sm font-medium">{{ t('new_transaction') }}</p>
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
            <h4 class="text-2xl font-black text-white mb-2">{{ t('inventory') }}</h4>
            <p class="text-slate-400 text-sm font-medium">{{ t('stock_audit') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No more complex @apply rules here to avoid Tailwind v4 build issues */
</style>
