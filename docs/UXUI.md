# UX / UI Philosophy

Ginnie AI is designed to look and feel like a premium, consumer-grade SaaS product, despite handling complex enterprise data. This document outlines our styling guidelines.

## 1. Dark Mode & Glassmorphism

The platform defaults to a sleek, modern dark mode. 

- **Backgrounds**: We use deep blacks (`#050505` and `#0a0a0a`) instead of bright whites to reduce eye strain for power users.
- **Glassmorphism**: Modals, navbars, and floating panels use `backdrop-blur` and semi-transparent backgrounds (`bg-white/5` or `bg-zinc-900/90`) to create a sense of depth and layering over the dark canvas.

## 2. Micro-Interactions (Framer Motion)

Every interaction should feel buttery-smooth and responsive.

- Elements like buttons, cards, and modal popups use `framer-motion` for spring-physics animations.
- Hover states include subtle `scale` increases (e.g., `hover:scale-105`) and glowing box-shadows.

## 3. The "Wow" Factor Components

We specifically engineered components to visually impress:
- **Typing Search Bar**: The Hero section features a simulated typing effect to demonstrate AI capabilities immediately upon page load.
- **Animated SVG Nodes**: The Automations section uses calculated SVG coordinates and glowing gradients to visually represent data flowing between triggers and actions.

## 4. Typography & Icons

- **Fonts**: We utilize system-native sans-serif fonts (via `next/font/google`) for maximum legibility and zero layout shift.
- **Icons**: `lucide-react` is used globally for clean, consistent, and scalable vector icons.
