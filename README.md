# Trempi V2 - Event Transportation Platform

A production-ready SaaS platform for organizing transportation to events. Built with React 19, TypeScript, Vite, Tailwind CSS, ShadCN UI, and Supabase.

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase project ([supabase.com](https://supabase.com))

### Setup

```bash
# Install dependencies
npm install

# Copy environment file and add your Supabase credentials
cp .env.example .env

# Run the database migration in your Supabase SQL Editor
# File: src/db/schema.sql

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Database Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Paste and run the contents of `src/db/schema.sql`
4. Enable Realtime for tables: `transportations`, `transportation_requests`, `notifications`
5. Create a Storage bucket named `avatars` (public)

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS 4 + ShadCN UI |
| Backend | Supabase (Auth, DB, Realtime, Storage) |
| State | TanStack Query |
| Routing | React Router v7 |
| Validation | Zod |
| Animation | Framer Motion |
| Icons | Lucide React |
| i18n | Custom (English + Arabic RTL) |

## Features

- Multi-language support (English LTR / Arabic RTL)
- Dark mode with system preference detection
- Event creation with unique shareable codes
- 5 transportation types (Car, Taxi, Bus, Shuttle, Other)
- Bus route builder with multiple stops
- Smart ride matching
- Real-time updates via Supabase Realtime
- QR code sharing
- Responsive mobile-first design
- Role-based access (User / Organizer / Admin)

## Project Structure

```
src/
├── components/
│   ├── ui/          # ShadCN components
│   ├── layout/      # Header, Footer, MobileNav, AppLayout
│   └── shared/      # EventCard, TransportCard, ShareModal, etc.
├── pages/
│   ├── home/        # Landing page sections
│   ├── auth/        # Login, Register, ForgotPassword, Profile
│   ├── events/      # Create, Detail, List, Transport dialogs
│   ├── dashboard/   # User & Organizer dashboard
│   └── search/      # Search with filters
├── hooks/           # Custom React hooks
├── services/        # Supabase service layer
├── providers/       # Context providers (Auth, Theme, i18n, Query)
├── locales/         # Translation files (en.json, ar.json)
├── types/           # TypeScript interfaces
├── lib/             # Utilities (supabase client, cn, constants)
├── config/          # Route definitions
└── db/              # SQL schema migration
```
