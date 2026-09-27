# Document Dashboard

A modern, responsive **document management admin dashboard** — browse, search, organize, and track documents through a clean tabbed interface with analytics views, a documents table, notifications center, and a settings panel. Built as a fully client-side Next.js app with dark/light theming.

## What it does

- **Dashboard view** — overview cards and charts summarizing document activity, plus recent-activity feeds
- **Documents view** — sortable, filterable documents table with card layouts, category filters, and a search bar
- **Notifications view** — notifications center for document events
- **Settings view** — theme switcher, theme selector, and app settings
- **AI chatbot widget** — floating chat assistant widget embedded in the dashboard
- **Theming** — dark/light mode via a theme context provider, customizable with the theme selector
- **Loading screen** — branded splash screen while the dashboard initializes
- **Responsive layout** — collapsible sidebar navigation, adapts from mobile to desktop

## Tech stack

| Layer        | Tech |
|--------------|------|
| Framework    | Next.js 15 (App Router, static export) |
| Language     | TypeScript |
| UI           | React 19, Tailwind CSS, shadcn/ui (Radix primitives) |
| Tables       | TanStack React Table (virtualized tables) |
| Charts       | Recharts |
| Forms        | React Hook Form + Zod |
| Icons        | Lucide React |
| Theming      | next-themes + custom theme context |

## Quick start

Prerequisites: Node.js 18+.

```bash
npm install          # or: pnpm install
npm run dev          # dev server at http://localhost:3000
```

Build a static export:

```bash
npm run build        # outputs to ./out
```

Serve the static build:

```bash
npx serve out        # or deploy ./out anywhere static
```

## Project structure

```
app/                # Next.js App Router pages (page, layout, loading)
components/         # Feature components (sidebar, dashboard-content,
                    # documents-view, notifications-content, settings-content,
                    # ai-chatbot-widget, loading-screen, …)
components/ui/      # shadcn/ui primitives
contexts/           # Theme context provider
lib/                # Shared utilities (cn, etc.)
styles/             # Global styles
public/             # Static assets
```

## Environment variables

None required — the app runs entirely client-side with no backend or API keys.

## Deployment

The project is configured for static export (`output: "export"` in `next.config.mjs`). `npm run build` produces the `./out` directory, which can be hosted on GitHub Pages, Netlify, Cloudflare Pages, or any static host.

Live demo: https://girishlade111.github.io/document-dashboard/

---

Built by Girish Lade — https://ladestack.in
