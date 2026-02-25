# CashDo

A TODO list app built with React Native, Expo, and TypeScript. Inspired by the look and feel of the Cashea parent app.

## Features

- Color palette, accents, favicon, and background aligned with Cashea branding
- Priority levels (High, Medium, Low) with color-coded badges
- Filter tasks by status (All, Completed, Pending) and priority
- Character counter appears at 80% of the 1000-character limit
- Clear input button after 10 characters
- Undo recently deleted tasks
- Task progress bar with completion tracking
- Data persistence across sessions
- Smooth animations for task entry, exit, and completion
- Light and dark theme support
- Mobile-first design

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+
- Android: Android Studio (for emulator) or Expo Go on a physical device
- iOS: macOS with Xcode (for simulator) or Expo Go on a physical device
- Web: any modern browser (no additional setup needed)

### Installation

```bash
git clone https://github.com/cardacci/CashDo.git
cd CashDo
npm install
```

### Running the App

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator/device
npm run web        # Run in the browser
```

Or try it live at [https://cardacci.github.io/CashDo](https://cardacci.github.io/CashDo)

## Dependencies

| Package                                   | Version  | Purpose               |
| ----------------------------------------- | -------- | --------------------- |
| expo                                      | ~54.0.33 | Development framework |
| react                                     | 19.1.0   | UI library            |
| react-native                              | 0.81.5   | Mobile runtime        |
| zustand                                   | ^5.0.11  | State management      |
| @react-native-async-storage/async-storage | 2.2.0    | Data persistence      |
| react-native-web                          | ^0.21.0  | Web support           |
| typescript                                | ~5.9.2   | Type safety           |

## State Management

**Zustand** was chosen over Context API and Redux for the following reasons:

- **Minimal boilerplate:** No reducers, action creators, or providers wrapping the component tree. State is defined and consumed in a single, readable store.
- **Built-in persistence:** The `persist` middleware integrates directly with AsyncStorage, handling serialization, hydration, and error recovery out of the box.
- **Selective re-rendering:** Components subscribe only to the specific slices of state they need, avoiding unnecessary re-renders without extra memoization.
- **TypeScript-first:** Full type inference with no extra configuration.
- **Scalable simplicity:** The project uses two focused stores (`useTaskStore` for tasks and `useUndoStore` for undo functionality), keeping each store small and testable.

## Error Handling

AsyncStorage errors are handled gracefully through a dedicated error modal. When a read or write operation fails, the user is notified with a clear message and actionable options.

| Scenario            | Modal                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| Data failed to load | <img src="docs/assets/could-not-load-your-data.jpg" alt="Could not load your data" width="240" /> |

- **Rehydration errors** (data failed to load): the modal offers a **Retry** button to attempt rehydration again, and a **Continue** button to start with a fresh state.
- **Write errors** (changes failed to save): the modal shows a **Dismiss** button. The next state change will automatically retry the write.

## Assumptions & Trade-offs

- **Local-only storage:** AsyncStorage was used as the persistence layer. There is no backend or API; all data lives on the device/browser (localStorage on web).
- **Task text limit:** 1000 characters per task, with a visual warning at 80% capacity.
- **Sort order:** Tasks are sorted by creation date (newest first). A configurable sort was not added to keep the UI focused.
- **Filters are not persisted:** Status and priority filters reset when the app restarts. This was intentional to always show all tasks on launch.
- **Mobile-first design:** The layout is optimized for small screens with a max width of 600px on web for readability.
- **No external UI libraries:** All components are built from scratch using React Native primitives, as required by the project constraints.

## Known Limitations

- No unit or integration tests (not required by the challenge, but planned for a future iteration)
- Pull-to-refresh has no effect on data since there is no remote API; it provides visual feedback only

## Dev Features & DX

- All linter and Prettier rules passing
- AI agent and developer coding guidelines configured via skills and project rules
- GitHub Actions CI/CD pipeline: lint, build, and auto-deploy to [GitHub Pages](https://cardacci.github.io/CashDo/)

## Roadmap

#### Next Up

- User authentication and cloud sync across devices
- Task categories and tags for better organization
- Due dates with reminder notifications
- Image attachments
- Search tasks by text

#### Premium Version

> Existing Cashea Wallet users automatically have access to the Premium version.

- Extended space per task
- Unlimited tasks
- Calendar integration for tasks
- Assign contacts to tasks
- Payment amounts tied to tasks with a due date and contact, processed through the Cashea Wallet
