# 🤖 AI Assistant Protocol (AI_INSTRUCTIONS.md)

This document serves as the primary operational directive for the AI Coding Assistant. All future tasks, code modifications, and architectural decisions must adhere to the rules defined herein.

---

## 1. 🧠 Context Awareness (Mandatory Initial Step)

Before executing any task, the AI **MUST**:
1.  **Read Documentation**: Scan the `docs/` directory (specifically `architecture.md`, `db_schema.md`, and `01_roadmap.md`) to understand the current system state.
2.  **Review History**: Read the most recent file in the `history/` directory to identify recent progress, open issues, and avoid redundant work or conflicts.
3.  **Verify Permissions**: Ensure all commands are run within the workspace and adhere to safety protocols.

---

## 2. 🎭 Operational Modes

The assistant operates in one of three distinct modes, depending on the task phase:

### 🏛️ Architect Mode
- **Goal**: Structural planning and quality assurance.
- **Rules**:
    - Ensure every feature follows **Clean Code** principles and SOLID patterns.
    - Validate architectural compatibility before writing a single line of code.
    - Propose implementation plans before execution for complex tasks.

### 💻 Developer Mode
- **Goal**: Implementation and troubleshooting.
- **Rules**:
    - Write robust, production-ready code.
    - Use the latest technology stack: **Laravel 11+**, **Vue 3**, **TypeScript**, **Inertia.js v3**, **Pinia**, **Tailwind CSS**.
    - Always implement error handling and logging.

### 📝 Documenter Mode
- **Goal**: Maintaining project integrity and records.
- **Rules**:
    - Keep `docs/` updated with any architectural or schema changes.
    - Maintain the **History Log** for every modification.

---

## 3. 📜 Mandatory History Logging (The Ledger)

After every code modification or addition, the AI is **strictly required** to update or create a history log.

### Log File Format
- **Path**: `history/YYYY-MM-DD.md`
- **Structure**:
    ```markdown
    ## [Entry Time] - [Task Title]
    - **Summary**: Brief overview of the change.
    - **Files Modified**: 
        - `path/to/file1.php`
        - `path/to/file2.vue`
    - **Changes Detail**: 
        - [File Basename]: [Line Range] - [Reason/Logic]
    - **Status**: (Success / Pending / Issues)
    ```

---

## 4. 🛠️ Development Constraints & Rules

1.  **Test-Driven Closure**: No history entry can be marked as `Success` without passing relevant **Unit Tests** (PestPHP/PHPUnit).
2.  **Technology Standards**:
    - **Backend**: Laravel 11 (minimum).
    - **Frontend**: Vue 3 with Composition API.
    - **State**: Pinia (No Zustand).
3.  **Code Preservation**: Never delete legacy code unless a functional replacement is verified and documented in the history log.
4.  **Security**: Adhere to Multi-tenancy isolation rules (stancl/tenancy). Never bypass tenant scoping in production code.

---

## ⚖️ Compliance
Failure to follow these instructions will result in architectural debt and loss of context. The assistant must treat this file as its **Source of Truth**.
