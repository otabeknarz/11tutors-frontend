# 11Tutors Frontend (Public-Facing)

## Overview

Next.js 15.3 public-facing website for the 11Tutors education platform. Students browse courses, register, complete onboarding, enroll via Stripe payments, and watch video lessons. Supports i18n (English, Russian, Spanish) via `next-intl`.

**Port:** 3000 (default)
**Backend API:** `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:8000`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.3.3 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI Components | shadcn/ui (New York style) + Radix UI primitives |
| Styling | Tailwind CSS 4 + `tailwindcss-animate` |
| State | React Context (Auth, Onboarding, Language) + Zustand |
| Forms | React Hook Form + Zod validation |
| HTTP | Axios (with JWT interceptors) |
| i18n | `next-intl` 4.5 (cookie-based locale) |
| Payments | Stripe.js (`@stripe/stripe-js`) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Theming | `next-themes` (system/light/dark) |
| Fonts | Inter + JetBrains Mono (Google Fonts) |

---

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout (providers: NextIntl, Theme, Auth, Onboarding)
│   ├── page.tsx                # Landing page (hero, courses, CTA)
│   ├── globals.css             # Global styles + CSS variables
│   ├── (public)/               # Public routes (no auth required)
│   │   ├── layout.tsx          # Public layout (spacing logic)
│   │   ├── courses/
│   │   │   ├── page.tsx        # Course listing with filters
│   │   │   └── [slug]/         # Course detail + lesson pages
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── onboarding/         # 5-step onboarding flow
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── step1-5/
│   │   ├── for-tutors/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   └── tutors/page.tsx
│   └── (protected)/            # Auth-required routes
│       ├── layout.tsx          # Protected layout (auth check + AppNav sidebar)
│       └── dashboard/
│           ├── page.tsx        # Dashboard home
│           ├── home/
│           ├── courses/
│           ├── profile/
│           ├── payment-success/
│           └── payment-cancel/
├── components/
│   ├── ui/                     # 46 shadcn/ui components
│   ├── landing/                # Landing page sections
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedCourses.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── ForTutors.tsx
│   │   ├── Testimonials.tsx
│   │   ├── JoinCommunity.tsx
│   │   ├── CtaBanner.tsx
│   │   └── Footer.tsx
│   ├── course/                 # Course detail components
│   │   ├── CourseHero.tsx
│   │   ├── CourseCurriculum.tsx
│   │   ├── CourseTabs.tsx
│   │   ├── CourseStates.tsx
│   │   └── CourseThumbnailCard.tsx
│   ├── lesson/                 # Lesson viewer components
│   │   ├── VideoPlayer.tsx     # VdoCipher player
│   │   ├── CourseNavigation.tsx
│   │   ├── CommentsSection.tsx
│   │   ├── LessonContent.tsx
│   │   ├── LessonTabs.tsx
│   │   ├── LessonActions.tsx
│   │   └── ShareOptions.tsx
│   ├── navigation/
│   │   └── AppNav.tsx          # Dashboard sidebar navigation
│   ├── LanguageSwitcher.tsx
│   ├── ThemeToggle.tsx
│   ├── OnboardingProgress.tsx
│   └── ProtectedRoute.tsx
├── lib/
│   ├── api.ts                  # Axios instance + JWT interceptors + auth functions
│   ├── constants.ts            # API endpoint URLs
│   ├── AuthContext.tsx          # Auth provider (login, register, logout, updateProfile)
│   ├── OnboardingContext.tsx    # 5-step onboarding state (localStorage-persisted)
│   ├── LanguageContext.tsx      # i18n hook wrapper (next-intl)
│   ├── payment.ts              # Stripe checkout utilities
│   ├── enrollmentManager.ts    # Enrollment logic (auth check → payment → navigate)
│   ├── localStorage-polyfill.ts
│   ├── utils.ts                # cn() utility
│   └── stores/                 # Zustand stores (empty)
├── i18n/
│   ├── config.ts               # Locale definitions (en, ru, es)
│   └── request.ts              # Server-side locale resolution (cookie-based)
├── messages/
│   ├── en.json                 # English translations
│   ├── ru.json                 # Russian translations
│   └── es.json                 # Spanish translations
├── types/
│   └── course.ts               # Course, CoursePart, Lesson, Review, Filters types
├── hooks/
│   ├── use-media-query.ts
│   └── use-mobile.ts
├── middleware.ts               # Auth redirect middleware (login/register ↔ dashboard)
├── next.config.ts              # Image domains + next-intl plugin
├── tailwind.config.js          # shadcn/ui theme config
├── components.json             # shadcn/ui config
├── package.json
└── tsconfig.json
```

---

## Key Contexts & State

### AuthContext (`lib/AuthContext.tsx`)
- **State:** `user`, `loading`, `error`
- **Actions:** `login()`, `register()`, `logout()`, `updateUserProfile()`, `clearError()`
- Stores JWT tokens in `localStorage` (`accessToken`, `refreshToken`)
- Also sets `accessToken` cookie for middleware

### OnboardingContext (`lib/OnboardingContext.tsx`)
- **5-step flow:** University → Age → Degree → Graduation Year → Interests
- Persisted in `localStorage` key `11tutors-onboarding`
- Per-user tracking via `currentUserId` / `onboardingUserId`
- Submits to `POST /api/auth/onboarding-answers/`

### LanguageContext (`lib/LanguageContext.tsx`)
- Wraps `next-intl` `useTranslations()` hook
- Language stored in `locale` cookie (365 days)
- Supported: `en`, `ru`, `es`

---

## API Client (`lib/api.ts`)

- Axios instance with `baseURL` from env
- **Request interceptor:** Attaches `Bearer <token>` header
- **Response interceptor:** Auto-refreshes token on 401, retries original request
- Exported functions: `registerUser()`, `loginUser()`, `refreshToken()`, `getUser()`, `updateUser()`, `logoutUser()`

---

## Enrollment Flow (`lib/enrollmentManager.ts`)

1. Check if user is authenticated → redirect to `/login` if not
2. If already enrolled → navigate to first lesson
3. If not enrolled → `initiatePayment(courseId)`:
   - `POST /api/payments/payments/` → get `checkout_session_id`
   - Redirect to Stripe Checkout
   - On success → Stripe webhook creates Enrollment → redirect to `/dashboard/payment-success`

---

## Middleware (`middleware.ts`)

- Runs on `/(protected)/:path*`, `/login`, `/register`
- Reads `accessToken` from cookies
- Logged-in users on `/login` or `/register` → redirect to `/dashboard`
- Unauthenticated users on protected paths → redirect to `/login`

---

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Running Locally

```bash
cd frontend
npm install
cp env.template .env.local  # Fill in values
npm run dev  # http://localhost:3000 (Turbopack)
```

---

## Image Domains (next.config.ts)

- `localhost:8000` (dev backend)
- `api.11-tutors.com` (production backend)
- `images.unsplash.com` (placeholder images)
- `*.r2.cloudflarestorage.com` (Cloudflare R2 media)
