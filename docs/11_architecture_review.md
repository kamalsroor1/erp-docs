# التحليل المعماري الاحترافي — Ebraa ERP
**Senior Software Architect Review**
**تاريخ المراجعة:** أبريل 2026 | **الإصدار:** 2.0 (محدَّث)

---

> **ملخص تنفيذي:** هذا المشروع من الناحية المعمارية سليم ومناسب للمرحلة الحالية (Solo Developer + MVP). اختيار Laravel Monolith صحيح استراتيجياً. القرار النهائي للـ Frontend: **Inertia.js v3 + Vue.js** مع استخدام **stancl/tenancy** للـ Multi-tenancy لضمان أعلى درجات الأمان والسرعة.

---

## 1. التقنيات المستخدمة (Tech Stack Inventory)

| الطبقة (Layer) | التقنية المختارة | الإصدار |
|---|---|---|
| **Backend Framework** | Laravel | 11/12 |
| **Frontend** | Inertia.js v3 + Vue.js + Pinia + Vite | 3.x |
| **Real-time** | Laravel Reverb | Latest |
| **Database Primary** | PostgreSQL | 15+ |
| **Cache & Queues** | Redis | 7.x |
| **Multi-tenancy** | **stancl/tenancy (Dual DB)** | Latest |
| **Desktop App** | مؤجل — Phase 2 (PWA للـ MVP) | — |
| **Barcode Scanning** | Html5-QRCode / WebAssembly + PWA | — |
| **Testing** | PestPHP | 2.x |
| **Payment** | Paymob (EG) / Moyasar (SA) | — |
| **Notifications** | **Telegram Bot API (بديل الواتساب)** | — |
| **Infrastructure** | Docker + AWS/DigitalOcean | — |

---

## 2. التقييم الفني التفصيلي

### 2.1 Laravel 11 (Backend) — ✅ القرار صحيح
**التقييم:** ممتاز لهذا الـ Use Case تحديداً.

**المميزات في سياق المشروع:**
- **Eloquent ORM:** يبسّط منطق TenantModel وGlobal Scopes بالتكامل مع `stancl/tenancy`.
- **Queue System:** مثالي لاستيراد Excel (1000+ سيريال) في الخلفية بدون timeout.
- **Laravel Reverb:** WebSocket مدمج — توفير لا يقدَّر بثمن لـ Solo Developer.
- **Spatie Permissions:** مكتبة ناضجة للـ RBAC المعقد (5 أدوار).
- **PestPHP:** اختبارات قابلة للقراءة تسرع كتابة الـ 45+ Test Case.

**المخاطر الفعلية:**
- ⚠️ **N+1 Problem:** مع `device_items` التي قد تحتوي مئات الآلاف من السجلات — `eager loading` و `cursor()` في التقارير أمر حتمي.
- ⚠️ **Cross-DB Transactions:** عند شراء Tenant لباقة يجب تحديث Central DB وTenant DB في نفس الوقت. **الحل: Events + Sagas pattern**.

---

### 2.2 PostgreSQL (Database) — ✅ القرار صحيح جداً
**التقييم:** الخيار الأفضل مطلقاً لهذا المشروع.

| الميزة | PostgreSQL | MySQL |
|---|---|---|
| **JSONB** (لخصائص الأجهزة المتغيرة) | ✅ أداء ممتاز مع Indexing | ⚠️ JSON بطيء |
| **Full-text Search** (بحث السيريال) | ✅ مدمج وسريع | ⚠️ أضعف |
| **Window Functions** (للحسابات التراكمية) | ✅ متفوقة في الأداء | ⚠️ دعم محدود |
| **UNIQUE Constraints مركبة** | ✅ (serial_number, tenant_id) | ✅ يدعم |
| **Concurrent Writes** | ✅ MVCC أقوى | ⚠️ أبطأ |

**مخاطر التصميم:**
- ⚠️ **Missing Indexes:** جدول `device_items` يحتاج Index صريح على `serial_number + tenant_id`. عند 100,000 سجل البحث بدونه كارثة أداء.
- ⚠️ **Logical FK بدون FK حقيقي:** `users.tenant_id` لا يملك FK فعلي لأن قاعدتا البيانات منفصلتان — خيار مقصود وصحيح لكن يجب توثيقه.
- 💡 **توصية هامة:** تخزين التكلفة (Cost) داخل جدول `invoice_lines` وقت البيع لضمان ثبات التقارير التاريخية عند تغير التكلفة المتوسطة لاحقاً.

---

### 2.3 Frontend — Inertia.js v3 + Vue.js 3 ✅ (القرار النهائي)
**قرار نهائي محسوم:** Inertia.js v3 هو الاختيار الوحيد لهذا المشروع. يوفر تجربة مستخدم تضاهي التطبيقات المكتبية مع تبسيط التطوير لـ Solo Developer.

**لماذا Inertia.js وليس Vue SPA أو Livewire وحده؟**
- **Vue SPA خالص:** يستلزم كتابة API endpoints + Axios calls + Error handling مرتين — ضعف وقت التطوير.
- **Livewire وحده:** لا يصلح لشاشة POS التي تحتاج Real-time فوري وCamera APIs للباركود.
- **Inertia.js:** يجمع سرعة Laravel في الـ Backend وجمال Vue في الـ Frontend بدون كتابة API.

**مميزات Inertia.js v3 لـ Ebraa ERP:**

| الميزة الجديدة في v3 | الفائدة لـ Ebraa ERP |
|---|---|
| **Optimistic Updates** | في شاشة POS تظهر المنتجات في السلة لحظياً بمجرد مسح الباركود. |
| **No Axios (Built-in XHR)** | تقليل حجم الـ Bundle وتحسين الأداء بالعميل المدمج. |
| **Simplified SSR** | لا حاجة لسيرفر Node.js منفصل أثناء التطوير. |
| **useHttp Hook** | إرسال طلبات خلفية (حالة طابعة / رصيد) بدون تغيير الصفحة. |
| **History Encryption** | تشفير بيانات المتصفح لضمان أمان بيانات المحلات. |

**توزيع الأعمال النهائي:**
- صفحات الإدارة (Products, Reports, Settings): Inertia + Vue بدون API.
- شاشة POS: Vue Component مستقل + Pinia للـ State.
- PWA / Mobile Scanner: Laravel PWA Package فوق كل ذلك.

---

### 2.4 معمارية Multi-tenancy — stancl/tenancy (Dual DB) ✅
**قرار محدَّث:** الانتقال من Row Level Isolation اليدوي إلى **stancl/tenancy** — يوفر Dual DB architecture جاهزة من أول سطر كود.

| النموذج | الوصف | Ebraa ERP |
|---|---|---|
| Single DB, Shared Tables | tenant_id في كل جدول — يدوي | ❌ خطر Data Leakage |
| Separate Schema per Tenant | Schema مختلف لكل محل | ❌ معقد جداً للـ Solo Dev |
| Separate DB per Tenant | قاعدة بيانات لكل محل | ❌ تكلفة استضافة مرتفعة |
| **Dual DB (stancl/tenancy)** | **Central DB + Tenant DB تلقائياً** | **✅ القرار المختار** |

**مميزات stancl/tenancy على الحل اليدوي:**
- **Automatic DB Switching:** يحدد Connection تلقائياً لكل Request بدون كود يدوي.
- **Tenant-aware Migrations:** أوامر migrate منفصلة للـ Central والـ Tenant.
- **Middleware جاهز:** يحدد الـ Tenant من الـ Domain أو الـ Subdomain تلقائياً.

---

### 2.5 Laravel Reverb (Real-time) — ⚠️ مقبول للـ MVP
**التقييم:** جيد للـ MVP لكن له سقف عند 500+ مستخدم متزامن.
- مدمج في Laravel بدون إعداد خارجي — مناسب للإشعارات اللحظية.
- ⚠️ **Resource Intensive:** كل WebSocket Connection يستهلك ذاكرة.
- **البديل عند التوسع:** Soketi (Self-hosted Pusher) أو Ably.

---

### 2.6 NativePHP — ❌ محذوف من الـ MVP
**قرار نهائي:** NativePHP مؤجل للـ Phase 2 بالكامل. الـ MVP يعتمد على **Web + PWA** فقط. هذا يقلل المخاطر ويسرع الوصول للسوق.

**البديل في الـ MVP:**
- **PWA (Progressive Web App):** تشتغل كـ Desktop App من المتصفح بدون تثبيت.
- **Barcode Scanning:** Html5-QRCode عبر PWA على الموبايل والتابلت.
- **Printing:** CSS Print Styles + Browser Print Dialog في المرحلة الأولى.

---

## 3. الثغرات التقنية والحلول المعمارية المتقدمة

1. **حساب التكلفة المتوسطة (Moving Average):**
   - **الحل:** بناء **Event Listener** يعمل في الخلفية (Queue) مع كل عملية إدخال في جدول حركات المخزون لتحديث حقل `average_cost` في جدول الأصناف فورياً.
2. **الأرصدة التراكمية (Running Balances):**
   - **الحل:** تجنب حلقات التكرار (Loops) برمجياً؛ اعتمد كلياً على الـ **Window Functions** في PostgreSQL (مثل `SUM() OVER (ORDER BY date)`) لتوليد الأرصدة بسرعة فائقة في تقارير الخزينة وحركة الأصناف.
3. **Cross-Database Transactions:** استخدام Database Events + Retry Queue لضمان تزامن تفعيل الاشتراك بين القاعدتين.
4. **Tenant Isolation في الـ Webhooks:** تضمين `tenant_id` في metadata الـ Payment Order عند الإنشاء.
5. **Rate Limiting في الاستيراد الضخم:** تقسيم Excel import لـ Chunks صغيرة (100 سجل/Job).
6. **Missing Indexes:** إضافة Indexes صريحة على `device_items(serial_number, tenant_id)` و `sales(tenant_id, created_at)`.
7. **Backup Strategy:** نسخ احتياطي يومي لـ S3 + تفعيل WAL Archiving في PostgreSQL.

---

## 4. خطوات البداية الفعلية (Getting Started)

### المرحلة الأولى: الأساس (الأسبوع 1-2)

1. **Laravel + stancl/tenancy:**
   ```bash
   laravel new ebraa-erp
   composer require stancl/tenancy
   php artisan tenancy:install
   ```
2. **Inertia.js v3 + Vue.js:**
   ```bash
   composer require inertiajs/inertia-laravel
   npm install @inertiajs/vue3 vue pinia vite
   ```
3. **Redis + Queue:** ضبط الـ `.env` لاستخدام Redis للجلسات والمهام الخلفية.
4. **PestPHP + Spatie Permissions:** إعداد بيئة الاختبار ونظام الصلاحيات.

### المرحلة الثانية: أول Module (الأسبوع 3-4)
البدء بـ **Tenant Registration + Subscription** لربط القاعدتين ببعضهما البعض.

---

## 5. التوصيات النهائية (Prioritized)

- 🔴 **أولوية قصوى:** إضافة الـ Indexes وحل مشكلة الـ Cross-DB Transactions.
- 🟡 **أولوية متوسطة:** إعداد Sentry للمراقبة و Load Testing بـ k6.
- 🟢 **أولوية مستقبلية:** تقييم Tauri كبديل لـ Desktop App مستقبلاً.

---

## 6. تقييم الـ Stack الكلي

| المجال | التقييم | من 10 |
|---|:---:|:---:|
| اختيار Backend Framework (Laravel) | ✅ ممتاز | 9/10 |
| اختيار قاعدة البيانات (PostgreSQL) | ✅ ممتاز | 9/10 |
| معمارية Multi-tenancy (stancl/tenancy) | ✅ ممتاز | 9/10 |
| Frontend Architecture (Inertia.js v3) | ✅ ممتاز | 8/10 |
| Desktop Strategy (PWA للـ MVP) | ✅ محسومة | 8/10 |
| استراتيجية الـ Testing (PestPHP) | ✅ جيدة | 8/10 |
| **الإجمالي** | **جيد جداً** | **8.1/10** |

---
*أُعدَّ هذا التحليل بناءً على مراجعة 11 وثيقة تقنية لمشروع Ebraa ERP — الإصدار 2.0*
