import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'dark',
    locale: localStorage.getItem('locale') || 'ar',
  }),
  
  getters: {
    isDark: (state) => state.theme === 'dark',
    isRTL: (state) => state.locale === 'ar',
  },
  
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      this.applyTheme()
    },
    
    setLocale(lang) {
      this.locale = lang
      this.applyLocale()
    },
    
    applyTheme() {
      localStorage.setItem('theme', this.theme)
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    
    applyLocale() {
      localStorage.setItem('locale', this.locale)
      document.documentElement.setAttribute('lang', this.locale)
      document.documentElement.setAttribute('dir', this.locale === 'ar' ? 'rtl' : 'ltr')
    },
    
    initUI() {
      this.applyTheme()
      this.applyLocale()
    }
  }
})
