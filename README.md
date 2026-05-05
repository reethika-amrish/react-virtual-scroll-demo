# React Virtual Scroll Demo — Clinical Research Pattern

> Demonstrates the **virtual scrolling and state management patterns** I built for a clinical research platform — rendering 50K+ records efficiently with React hooks and pagination.

## What This Showcases

A self-contained React app demonstrating the frontend patterns from my **Clinical Research & Content Management Platform** — virtual scrolling, debounced search, and paginated API consumption.

### Patterns Demonstrated

| Pattern | Implementation |
|---|---|
| **Virtual Scrolling** | Only renders visible rows — handles 50K+ records smoothly |
| **Backend Pagination** | Fetches data in pages as user scrolls (mock API) |
| **Debounced Search** | Custom `useDebounce` hook for search input |
| **Custom Hooks** | `useVirtualScroll`, `useDebounce`, `usePagination` |
| **State Management** | useReducer for complex multi-field state |

## Architecture

```mermaid
graph TD
    A[👤 User Scrolls / Searches] --> B[useVirtualScroll Hook]
    B --> C{Calculate Visible Range}
    C --> D[visibleStart → visibleEnd]
    D --> E[Render Only Visible Rows]
    
    B --> F{Page Boundary?}
    F -->|Yes| G[Fetch Next Page<br/>from Mock API]
    G --> H[Append to Item Map]
    H --> E
    F -->|No| E

    A --> I[useDebounce Hook]
    I -->|300ms delay| J[Filter Dataset]
    J --> B

    E --> K[🖥️ DOM: ~20 nodes<br/>instead of 50,000]

    style A fill:#1e3a5f,stroke:#64ffda,color:#e2e8f0
    style B fill:#2d1b69,stroke:#a78bfa,color:#e2e8f0
    style G fill:#4a3000,stroke:#fbbf24,color:#e2e8f0
    style K fill:#064e3b,stroke:#34d399,color:#e2e8f0
    style I fill:#1e293b,stroke:#94a3b8,color:#e2e8f0
```

## Running

```bash
npm install
npm run dev
```

Opens at `http://localhost:5174`

## Project Structure

```
src/
├── components/
│   ├── VirtualList.jsx        # Virtual scrolling container
│   ├── SearchBar.jsx          # Debounced search input
│   └── RecordRow.jsx          # Individual record renderer
├── hooks/
│   ├── useVirtualScroll.js    # Core virtual scroll logic
│   ├── useDebounce.js         # Debounce hook
│   └── usePagination.js       # Paginated data fetching
├── data/
│   └── mockApi.js             # Mock API with 50K records
├── App.jsx
└── main.jsx
```
