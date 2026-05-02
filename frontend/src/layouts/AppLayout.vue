<script setup>
/**
 * @file AppLayout.vue
 * @description Master layout for Ebraa ERP.
 * Features: Mobile-First Full Screen (Teleported), Mini Sidebar Desktop, and RBAC-filtered navigation.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUIStore } from '../stores/ui'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  LogOut, 
  Moon, 
  Sun, 
  Languages,
  Menu,
  Bell,
  Search as SearchIcon,
  ChevronDown,
  X,
  ArrowRight,
  ArrowLeft,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-vue-next'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import BaseText from '../components/base/BaseText.vue'
import AIAssistant from '../components/AIAssistant.vue'

const router = useRouter()
const uiStore = useUIStore()
const authStore = useAuthStore()
const { t, locale } = useI18n()
const isSidebarOpen = ref(true)
const showNotifications = ref(false)
const notificationRef = ref(null)
const isMobile = ref(false)

const branches = ref([
  { id: 1, name: 'فرع القاهرة - الرئيسي' },
  { id: 2, name: 'فرع الإسكندرية' },
  { id: 3, name: 'فرع المنصورة' }
])

const notifications = ref(Array.from({ length: 20 }, (_, i) => {
  const types = ['warning', 'success', 'info']
  const type = types[i % 3]
  return {
    id: i + 1,
    title: i % 2 === 0 ? 'تنبيه مخزون منخفض' : 'عملية بيع جديدة',
    body: i % 2 === 0 
      ? `الصنف #${i + 100} وصل للحد الأدنى في المخزن الرئيسي.` 
      : `تم تسجيل فاتورة جديدة بقيمة ${Math.floor(Math.random() * 5000 + 1000)} ج.م`,
    time: `منذ ${i + 1} دقيقة`,
    type: type
  }
}))

const menuItems = computed(() => {
  const items = [
    { name: t('common.dashboard'), path: '/', icon: LayoutDashboard, perm: 'view_reports' },
    { name: t('common.pos'), path: '/pos', icon: ShoppingCart, perm: 'make_sales' },
    { name: t('common.inventory'), path: '/inventory', icon: Package, perm: 'view_inventory' },
    { name: t('common.customers'), path: '/customers', icon: Users, perm: 'view_customers' },
  ]
  return items.filter(item => authStore.hasPermission(item.perm))
})

const toggleLocale = () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  uiStore.setLocale(newLocale)
  locale.value = newLocale
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

const handleClickOutside = (event) => {
  if (notificationRef.value && !notificationRef.value.contains(event.target)) {
    if (!isMobile.value) {
      showNotifications.value = false
    }
  }
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
  document.addEventListener('mousedown', handleClickOutside)
  if (isMobile.value) isSidebarOpen.value = false
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
  document.removeEventListener('mousedown', handleClickOutside)
})

const logoSrc = computed(() => {
  return uiStore.isDark ? '/assets/logo.png' : '/assets/logo-black.png'
})
</script>

<template>
  <div class="min-h-screen flex transition-colors duration-300" :class="uiStore.isDark ? 'bg-midnight text-slate-200' : 'bg-slate-50 text-slate-900'">
    
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[55] transition-opacity duration-300"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="fixed lg:sticky top-0 h-screen z-[60] transition-all duration-500 ease-in-out border-white/5 flex flex-col overflow-visible shadow-2xl lg:shadow-none"
      :class="[
        !isSidebarOpen ? (uiStore.isRTL ? 'translate-x-full w-0 invisible' : '-translate-x-full w-0 invisible') : 'translate-x-0 w-full lg:w-64',
        'lg:translate-x-0 lg:visible',
        isSidebarOpen ? '' : 'lg:w-20',
        uiStore.isRTL ? 'right-0 border-l lg:border-l-0 lg:border-r' : 'left-0 border-r lg:border-r-0 lg:border-l',
        uiStore.isDark ? 'bg-slate-800/95 text-slate-200' : 'bg-white text-slate-800 border-slate-200'
      ]"
    >
      <div class="h-20 flex items-center justify-center px-4 mb-4 relative">
        <img v-if="isSidebarOpen" :src="logoSrc" alt="Ebraa ERP" class="h-10 w-auto transition-all animate-in fade-in" />
        <div v-else class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg cursor-pointer hover:rotate-12 transition-transform" @click="isSidebarOpen = true">E</div>
        
        <button v-if="isSidebarOpen" @click="isSidebarOpen = false" class="lg:hidden absolute top-6" :class="uiStore.isRTL ? 'left-6' : 'right-6'">
          <div class="header-icon !bg-white/10 !border-white/10 text-white">
            <X class="w-6 h-6" />
          </div>
        </button>
      </div>
      
      <nav class="flex-1 px-4 space-y-3">
        <router-link 
          v-for="item in menuItems" 
          :key="item.name"
          :to="item.path"
          @click="isMobile ? isSidebarOpen = false : null"
          class="flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative"
          :class="[
            uiStore.isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50 text-slate-600',
            !isSidebarOpen ? 'lg:justify-center lg:!px-0 lg:w-12 lg:h-12 lg:mx-auto' : ''
          ]"
          active-class="bg-primary-500/10 !text-primary-500 border border-primary-500/20 !font-black shadow-inner shadow-primary-500/5"
        >
          <component :is="item.icon" class="w-6 h-6 shrink-0 transition-transform group-hover:scale-110" />
          <BaseText v-if="isSidebarOpen" weight="black" class="whitespace-nowrap animate-in slide-in-from-left-2 text-xl lg:text-base">{{ item.name }}</BaseText>
          
          <div 
            v-if="!isSidebarOpen" 
            class="hidden lg:block absolute top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-12 transition-all duration-300 pointer-events-none z-[100] shadow-xl whitespace-nowrap border border-white/10"
            :class="uiStore.isRTL ? '-translate-x-2 group-hover:-translate-x-12 right-full mr-4' : 'left-full ml-4'"
          >
            {{ item.name }}
            <div 
              class="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 border-white/10"
              :class="uiStore.isRTL ? '-right-1 border-r border-t' : '-left-1 border-l border-b'"
            ></div>
          </div>
        </router-link>
      </nav>
      
      <div class="p-4 border-t border-white/5">
        <button 
          @click="logout"
          class="flex items-center gap-4 w-full px-4 py-4 rounded-2xl transition-all group relative"
          :class="[
            uiStore.isDark ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400' : 'text-slate-500 hover:bg-red-50 hover:text-red-600',
            !isSidebarOpen ? 'lg:justify-center lg:!px-0 lg:w-12 lg:h-12 lg:mx-auto' : ''
          ]"
        >
          <LogOut class="w-6 h-6 shrink-0" />
          <BaseText v-if="isSidebarOpen" weight="black" size="text-xl lg:text-sm" class="animate-in fade-in">{{ t('common.logout') }}</BaseText>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 min-h-screen relative" :class="uiStore.isDark ? 'bg-midnight/50' : 'bg-slate-50/50'">
      <div v-if="uiStore.pageLoading" class="fixed top-0 left-0 right-0 z-[100]">
        <ProgressBar mode="indeterminate" style="height: 3px" class="!bg-transparent !border-none" />
      </div>

      <header class="h-20 flex items-center justify-between px-4 lg:px-8 border-b glass-dark sticky top-0 z-40" :class="uiStore.isDark ? 'border-white/5' : 'border-slate-200'">
        <div class="flex items-center gap-2 lg:gap-4">
          <button @click="isSidebarOpen = !isSidebarOpen" class="header-icon !bg-transparent !border-none hover:!scale-110 shrink-0">
            <Menu class="w-7 h-7" />
          </button>
        </div>
        
        <div class="flex items-center gap-2 lg:gap-4">
          <div class="relative" ref="notificationRef">
            <button @click="showNotifications = !showNotifications" class="header-icon !relative">
              <Bell class="w-6 h-6" />
              <div class="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></div>
            </button>
            
            <!-- Desktop Notification Dropdown -->
            <Transition v-if="!isMobile" name="dropdown-slide">
              <div 
                v-if="showNotifications" 
                class="absolute top-full mt-4 w-96 max-h-[500px] overflow-y-auto no-scrollbar rounded-[2rem] border shadow-2xl p-5 z-[60]" 
                :class="[
                  uiStore.isRTL ? 'left-0' : 'right-0',
                  uiStore.isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200'
                ]"
              >
                   <div class="flex items-center justify-between mb-6 px-1">
                     <BaseText weight="black" size="text-base">التنبيهات ({{ notifications.length }})</BaseText>
                     <BaseText type="muted" size="text-[10px]" class="cursor-pointer hover:text-primary-400 font-black uppercase">تحديد كقروء</BaseText>
                   </div>
                   <div class="space-y-4">
                     <div v-for="n in notifications" :key="n.id" class="p-5 rounded-[1.5rem] transition-all cursor-pointer group hover:scale-[1.02]" :class="uiStore.isDark ? 'bg-white/5 border border-white/5 hover:bg-white/10' : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'">
                       <div class="flex items-center gap-3">
                          <div class="w-3 h-3 rounded-full shadow-[0_0_8px]" :class="n.type === 'warning' ? 'bg-amber-500 shadow-amber-500/50' : (n.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-primary-500 shadow-primary-500/50')"></div>
                          <BaseText weight="black" size="text-sm">{{ n.title }}</BaseText>
                       </div>
                       <BaseText type="muted" size="xs" class="mt-3 block leading-relaxed">{{ n.body }}</BaseText>
                       <BaseText type="muted" size="text-[10px]" class="mt-4 opacity-40 font-bold uppercase tracking-wider">{{ n.time }}</BaseText>
                     </div>
                   </div>
              </div>
            </Transition>
          </div>

          <div class="flex items-center gap-2">
            <button @click="uiStore.toggleTheme" class="header-icon">
              <Sun v-if="uiStore.isDark" class="w-6 h-6" />
              <Moon v-else class="w-6 h-6" />
            </button>
            <button @click="toggleLocale" class="header-icon gap-2 !w-auto !px-4">
              <Languages class="w-5 h-5" />
              <BaseText weight="black" size="text-xs" class="uppercase">{{ locale === 'ar' ? 'EN' : 'عربي' }}</BaseText>
            </button>
          </div>

          <div class="h-10 w-[1px] bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block"></div>

          <div class="flex items-center gap-2 lg:gap-4 group cursor-pointer">
             <div class="text-right hidden lg:block">
              <BaseText weight="black" size="text-sm" class="group-hover:text-primary-500 transition-colors">{{ authStore.user.name }}</BaseText>
              <BaseText type="muted" size="text-[10px]" class="font-black uppercase tracking-widest opacity-60">{{ t('common.admin') }}</BaseText>
            </div>
            <div class="w-10 lg:w-12 h-10 lg:h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center overflow-hidden transition-all group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white">
              <Users class="w-6 lg:w-7 h-6 lg:h-7" :class="uiStore.isDark ? 'text-primary-400 group-hover:text-white' : 'text-primary-600 group-hover:text-white'" />
            </div>
          </div>
        </div>
      </header>
      
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>

      <AIAssistant />

      <!-- Mobile Full-Screen Notifications -->
      <Teleport to="body">
        <Transition name="mobile-modal">
          <div 
            v-if="showNotifications && isMobile" 
            class="fixed inset-0 z-[2000] flex flex-col transition-colors duration-300"
            :class="uiStore.isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'"
          >
            <div class="h-20 flex items-center justify-between px-6 bg-primary-600 text-white shadow-xl shrink-0">
               <button @click="showNotifications = false">
                 <component :is="uiStore.isRTL ? ArrowRight : ArrowLeft" class="w-7 h-7" />
               </button>
               <BaseText weight="black" size="text-xl" class="!text-white tracking-widest uppercase">التنبيهات (20)</BaseText>
               <button @click="showNotifications = false"><X class="w-7 h-7" /></button>
            </div>

            <div class="flex-1 p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-transparent to-primary-500/5 no-scrollbar">
              <div v-for="n in notifications" :key="n.id" class="p-6 rounded-[2rem] border transition-all active:scale-95 shadow-sm" :class="uiStore.isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'">
                 <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center" :class="n.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : (n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary-500/10 text-primary-500')">
                        <component :is="n.type === 'warning' ? AlertTriangle : (n.type === 'success' ? CheckCircle : Info)" class="w-6 h-6" />
                    </div>
                    <div>
                      <BaseText weight="black" size="text-base">{{ n.title }}</BaseText>
                      <BaseText type="muted" size="text-[10px]" class="uppercase font-black opacity-40">{{ n.time }}</BaseText>
                    </div>
                 </div>
                 <BaseText type="muted" size="text-sm" class="leading-relaxed opacity-80">{{ n.body }}</BaseText>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </main>
  </div>
</template>

<style scoped>
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.mobile-modal-enter-active,
.mobile-modal-leave-active {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mobile-modal-enter-from,
.mobile-modal-leave-to {
  transform: translateX(100%);
}
</style>
