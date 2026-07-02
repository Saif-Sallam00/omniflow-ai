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
- `routes.ts` - API endpoints:
  - `/api/contact` - Contact form submission
  - `/api/user`, `/api/login`, `/api/logout` - Admin authentication
  - `/api/projects` - Portfolio CRUD (GET public, POST/PATCH/DELETE require auth)
  - `/api/objects/*` - Image upload endpoints
- Contact form validation using Zod schemas

### Admin (`client/src/pages/admin/`)
- `Auth.tsx` - Admin login page
- `Dashboard.tsx` - Portfolio CMS (create, edit, delete projects)

### Shared (`shared/`)
- `schema.ts` - Zod schemas for contacts, users, and projects

## Features

### Bilingual Support
- Full English and Arabic translations in `i18n.tsx`
- RTL layout support for Arabic (`dir="rtl"` on document and body)
- Language toggle in navigation (globe icon)
- Persistent language selection (localStorage)

### Pages & Routing
- `/` - Home page (Featured Work section is hardcoded)
- `/about` - About page
- `/services` - Services overview
- `/services/:slug` - Individual service pages
  - `/services/website-development`
  - `/services/ai-agents`
  - `/services/automation`
  - `/services/digital-marketing`
- `/portfolio` - Portfolio/case studies (dynamic from database)
- `/contact` - Contact form
- `/admin/auth` - Admin login
- `/admin/dashboard` - Portfolio CMS (protected)

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
- **Colors**: Gunmetal (#0F172A) primary, Electric Gold (#F59E0B) accent
- **Components**: Shadcn UI library (buttons, cards, forms, etc.)
- **Interactions**: Hover/active elevation effects via `hover-elevate` and `active-elevate-2` utility classes
- **3-Pillar System**: build (Website/App), attract (Marketing), automate (AI/Automation)

## Environment Variables

### Required for Google Analytics
- `VITE_GA_MEASUREMENT_ID` - Google Analytics 4 measurement ID (e.g., "G-XXXXXXXXXX")

## Development
```bash
npm run dev
```

Runs Express server (backend) and Vite dev server (frontend) on port 5000.

## Admin Access
- **Login URL**: /admin/auth
- **Credentials**: username="admin", password="Admin@admin1234"

## Recent Changes
- January 27, 2026: UI Compliance and Accessibility Updates
  - All horizontal flex containers now include flex-wrap for responsive layout
  - Sticky headers use high z-index (z-[9999]) for proper layering
  - Textareas use rows attribute instead of explicit heights
  - ObjectUploader uses aspect-ratio containers for proper sizing
  - All interactive elements have data-testid attributes for testing
  - All meaningful display elements have data-testid attributes
  - Removed all custom hover/focus colors from interactive elements
  - Button components use standard variants without custom borders

- January 22, 2026: Admin CMS and Portfolio Integration
  - Added admin dashboard at /admin/dashboard (protected)
  - Portfolio CMS: create, edit, delete projects with image upload
  - Portfolio page now displays dynamic content from database
  - Updated to 3-pillar category system: build/attract/automate
  - Filter tabs on portfolio page: All Work, Build, Attract, Automate
  - Home page Featured Work remains hardcoded for stability
  - Fixed form validation for title/client/image fields

- November 21, 2024: Initial MVP build
  - Complete bilingual website with English/Arabic support
  - All pages (Home, About, Services, Portfolio, Contact)
  - Contact form with backend API integration
  - Google Analytics 4 integration
  - Responsive design with RTL support
  - Professional design adhering to agency standards
