import { db } from '../database/db'

export const generateRealisticData = async () => {
  // 1. Clear existing data to avoid duplicates in demo
  await db.branches.clear()
  await db.warehouses.clear()
  await db.products.clear()
  await db.items.clear()

  // 2. Add Branches
  const branches = [
    { id: 1, name: 'فرع القاهرة - الرئيسي', location: 'القاهرة', code: 'CAI-01' },
    { id: 2, name: 'فرع الإسكندرية', location: 'الإسكندرية', code: 'ALX-02' },
    { id: 3, name: 'فرع المنصورة', location: 'المنصورة', code: 'MAN-03' }
  ]
  await db.branches.bulkAdd(branches)

  // 3. Add Warehouses tied to Branches
  const warehouses = [
    { id: 1, branch_id: 1, name: 'مخزن القاهرة الرئيسي' },
    { id: 2, branch_id: 1, name: 'مخزن قطع الغيار - القاهرة' },
    { id: 3, branch_id: 2, name: 'مخزن الإسكندرية' },
    { id: 4, branch_id: 3, name: 'مخزن المنصورة' }
  ]
  await db.warehouses.bulkAdd(warehouses)

  // 4. Generate 50+ Products
  const categories = ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Printers']
  const brands = ['Apple', 'Samsung', 'HP', 'Dell', 'Lenovo', 'Canon']
  const products = []

  for (let i = 1; i <= 60; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const buyPrice = Math.floor(Math.random() * 30000) + 500
    const sellPrice = buyPrice + (buyPrice * 0.2) // 20% margin
    
    products.push({
      id: i,
      name: `${brand} ${category === 'Smartphones' ? 'Galaxy S' : 'Pro Book'} ${i + 10}`,
      brand: brand,
      category: category,
      buy_price: buyPrice,
      sell_price: sellPrice,
      type: i % 5 === 0 ? 'bulk' : 'serial', // Most are serialized
      status: i % 15 === 0 ? 'inactive' : 'active',
      reorder_point: 5,
      barcode: `622${1000000 + i}`,
      barcode_2: `000${2000000 + i}`
    })
  }
  await db.products.bulkAdd(products)

  // 5. Generate Items (Inventory Records)
  const items = []
  let itemCounter = 1

  for (const product of products) {
    if (product.status === 'inactive') continue

    // Add items to random warehouses
    const warehouseId = warehouses[Math.floor(Math.random() * warehouses.length)].id
    const stockCount = Math.floor(Math.random() * 20) // Random stock 0-20
    
    for (let j = 0; j < stockCount; j++) {
      items.push({
        id: itemCounter++,
        product_id: product.id,
        warehouse_id: warehouseId,
        serial_number: product.type === 'serial' ? `SN-${product.id}-${1000 + j}` : null,
        status: 'available',
        added_date: new Date(Date.now() - Math.random() * 1000000000).toISOString()
      })
    }
  }
  await db.items.bulkAdd(items)

  // 6. Generate 25+ Invoices for Analytics
  const invoices = []
  for (let i = 1; i <= 30; i++) {
    const branchId = (i % 3) + 1
    const total = Math.floor(Math.random() * 50000) + 1000
    invoices.push({
      id: i,
      branch_id: branchId,
      total: total,
      tax: total * 0.14,
      discount: 0,
      created_at: new Date(Date.now() - (30 - i) * 86400000).toISOString(),
      status: 'paid'
    })
  }
  await db.invoices.bulkAdd(invoices)

  console.log('✅ Realistic Demo Data Generated Successfully')
}
