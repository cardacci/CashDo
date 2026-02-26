# Project Overview

CashDo: a TODO list app built with React Native, Expo, and TypeScript. Uses Zustand for state management with persist middleware + AsyncStorage. All custom components (no external UI libraries).

# Code Style & Formatting

- **Indentation:** Tabs (not spaces) in source files.
- **Max line length:** 160 characters.
- **Quotes:** Single quotes for strings.
- **Semicolons:** Required at end of statements.
- **Trailing commas:** Not used.
- **Language:** English for all code, comments, and variable names.

# Constants & Magic Strings

- **Never use magic strings or numbers directly in code.** Extract them into named constants.
- Place constants at module level or in the `Constants` section of the component/hook.

# Component & Hook Conventions

- **Section header comments are mandatory.** Every section present in a component/hook MUST have its corresponding `/* ===== SectionName ===== */` comment (e.g., `/* ===== Store ===== */`, `/* ===== Memos ===== */`, `/* ===== Functions ===== */`).
- Use `function` declarations for components and helper functions (not arrow functions assigned to `const`).

# Project Structure

- `src/types/`: Shared TypeScript types and interfaces.
- `src/store/`: Zustand stores with AsyncStorage persistence.
- `src/utils/`: Utility functions (e.g., `generateId`).
- `src/theme/`: Light/dark theme color definitions.
- `src/hooks/`: Custom React hooks.
- `src/components/`: Reusable UI components.
- `App.tsx`: Root component that wires everything together.

# Git & Branching

- Commit messages should be concise and in English.
