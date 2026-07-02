# Design Guidelines for OmniflowAI.agency

## Design Approach

**Selected Approach**: Reference-Based, drawing from high-converting SaaS and agency websites like Stripe, Webflow, and Linear for their professional credibility and conversion optimization.

**Core Principles**:
- Trust-building through visual hierarchy and white space
- Conversion-focused with strategic CTA placement
- Professional sophistication balanced with approachability
- Bilingual excellence with seamless RTL adaptation

---

## Typography System

**Font Stack** (via Google Fonts):
- Primary: Inter (body text, navigation, forms)
- Display: Space Grotesk (headlines, hero text)

**Hierarchy**:
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold, leading-tight
- Section Headlines: text-3xl md:text-4xl lg:text-5xl, font-bold
- Subheadlines: text-xl md:text-2xl, font-medium, opacity-80
- Body Text: text-base md:text-lg, leading-relaxed
- CTAs: text-lg font-semibold
- Small Text: text-sm for captions, metadata

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Section padding: py-16 md:py-24 lg:py-32
- Container gaps: gap-8 md:gap-12 lg:gap-16
- Card spacing: p-6 md:p-8
- Button padding: px-8 py-4

**Grid System**:
- Container: max-w-7xl mx-auto px-6 md:px-8
- Content sections: max-w-6xl for full-width features
- Text blocks: max-w-3xl for optimal readability

---

## Homepage Structure (8 Sections)

### 1. Hero Section
- Full-width layout with large hero image (modern office/tech workspace or abstract digital transformation visual)
- Asymmetric two-column: 60/40 split (headline/CTA left, supporting visual right on desktop)
- Height: min-h-[600px] md:min-h-[700px]
- Floating navigation bar (sticky, backdrop-blur effect)
- Primary CTA with backdrop-blur background when over image
- Trust indicator below CTA: "Trusted by 500+ businesses" with micro logos

### 2. Value Proposition Section
- Three-column grid on desktop (grid-cols-1 md:grid-cols-3)
- Icon + Headline + Description cards
- Each card: hover lift effect (transform translate-y)
- Background: subtle gradient overlay

### 3. Main Service Spotlight (Website Development)
- Two-column split layout: 50/50
- Left: Large feature image/mockup of dashboard
- Right: Headline, benefits list (checkmarks), CTA
- Reverse column order on alternating sections for visual variety

### 4. Secondary Services Grid
- Four-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Service cards with icon, title, brief description, "Learn More" link
- Hover state: border glow effect

### 5. Portfolio Showcase
- Masonry-style grid or carousel slider
- Project cards: image, client name, result metrics
- 3 featured projects with case study preview
- "View All Projects" CTA

### 6. Social Proof Section
- Three-column testimonial grid
- Client photo + quote + name/company
- Star ratings visible
- Background: light gradient

### 7. Bilingual Toggle Indicator
- Language switcher in header: pill-style toggle (EN | AR)
- Smooth transition with fade effect
- Flag icons optional beside text

### 8. Final CTA Section
- Centered, bold headline
- Two-CTA approach: Primary "Start Your Project" + Secondary "Schedule Consultation"
- Background: gradient with subtle pattern overlay
- Contact info footer integrated below

---

## Component Library

### Navigation
- Sticky header with backdrop-blur
- Logo left, menu center, language toggle + CTA right
- Mobile: hamburger menu with slide-in drawer
- Smooth scroll to sections with offset for sticky header

### Buttons
- Primary: Solid with hover scale (1.02), shadow-lg
- Secondary: Outline with hover fill
- Sizes: px-8 py-4 (default), px-6 py-3 (small)
- Backdrop-blur variants for image overlays

### Cards
- Border: 1px solid with subtle shadow
- Border-radius: rounded-xl
- Hover: lift with shadow increase
- Padding: p-6 md:p-8

### Forms (Contact Page)
- Two-column layout: Form (60%) + Info sidebar (40%)
- Input fields: Large touch targets (h-12), rounded-lg borders
- Labels: font-medium, mb-2
- Textarea: min-h-32
- Submit button: Full-width on mobile, auto on desktop
- Info sidebar: Office hours, response time, alternative contacts

### Icons
- Heroicons via CDN
- Consistent sizing: w-6 h-6 (standard), w-12 h-12 (feature cards)

---

## RTL Support (Arabic)

- Full layout mirroring with `dir="rtl"` attribute
- Typography: Maintain Inter with Arabic font fallback (Tajawal or Cairo)
- Navigation: Right-aligned menu items
- Grids: Reverse flex-direction where appropriate
- Forms: Label and input alignment reversed
- Icons: Horizontally flipped where directional (arrows, chevrons)

---

## Images Section

**Hero Section**: Large hero image - modern tech workspace showing collaboration or abstract digital transformation visual (dashboard screens, flowing data), positioned right side on desktop, full-width background on mobile

**Service Spotlight**: Dashboard/website mockup images showcasing clean, modern interface design

**Portfolio Section**: Client project screenshots - before/after comparisons, website examples, results dashboards

**About Page**: Team photo or office workspace image

**Placement Strategy**: Images used for credibility and visual storytelling, balanced with white space to maintain professional aesthetic

---

## Animations

- **Hero entrance**: Fade-up on headline and CTA (staggered, 0.2s delay)
- **Scroll reveals**: Fade-up on section entry (Intersection Observer)
- **Hover effects**: Scale (1.02-1.05) on cards and buttons
- **Page transitions**: Smooth fade (300ms) on navigation
- Keep subtle - prioritize performance over spectacle

---

## Service Pages Structure

- Hero: Service-specific headline + description + CTA
- Benefits section: Grid of value propositions
- Process timeline: 4-step visual walkthrough
- Pricing tiers (if applicable): 3-column comparison table
- FAQ accordion
- Bottom CTA section

---

## Trust Elements

- Client logos bar: Grayscale, hover to color
- Numerical stats: Large numbers with brief descriptors
- Certifications/awards: Badge display
- Testimonials: Photo + quote + attribution
- Case study metrics: Before/after numbers with percentage improvements

This design creates a comprehensive, conversion-optimized experience that balances professional credibility with modern web aesthetics, ensuring both English and Arabic users receive an exceptional experience.