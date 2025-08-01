# Next.js 14+ with TypeScript and Strict Linting Guidelines

This project uses Next.js 14 (App Router) with TypeScript, aiming for high code quality, strict type safety, clear separation of server-side and client-side code, and maximizing the benefits of Server-Side Rendering (SSR).

## Key Principles:

1.  **Strict Type Safety (TypeScript):**
    * All code should be strictly typed. Avoid `any` as much as possible.
    * Functions, component props, and API responses must have explicit types.
    * We use `tsconfig.json` with `"strict": true` and `@typescript-eslint/recommended-requiring-type-checking` ESLint rules.
    * Always consider edge cases for null/undefined values and union types.

2.  **ESLint Compliance:**
    * Adhere to all ESLint rules defined in `.eslintrc.json`.
    * Pay close attention to `@typescript-eslint` rules for type safety and `react-hooks` rules for correct Hook usage.
    * Import statements should be sorted (`simple-import-sort`).

3.  **Clear Server/Client Separation:**
    * **Server Components (Default):**
        * Used for data fetching (e.g., database queries, external API calls with sensitive keys), heavy computation, and rendering static/initial UI.
        * Do not use React Hooks (`useState`, `useEffect`, etc.) in Server Components.
        * Do not directly access browser APIs (e.g., `window`, `localStorage`).
        * Sensitive logic (DB access, API keys) must remain on the server.
        * Files without `"use client";` at the top are Server Components.
        * Server-only utility functions should ideally reside in `src/lib/server/`.
    * **Client Components (Opt-in):**
        * Used for interactive UI (e.g., button clicks, form submissions, state management), event listeners, and browser-specific APIs.
        * Must include `"use client";` at the very top of the file.
        * Files representing Client Components can optionally be named with a `.client.tsx` suffix (e.g., `MyComponent.client.tsx`).
        * Client-only utility functions should ideally reside in `src/lib/client/`.
    * **Data Flow:** Data can be passed from Server Components to Client Components as props, but not vice versa (unless using Server Actions).

4.  **Maximizing SSR Benefits:**
    * **Initial Load Performance:** Prioritize fetching necessary data in Server Components/Route Handlers to render complete HTML on the server.
    * **SEO:** Ensure critical content is available in the initial server-rendered HTML for search engine crawlers.
    * **Reduced Client JavaScript:** Aim to shift as much rendering and data fetching logic as possible to the server to minimize client-side bundle size and execution time.

## Project Structure Conventions:

* `src/app/`: Next.js App Router pages and layouts. Default to Server Components.
* `src/components/`: Reusable React components. Use `.client.tsx` for Client Components.
* `src/lib/server/`: Server-only utilities, database connections, API wrappers using sensitive keys.
* `src/lib/client/`: Client-only utilities, browser-specific APIs.
* `src/lib/types/`: Shared TypeScript type definitions.

---

**Example Scenario for Gemini:**

When asked to generate a component, always consider whether it needs client-side interactivity.
* If it involves state (`useState`), effects (`useEffect`), or browser events, it's a Client Component and needs `"use client";`.
* If it's purely for display or fetches data once for initial render, it's likely a Server Component.

**Please generate code that strictly follows these guidelines.**