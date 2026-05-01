<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUIStore } from '../stores/ui'
import { useI18n } from 'vue-i18n'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  LogOut, 
  Moon, 
  Sun, 
  Languages,
  Menu
} from 'lucide-vue-next'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'

const router = useRouter()
const uiStore = useUIStore()
const { t, locale } = useI18n()
const isSidebarOpen = ref(true)
const branches = ref([
  { id: 1, name: 'فرع القاهرة - الرئيسي' },
  { id: 2, name: 'فرع الإسكندرية' },
  { id: 3, name: 'فرع المنصورة' }
])

const menuItems = computed(() => [
  { name: t('dashboard'), path: '/', icon: LayoutDashboard },
  { name: t('pos'), path: '/pos', icon: ShoppingCart },
  { name: t('inventory'), path: '/inventory', icon: Package },
  { name: t('customers'), path: '/customers', icon: Users },
])

const toggleLocale = () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  uiStore.setLocale(newLocale)
  locale.value = newLocale
}

const logout = () => {
  localStorage.removeItem('auth_token')
  router.push('/login')
}

const logoSrc = computed(() => {
  return uiStore.isDark ? '/assets/logo.png' : '/assets/logo-black.png'
})
</script>

<template>
  <div class="min-h-screen flex transition-colors duration-300" :class="uiStore.isDark ? 'bg-midnight text-slate-200' : 'bg-slate-50 text-slate-900'">
    <!-- Sidebar -->
    <aside 
      class="fixed lg:static inset-y-0 z-50 w-64 transition-all duration-300 transform shadow-2xl border-white/5"
      :class="[
        isSidebarOpen ? 'translate-x-0' : (uiStore.isRTL ? 'translate-x-full' : '-translate-x-full'),
        uiStore.isRTL ? 'right-0 border-l' : 'left-0 border-r',
        uiStore.isDark ? 'bg-slate-800/95 text-slate-200' : 'bg-white text-slate-800 border-slate-200'
      ]"
    >
      <div class="p-6 flex items-center justify-center">
        <img :src="logoSrc" alt="Ebraa ERP" class="h-12 w-auto object-contain transition-all hover:scale-105" />
      </div>
      
      <nav class="mt-6 px-4 space-y-2">
        <router-link 
          v-for="item in menuItems" 
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
          :class="uiStore.isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50 text-slate-600'"
          active-class="bg-primary-500/10 text-primary-500 border border-primary-500/20 !text-primary-600 dark:!text-primary-400"
        >
          <component :is="item.icon" class="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span class="font-bold">{{ item.name }}</span>
        </router-link>
      </nav>
      
      <div class="absolute bottom-8 left-0 right-0 px-4">
        <button 
          @click="logout"
          :disabled="uiStore.pageLoading"
          class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all"
          :class="uiStore.isDark ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400' : 'text-slate-500 hover:bg-red-50 hover:text-red-600'"
        >
          <LogOut class="w-5 h-5" />
          <span class="font-medium">{{ t('logout') }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden" :class="uiStore.isDark ? 'bg-midnight/50' : 'bg-slate-50/50'">
      <!-- Global Page Loader -->
      <div v-if="uiStore.pageLoading" class="fixed top-0 left-0 right-0 z-[100]">
        <ProgressBar mode="indeterminate" style="height: 3px" class="!bg-transparent !border-none" />
      </div>

      <!-- Top Bar -->
      <header class="h-16 flex items-center justify-between px-8 border-b glass-dark sticky top-0 z-40" :class="uiStore.isDark ? 'border-white/5' : 'border-slate-200'">
        <div class="flex items-center gap-4">
          <Button @click="isSidebarOpen = !isSidebarOpen" text class="!text-slate-400 dark:!text-slate-500">
            <Menu class="w-6 h-6" />
          </Button>
          <h2 class="text-sm font-medium text-slate-400 hidden md:block">
            {{ t('platform_version') }}
          </h2>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Branch Switcher -->
          <div class="hidden md:flex items-center gap-2 mr-4">
             <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ t('branch') }}:</span>
             <select 
               v-model="uiStore.selectedBranchId" 
               @change="uiStore.setBranch($event.target.value)"
               class="bg-transparent border-none text-sm font-bold text-primary-500 focus:ring-0 cursor-pointer outline-none"
             >
               <option v-for="b in branches" :key="b.id" :value="b.id" class="bg-midnight text-white">{{ b.name }}</option>
             </select>
          </div>

          <!-- Theme Toggle -->
          <Button @click="uiStore.toggleTheme" text rounded class="!text-slate-400 dark:!text-slate-500 hover:!bg-white/5">
            <Sun v-if="uiStore.isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </Button>

          <!-- Language Toggle -->
          <Button @click="toggleLocale" text rounded class="!text-slate-400 dark:!text-slate-500 hover:!bg-white/5 flex items-center gap-2">
            <Languages class="w-5 h-5" />
            <span class="text-xs font-bold uppercase">{{ locale === 'ar' ? 'EN' : 'عربي' }}</span>
          </Button>

          <div class="h-8 w-[1px] bg-slate-200 dark:bg-white/5 mx-2"></div>

          <div class="flex items-center gap-4">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-bold" :class="uiStore.isDark ? 'text-white' : 'text-slate-900'">{{ t('welcome') }}</p>
              <p class="text-xs text-slate-500">{{ t('admin') }}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center overflow-hidden">
              <Users class="w-6 h-6 text-primary-500" />
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>
    </main>
  </div>
</template>
