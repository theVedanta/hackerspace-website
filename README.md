# HackBama

Marketing site for HackBama, the build club at The University of Alabama.

## Stack

- Next.js 15 (App Router), React 19, Tailwind CSS 3
- Motion (`motion/react`) for scroll-linked and entrance animation
- Lenis for inertial scrolling
- Raw WebGL2 for the hero particle field, Canvas 2D for the game
- `next/font` for Inter Tight (headlines and UI), Bodoni Moda (wordmark and
  the one italic accent per headline), JetBrains Mono (clocks, HUD, labels)
- Phosphor for icons

## Develop

```bash
pnpm install
pnpm dev
```

## How the page is built

The pitch is one sentence: everybody says next semester, HackBama is the room
where it becomes tonight. The page acts that out.

- **Hero** (`components/hero/`): the Denny Chimes mark, sampled into a field
  of points and drawn in WebGL2. The section is pinned; the first stretch of
  scroll drives a `--night` custom property from 0 to 1, which turns the sky
  from bone to ink, lights the tower's circuit trace, and scrambles the
  headline from the excuse to the answer. The pointer pushes a wake through
  the particles. If WebGL is unavailable the printed SVG mark renders instead.
- **Why**: the manifesto, one word resolving at a time as it scrolls into
  the middle of the viewport.
- **Cadence**: a pinned horizontal pan across the three meeting types. The
  first two carry a switched-off clock; the mini-hackathon's clock is
  running. Vertical stack on phones.
- **Nights**: the single marquee. Two rows, opposite directions, speed and
  lean follow scroll velocity.
- **Play** (`components/game/`): Breakout, where the bricks are the excuses
  from `lib/site.ts`. Two minutes, three balls, synth sound with a mute
  toggle. The Konami code anywhere on the page scrolls here and starts a
  round.
- **Join**: the crimson close.

Every animation degrades under `prefers-reduced-motion`: the sky still turns
but nothing drifts, the marquee becomes a grid, the pan becomes a stack, and
the particle field renders once and holds. Components that swap markup for
the reduced case read `useReduce()` from `lib/useReduce.ts`, which is false
on the server and first client render so hydration always matches.

## Content

Copy and lists that change between semesters live in `lib/site.ts`: the
GroupMe invite, the meeting cadence, the event calendar, the mentorship
topics, the officer roster, and the wall of excuses in the game.

## Design tokens

Brand colors are CSS custom properties in `app/globals.css`, surfaced to
Tailwind in `tailwind.config.ts`. The page lives on `ink` with `bone` text;
`crimson` is the accent on light surfaces and `ember` (crimson lifted to pass
AA against ink) on dark ones. The `sky-*` utilities interpolate between the
day and night values of a color using `--night`, so the nav and the hero copy
turn with the sky.

Corners are square everywhere. The Denny Chimes geometry lives once, in
`lib/chimes.ts`, and is drawn by both `components/brand/Chimes.tsx` and the
particle sampler in `components/hero/field.ts`.
