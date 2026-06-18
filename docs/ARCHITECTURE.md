# Ginnie AI Backend Architecture

Ginnie AI utilizes a robust, modern full-stack architecture powered by **Next.js App Router** and **React Server Components**. This document outlines the core patterns and rules for development.

## 1. Next.js App Router Philosophy

We use the App Router (`app/` directory) to heavily leverage Server Components. This minimizes the JavaScript bundle sent to the client and allows direct database/API access securely from the server.

- `page.tsx`: Defines the UI for a route.
- `layout.tsx`: Defines shared UI (like sidebars and navbars) that wraps routes.
- `route.ts`: Defines backend API endpoints (inside `app/api/`).

## 2. Authentication (Clerk)

We use **Clerk** for all authentication and user management.

- `middleware.ts`: Protects all routes under `/(dashboard)` and redirects unauthenticated users to `/sign-in`.
- `auth()` from `@clerk/nextjs/server` is used in Server Components and API routes to securely retrieve the `userId`.
- No raw passwords or sessions are managed locally; everything is delegated to Clerk's highly secure infrastructure.

## 3. Payments & Webhooks (Razorpay)

Monetization is handled through Razorpay.

- `/api/checkout`: Initiates the Razorpay order and returns an Order ID to the frontend.
- `/api/webhooks/razorpay`: A secure endpoint that listens for successful payment webhooks (`payment.captured`), verifies the cryptographic signature, and upgrades the user's account tier in the database.

## 4. AI Workflows & State Management

- **Client State**: Complex UI states (like the node-based Automation Builder) are managed via React `useState` and `useEffect`, leveraging Framer Motion for smooth visual updates.
- **AI Processing**: Heavy AI tasks are executed on the server to protect API keys and ensure fast execution, with results streamed or returned to the client asynchronously.
