import { defineStore } from 'pinia'
import { db } from '../database/db'
import { ref, computed } from 'vue'

export const useInventoryStore = defineStore('inventory', () => {
  const products = ref([])
  const warehouses = ref([])
  const selectedWarehouseId = ref(null)
  const loading = ref(false)

  // Fetch all warehouses and set default
  async function loadWarehouses() {
    warehouses.value = await db.warehouses.toArray()
    if (warehouses.value.length > 0 && !selectedWarehouseId.value) {
      selectedWarehouseId.value = warehouses.value.find(w => w.is_default)?.id || warehouses.value[0].id
    }
  }

  // Fetch products with stock levels for the selected warehouse
  async function fetchInventory() {
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

      products.value = enrichedProducts
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
          // Serialized item
          await db.items.where({ serial_number: item.serial_number }).modify({ 
            status: 'in_transit',
            warehouse_id: toId // Or keep original until received? Specs say "In-Transit"
          })
        } else {
          // Bulk item
          const sourceStock = await db.inventory_stocks.where({ product_id: item.product_id, warehouse_id: fromId }).first()
          if (sourceStock && sourceStock.quantity >= item.quantity) {
            await db.inventory_stocks.update(sourceStock.id, { quantity: sourceStock.quantity - item.quantity })
            // Logic for destination (usually stays pending until received)
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
    loadWarehouses,
    fetchInventory,
    transferStock
  }
})
