# HackBama

Marketing site for HackBama, the build club at The University of Alabama.

## Stack

- Next.js 15 (App Router, static export)
- Tailwind CSS 3
- `next/font` for Bodoni Moda (display), Inter Tight (UI), JetBrains Mono (labels)
- Phosphor for icons

## Develop

```bash
pnpm install
pnpm dev
```

## Content

Copy and lists that change between semesters live in `lib/site.ts`: the GroupMe
invite, the meeting cadence, the event calendar, the mentorship topics, and the
officer roster. Editing that file is enough for most updates.

## Design tokens

Brand colors are CSS custom properties in `app/globals.css` and are surfaced to
Tailwind in `tailwind.config.ts` as `bone`, `paper`, `ink`, `crimson`, and
`rule`. The page is a single locked light theme, matching the brand card.

The Denny Chimes mark lives in `components/brand/Chimes.tsx`. It draws in
`currentColor` and knocks its circuit trace out in the page background color,
so it needs a bone-colored surface behind it.
