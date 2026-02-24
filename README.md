# ZakatEase — زکوٰۃ ایز

A bilingual (Urdu / English) Zakat self-assessment calculator built with Next.js. Walks users through a step-by-step wizard to calculate their yearly Zakat obligation based on gold, silver, cash, investments, business assets, and deductions.

## Features

- **7-Step Wizard** — Guided flow covering cash & bank, precious metals, investments, business assets, other assets, deductions, and the final result with Nisab comparison.
- **Bilingual UI** — Full Urdu (Noto Nastaliq Urdu) and English (Inter) support with RTL layout. Language toggles instantly via cookie-based locale.
- **Multi-Currency Support** — Add multiple foreign currency accounts (USD, GBP, EUR, AED, SAR, USDT, or custom). Enter amounts in original currency with exchange rates — totals auto-convert to your primary currency.
- **Primary Currency Setting** — Choose any supported currency as your base for all calculations. Switching filters it from the foreign currency dropdown automatically.
- **Nisab Calculation** — Gold (7.5 tola) or Silver (52.5 tola) standard. Enter the current price per tola and the app determines whether Zakat is obligatory.
- **Helpful Tooltips** — Contextual guidance on trade goods vs. personal property, receivable debts, installment deductions, savings certificates, and more.
- **Animated Transitions** — Smooth step-to-step animations with Framer Motion.
- **Responsive & Mobile-First** — Clean, minimal design optimized for phone screens.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| i18n | [next-intl](https://next-intl.dev) (cookie-based locale) |
| Animations | [Framer Motion](https://motion.dev) |
| Fonts | Noto Nastaliq Urdu + Inter via `next/font/google` |
| React | React 19 with React Compiler |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/<your-username>/ZakatEase.git
cd ZakatEase

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/                  # Next.js App Router (layout, page, globals.css)
├── components/
│   ├── calculator/       # Wizard steps, currency inputs, result display
│   └── layout/           # Header, Footer, LanguageToggle
├── hooks/                # useZakatCalculation, useNumericInput
├── i18n/                 # next-intl request config
├── lib/                  # Types, constants, formatters
└── messages/             # en.json, ur.json translation files
```

## How Zakat is Calculated

1. **Total Assets (Section A)** — Sum of gold, silver, cash, bank balance, foreign currency, investments, trade goods, business assets, deposits, and receivables.
2. **Total Deductions (Section B)** — Sum of payable debts, committee balances, utility bills, party payments, employee salaries, previous unpaid Zakat, and current installments due.
3. **Net Zakatable Amount** — Total Assets minus Total Deductions (minimum 0).
4. **Nisab Check** — If net amount >= Nisab threshold (gold or silver tola price x tola count), Zakat is obligatory.
5. **Zakat** — Net Zakatable Amount / 40 (i.e., 2.5%).

## Deployment

Deploy on [Vercel](https://vercel.com) with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/<your-username>/ZakatEase)

Or build and serve anywhere that supports Node.js:

```bash
npm run build
npm run start
```

## License

MIT

## Disclaimer

This calculator is for **self-assessment only**. For specific Zakat rulings on your situation, please consult a qualified Islamic scholar.
