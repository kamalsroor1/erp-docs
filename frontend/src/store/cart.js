import { defineStore } from 'pinia'
import { db } from '../database/db'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // Array of { product, serial_number, price }
    taxRate: 0.14, // 14% VAT
  }),
  
  getters: {
    subtotal: (state) => state.items.reduce((acc, item) => acc + item.price, 0),
    tax: (state) => state.subtotal * state.taxRate,
    total: (state) => state.subtotal + state.tax,
    itemCount: (state) => state.items.length,
  },
  
  actions: {
    async addItemBySerial(serialNumber) {
      const item = await db.items.where('serial_number').equals(serialNumber).first()
      
      if (!item) {
        throw new Error('Item not found')
      }
      
      if (item.status !== 'available') {
        throw new Error('Item already sold or unavailable')
      }
      
      // Check if already in cart
      if (this.items.find(i => i.serial_number === serialNumber)) {
        throw new Error('Item already in cart')
      }
      
      const product = await db.products.get(item.product_id)
      
      this.items.push({
        id: item.id,
        product_id: product.id,
        name: product.name,
        serial_number: item.serial_number,
        price: 1500, // Placeholder price logic
      })
    },
    
    removeItem(serialNumber) {
      this.items = this.items.filter(i => i.serial_number !== serialNumber)
    },
    
    clearCart() {
      this.items = []
    }
  },
  
  persist: true
})
