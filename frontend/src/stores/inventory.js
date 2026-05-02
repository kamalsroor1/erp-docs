import { defineStore } from 'pinia'
import { db } from '../database/db'
import { ref, computed } from 'vue'
import { useUIStore } from './ui'
import Big from 'big.js'

/**
 * @file inventory.js
 * @description Pinia store for inventory management.
 * Follows ERP standards: Big.js for precision math, Dexie.js for persistence.
 */
export const useInventoryStore = defineStore('inventory', () => {
  const uiStore = useUIStore()
  const products = ref([])
  const warehouses = ref([])
  const selectedWarehouseId = ref(null)
  const loading = ref(false)

  // Getters
  const totalStockItems = computed(() => {
    return products.value.reduce((acc, p) => acc + (p.stock || 0), 0)
  })

  const totalEstimatedValue = computed(() => {
    // Rule: Use Big.js for financial calculations
    return products.value.reduce((acc, p) => {
      const stock = new Big(p.stock || 0)
      const price = new Big(p.buy_price || 0)
      return new Big(acc).plus(stock.times(price)).toNumber()
    }, 0)
  })

  // Fetch warehouses filtered by active branch
  async function loadWarehouses() {
    const branchId = parseInt(uiStore.selectedBranchId)
    const allWarehouses = await db.warehouses.where('branch_id').equals(branchId).toArray()
    warehouses.value = allWarehouses
    
    if (allWarehouses.length > 0) {
      // Keep selection if it exists in current branch, otherwise reset to first
      if (!allWarehouses.find(w => w.id === selectedWarehouseId.value)) {
        selectedWarehouseId.value = allWarehouses[0].id
      }
    } else {
      selectedWarehouseId.value = null
    }
  }

  // Fetch products with stock levels for the selected warehouse
  async function fetchInventory() {
    if (!selectedWarehouseId.value) {
      products.value = []
      return
    }
    
    loading.value = true
    try {
      const allProducts = await db.products.toArray()
      
      const enrichedProducts = await Promise.all(allProducts.map(async (product) => {
        let stockCount = 0
        
        if (product.type === 'serial') {
          stockCount = await db.items
            .where({ product_id: product.id, warehouse_id: selectedWarehouseId.value, status: 'available' })
            .count()
        } else if (product.type === 'bulk') {
          const stockEntry = await db.inventory_stocks
            .where({ product_id: product.id, warehouse_id: selectedWarehouseId.value })
            .first()
          stockCount = stockEntry?.quantity || 0
        }

        return {
          ...product,
          stock: stockCount
        }
      }))

      products.value = enrichedProducts.filter(p => p.status === 'active') // Filter inactive for main view
    } finally {
      loading.value = false
    }
  }

  // Transfer stock logic
  async function transferStock(fromId, toId, items) {
    return await db.transaction('rw', db.items, db.inventory_stocks, db.stock_transfers, db.stock_transfer_items, async () => {
      const transferId = await db.stock_transfers.add({
        from_warehouse_id: fromId,
        to_warehouse_id: toId,
        status: 'shipped',
        created_at: new Date()
      })

      for (const item of items) {
        if (item.serial_number) {
          await db.items.where({ serial_number: item.serial_number }).modify({ 
            status: 'in_transit',
            warehouse_id: toId 
          })
        } else {
          const sourceStock = await db.inventory_stocks.where({ product_id: item.product_id, warehouse_id: fromId }).first()
          if (sourceStock && sourceStock.quantity >= item.quantity) {
            await db.inventory_stocks.update(sourceStock.id, { quantity: sourceStock.quantity - item.quantity })
          }
        }

        await db.stock_transfer_items.add({
          transfer_id: transferId,
          product_id: item.product_id,
          serial_number: item.serial_number || null,
          quantity: item.quantity
        })
      }
    })
  }

  return {
    products,
    warehouses,
    selectedWarehouseId,
    loading,
    totalStockItems,
    totalEstimatedValue,
    loadWarehouses,
    fetchInventory,
    transferStock
  }
})
