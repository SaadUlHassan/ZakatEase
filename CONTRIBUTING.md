# Contributing to ZakatEase

Thanks for your interest in contributing! This document covers the guidelines to keep the codebase clean and consistent.

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
git clone https://github.com/<your-username>/ZakatEase.git
cd ZakatEase
npm install
npm run dev
```

## Development Workflow

1. **Fork the repo** and create a branch from `main`.
2. **Make your changes** — keep PRs focused on a single concern.
3. **Ensure quality gates pass** before pushing:
   ```bash
   npm run lint        # ESLint
   npx tsc --noEmit    # Type-check
   npm run build       # Production build
   ```
4. **Open a PR** against `main`. Fill out the PR template.

## Code Standards

- **TypeScript only** — no `.js` or `.jsx` files in `src/`.
- **Strict mode** — `tsconfig.json` has `"strict": true`. Fix all type errors.
- **Tailwind CSS v4** — use utility classes. No inline styles unless unavoidable (e.g., `appearance: none` select arrows).
- **No hardcoded strings** — all user-facing text goes through `next-intl`. Update both `src/messages/en.json` and `src/messages/ur.json`.
- **RTL awareness** — use logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`) where possible. Test in both Urdu (RTL) and English (LTR).
- **Minimal dependencies** — don't add packages without discussion. Open an issue first.

## Project Conventions

| Convention   | Example                                                        |
| ------------ | -------------------------------------------------------------- |
| Components   | PascalCase, one per file (`CurrencyInput.tsx`)                 |
| Hooks        | `use` prefix (`useNumericInput.ts`)                            |
| Types        | Defined in `src/lib/types.ts`                                  |
| Constants    | UPPER_SNAKE_CASE in `src/lib/constants.ts`                     |
| Translations | Nested keys matching section structure (`sectionA.gold.label`) |

## What Makes a Good PR

- Solves one problem
- Includes both `en.json` and `ur.json` changes if touching UI text
- Doesn't break the build
- Doesn't introduce `any` types
- Keeps bundle size in check — no large library additions without justification
