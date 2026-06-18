# Ginnie AI 🧞‍♂️

Ginnie AI is a powerful enterprise intelligence platform that puts your inbox, calendar, and daily workflows on autopilot. It categorizes, summarizes, and automates repetitive communication tasks to help knowledge workers focus on impact rather than busywork.

## Features ✨

- **Inbox AI:** Your inbox reads itself, drafts contextual responses, and bubbles up only what matters.
- **Calendar AI:** Automated scheduling that respects your deep work blocks and seamlessly integrates with Google Calendar & Outlook.
- **Smart Search:** Semantic retrieval across all your connected apps. Find the information you need in seconds.
- **Automations:** Build custom workflows using an intuitive visual node builder. Automatically summarize daily emails, auto-reply to specific senders, and schedule meetings based on email context.

## Tech Stack 🛠️

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom sleek dark-mode aesthetics.
- **Authentication:** [Clerk](https://clerk.dev/)
- **Payments:** [Razorpay](https://razorpay.com/) (For Pro & Elite tiers)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started 🚀

First, clone the repository and install the dependencies:

```bash
npm install
```

Set up your environment variables. Create a `.env` or `.env.local` file and add the required API keys (Clerk, Razorpay, etc.):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Razorpay Variables (For Payments)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure 📁

- `/app`: The main Next.js App Router containing pages, layouts, and API routes.
  - `/(dashboard)`: Protected dashboard routes for authenticated users.
  - `/api`: Backend API endpoints (e.g., checkout and webhooks).
  - `/sign-in` & `/sign-up`: Clerk authentication pages.
- `/components/landing`: High-fidelity interactive UI components for the marketing landing page.
- `/components`: Shared reusable components (Sidebar, Navbar, etc.).
- `/lib`: Helper functions and shared configurations.

## Built With Love ❤️
Made by Karan.
