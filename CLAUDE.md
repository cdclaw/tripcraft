# CLAUDE.md — TripCraft

## What is this?
TripCraft is an AI-powered family trip planner SaaS. Users input destination, dates, travelers (including kid ages), budget, and interests. The AI generates a full day-by-day itinerary with:
- Nap-time optimization (user specifies kid nap window)
- Hidden gems + tourist spots
- Hotel zone recommendations
- Daily food budget
- Shareable trip URL

## Tech Stack
- Next.js 15 (App Router)
- Tailwind CSS + shadcn/ui
- TypeScript
- Anthropic Claude API (trip generation)
- Vercel deployment
- SQLite via better-sqlite3 (local) or Turso (production) for trip storage
- PostHog for analytics (optional, add if time)

## Architecture
```
/app
  /page.tsx          — Landing page + hero
  /plan/page.tsx     — Trip input form
  /trip/[id]/page.tsx — Generated trip view (shareable)
  /api/generate/route.ts — AI trip generation endpoint
  /api/trip/[id]/route.ts — Fetch saved trip
/lib
  /ai.ts             — Anthropic API integration
  /db.ts             — Trip storage
  /prompts.ts        — System prompts for trip generation
/components
  /TripForm.tsx
  /Itinerary.tsx
  /DayCard.tsx
  /Header.tsx
  /Footer.tsx
```

## Design
- Clean, modern, travel-inspired
- Mobile-first (most users will share on phone)
- Colors: warm palette — coral accent (#FF6B6B), dark navy (#1A1A2E), cream bg
- Big hero with tagline: "Your family trip, planned in 30 seconds"
- Trip output should look premium — like a travel magazine layout

## Key Behaviors
- No login required to generate a trip
- Each trip gets a unique shareable URL
- Email capture optional ("Save & get updates")
- Rate limit: 10 trips per IP per hour
- Nap optimization: if kids under 5, ask for nap window and block that time for hotel/rest

## Environment
- ANTHROPIC_API_KEY for AI generation
- Use claude-sonnet-4-6 for generation (fast + cheap enough)
- Deploy to Vercel

## Commands
- `npm run dev` — local dev
- `npm run build` — production build
- `npx vercel --prod` — deploy

## Quality Bar
- Must work on mobile
- Must load fast (<2s)
- Trip generation <15s
- Beautiful output that people WANT to share
- Zero bugs in the happy path
