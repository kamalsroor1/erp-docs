# ✅ Frontend MVP Task List

## 🚀 Phase 1: Foundation (Current)
- [x] Initialize Vite project (`npm create vite@latest . -- --template vue`)
- [x] Install dependencies (`tailwind`, `primevue`, `pinia`, `vue-router`, `dexie`, `lucide-vue-next`)
- [x] Configure Tailwind CSS and Theme
- [x] Setup Base Layouts (`AppLayout.vue`, `AuthLayout.vue`, `POSLayout.vue`)
- [x] Implement Fake Auth Logic (LocalStorage Token + Router Guards)
- [x] Create Login Page UI
- [ ] Implement Global **Branch Switcher** in AppLayout
- [ ] Upgrade PrimeVue Dropdowns to **Advanced Select with Filter/Search**

## 📦 Phase 3: Advanced Inventory Module
- [x] Expand Dexie.js Schema (Warehouses, Transfers, Stocks)
- [x] Create `inventoryStore.js` with multi-warehouse logic
- [x] Implement Warehouse Switcher in `Inventory.vue`
- [x] Build Stock Transfer interface (Transfer Workflow)
- [ ] Implement Excel/CSV Bulk Import component
- [x] Build Mobile Stock Audit view (Camera scanning)
- [ ] Add Stock Movement History (Ledger) for products
- [ ] Optimize Inventory Table for **Mobile/Touch Devices** (Responsive cards)
- [ ] Review Inventory module vs `docs/07` specifications
- [x] Refactor Components to "Dumb Components" (e.g., AddProductModal)

## 🛒 Phase 3: POS System
- [x] Setup Pinia Cart Store
- [x] Build POS Scanner Input logic
- [x] Implement Checkout & Invoice saving
- [ ] Design Thermal Receipt print preview

## 📊 Phase 4: Analytics
- [ ] Refactor DataGenerator for **High-Volume Realistic Data**
- [ ] Connect Dashboard widgets to **Live Dexie.js Queries** (Calculated Totals)
- [x] Build Dashboard summary widgets
- [ ] Implement Sales Charts (Local Data)
- [ ] Final UI Polish & Demo verification

## 🛡️ Enterprise Standardization (In Progress)
- [x] Implement RBAC (v-can directive) across all modules
- [x] Global i18n Audit & Standardization (100% Bilingual)
- [x] Standardize Financial Precision with Big.js
- [x] Global Keyboard Shortcuts Integration (F9, F2, Esc)
