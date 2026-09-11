# HackBama

The site for HackBama, the build club at The University of Alabama. The whole
site is a game: a night walk across the Quad where every lit spot teaches you
one thing about the club.

## Stack

- Next.js 15 (App Router), React 19, Tailwind CSS 3
- Canvas 2D for the world, Motion (`motion/react`) for the HTML on top of it
- `next/font` for Inter Tight (UI and cards), Bodoni Moda (wordmark and the
  title's italic accent), JetBrains Mono (HUD, the clock, the marquee)
- Phosphor for icons

## Develop

```bash
pnpm install
pnpm dev
```

## How the game works

You are a student with a glowing laptop, dropped south of Denny Chimes. Six
lit spots stand around the Quad: a door standing alone on the lawn, a
whiteboard, a clock counting down two hours, an LED marquee of the nights, a
circle of upperclassmen around one laptop, and a kiosk swarmed by seventy
dots. Walk into one and a card opens. Close it and one of the six knockouts
on the tower's circuit trace lights up, the room at the top of the Quad
gains a lit window, and you level up: Lurker, Curious, Showed up, Builder,
Shipper, Regular, Member. Light all six and the chimes play, the trace burns
ember, and the room's door opens. Twenty crimson commits are scattered
around the lawn for anyone who likes a clean tree.

WASD or arrows walk, Shift runs. On phones, touching anywhere drops a thumb
stick under your finger. Fireflies scatter when you walk through them.
Arrows at the edge of the screen point at lights you have not found yet.
Progress is saved in `localStorage`.

The journal (top right, or from the title screen) lists everything found
and has a "just show me everything" link, so nobody has to play to read.
The same content is also in the DOM as visually hidden text for crawlers
and screen readers, and the Join button is always in the HUD.

Under `prefers-reduced-motion` there is no intro pan, no fireflies, no
particles, no shake, and the marquee holds still.

## Where things live

- `lib/stations.ts`: every card's copy, the level names, and which spots
  count as lights. `lib/site.ts` still holds the raw lists (nights, topics,
  officers) and the GroupMe link.
- `components/game/world.ts`: the map. Buildings, benches, lamps, where each
  spot stands, and a seeded scatter for the trees and the commits so the
  Quad is the same for everyone.
- `components/game/engine.ts`: the loop, movement and collision, the camera
  and its intro pan, spot triggers, collectibles, and the finale.
- `components/game/render.ts`: everything drawn. Ground and paths, the
  y-sorted 2.5D objects, the tower with its lit nodes, each spot's prop, the
  additive light pass, particles, fireflies, labels, and the vignette.
- `components/game/Game.tsx`: the React host. Owns the canvas, keyboard and
  thumb-stick input, the HUD, cards, journal, toasts, and saving.
- `components/game/audio.ts`: the synth. Oscillators and envelopes; the
  finale plays the Westminster quarters as bells.

## Design tokens

Brand colors are CSS custom properties in `app/globals.css`, surfaced to
Tailwind in `tailwind.config.ts`, and mirrored as HSL strings at the top of
`render.ts` for the canvas. The page lives on `ink` with `bone` text;
`crimson` is the tower and `ember` (crimson lifted to pass AA against ink) is
every light. Corners are square everywhere. The Denny Chimes geometry lives
once, in `lib/chimes.ts`, and is drawn by both the SVG mark and the canvas.
