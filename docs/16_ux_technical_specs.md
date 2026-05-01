# 16 المواصفات التقنية للواجهة والأداء (Technical UI Specs)
**مشروع Ebraa ERP - بنية الواجهة ومعايير التنفيذ v2.0**

---

## 🛠️ 1. المكدس التقني للواجهة (Frontend Stack)
تم اختيار هذه الأدوات لتقليل حجم الـ Bundle وتحقيق سرعة استجابة فائقة.

- **Framework:** **Inertia.js v3.0** (استخدام بروتوكول XHR المتطور للتنقل بين الصفحات دون Refresh).
- **View Layer:** **Vue.js 3 (Composition API)** مع استخدام الـ **Teleport** للنوافذ المنبثقة لضمان نظافة الـ DOM.
- **Styling:** **Tailwind CSS** مع استخدام نظام **PurgeCSS** لحذف أي تنسيقات غير مستخدمة، مما يقلل الحجم لـ أقل من 50KB.
- **Build Tool:** **Vite** لضمان تحديث الكود لحظياً أثناء التطوير (HMR).

---

## ⚡ 2. معايير الأداء اللحظي (Optimistic UI)
لتحقيق ميزة "البيع في 0 ثانية":
- **Manual State Management:** عند مسح سيريال، نقوم بإضافته فوراً لمصفوفة السلة في الـ Frontend (Vue State) قبل إرسال الطلب للسيرفر.
- **Background Sync:** نستخدم `Inertia.post` مع خيار `preserveScroll: true` و `preserveState: true` لضمان عدم اهتزاز الواجهة أثناء التزامن.

---

## 🛡️ 3. الأمان والعرض المشروط (Permission-based Rendering)
النظام ذكي بما يكفي لإخفاء المعلومات الحساسة برمجياً:
- **Conditional Directives:** استخدام `v-if` بناءً على مصفوفة `auth.permissions` الممرة من Laravel.
- **Data Masking:** إخفاء أرقام تليفونات العملاء أو أسعار الشراء عن أدوار معينة (مثل البائع) إلا في حال امتلاك صلاحية صريحة.

---

## 📱 4. ميزات التطبيق التقدمي (PWA Specs)
ليعمل النظام كـ Desktop App حقيقي:
- **Manifest Setup:** تعريف أيقونات مخصصة، لون شريط العنوان (Emerald Green)، ووضع العرض `standalone`.
- **Service Worker:** استخدام استراتيجية **Stale-While-Revalidate** لضمان تحميل الواجهات بسرعة البرق حتى في ضعف الإنترنت.
- **Haptic API:** تفعيل الاهتزاز عند مسح الباركود عبر المتصفح في أجهزة الأندرويد.

---

## ✅ 5. جودة الواجهة (UI Quality Assurance)
- **Lighthouse Score:** نستهدف درجة لا تقل عن **95/100** في الأداء وسهولة الوصول (Accessibility).
- **Cross-browser:** دعم كامل لـ Chrome, Safari, Edge, و Firefox.

---

> [!IMPORTANT]
> **ملاحظة للمطور:** يجب استخدام مكتبة **Pinia** لإدارة حالة السلة محلياً لضمان عدم فقدان البيانات في حال قام المستخدم بعمل Refresh للصفحة بالخطأ.
