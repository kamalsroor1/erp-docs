import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../database/db'
import Big from 'big.js'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)

  const subtotal = computed(() => {
    return items.value.reduce((acc, item) => {
      return new Big(acc).plus(new Big(item.price)).toNumber()
    }, 0)
  })

  const tax = computed(() => {
    return new Big(subtotal.value).times(0.14).toNumber()
  })

  const total = computed(() => {
    return new Big(subtotal.value).plus(new Big(tax.value)).toNumber()
  })

  const addItemBySerial = async (serial) => {
    loading.value = true
    try {
      // Find item in local DB
      const item = await db.items.where('serial_number').equals(serial).first()
      if (!item) throw new Error('القطعة غير موجودة أو تم بيعها')
      
      const product = await db.products.get(item.product_id)
      
      items.value.push({
        ...item,
        name: product.name,
        price: product.price || 1000 // Fallback for demo
      })
    } finally {
      loading.value = false
    }
  }

  const removeItem = (serial) => {
    items.value = items.value.filter(i => i.serial_number !== serial)
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    loading,
    subtotal,
    tax,
    total,
    addItemBySerial,
    removeItem,
    clearCart
  }
})
