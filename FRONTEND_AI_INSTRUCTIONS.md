# 🎨 Frontend MVP Protocol (FRONTEND_AI_INSTRUCTIONS.md)

This document defines the specialized rules for building the **Ebraa ERP Frontend MVP**. The primary goal is to create a fully interactive, data-persistent prototype (using LocalStorage/SQLite) for client demonstrations and pre-order generation.

---

## 1. 🎯 Primary Objective: The "Demo-Ready" MVP
We are building a **Front-end Only** version of Ebraa ERP. 
- **Persistence**: All data must be stored in `LocalStorage` or a local `SQLite` database (WASM/Client-side).
- **Interactivity**: Every button, form, and chart must work using local data to simulate a real backend.
- **Goal**: A high-fidelity prototype that wows potential customers.
- **Roles**:
    - **Admin**: Full access to all modules (Dashboard, Inventory, POS, Analytics).
    - **Cashier**: Restricted access (POS, Cart, Invoice History).

---

## 1. 🧠 Context & Task Tracking (Mandatory)
Before any task, the AI **MUST** read:
- **Project Plan**: [FE_PLAN.md](FE_PLAN.md)
- **Task List**: [FE_TASKS.md](FE_TASKS.md)
- **Recent History**: The latest file in the [history/](history/) directory.

**Rule**: After completing any task, the AI **MUST** update `FE_TASKS.md` (marking items as `[x]`) and create a corresponding entry in the `history/` log.

---

## 2. 🧩 The "One Task at a Time" Rule (STRICT)
To maintain focus and avoid incomplete features:
- The AI **MUST ONLY** work on **ONE** specific task or component per request.
- Do not attempt to build multiple pages or logic systems simultaneously.
- Finish, test, and document the current task before moving to the next.

---

## 3. 🛠️ Technology Stack (Frontend)
- **Framework**: Vue 3 (Composition API + `<script setup>`).
- **State Management**: **Pinia** (Must be configured to persist to LocalStorage).
- **Styling**: **Tailwind CSS** (Premium/Glassmorphism design).
- **Routing**: Vue Router (Web Hash mode for local file compatibility if needed).
- **Charts**: ApexCharts or Chart.js for financial data simulation.
- **Icons**: Lucide-Vue or Heroicons.

---

## 4. 📝 Mandatory History Logging
Follow the same logging protocol in `history/YYYY-MM-DD.md` but include:
- **UI Logic**: Explanation of how the local data is manipulated.
- **Component**: The specific Vue component modified.
- **Demo Impact**: How this change affects the customer demo experience.

---

## 🏗️ دليل بناء النسخة التجريبية (Front-End MVP)

هذا القسم هو الدليل التنفيذي لبناء واجهة تفاعلية كاملة بدون خوادم، تعمل محلياً لإثبات الفكرة وتوليد الطلبات المسبقة (Pre-Orders).

### 📌 نظرة عامة على الـ MVP
**الهدف**: بناء تطبيق ويب يتصرف كأنه متصل بسيرفر حقيقي. يمكن للعميل تسجيل الدخول، إضافة منتجات، إجراء عمليات بيع من شاشة الـ POS، ورؤية الأرباح.. والبيانات تُحفظ محلياً في المتصفح.

### التقنيات المختارة:
- **إدارة الحالة**: Pinia (لحفظ السلة والإعدادات).
- **قاعدة البيانات**: **Dexie.js** (غلاف لـ IndexedDB لتخزين آلاف السجلات محلياً).
- **المكونات**: **PrimeVue** (لـ DataTables الاحترافية).
- **الرسوم البيانية**: Chart.js.

---

## 🗺️ خريطة البناء (4 أسابيع)

### الأسبوع 1: الهيكل والمصادقة الوهمية
- **الـ Layouts**: إنشاء `AuthLayout` (تسجيل دخول)، `AppLayout` (الرئيسية)، و `POSLayout` (ملء الشاشة).
- **Fake Auth**: حفظ Fake Token في `localStorage` وحماية المسارات بـ `Router Guards`.

### الأسبوع 2: الداتا بيز المحلية والمخزون
- **Dexie.js Setup**: تعريف جداول `products`, `items`, `invoices`, `invoice_lines`.
- **Inventory Screens**: عرض وقائمة المنتجات مع ميزة **"توليد بيانات عشوائية"** لملء العرض.

### الأسبوع 3: وحش النظام — شاشة الـ POS
- **Pinia Cart**: إدارة السلة واحتساب الخصم والضريبة لحظياً.
- **Barcode Logic**: البحث في `db.items` عن السيريال الممسوح وتحديث الحالة لـ `sold` عند الدفع.
- **Checkout**: تسجيل الفاتورة وتفريغ السلة وإظهار نافذة الطباعة الوهمية.

### الأسبوع 4: لوحة التحكم والتقارير
- **إحصائيات تفاعلية**: قراءة الأرباح اليومية عبر طرح التكلفة من سعر البيع في الفواتير المحلية.
- **Charts**: رسم بياني للمبيعات لآخر 7 أيام.
- **سجل الفواتير**: جدول لاستعراض العمليات التي تمت أثناء العرض.

---

## 🎭 سيناريو العرض التقديمي (The Sales Pitch)
1.  **لوحة التحكم**: "هذه شاشتك الصباحية لمراقبة الأرباح".
2.  **التجربة العملية**: استخدام قارئ باركود حقيقي لمسح منتج؛ رؤيته يظهر في الفاتورة فوراً؛ ثم إتمام البيع.
3.  **الشفافية**: "هذا Prototype سريع جداً لنضمن ملاءمة التجربة لاحتياجاتكم؛ النسخة النهائية ستكون سحابية بنفس هذه السرعة".

---

## ⚡ ملخص القرارات التقنية (Frontend)
| الميزة | الأداة | السبب |
|---|---|---|
| **التصميم** | TailwindCSS | مرونة وعصرانية التصميم (Glassmorphism). |
| **المكونات** | PrimeVue | أفضل DataTables للـ ERP. |
| **الداتا بيز** | Dexie.js | أقوى مكتبة للتعامل مع IndexedDB. |
| **إدارة الحالة** | Pinia | خفة الوزن والربط السريع بين POS و Dashboard. |
| **التنبيهات** | Vue Toastification | مظهر احترافي عند نجاح العمليات. |
