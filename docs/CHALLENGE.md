# Sr. Frontend Engineer Challenge

## Overview

Build a TODO list application with filtering capabilities, state management, and data persistence.

To quickly set up a mock REST API for testing and development, it's recommended to use [json-server](https://www.npmjs.com/package/json-server). This npm package allows you to create a full fake REST API with zero coding in less than 30 seconds.

## Core Requirements

### 1. Add Tasks

- Text input field for new tasks
- Add button to submit
- Validate input is not empty
- Clear input after adding

### 2. Filtering System

- Filter buttons: "All", "Completed", "Pending"
- Filter by priority (dropdown, picker, or segmented control)
- Filters should work together (e.g., "Pending + High Priority")

### 3. Data Persistence

- Explain your choice
- Save tasks to `AsyncStorage`
- Load tasks when app opens
- Handle AsyncStorage errors gracefully

### 4. Task List

- Display all tasks using `FlatList`
- Each task item must have:
    - Task text
    - Checkbox to mark as complete/incomplete
    - Delete button
    - Priority tag/badge (High, Medium, Low)
    - Visual distinction for completed tasks (strikethrough, opacity, etc.)

### 5. Global State Management

- Use **Context API** OR **Zustand** (candidate's choice)
- Do NOT use Redux (too much boilerplate for this)

## Optional

Choose any to showcase additional skills:

- Animations when adding/removing tasks (LayoutAnimation or Reanimated)
- Pull-to-refresh functionality
- Dark mode toggle
- Task counter badge (e.g., "5 pending tasks")
- Sort by creation date
- Edit existing tasks (inline or modal)

### Required Dependencies

```bash
# AsyncStorage
npx expo install @react-native-async-storage/async-storage

# If using Zustand (optional)
npm install zustand
```

## Submission

1. Your code (GitHub repo)
2. [**README.md**](../README.md) file with:
    - Setup instructions
    - How to run the project (iOS/Android)
    - Dependencies and versions
    - Any special configuration needed
    - Known issues or limitations (if any)
3. Brief explanation of your state management choice
4. Any assumptions or trade-offs you made
5. Share
