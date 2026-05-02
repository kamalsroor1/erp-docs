import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * @file auth.js
 * @description Pinia store for RBAC and authentication.
 * Admin role is granted superuser access via a logic bypass.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    name: 'كمال سرور',
    role: 'admin',
    // Full list of permissions for the MVP demonstration
    permissions: [
      'view_inventory', 
      'edit_inventory', 
      'delete_inventory', 
      'manage_warehouses',
      'transfer_stock',
      'stock_audit',
      'make_sales', 
      'view_reports', 
      'view_financials',
      'manage_users',
      'system_settings',
      'manage_branches',
      'view_logs'
    ]
  })

  const isAuthenticated = ref(!!localStorage.getItem('auth_token'))

  const hasPermission = (permission) => {
    // Admin Override: Superuser always has all permissions
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
