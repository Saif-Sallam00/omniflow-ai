# OmniflowAI.agency Website

## Overview
Professional, high-converting bilingual (English/Arabic) agency website for OmniflowAI showcasing custom website development, AI agents, automation, and digital marketing services.

## Project Structure

### Frontend (`client/src/`)
- **Pages**:
  - `Home.tsx` - Hero section, value propositions, services, portfolio, testimonials, final CTA
  - `About.tsx` - Company values, team info, stats
  - `Portfolio.tsx` - Case studies and project showcases
  - `Services.tsx` - Service overview grid
  - `ServiceDetail.tsx` - Individual service pages (website-development, ai-agents, automation, digital-marketing)
  - `Contact.tsx` - Contact form with TanStack Query mutation

- **Components**:
  - `Navigation.tsx` - Sticky header with language toggle, responsive mobile menu
  - `Footer.tsx` - Footer with links organized by sections

- **Libraries**:
  - `i18n.tsx` - Bilingual support (EN/AR) with RTL handling
  - `analytics.ts` - Google Analytics 4 integration
  - `queryClient.ts` - TanStack Query setup

### Backend (`server/`)
- `routes.ts` - Contact form API endpoint (`/api/contact`)
- Contact form validation using Zod schemas

### Shared (`shared/`)
- `schema.ts` - Contact form validation schema

## Features

### Bilingual Support
- Full English and Arabic translations in `i18n.tsx`
- RTL layout support for Arabic (`dir="rtl"` on document and body)
- Language toggle in navigation (globe icon)
- Persistent language selection (localStorage)

### Pages & Routing
- `/` - Home page
- `/about` - About page
- `/services` - Services overview
- `/services/:slug` - Individual service pages
  - `/services/website-development`
  - `/services/ai-agents`
  - `/services/automation`
  - `/services/digital-marketing`
- `/portfolio` - Portfolio/case studies
- `/contact` - Contact form

### Contact Form
- Form validation using React Hook Form + Zod
- TanStack Query mutation for API calls
- Loading and error states
- Toast notifications for success/error
- Fields: name, email, phone (optional), company (optional), service selection, message

### Google Analytics
- GA4 integration with `VITE_GA_MEASUREMENT_ID` environment variable
- Automatic page view tracking on route changes
- Event tracking capability
- Graceful handling when GA key is not provided

### Design System
- **Fonts**: Inter (body), Space Grotesk (display/headings)
- **Colors**: Blue primary (#217 91% 60%), green success, clean grays
- **Components**: Shadcn UI library (buttons, cards, forms, etc.)
- **Interactions**: Hover/active elevation effects via `hover-elevate` and `active-elevate-2` utility classes

## Environment Variables

### Required for Google Analytics
- `VITE_GA_MEASUREMENT_ID` - Google Analytics 4 measurement ID (e.g., "G-XXXXXXXXXX")

## Development
```bash
npm run dev
```

Runs Express server (backend) and Vite dev server (frontend) on port 5000.

## Recent Changes
- November 21, 2024: Initial MVP build
  - Complete bilingual website with English/Arabic support
  - All pages (Home, About, Services, Portfolio, Contact)
  - Contact form with backend API integration
  - Google Analytics 4 integration
  - Responsive design with RTL support
  - Professional design adhering to agency standards
