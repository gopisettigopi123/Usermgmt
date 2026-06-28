# User Management Dashboard

A responsive, high-performance **User Management Dashboard** built with React, Vite, and custom CSS3 styles. It allows administrators to perform full CRUD operations (Create, Read, Update, Delete) on user accounts by communicating with the **JSONPlaceholder** mock API.

This version incorporates **React Router** for multi-page routing, centralizes state in a **Zustand** store, implements **in-memory caching** at the service layer, utilizes a screen-centered **Filter Modal**, and triggers stackable **Success Toast Notifications** on actions.

## Project Features

- **Multi-Page Routing**: Set up with `react-router-dom` to partition views into dedicated routes:
  - `/` (DashboardPage): Interactive users table with sorting, search, centered filters, delete verification modal, and pagination.
  - `/user/add` (UserDetailsPage): Standalone page layout containing the details creation form.
  - `/user/edit/:id` (UserDetailsPage): Standalone page pre-populated with details for editing, supporting deep link refreshes.
- **Light Mode by Default**: Re-engineered with a default light glassmorphism style (pastel accents, high contrast text) and smooth transitions.
- **Theme Switcher Toggle**: Rotatable Sun/Moon theme switcher button positioned at the top header that caches selection in `localStorage`.
- **Success Action Toasts**: Animated feedback cards slide in from the top-right upon successful user creation, profile update, or deletion, matching active theme styles.
- **Centered Filter Modal**: The filter popup has been redesigned to align at the exact center of the screen as a modal overlay, locking background page scroll when active.
- **Centralized Zustand Store**: All parameters (search queries, active filters, sorting properties, active page size, loading indicators, and user data list) are managed in a central store.
- **In-Memory Caching**: Network API requests are cached in the service layer, eliminating duplicate/repeated HTTP calls on page switching or search query updates.
- **Isolated API Endpoints**: All API route paths and base URLs are defined in a separate constants file (`src/api/endpoints.js`).
- **Real-Time Search**: Instant filtering as you type, matching first name, last name, or email.
- **Lexicographical Column Sorting**: Bidirectional sorting (Ascending/Descending) on ID, Name, Email, and Department.
- **Pagination Controls**: Selectable page sizes (5, 10, 20 items) and responsive pagination page navigation links.
- **Error & Validation Layer**: Displays input-specific validation errors and triggers top-level error banners if network requests fail.

---

## Folder Structure Map

```text
user-management-dashboard/
│
├── public/
│
├── src/
│    ├── api/
│    │    ├── endpoints.js          # Isolated API base URL and route constants
│    │    └── userService.js        # Axios instance, caching layer, and api calls
│    │
│    ├── components/
│    │    ├── DashboardPage.jsx     # Dashboard route (search, table, pagination, filters, delete modal)
│    │    ├── UserDetailsPage.jsx   # Standalone details form route (add/edit mode, validations)
│    │    ├── Header.jsx            # Top banner, statistics, theme toggle, and page actions
│    │    ├── SearchBar.jsx         # Real-time search query input
│    │    ├── FilterPopup.jsx       # Centered filter modal overlay
│    │    ├── UserTable.jsx         # Core table grid (sorting headers, skeletons)
│    │    ├── UserRow.jsx           # Individual user table row details
│    │    ├── Pagination.jsx        # Previous/Next and page-size selector
│    │    ├── ConfirmDelete.jsx     # Deletion safety verification modal
│    │    └── ToastContainer.jsx    # Stackable slide-in success notifications
│    │
│    ├── store/
│    │    └── useUserStore.js       # Zustand centralized state store, toasts, and actions
│    │
│    ├── utils/
│    │    ├── constants.js          # App configurations (Departments, default page sizes)
│    │    ├── helpers.js            # Mappers (names splits, HSL avatar generation)
│    │    └── validators.js         # Client-side form input validation functions
│    │
│    ├── index.css                  # Global styles (glassmorphism themes, transition variables, toast CSS)
│    ├── main.jsx                   # React bootstrapper
│    └── App.jsx                    # Root router settings and routes mapping
│
├── index.html                      # HTML document entry (with SEO meta tags)
├── package.json                    # Dependencies & scripts
└── README.md                       # Project reference guide
```

---

## Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

1. Clone or download this project workspace directory.
2. Open your terminal in the workspace directory.
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

- **Development Server**:
  Launch the local HMR dev server (runs on `http://localhost:5173`):
  ```bash
  npm run dev
  ```

- **Production Build**:
  Compile and bundle optimized static assets in the `dist/` directory:
  ```bash
  npm run build
  ```

- **Lint Check**:
  Run static code analysis using `oxlint`:
  ```bash
  npm run lint
  ```

- **Unit Tests**:
  Execute the Vitest test runner to run unit test suites:
  ```bash
  npm run test
  ```

---

## Technical Stack & Libraries

- **React 19**: Frontend UI library.
- **Zustand 5**: Centralized state management.
- **React Router 7**: Declarative page routing.
- **Vite 8**: Next-generation frontend tooling and bundler.
- **Vitest**: Blazing fast, lightweight testing runner compatible with Vite configs.
- **Axios**: Promised-based HTTP client for API transactions.
- **Oxlint**: Highly optimized linter to maintain code quality.
- **Custom CSS3**: Custom glassmorphism, transitions, skeleton loaders, and styles (no heavy CSS frameworks).

---

## Caching Strategy & Endpoint Variables

- **Endpoint Isolation**: All REST routes are separated into `src/api/endpoints.js` containing clean, descriptive objects (`ENDPOINTS.USERS` and `ENDPOINTS.USER_BY_ID(id)`) to abstract absolute URL strings from service logic.
- **In-Memory Caching**: 
  - A caching variable in `userService.js` saves the network response on the initial `getUsers()` call.
  - Subsequent requests for users (e.g., when the dashboard mounts, or filters toggle) serve data directly from memory cache, dropping network round-trips to zero.
  - Adding, editing, or deleting users automatically updates the cache in memory alongside the REST calls, ensuring subsequent fetches yield the updated dataset.
  - A `clearUserCache()` helper is exported to manually invalidate cache when necessary.

---

## Challenges Faced & Workarounds

1. **Duplicate Mock IDs on Creation**:
   - *Problem*: Sending a POST request to `jsonplaceholder.typicode.com/users` always returns `id: 11` for any created resource. If an admin creates multiple users, they would share `id: 11`, causing React key collisions and display issues.
   - *Workaround*: If the response returns `id: 11` and a user with ID 11 is already present, the Zustand store dynamically generates a unique sequential ID (`Math.max(...currentIds) + 1`) to ensure key uniqueness.

2. **404 Errors on Updating Mocked Users**:
   - *Problem*: Attempting to update or delete a locally created user (with ID > 10) triggers a 404 error on the JSONPlaceholder REST server because that resource doesn't exist on their mock database.
   - *Workaround*: The Zustand store handles error catching for updates/deletions. If a request throws a 404, we log it as a warning (expected behavior for mocked users) and proceed to execute the update/deletion locally in React state so the UI remains in sync.

3. **Data Loss on Direct Reload of Details Route**:
   - *Problem*: If an administrator navigates directly or refreshes the page on `/user/edit/3`, the local Zustand state resets, resulting in an empty `users` array, causing profile retrieval to fail.
   - *Workaround*: A `useEffect` in `UserDetailsPage` intercepts empty store arrays and fires a server refetch immediately. The component displays a styled loading spinner while fetching, and then populates details, making direct URL entry and hard reloads fully supported.
