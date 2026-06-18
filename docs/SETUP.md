# Setup & Installation

Follow these instructions to get Ginnie AI running locally on your machine.

## Prerequisites

- Node.js 18+
- npm or pnpm
- A Clerk Account (for authentication)
- A Razorpay Account (for payments/billing)

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/ginnie-ai.git
cd ginnie-ai
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Environment Variables

Create a `.env` or `.env.local` file in the root of the project. You will need to obtain API keys for the following services:

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret...
```

## 4. Run the Development Server

Start the local server:

```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

## 5. Production Build

To build the project for production deployment (e.g., on Vercel):

```bash
npm run build
npm run start
```
