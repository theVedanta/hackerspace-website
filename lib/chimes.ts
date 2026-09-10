/**
 * Denny Chimes with a circuit trace running up the shaft, redrawn from the
 * HackBama brand card. One geometry, drawn two ways: as an SVG mark and as
 * a sampled particle field in the hero.
 *
 * Fills are the tower. Knockouts are cut out of the tower in the surface
 * color: belfry columns, the circuit trace, and the door.
 */
export const CHIMES_VIEWBOX = { width: 120, height: 440 } as const;

export type Rect = readonly [x: number, y: number, w: number, h: number];

export const CHIMES_FILLS: readonly Rect[] = [
    [26, 0, 68, 12],
    [33, 14, 54, 9],
    [33, 27, 54, 46],
    [30, 75, 60, 10],
    [36, 87, 48, 8],
    [41, 97, 38, 252],
    [28, 351, 64, 14],
    [22, 367, 76, 73],
];

export const CHIMES_KNOCKOUT_STROKES: readonly {
    d: string;
    width: number;
    cap: "butt" | "round";
}[] = [
    { d: "M43 27v46M52 27v46M60 27v46M68 27v46M77 27v46", width: 4, cap: "butt" },
    { d: "M60 128v42l-11 11v30", width: 3.5, cap: "round" },
    { d: "M60 196l11 11v34", width: 3.5, cap: "round" },
    { d: "M60 236v34l-11 11v28", width: 3.5, cap: "round" },
    { d: "M71 262v46", width: 3.5, cap: "round" },
];

export const CHIMES_KNOCKOUT_CIRCLES: readonly (readonly [
    cx: number,
    cy: number,
    r: number,
])[] = [
    [60, 126, 6],
    [49, 212, 6],
    [71, 242, 6],
    [49, 310, 6],
    [71, 308, 6],
];

export const CHIMES_KNOCKOUT_RECTS: readonly Rect[] = [[49, 399, 22, 41]];
