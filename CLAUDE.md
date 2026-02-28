# Aura (灵气) — Claude Memory

## Project Overview

Aura is a Chinese-language AI relationship advisor app. It helps users track romantic/social relationships, get AI-driven consultation, and do daily self-reflection. The UI is in Chinese throughout.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS variables (glassmorphism design system) |
| Animations | `motion` library (Framer Motion fork) |
| State | Zustand v5 |
| Icons | lucide-react |
| Fonts | Noto Sans SC / PingFang SC (Chinese font stack) |
| Backend | None yet — all mock data, client-side only |

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Public landing page
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Design tokens + global styles
│   ├── (auth)/             # Login / Register
│   ├── dashboard/          # Main app hub + mirror page
│   ├── onboarding/         # 4-step onboarding flow
│   └── relationship/[id]/  # Relationship detail (feed + AI chat)
├── components/
│   ├── landing/            # Hero, Decoder, Mirror, Planner, CTA screens
│   ├── auth/               # LoginForm, RegisterForm
│   ├── dashboard/          # BentoGrid, cards, nav, modals
│   ├── relationship/       # FeedItem, InputBar, MagicMenu
│   ├── onboarding/         # Step components
│   ├── mirror/             # ChatTestModal, ReflectionTimeline
│   └── shared/             # GlassCard, GradientButton, GradientBackground, Logo
├── stores/                 # Zustand stores (auth, onboarding, dashboard, relationship)
├── types/                  # user.ts, relationship.ts, common.ts
├── data/                   # Mock data (users, relationships, feed, reflections)
├── lib/                    # constants.ts, utils.ts, animations.ts, fonts.ts
└── hooks/                  # Custom React hooks
```

## State Management (Zustand)

Four stores, all in `src/stores/`:

| Store | Key | Persisted | Owns |
|-------|-----|-----------|------|
| `useAuthStore` | `aura-auth` | Yes (full) | isAuthenticated, user, hasCompletedOnboarding |
| `useOnboardingStore` | `aura-onboarding` | Yes (full) | currentStep, nickname, birthday, gender, orientation, relationshipStatus, consultantVibe |
| `useDashboardStore` | `aura-dashboard` | Partial (mirrorAnswers only) | user, relationships, dailyQuestion, mirrorAnswers, reflections |
| `useRelationshipStore` | — | No | relationship, feed, isLoaded |

## Data Layer

Currently **mock data only** — no real backend:

- `src/data/mock-user.ts` — single user object
- `src/data/mock-relationships.ts` — 4 hardcoded relationships (Alex, 小雨, Leo, 晓晓)
- `src/data/mock-feed.ts` — feed items per relationship
- `src/data/mock-reflections.ts` — reflection history

AI responses are generated **client-side** using keyword pattern matching (no API calls).

## Design System

**Color palette** (CSS variables in `globals.css`):

```
--color-void: #0a0a12          (darkest bg)
--color-cosmos: #12101f
--color-nebula: #1c1a2e
--color-stardust: #2a2745
--color-aurora-start: #7c3aed  (purple gradient)
--color-aurora-mid: #a855f7
--color-aurora-end: #c084fc
--color-glow-pink: #f472b6
--color-glow-cyan: #22d3ee
--color-glow-amber: #fbbf24
--color-text-primary: #f0eef6
--color-text-secondary: #a8a3c0
--color-text-tertiary: #6b6589
```

**Glassmorphism tokens:**
```
--glass-bg: rgba(255,255,255,0.06)
--glass-border: rgba(255,255,255,0.10)
--glass-blur: 16px
```

**Utility classes** (from `globals.css`):
- `.glass-card` — standard card style
- `.text-gradient` — aurora gradient text
- `.btn-glow` — glowing CTA button

**Animation presets** (`src/lib/animations.ts`):
- `smoothSpring`, `gentleFade`, `staggerContainer`, `slideInLeft/Right`, `scaleIn`, `glowPulse`

## Key Features

1. **Landing Page** — 5 animated screens (Hero → Decoder → Mirror → Planner → CTA)
2. **Auth** — Login / Register (client-side only, stored in Zustand + localStorage)
3. **Onboarding** — 4 steps: Identity → Orientation → Status → Vibe (fox 🦊 / dog 🐶 / owl 🦉)
4. **Dashboard** — Bento grid: Daily Mirror card + My Aura card + Relationship list
5. **Relationship Detail** — Chat-style feed, AI consultation by keyword, Magic Menu (date plans / gift lists / SOS replies)
6. **Daily Mirror** — Rotating self-reflection questions (7-day cycle), AI insight generation

## Navigation Flow

```
Landing → Register/Login → Onboarding (first time) → Dashboard
Dashboard → Relationship Detail (/relationship/[id])
Dashboard → Mirror (/dashboard/mirror)
All inner pages ← Bottom Nav
```

## Coding Conventions

- All UI text in **Chinese**
- `"use client"` on any interactive component
- Components use **PascalCase**; stores use `use` prefix
- Mobile-first responsive (`md:` breakpoint for desktop)
- `max-w-lg mx-auto` for inner page containers
- `pb-safe` for bottom safe area on mobile
- Dynamic import with `ssr: false` for canvas/animation components (e.g., GradientBackground)
- Props interfaces defined in the same file as the component
- GlassCard, GradientButton, GradientBackground are the primary shared primitives

## Relationship Types

```typescript
type RelationshipType = "crush" | "partner" | "ex" | "friend" | "complicated"
type RelationshipStatus = "active" | "paused" | "ended"
type ConsultantVibe = "fox" | "dog" | "owl"
```

## FeedItem Types

```typescript
type FeedItemType = "message" | "screenshot" | "voice" | "date-plan" | "gift-list" | "sos-reply"
```

## Future Integration Points

- Real backend/API for auth, user data, relationships, AI calls
- Actual LLM API for consultation responses (currently keyword-matched)
- Push notifications for daily mirror reminders
- Screenshot upload and OCR for message analysis
