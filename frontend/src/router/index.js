import { createRouter, createWebHashHistory } from 'vue-router'
import { useUIStore } from '../stores/ui'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Auth/Login.vue'),
    meta: { layout: 'AuthLayout' }
  },
  {
    path: '/pos',
    name: 'POS',
    component: () => import('../views/Sales/POS.vue'),
    meta: { requiresAuth: true, layout: 'POSLayout' }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/Inventory/Inventory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory/transfer',
    name: 'StockTransfer',
    component: () => import('../views/Inventory/StockTransfer.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory/audit',
    name: 'StockAudit',
    component: () => import('../views/Inventory/StockAudit.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const uiStore = useUIStore()
  uiStore.setPageLoading(true)
  
  const isAuthenticated = !!localStorage.getItem('auth_token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

router.afterEach(() => {
  const uiStore = useUIStore()
  // Add a small delay to make the loading visible for demo purposes
  setTimeout(() => {
    uiStore.setPageLoading(false)
  }, 300)
})

export default router
