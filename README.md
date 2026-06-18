<div align="center">
  <h1>Ginnie AI 🧞‍♂️</h1>
  <p><strong>Your entire workday. One autonomous command center.</strong></p>
  <p>An AI-first communication platform that categorizes, summarizes, and automates your repetitive tasks — so you stop switching tabs and start getting things done.</p>
</div>

<div align="center">
  <a href="https://ginnieai.karanop.in"><strong>🌐 Live Demo - Try the fully working app.</strong></a><br/>
  <a href="https://ginnieai.karanop.in/reference"><strong>📚 API Reference - Stunning interactive Scalar API documentation.</strong></a><br/>
  <a href="https://ginnieai.karanop.in/pricing"><strong>💳 Pricing & Billing - See our subscription tiers and Razorpay integration.</strong></a>
</div>

---

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Agent Pipeline](#agent-pipeline)
- [Authentication](#authentication)
- [API Routes](#api-routes)
- [Plans and Billing](#plans-and-billing)
- [Payment Integration](#payment-integration)
- [Theming](#theming)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Deployment](#deployment)

---

## Overview

Ginnie AI integrates deeply with your essential workflow tools to function as an autonomous executive assistant. Users sign in seamlessly with **Clerk**, granting them immediate access to a unified workspace where they can:

- Utilize an **AI chat interface (Agentic mode)** where an AI agent can read emails, draft and send messages, create calendar events, and retrieve essential context.
- Leverage **Visual Workflow Automations** to build conditional logic (e.g., automatically scheduling a meeting when an email contains specific context).
- Configure **preferences and AI writing styles** so that auto-drafted responses sound exactly like you.
- Explore fully interactive API documentation powered by **Scalar** at `/reference`.

The platform enforces per-plan usage quotas and processes payments securely through **Razorpay**.

---

## Architecture

Ginnie AI utilizes a robust, modern full-stack architecture powered by **Next.js App Router** and **React Server Components**. 
- Heavy AI tasks and payment webhooks run securely on the server (`app/api`).
- Interactive dashboard UI and animation states are managed heavily via client components utilizing Framer Motion.

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript, Node.js
- **Styling:** Tailwind CSS, Framer Motion, Lucide React
- **Authentication:** Clerk
- **Monetization:** Razorpay
- **API Docs:** @scalar/nextjs-api-reference

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── (dashboard)/          # Protected routes (Billing, Inbox, Settings)
│   ├── api/                  # Backend API routes
│   │   ├── chat/             # AI Streaming endpoint
│   │   ├── checkout/         # Razorpay order generation
│   │   └── webhooks/         # Razorpay webhook listener
│   ├── reference/            # Scalar OpenAPI documentation route
│   └── page.tsx              # Animated landing page
├── components/               
│   └── landing/              # Marketing components (Hero, Automations, Pricing)
├── public/                   # Static assets
└── README.md
```

## Core Features

- **Inbox AI:** Triage and summarize incoming messages. Bubble up critical context.
- **Calendar AI:** Parse meeting requests and schedule automatically respecting "Deep Work".
- **Visual Automations:** Node-based workflow builder for chaining triggers and actions.
- **Smart Search:** Semantic retrieval across connected workflow tools.

## Agent Pipeline

The AI relies on system prompts that receive streaming connections to OpenAI. It determines user intent natively through Tool Calling to either query databases, fetch emails, or respond directly to the user.

## Authentication

Authentication is fully managed by **Clerk**.
- Middleware enforces protection across all `/(dashboard)` routes.
- Webhooks can be utilized to sync users from Clerk into the primary database.

## API Routes

Ginnie AI relies on Next.js Route Handlers rather than tRPC:
- `POST /api/chat`: Streams responses back using the AI SDK.
- `POST /api/checkout`: Creates a Razorpay order returning an `orderId`.
- `POST /api/webhooks/razorpay`: Listens for `payment.captured` to upgrade users securely.

*View the full schema visually at `/reference` using Scalar.*

## Plans and Billing

Users can upgrade from the Free tier to unlock higher API limits:
- **Free:** Basic testing and trial quotas.
- **Pro:** Perfect for professionals needing high daily task volumes.
- **Elite:** Unlimited power for heavy executive workflows.

## Payment Integration

Integrated directly with **Razorpay**. When a user clicks "Get Pro", an order is instantiated server-side. The Razorpay SDK handles the checkout overlay, and a strict server-side webhook guarantees that accounts are only upgraded when payment is cryptographically verified.

## Theming

Ginnie AI features a premium **Dark Mode** aesthetic.
- Deep blacks (`#050505`) to reduce eye strain.
- **Glassmorphism** heavily utilized on floating navbars and modals.
- Spring-physics animations powered by **Framer Motion** for a buttery-smooth UX.

## Environment Variables

To run the project, create a `.env` file:

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret...
```

## Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/ginnie-ai.git

# Install dependencies
npm install

# Run the local server
npm run dev
```

Navigate to `http://localhost:3000`.

## Deployment

Deploy effortlessly to Vercel:
1. Push your code to GitHub.
2. Import the repository in your Vercel Dashboard.
3. Add your Environment Variables.
4. Deploy!

---

<div align="center">
  <strong>Built with extreme focus on speed, enterprise security, and AI guardrails.</strong><br/>
  <em>Made with ❤️ by Karan.</em>
</div>
