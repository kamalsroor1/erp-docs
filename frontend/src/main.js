import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import i18n from './i18n'
import { useUIStore } from './stores/ui'
import { useAuthStore } from './stores/auth'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(pinia)

// Initialize UI (Theme & Locale)
const uiStore = useUIStore()
uiStore.initUI()

const authStore = useAuthStore()

// RBAC Directive: v-can="'permission_name'"
app.directive('can', {
    mounted(el, binding) {
        if (!authStore.hasPermission(binding.value)) {
            el.parentNode?.removeChild(el)
        }
    }
})

app.use(router)
app.use(i18n)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark',
            cssLayer: {
                name: 'primevue',
                order: 'tailwind-base, primevue, tailwind-utilities'
            }
        }
    }
})
app.use(ToastService)

app.mount('#app')
