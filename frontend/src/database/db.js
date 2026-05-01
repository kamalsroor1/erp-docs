import Dexie from 'dexie';

export const db = new Dexie('EbraaDB');

// Define database schema
db.version(2).stores({
  products: '++id, name, category, sku, type, brand',
  items: '++id, product_id, serial_number, status, purchase_price, warehouse_id',
  invoices: '++id, date, total, customer_id, branch_id',
  invoice_lines: '++id, invoice_id, item_id, price, cost',
  customers: '++id, name, phone',
  warehouses: '++id, name, branch_id, is_default',
  branches: '++id, name, location',
  inventory_stocks: '++id, [product_id+warehouse_id], quantity',
  stock_transfers: '++id, from_warehouse_id, to_warehouse_id, status, created_at',
  stock_transfer_items: '++id, transfer_id, product_id, serial_number, quantity',
  brands: '++id, name',
  categories: '++id, name'
});

// Initialize some helper functions if needed
export const initDB = async () => {
  try {
    await db.open();
    console.log('Database opened successfully');
    
    // Seed default branch and warehouse if empty
    const branchCount = await db.branches.count();
    if (branchCount === 0) {
      const branchId = await db.branches.add({ name: 'الفرع الرئيسي', location: 'القاهرة' });
      await db.warehouses.add({ name: 'المخزن الرئيسي', branch_id: branchId, is_default: 1 });
    }
    
  } catch (err) {
    console.error('Failed to open db:', err.stack || err);
  }
};
