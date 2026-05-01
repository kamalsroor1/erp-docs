import { db } from '../database/db';

const sampleProducts = [
  { name: 'iPhone 15 Pro', category: 'Smartphones', sku: 'IP15P-256-BLK' },
  { name: 'MacBook Air M2', category: 'Laptops', sku: 'MBA-M2-8-256' },
  { name: 'AirPods Pro 2', category: 'Accessories', sku: 'APP2-WHT' },
  { name: 'Samsung S24 Ultra', category: 'Smartphones', sku: 'S24U-512-TIT' },
  { name: 'Dell XPS 13', category: 'Laptops', sku: 'DELL-XPS13-16' },
];

export const generateDummyData = async () => {
  const productCount = await db.products.count();
  if (productCount > 0) return; // Don't duplicate

  console.log('Generating dummy data...');

  for (const p of sampleProducts) {
    const productId = await db.products.add(p);
    
    // Generate 5 items for each product
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        product_id: productId,
        serial_number: `SN-${p.sku}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'available',
        purchase_price: Math.floor(500 + Math.random() * 1500)
      });
    }
    await db.items.bulkAdd(items);
  }

  console.log('Dummy data generation complete.');
};
