# 🎨 Frontend MVP Protocol (FRONTEND_AI_INSTRUCTIONS.md)

This document defines the specialized rules for building the **Ebraa ERP Frontend MVP**. The primary goal is to create a fully interactive, data-persistent prototype for client demonstrations and pre-order generation.

---

## 🛑 1. Mandatory Operation Protocol (The Workflow)

### 🧠 1.1 Context & Task Tracking
Before starting any task, the AI **MUST**:
1.  **Read Planning**: Check `FE_PLAN.md` and `FE_TASKS.md` to identify the current objective.
2.  **Audit History**: Read `history/YYYY-MM-DD.md` to understand the latest state and avoid overwriting.
3.  **Check Protocol**: Review these instructions to ensure architectural compliance for the specific task.
4.  **Check Components**: Search `src/components/base/` to reuse existing components.

**Rule**: After completion, the AI **MUST** update `FE_TASKS.md` (marking `[x]`) and **APPEND** a new entry to the `history/` log.

### 🧩 1.2 The "One Task at a Time" Rule (STRICT)
- Work on **ONLY ONE** specific task or component per request.
- Do not attempt to build multiple pages or logic systems simultaneously.
- Finish, test, and document the current task before moving to the next.

### 📝 1.3 Mandatory History Logging (The Ledger)
- **CRITICAL**: Never use `Overwrite: true` on an existing history file. Always **APPEND** to the bottom.
- **Format**:
```markdown
## [HH:mm] - [Task Title]
- **Summary**: Overview of feature/logic added.
- **Files Modified**: `src/views/Inventory.vue` [UPDATED]
- **Changes Detail**: (Logic details, UI details, Demo impact).
- **Status**: [Success / Pending]
```

---

## 🎯 2. Primary Objective & Strategy

### 🚀 2.1 The "Demo-Ready" MVP
We are building a **Front-end Only** version of Ebraa ERP. 
- **Persistence**: All data must be stored in `LocalStorage` or a local `SQLite/Dexie.js` database.
- **Interactivity**: Every button, form, and chart must work using local data to simulate a real backend.
- **Goal**: A high-fidelity prototype that wows potential customers.

### 🎭 2.2 Roles & Scenarios
- **Admin**: Full access to all modules (Dashboard, Inventory, POS, Analytics).
- **Cashier**: Restricted access (POS, Cart, Invoice History).
- **Branch Manager**: Access to specific branch data and inventory.
- **Sales Pitch**: Focus on Dashboard (Profit monitoring), POS (Barcode scanning/instant checkout), and Transparency (Speed & UX).

---

## 🛠️ 3. Technology Stack & Tech Decisions

### ⚡ 3.1 Core Stack
| Feature | Tool | Reason |
|---|---|---|
| **Framework** | Vue 3 (Composition API) | Modern, fast development. |
| **State** | Pinia (Persisted) | Lightweight, persistent state between POS & Dashboard. |
| **Styling** | Tailwind CSS | Flexibility & Premium Glassmorphism design. |
| **Database** | Dexie.js (IndexedDB) | Powerful client-side storage for thousands of records. |
| **Components**| PrimeVue | Best-in-class DataTables for ERP. |
| **Icons** | Lucide-Vue / Heroicons | Consistent iconography. |
| **Math** | Big.js | **MANDATORY** for all financial/tax calculations to avoid JS precision errors. |
| **Alerts** | Vue Toastification | Professional feedback for interactions. |

### 🌍 3.2 Modular Localization (i18n)
- **Strict Translation**: Never use hardcoded strings. Use `{{ t('module.key') }}`.
- **Modular Structure**: Organize `src/i18n/index.js` into namespaces:
    - `common`: Global terms.
    - `validation`: Error messages.
    - `auth`, `inventory`, `pos`, `dashboard`: Module-specific keys.

---

## 🏗️ 4. Architecture & Technical Standards

### 📁 4.1 Folder Structure (Feature-based)
```plaintext
src/
├── api/             # Axios modules per feature.
├── assets/          # Images, Icons, global CSS.
├── components/      # Shared UI (Dumb Components).
├── composables/     # Shared Logic (Smart Logic/Financials).
├── stores/          # Pinia stores per feature.
├── views/           # Smart Components / Pages.
└── utils/           # Formatters, Date Helpers.
```

### 📏 4.2 Strict Programming Rules
1.  **Smart vs Dumb Components**: Components in `src/components/` must be "Dumb" (props/emits only). Views are "Smart" (API/Store interaction).
2.  **Composables (Logic)**: All calculations (VAT, discounts, net totals) must reside in `composables/` for reuse across modules.
3.  **State Management**: Use Pinia stores for session data (User, Branch, Cart). Do not access LocalStorage directly inside components.
4.  **API Layer**: Use dedicated files in `src/api/` with Axios Interceptors for uniform error handling.
5.  **Strict Types**: Define `Interfaces` (e.g., `interface Product`) for all data models to ensure field name accuracy.

---

## 🏢 5. Unified Design System (Atomic Design) [STRICT MANDATORY]

### 🧩 5.1 Component-First Strategy
- **Search Before Build**: Always check `src/components/base/` before creating new UI.
- **Base Components**:
    - `<BaseText>`: **MANDATORY** for all text. Tags like `h1`, `p`, `span`, `label` are forbidden.
    - `<BaseSelect>`: For all selection/dropdown inputs (includes search/filter).
    - `<BaseTable>`: For all data tables (includes Mobile/Card view).
    - `<BaseModal>`: For all dialogs.
- **Refactoring**: Create a `Base` component if a pattern repeats 2+ times.

### 📏 5.2 Spacing & Typography
- **Standardized Spacing**: All Modals **MUST** have **32px (8 units)** padding in Header, Body, and Footer.
- **Gaps**: Use `gap-4` minimum between large interactive elements.
- **Input Labels**: Must be large (`text-xs` to `text-sm`), bold, and high-contrast (`--text-main` with 80% opacity).

### 🎨 5.3 Themes & Readability
- **Light Mode Quality**: Ensure 100% Arabic readability in Light mode. Avoid faint grays.
- **CSS Variables**: Use `--text-main` and `--text-title` via `BaseText` to handle themes automatically.

---

## 🛡️ 6. UX & Interaction Standards [STRICT MANDATORY]

### ✅ 6.1 Validation & Feedback
- **Form Validation**: No form submission without reactive validation. Show clear red error messages under invalid fields.
- **Loading States**: All action buttons (Save, Delete, Edit) **MUST** implement the `:loading` state.
- **Toasts**: Always show a success/failure toast after interactive operations.

### ⌨️ 6.2 Advanced Interaction
- **Keyboard-First**: Support `F9` (Save), `F2` (Search), `Enter` (Navigation), `Esc` (Close).
- **Search & Filtering**: Use Advanced Selects with filters and Global Search in the header.
- **Universal Loading**: Use Progress Bars or Overlays during page transitions and heavy data fetching.

### 📱 6.3 Mobile & PWA
- **Responsive Layout**: All tables/cards must adapt to mobile.
- **Touch-Friendly**: Buttons and menus must be large enough for touch.
- **PWA Capabilities**: Maintain splash screens, icons, and offline readiness.

---

## 🏛️ 7. Advanced ERP Enterprise Standards

1.  **RBAC (Permissions)**: Use `v-can="'permission-name'"` to mask UI elements based on user rights.
2.  **Audit Logs**: Record sensitive operations (Add/Edit/Delete) in dedicated tables/history views.
3.  **Precision Math**: Use `Big.js` for all financial logic. Rounding must be unified system-wide.
4.  **Offline Persistence**: Use Dexie.js for local data and Background Sync when connectivity returns.
5.  **Printing Engine**: Professional CSS `@media print` templates for invoices and reports.
6.  **Branch Switching**: Header-based branch selector that affects all visible data automatically.

---

## 🗺️ 8. Build Roadmap (4-Week MVP)

### الأسبوع 1: الهيكل والمصادقة الوهمية
- الـ Layouts (Auth, App, POS) و Fake Auth مع Router Guards.

### الأسبوع 2: الداتا بيز المحلية والمخزون
- Dexie.js Setup وشاشات المخزون مع ميزة توليد البيانات العشوائية.

### الأسبوع 3: وحش النظام — شاشة الـ POS
- سلة المشتريات (Pinia)، Barcode Logic، ونافذة الطباعة الوهمية.

### الأسبوع 4: لوحة التحكم والتقارير
- إحصائيات الأرباح، الرسوم البيانية (Charts)، وسجل الفواتير.

---

## 🧪 9. Quality Assurance (Testing Strategy)

- **Tool**: Vitest.
- **Business Logic**: 100% test coverage for calculations and state updates (Composables/Stores).
- **TDD Approach**: Write tests before logic for critical financial functions.
- **Mocking**: Mock all API calls to ensure test independence.
