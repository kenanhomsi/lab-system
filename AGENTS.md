<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# 🏥 Project-Specific Rules for Doctor System

## Tech Stack

- Next.js 15+ with App Router
- i18n for multilingual support (messages folder)
- TypeScript with strict mode

## Key Conventions

- All new pages must be Server Components unless they need client interactivity
- Use route groups `(auth)`, `(dashboard)` for organizing routes without affecting URLs
- See `README_ARCHITECTURE.md` for the BFF + DI layering (frontend services → `/api/*` → backend services → upstream).

## Database & Auth

- Use Prisma for database operations
- Authentication via NextAuth.js
- All server actions must validate input with Zod

## Code Quality Rules

- NO `any` type allowed (ESLint will fail the build)
- All components must have proper JSDoc comments
- Server Components cannot use `useState`, `useEffect`, or browser APIs
