import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    name: 'كمال سرور',
    role: 'admin',
    permissions: ['view_inventory', 'edit_inventory', 'delete_inventory', 'make_sales', 'view_reports', 'manage_warehouses']
  })

  const isAuthenticated = ref(!!localStorage.getItem('auth_token'))

  const hasPermission = (permission) => {
    if (user.value.role === 'admin') return true
    return user.value.permissions.includes(permission)
  }

  const login = (token) => {
    localStorage.setItem('auth_token', token)
    isAuthenticated.value = true
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    hasPermission,
    login,
    logout
  }
})
