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
    - **Branch Manager**: Access to specific branch data and inventory.

---

## 1. 🧠 Context & Task Tracking (Mandatory)
Before starting any task, the AI **MUST** perform these 3 steps:
1.  **Read Planning**: Check `FE_PLAN.md` and `FE_TASKS.md` to identify the current objective.
2.  **Audit History**: Read `history/YYYY-MM-DD.md` to understand what was last done and avoid overwriting.
3.  **Check Protocol**: Review these instructions to ensure architectural compliance.

**Rule**: After completion, the AI **MUST** update `FE_TASKS.md` (marking `[x]`) and **APPEND** a new entry to the `history/` log.

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
- **Precision Math**: **Big.js** (Mandatory for all financial calculations).

---

## 4. 📝 Mandatory History Logging (The Ledger)
Follow the strict protocol in `AI_INSTRUCTIONS.md`. 
### 🚫 CRITICAL: NO OVERWRITING
- **NEVER** use `write_to_file` or `Overwrite: true` on an existing history file.
- **ALWAYS** use `append` logic to add new entries at the **BOTTOM**.

### Log Format for Frontend:
```markdown
## [HH:mm] - [Task Title]
- **Summary**: Overview of feature/logic added.
- **Files Modified**: 
    - `src/views/Inventory.vue` [UPDATED]
- **Changes Detail**: 
    - **Logic**: (e.g., Integrated Big.js for tax calc).
    - **UI**: (e.g., Added Glassmorphism cards).
    - **Demo Impact**: (e.g., Customer can now see live stock updates).
- **Status**: [Success / Pending]
```

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

---

## 🏗️ 5. الهيكل المعماري والمعايير البرمجية (Architecture & Standards)

يجب الالتزام بالمعايير التالية لضمان جودة الكود وسهولة صيانته:

### 📁 1. هيكلة المجلدات (Folder Structure)
نعتمد تقسيم **Feature-based Architecture**:
```plaintext
src/
├── api/             # ملفات Axios لكل موديول (مشتريات، مبيعات، حسابات)
├── assets/          # الصور، الأيقونات، وملفات الـ CSS (Tailwind مثلاً)
├── components/      # المكونات العامة (Shared UI)
│   ├── AppButton.vue
│   └── AppButton.test.js      # اختبار الـ props والـ emits
├── composables/     # الـ Logic المشترك
│   ├── useFinancials.js
│   └── useFinancials.test.js  # اختبار العمليات الحسابية ( Edge Cases)
├── stores/          # ملفات Pinia لكل قطاع
│   ├── cart.js
│   └── cart.test.js           # اختبار تحديث الـ State والـ Getters
├── views/           # الصفحات الأساسية مقسمة حسب الموديول
└── utils/           # دوال مساعدة (Format Currency, Date Helpers)
```

### 📏 2. القواعد البرمجية الصارمة:

*   **القاعدة الأولى: منطق الحسابات (Composables)**
    "أي عملية حسابية (مثل حساب الضريبة، صافي الفاتورة، أو خصم الصنف) لا تُكتب داخل الـ Component. بل تُكتب في ملف مستقل في مجلد `composables/` (مثلاً `useFinancials.js`) لتكون قابلة للاستخدام في شاشة البيع، الشراء، والمرتجع بنفس الدقة."

*   **القاعدة الثانية: إدارة البيانات (Pinia Store)**
    "بيانات الجلسة الحالية (مثل المستخدم، الفرع النشط، الخزينة المختارة، أو سلة المشتريات الحالية) تُخزن في Pinia. لا نعتمد على الـ Local Storage مباشرة داخل المكونات، بل يتم التعامل مع Store مخصص لكل قطاع (مثل `useTreasuryStore` أو `useAuthStore`)."

*   **القاعدة الثالثة: المكونات الذكية والغباء (Smart vs Dumb Components)**
    "الـ Components الموجودة في مجلد `components/` يجب أن تكون **Dumb Components**؛ أي أنها تستقبل بيانات عبر props وترسل أحداثاً عبر emits فقط، ولا تتصل بالـ API مباشرة. أما الـ Views فهي الـ **Smart Components** التي تتعامل مع الـ API والـ Stores وتوزع البيانات على المكونات."

*   **القاعدة الرابعة: توحيد شكل البيانات (API Layer)**
    "كل موديول له ملف API خاص به في مجلد `api/`. يتم استخدام Axios Interceptors لمعالجة الأخطاء (مثل انتهاء الجلسة أو خطأ في الصلاحيات) بشكل موحد، مع التأكد من إرسال الـ Token في كل طلب."

### 💡 3. مثال عملي للتنفيذ (فاتورة بيع):
1.  **الـ API**: ملف `src/api/sales.js` يحتوي على دالة `createInvoice`.
2.  **الـ Store**: ملف `src/stores/cart.js` يخزن الأصناف قبل الحفظ.
3.  **الـ Composable**: ملف `src/composables/useVatCalculator.js` يحسب ضريبة الـ 14%.
4.  **الـ Component**: مكون `AppTable.vue` يعرض الأصناف، ومكون `AppSearch.vue` يبحث بالباركود.
5.  **الـ View**: صفحة `SalesInvoice.vue` تجمع كل ما سبق.

### 🛡️ 4. الأنواع الصارمة (Strict Types)
يفضل تعريف Interfaces لكل نموذج بيانات لتجنب الأخطاء في أسماء الحقول:
```typescript
interface Product { 
  id: number; 
  name: string;
  price: number; 
  vat: number; 
}
```
هذا يضمن دقة التعامل مع الحقول (مثلاً استخدام `price` بدلاً من `unit_price`) من قبل الـ AI والمطورين.

    3. **الوضع المظلم والمضيء**: استخدام `dark:` للتأكد من وضوح العناصر في كلتا الحالتين."

*   **القاعدة السادسة: الجودة والاختبارات (Testing & QA)**
    "يجب أن يرافق كل ملف منطق برمجي ملف اختبار `.test.js` باستخدام **Vitest**:
    1. **Composables**: اختبار كافة الحالات (صفر، مبالغ ضخمة، أرقام عشرية، خصم أكبر من السعر).
    2. **Stores**: اختبار أن الـ State يتحدث بشكل صحيح (مثلاً إضافة صنف للسلة) وأن الـ Getters تحسب الإجمالي بدقة.
    3. **Components**: اختبار ظهور الـ props بشكل صحيح وانطلاق الـ emits عند التفاعل."

---

## 🧪 6. استراتيجية الاختبار (Testing Strategy)

نحن نستخدم **Vitest** لضمان استقرار النظام:
- **Business Logic**: أي منطق حسابي (مديونية، ضرائب، مخزون) يجب أن يكون له Unit Test يغطي الحالات العادية والشاذة (Edge Cases).
- **TDD Approach**: عند الطلب، ابدأ بكتابة الاختبار أولاً قبل الكود البرمجي.
- **Mocking**: يجب عمل Mocking لأي API calls لضمان سرعة الاختبارات واستقلاليتها عن الخوادم.

---

## 🏛️ 7. معايير متقدمة لنظام الـ ERP (Advanced ERP Standards)

يجب الالتزام بالمعايير التالية لضمان ملاءمة النظام لمتطلبات المؤسسات الكبرى (Enterprise Grade):

### 🛡️ 1. نظام الصلاحيات الدقيق (RBAC)
- التحكم في الصلاحيات يكون على مستوى **العملية (Action)** وليس فقط الدور.
- **UI Masking**: استخدام Custom Directive `v-can="'permission-name'"` لإخفاء العناصر من الـ DOM تماماً إذا لم يملك المستخدم الصلاحية.

### 📝 2. سجل العمليات (Audit Logs)
- كل عملية حساسة (إضافة، تعديل، حذف) يجب أن تسجل في جدول مستقل.
- يجب توفير واجهة لعرض "تاريخ العمليات" (Activity History) داخل صفحات التفاصيل.

### 🔢 3. معالجة الأرقام العشرية (Precision Management)
- **ممنوع** استخدام الحسابات التقليدية في JavaScript للعمليات المالية.
- يجب استخدام مكتبة **Big.js** لضمان دقة الكسور وتجنب أخطاء Floating Point.
- توحيد عدد الخانات العشرية (Rounding) في النظام بالكامل (غالباً خانتين).

### 📶 4. وضع الأوفلاين والمزامنة (Offline & Persistence)
- الاعتماد على **Dexie.js** لتخزين البيانات الأساسية محلياً.
- السماح بإجراء العمليات (مثل البيع) في حالة انقطاع الإنترنت، مع مزامنة البيانات تلقائياً عند عودة الاتصال (Background Sync).

### 🔔 5. التنبيهات اللحظية (Real-time Notifications)
- استخدام **WebSockets** (مثل Laravel Echo/Reverb) لتمرير التنبيهات فوراً للمدير (نقص مخزون، تحصيل شيكات) بدون تحديث الصفحة.

### 🖨️ 6. محرك الطباعة (Printing Engine)
- بناء Template Engine مرن يسمح بتخصيص شكل الفاتورة (اللوجو، الهيدر، الفوتر).
- استخدام CSS `@media print` لضمان خروج المطبوعات بشكل احترافي يحافظ على الهوية البصرية.

### ⌨️ 7. التفاعل السريع (Keyboard-First UI)
- نظام الـ ERP يعتمد على سرعة مدخلي البيانات.
- يجب دعم اختصارات الكيبورد بشكل كامل:
    - `F9`: حفظ (Save/Post).
    - `F2`: بحث (Search).
    - `Enter`: التنقل بين الحقول.
    - `Esc`: إغلاق النوافذ (Close/Cancel).

### ⏳ 8. حالات التحميل الشاملة (Universal Loading States)
- **Buttons**: أي زرار يقوم بعملية (حفظ، حذف، تعديل، أو طلب بيانات) **يجب** أن يحتوي على خاصية `:loading`.
- **Page Transitions**: يجب إظهار مؤشر تحميل (Progress Bar أو Overlay) عند التنقل بين الصفحات لضمان عدم شعور المستخدم بتجمد النظام.
- **Feedback**: لا يُترك المستخدم أبداً بدون استجابة بصرية عند الضغط على أي عنصر تفاعلي.

### 📏 10. التباعد والترجمه (Spacing & i18n)
- **Interactive Spacing**: يجب ترك مسافة (Padding/Gap) كافية بين الأزرار، الـ Selects، والـ Dropdowns (على الأقل `gap-3` أو `gap-4`). لا تترك العناصر ملتصقة أبداً.
- **Strict Translation**: يُمنع منعاً باتاً كتابة أي نصوص ثابتة (Hardcoded Strings). يجب استخدام `{{ t('key') }}` لجميع النصوص بدون استثناء.
- **Audit Requirement**: عند تعديل أي ملف، يجب التأكد من مطابقة الملف لكافة القواعد (RBAC, Mobile, Spacing, Translation).

### 📱 9. واجهة متوافقة مع الجوال (PWA & Mobile Ready)
- **Responsive Layout**: يجب أن تكون جميع الجداول والبطاقات متوافقة مع شاشات الهاتف.
- **Touch-Friendly**: الأزرار والقوائم يجب أن تكون كبيرة كفاية للمس.
- **PWA Capabilities**: تهيئة النظام ليعمل كتطبيق مستقل عند تثبيته على الهاتف (Splash screen, Icons).

### 🔍 10. البحث المتقدم والفلترة (Advanced Selection)
- **Advanced Select**: استخدام مكونات `MultiSelect` أو `Dropdown` مع خاصية البحث (`filter`) والفرز.
- **Global Search**: توفير شريط بحث سريع في الهيدر للوصول السريع للمنتجات أو الفواتير.

### 🏢 11. نظام الفروع المتعددة (Branch Switching)
- يجب توفير سليكت (Select) في الهيدر يسمح بتبديل "الفرع النشط".
- جميع البيانات (المخزن، المبيعات) يجب أن تتأثر تلقائياً بالفرع المختار.
