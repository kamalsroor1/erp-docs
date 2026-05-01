# 🎨 Frontend MVP Protocol (FRONTEND_AI_INSTRUCTIONS.md)

This document defines the specialized rules for building the **Ebraa ERP Frontend MVP**. The primary goal is to create a fully interactive, data-persistent prototype (using LocalStorage/SQLite) for client demonstrations and pre-order generation.

---

## 1. 🎯 Primary Objective: The "Demo-Ready" MVP
We are building a **Front-end Only** version of Ebraa ERP. 
- **Persistence**: All data must be stored in `LocalStorage` or a local `SQLite` database (WASM/Client-side).
- **Interactivity**: Every button, form, and chart must work using local data to simulate a real backend.
- **Goal**: A high-fidelity prototype that wows potential customers.

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

## 5. 🏗️ Local Data Architecture
- **Mock Services**: Create a `services/` directory to handle all CRUD operations on LocalStorage/SQLite.
- **Seeding**: Automatically seed the local database with "Dummy Data" (e.g., 5 products, 3 customers, 2 repair tickets) if it's empty, to ensure the demo is never blank.
- **Export/Import**: Provide a "Reset Data" or "Export Data" button in settings for easy demo cleanup.

---

## 6. 🏛️ Operational Modes (Frontend Focus)
- **UI Architect**: Designing layouts, color schemes, and UX flows.
- **UI Developer**: Implementing the Vue components and LocalStorage logic.
- **UI Tester**: Verifying that forms validate and data persists after page refresh.

---

## ⚠️ Compliance Warning
Focus on visual excellence and flawless local interactivity. If a feature isn't functional or looks "basic," it fails the MVP demo criteria. **Focus on one thing, and do it perfectly.**
