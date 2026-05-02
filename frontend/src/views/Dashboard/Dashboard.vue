<script setup>
/**
 * @file Dashboard.vue
 * @description ERP Dashboard with RBAC (Role-Based Access Control) and Full-Screen Analysis.
 * Implements Section 10 Protocol: active:scale-95 and px-6 padding.
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '../../stores/ui'
import { useAuthStore } from '../../stores/auth'
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  ArrowUpRight, 
  ArrowDownLeft,
  Plus,
  BarChart3,
  Settings,
  Truck,
  CreditCard,
  History,
  ClipboardCheck,
  UserPlus,
  Maximize2,
  Download
} from 'lucide-vue-next'
import BaseText from '../../components/base/BaseText.vue'
import Chart from 'primevue/chart'
import Dialog from 'primevue/dialog'

const { t } = useI18n()
const uiStore = useUIStore()
const authStore = useAuthStore()

const showAnalysisModal = ref(false)

// Statistics mapping
const stats = computed(() => {
  const allStats = [
    { 
      title: t('dashboard.revenue'), 
      value: '45,230 ج.م', 
      change: '+12.5%', 
      up: true, 
      icon: TrendingUp, 
      color: 'bg-emerald-500',
      permission: 'view_reports'
    },
    { 
      title: t('dashboard.orders'), 
      value: '124', 
      change: '+8.2%', 
      up: true, 
      icon: ShoppingCart, 
      color: 'bg-primary-500',
      permission: 'make_sales'
    },
    { 
      title: t('common.customers'), 
      value: '1,240', 
      change: '+4.1%', 
      up: true, 
      icon: Users, 
      color: 'bg-indigo-500',
      permission: 'view_customers'
    },
    { 
      title: t('dashboard.stock_alerts'), 
      value: '12', 
      change: '-2', 
      up: false, 
      icon: Package, 
      color: 'bg-amber-500',
      permission: 'view_inventory'
    }
  ]
  return allStats.filter(s => !s.permission || authStore.hasPermission(s.permission))
})

// Quick Access Grid with Permission check
const quickActions = computed(() => {
  const actions = [
    { label: t('dashboard.new_sale'), icon: Plus, color: 'bg-emerald-500', path: '/pos', perm: 'make_sales' },
    { label: t('common.inventory'), icon: Package, color: 'bg-primary-500', path: '/inventory', perm: 'view_inventory' },
    { label: t('dashboard.reports'), icon: BarChart3, color: 'bg-indigo-500', path: '/reports', perm: 'view_reports' },
    { label: t('dashboard.inventory_audit'), icon: ClipboardCheck, color: 'bg-amber-500', path: '/inventory/audit', perm: 'edit_inventory' },
    { label: t('common.customers'), icon: UserPlus, color: 'bg-pink-500', path: '/customers', perm: 'view_customers' },
    { label: t('dashboard.suppliers'), icon: Truck, color: 'bg-slate-500', path: '/suppliers', perm: 'view_inventory' },
    { label: t('dashboard.expenses'), icon: CreditCard, color: 'bg-red-500', path: '/expenses', perm: 'view_reports' },
    { label: t('dashboard.stock_transfer'), icon: ArrowUpRight, color: 'bg-cyan-500', path: '/inventory/transfer', perm: 'edit_inventory' },
    { label: t('dashboard.history'), icon: History, color: 'bg-purple-500', path: '/history', perm: 'view_reports' },
    { label: t('dashboard.settings'), icon: Settings, color: 'bg-slate-700', path: '/settings', perm: 'manage_system' },
    { label: t('dashboard.employees'), icon: Users, color: 'bg-blue-600', path: '/employees', perm: 'manage_system' }
  ]
  return actions.filter(a => authStore.hasPermission(a.perm))
})

const chartData = ref({
  labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
  datasets: [
    {
      label: 'المبيعات الأسبوعية',
      data: [65000, 59000, 80000, 81000, 56000, 55000, 40000],
      fill: true,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: '#6366f1'
    }
  ]
})

const chartOptions = computed(() => ({
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { 
      display: true, 
      grid: { color: uiStore.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
      ticks: { color: uiStore.isDark ? '#94a3b8' : '#64748b' }
    },
    x: { 
      grid: { display: false },
      ticks: { color: uiStore.isDark ? '#94a3b8' : '#64748b' }
    }
  },
  maintainAspectRatio: false
}))

const cardClass = computed(() => {
  return [
    'backdrop-blur-xl border transition-all duration-300 shadow-2xl rounded-[2.5rem]',
    uiStore.isDark 
      ? 'bg-slate-900/40 border-white/10 shadow-black/20' 
      : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
  ]
})
</script>

<template>
  <div class="px-6 py-6 md:p-10 space-y-8 md:space-y-12 animate-in fade-in duration-700">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <BaseText weight="black" size="text-3xl md:text-5xl" class="tracking-tight">{{ t('common.welcome') }}, 👋</BaseText>
        <BaseText type="muted" size="text-sm md:text-base" class="mt-2 font-black opacity-60">{{ t('dashboard.subtitle') }}</BaseText>
      </div>
      <div v-if="authStore.hasPermission('make_sales')" class="flex items-center gap-4">
        <button class="flex-1 md:flex-none px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-[1.5rem] font-black text-sm transition-all shadow-xl shadow-primary-500/30 active:scale-95 flex items-center justify-center gap-2">
          <Plus class="w-6 h-6" />
          {{ t('dashboard.new_sale') }}
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      <div 
        v-for="stat in stats" 
        :key="stat.title"
        :class="cardClass"
        class="p-8 hover:translate-y-[-8px] active:scale-95 transition-all group relative overflow-hidden cursor-pointer"
      >
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
        
        <div class="flex items-center justify-between mb-8">
          <div :class="[stat.color, 'w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10 transition-transform group-hover:rotate-12 group-hover:scale-110']">
            <component :is="stat.icon" class="w-8 h-8" />
          </div>
          <div :class="[stat.up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500', 'px-4 py-1.5 rounded-full text-[11px] font-black flex items-center gap-1.5 uppercase tracking-widest']">
            {{ stat.change }}
            <ArrowUpRight v-if="stat.up" class="w-3.5 h-3.5" />
            <ArrowDownLeft v-else class="w-3.5 h-3.5" />
          </div>
        </div>
        
        <BaseText weight="black" size="text-3xl" class="block leading-none">{{ stat.value }}</BaseText>
        <BaseText type="muted" size="text-xs" class="mt-3 font-black uppercase tracking-widest opacity-40">{{ stat.title }}</BaseText>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
      <!-- Chart Preview Area -->
      <div v-if="authStore.hasPermission('view_reports')" :class="cardClass" class="lg:col-span-7 p-8 md:p-12 flex flex-col group overflow-hidden active:scale-[0.99] transition-all cursor-pointer" @click="showAnalysisModal = true">
        <div class="flex items-center justify-between mb-10">
          <div>
            <BaseText weight="black" size="text-2xl md:text-3xl">{{ t('dashboard.sales_chart') }}</BaseText>
            <BaseText type="muted" size="text-xs" class="mt-2 font-black uppercase tracking-widest opacity-40">{{ t('dashboard.weekly_performance') }}</BaseText>
          </div>
          <button class="header-icon !bg-primary-500/10 !text-primary-500 hover:!bg-primary-500 hover:!text-white transition-all shadow-lg shadow-primary-500/10">
             <Maximize2 class="w-6 h-6" />
          </button>
        </div>
        <div class="h-64 md:h-80 w-full relative">
          <Chart type="line" :data="chartData" :options="chartOptions" class="h-full" />
        </div>
      </div>

      <!-- Quick Access Area -->
      <div :class="[cardClass, !authStore.hasPermission('view_reports') ? 'lg:col-span-12' : 'lg:col-span-5']" class="p-8 md:p-12">
        <div class="mb-10">
          <BaseText weight="black" size="text-2xl md:text-3xl">{{ t('dashboard.quick_access') }}</BaseText>
          <BaseText type="muted" size="text-xs" class="mt-2 font-black uppercase tracking-widest opacity-40">{{ t('dashboard.quick_access_desc') }}</BaseText>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6" :class="!authStore.hasPermission('view_reports') ? 'lg:grid-cols-6' : 'lg:grid-cols-4'">
          <router-link 
            v-for="action in quickActions" 
            :key="action.label" 
            :to="action.path"
            class="flex flex-col items-center gap-4 p-5 md:p-6 rounded-[2rem] transition-all hover:bg-white/5 border border-transparent hover:border-white/10 active:scale-95 group"
          >
            <div :class="[action.color, 'w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform shadow-black/10']">
              <component :is="action.icon" class="w-7 h-7" />
            </div>
            <BaseText weight="black" size="text-[11px]" class="text-center font-black uppercase tracking-tighter leading-tight">{{ action.label }}</BaseText>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Sales Analysis Detailed Modal -->
    <Dialog v-model:visible="showAnalysisModal" modal :header="t('dashboard.sales_chart')" class="!max-w-[95vw] !w-[1000px] !rounded-[3rem] overflow-hidden" :breakpoints="{ '1024px': '90vw', '768px': '100vw' }">
      <template #header>
        <div class="flex items-center justify-between w-full pr-8">
           <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500">
                 <BarChart3 class="w-7 h-7" />
              </div>
              <div>
                 <BaseText weight="black" size="text-2xl">{{ t('dashboard.sales_chart') }}</BaseText>
                 <BaseText type="muted" size="text-[10px]" class="uppercase font-black opacity-40">تحليل تفصيلي للفترة الحالية</BaseText>
              </div>
           </div>
        </div>
      </template>

      <div class="space-y-10">
        <div class="h-[450px] w-full">
           <Chart type="line" :data="chartData" :options="{ ...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, display: true } } }" class="h-full" />
        </div>
      </div>
    </Dialog>
  </div>
</template>
