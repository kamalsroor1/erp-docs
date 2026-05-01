import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    pos: 'Point of Sale',
    customers: 'Customers',
    logout: 'Logout',
    welcome: 'Welcome back',
    admin: 'Administrator',
    cashier: 'Cashier',
    login: 'Sign In',
    email: 'Email Address',
    password: 'Password',
    demo_notice: 'Demo Access - Use the pre-filled credentials.',
    add_product: 'Add Product',
    stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    category: 'Category',
    sku: 'SKU',
    generate_data: 'Generate Sample Data',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    inventory: 'المخزون',
    pos: 'نظام البيع',
    customers: 'العملاء',
    logout: 'تسجيل الخروج',
    welcome: 'مرحباً بك مجدداً',
    admin: 'المدير العام',
    cashier: 'كاشير',
    login: 'تسجيل الدخول',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    demo_notice: 'نسخة تجريبية - استخدم بيانات الدخول الجاهزة.',
    add_product: 'إضافة منتج',
    stock: 'متوفر',
    out_of_stock: 'نفذ المخزون',
    category: 'التصنيف',
    sku: 'كود المنتج',
    generate_data: 'توليد بيانات عينة',
  }
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'ar',
  fallbackLocale: 'en',
  messages,
})

export default i18n
