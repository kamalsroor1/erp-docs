import Dexie from 'dexie';

export const db = new Dexie('EbraaDB');

// Define database schema
db.version(1).stores({
  products: '++id, name, category, sku',
  items: '++id, product_id, serial_number, status, purchase_price',
  invoices: '++id, date, total, customer_id',
  invoice_lines: '++id, invoice_id, item_id',
  customers: '++id, name, phone'
});

// Initialize some helper functions if needed
export const initDB = async () => {
  try {
    await db.open();
    console.log('Database opened successfully');
  } catch (err) {
    console.error('Failed to open db:', err.stack || err);
  }
};
