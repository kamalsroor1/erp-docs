<script setup>
import { ref } from 'vue'
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  FileText,
  Settings
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

const { t } = useI18n()

const stats = ref([
  { name: 'إجمالي المبيعات', value: '482,000 ج.م', trend: '+12%', up: true, icon: ShoppingCart, color: 'text-primary-400' },
  { name: 'الأرباح المحققة', value: '54,200 ج.م', trend: '+8%', up: true, icon: DollarSign, color: 'text-emerald-500' },
  { name: 'إجمالي الديون', value: '12,500 ج.م', trend: '-2%', up: false, icon: Users, color: 'text-orange-500' },
])

const quickActions = [
  { name: 'عملية بيع جديدة', icon: ShoppingCart, path: '/pos', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { name: 'إضافة بضاعة', icon: Package, path: '/inventory', color: 'bg-primary-500/10 text-primary-400 border-primary-500/20' },
  { name: 'التقارير المالية', icon: FileText, path: '/', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { name: 'إعدادات النظام', icon: Settings, path: '/', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
]
</script>

<template>
  <div class="p-8 space-y-10">
    <!-- Header -->
    <div class="flex items-end justify-between">
      <div>
        <h1 class="text-4xl font-black leading-tight text-slate-900 dark:text-white">
          {{ t('welcome') }}, <span class="text-gradient">المدير العام</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">نظرة عامة على أداء المنشأة اليوم</p>
      </div>
      <div class="flex gap-2">
         <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
           Last Update: Just Now
         </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        v-for="stat in stats" 
        :key="stat.name"
        class="glass p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden group hover:border-primary-500/30 transition-all duration-500"
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors"></div>
        
        <div class="flex items-start justify-between">
          <div class="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform duration-500">
            <component :is="stat.icon" class="w-6 h-6" :class="stat.color" />
          </div>
          <div 
            class="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg"
            :class="stat.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'"
          >
            <component :is="stat.up ? ArrowUpRight : ArrowDownRight" class="w-3 h-3" />
            {{ stat.trend }}
          </div>
        </div>
        
        <div class="mt-6">
          <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">{{ stat.name }}</p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white mt-1">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Quick Access Tiles (As per docs) -->
    <div class="space-y-6">
      <h2 class="text-xl font-bold text-slate-700 dark:text-slate-300 flex items-center gap-3">
        <div class="w-2 h-6 bg-primary-500 rounded-full"></div>
        الوصول السريع
      </h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <router-link 
          v-for="action in quickActions" 
          :key="action.name"
          :to="action.path"
          class="glass p-6 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-primary-500/20 transition-all group flex flex-col items-center justify-center gap-4 text-center aspect-square md:aspect-auto md:h-48"
        >
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:rotate-6 group-hover:scale-110" :class="action.color">
            <component :is="action.icon" class="w-8 h-8" />
          </div>
          <span class="font-bold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">{{ action.name }}</span>
        </router-link>
      </div>
    </div>

    <!-- Charts Placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="glass p-8 rounded-[2.5rem] border border-white/5 h-80 flex flex-col items-center justify-center text-slate-600 italic">
        <TrendingUp class="w-12 h-12 mb-4 opacity-10" />
        <p>رسم بياني لتحليل المبيعات (قريباً)</p>
      </div>
      <div class="glass p-8 rounded-[2.5rem] border border-white/5 h-80 flex flex-col items-center justify-center text-slate-600 italic">
        <Users class="w-12 h-12 mb-4 opacity-10" />
        <p>أكثر المنتجات طلباً (قريباً)</p>
      </div>
    </div>
  </div>
</template>
