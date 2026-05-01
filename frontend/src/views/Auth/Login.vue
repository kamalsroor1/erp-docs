<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '../../stores/ui'
import { LogIn, ShieldCheck, Sun, Moon, Languages } from 'lucide-vue-next'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const { t, locale } = useI18n()
const uiStore = useUIStore()
const toast = useToast()

const email = ref('demo@ebraa.com')
const password = ref('password')
const loading = ref(false)

const handleLogin = () => {
  loading.value = true
  setTimeout(() => {
    localStorage.setItem('auth_token', 'fake_token_for_demo')
    toast.add({ severity: 'success', summary: t('login'), detail: t('welcome'), life: 3000 })
    router.push('/')
    loading.value = false
  }, 1000)
}

const toggleLocale = () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  uiStore.setLocale(newLocale)
  locale.value = newLocale
}
</script>

<template>
  <div class="glass p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
    <!-- Theme/Lang Toggles for Login -->
    <div class="absolute top-4 right-4 flex gap-2">
      <Button @click="uiStore.toggleTheme" text rounded class="!text-slate-500">
        <Sun v-if="uiStore.isDark" class="w-4 h-4" />
        <Moon v-else class="w-4 h-4" />
      </Button>
      <Button @click="toggleLocale" text rounded class="!text-slate-500">
        <Languages class="w-4 h-4" />
      </Button>
    </div>

    <div class="text-center mb-10">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-500/10 border border-primary-500/20 mb-6 shadow-inner">
        <ShieldCheck class="w-10 h-10 text-primary-400" />
      </div>
      <h1 class="text-4xl font-bold text-white mb-2 tracking-tight">Ebraa ERP</h1>
      <p class="text-slate-400 font-medium">{{ t('demo_notice') }}</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div class="space-y-2">
        <label class="text-sm font-semibold text-slate-400 px-1">{{ t('email') }}</label>
        <InputText 
          v-model="email" 
          type="email" 
          class="w-full !bg-white/5 !border-white/10 !text-white !p-4 !rounded-2xl focus:!border-primary-500/50 transition-all" 
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-slate-400 px-1">{{ t('password') }}</label>
        <InputText 
          v-model="password" 
          type="password" 
          class="w-full !bg-white/5 !border-white/10 !text-white !p-4 !rounded-2xl focus:!border-primary-500/50 transition-all" 
        />
      </div>

      <Button 
        type="submit" 
        :loading="loading"
        class="w-full !bg-primary-500 hover:!bg-primary-600 !border-none !p-5 !rounded-2xl !font-black !text-white !text-lg shadow-xl shadow-primary-500/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
      >
        <LogIn v-if="!loading" class="w-6 h-6" />
        <span>{{ t('login') }}</span>
      </Button>
    </form>

    <div class="mt-10 pt-8 border-t border-white/5 text-center">
      <img src="/assets/logo.png" v-if="uiStore.isDark" alt="Ebraa" class="h-8 mx-auto opacity-50 grayscale hover:grayscale-0 transition-all" />
      <img src="/assets/logo-black.png" v-else alt="Ebraa" class="h-8 mx-auto opacity-30 grayscale hover:grayscale-0 transition-all" />
    </div>
  </div>
</template>
