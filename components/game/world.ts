import type { StationId } from "@/lib/stations";

/**
 * The Quad. World units are pixels at zoom 1. Everything with a footprint is
 * centered on (x, y); `w` runs along x, `d` along y, and `h` is how tall it
 * is drawn, standing up out of the ground.
 */
export const WORLD = { w: 2200, h: 1500 } as const;

export type Block = {
    x: number;
    y: number;
    w: number;
    d: number;
    h: number;
    /** Window columns and rows on the front face. */
    windows?: [cols: number, rows: number];
};
export type Tree = { x: number; y: number; r: number; s: number };
export type Lamp = { x: number; y: number };
export type Bench = { x: number; y: number; w: number };
export type Station = { id: StationId; x: number; y: number; r: number };
export type Vec = { x: number; y: number };

export const TOWER = { x: 1100, y: 700, w: 80, d: 48, h: 330 } as const;
export const START: Vec = { x: 1100, y: 1000 };
export const PLAZA_R = 190;
export const RING_R = 280;

export const ROOM: Block = { x: 1100, y: 150, w: 300, d: 130, h: 118, windows: [7, 2] };

export const BLOCKS: Block[] = [
    ROOM,
    { x: 340, y: 150, w: 380, d: 120, h: 96, windows: [8, 2] },
    { x: 1860, y: 150, w: 380, d: 120, h: 96, windows: [8, 2] },
    { x: 100, y: 720, w: 130, d: 420, h: 84, windows: [2, 4] },
    { x: 2100, y: 720, w: 130, d: 420, h: 84, windows: [2, 4] },
    { x: 380, y: 1400, w: 440, d: 110, h: 88, windows: [9, 2] },
    { x: 1820, y: 1400, w: 440, d: 110, h: 88, windows: [9, 2] },
];

export const STATION_MAP: Station[] = [
    { id: "door", x: 560, y: 480, r: 62 },
    { id: "board", x: 1660, y: 430, r: 62 },
    { id: "clock", x: 1780, y: 990, r: 62 },
    { id: "sign", x: 600, y: 1090, r: 70 },
    { id: "circle", x: 1380, y: 1240, r: 70 },
    { id: "chat", x: 400, y: 790, r: 62 },
    { id: "room", x: 1100, y: 250, r: 66 },
];

export const BENCHES: Bench[] = [
    { x: 880, y: 1010, w: 44 },
    { x: 1320, y: 1010, w: 44 },
    { x: 1420, y: 620, w: 44 },
    { x: 780, y: 620, w: 44 },
    { x: 1000, y: 340, w: 44 },
    { x: 1200, y: 340, w: 44 },
];

// Deterministic scatter so the map is the same for everyone.
function rng(seed: number) {
    let s = seed >>> 0;
    return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

function inBlock(p: Vec, pad = 0) {
    return BLOCKS.some(
        (b) =>
            p.x > b.x - b.w / 2 - pad &&
            p.x < b.x + b.w / 2 + pad &&
            p.y > b.y - b.d / 2 - pad &&
            p.y < b.y + b.d / 2 + pad
    );
}

function clearOfLandmarks(p: Vec, stationPad: number, towerPad: number) {
    if (inBlock(p, 40)) return false;
    if (dist(p, TOWER) < towerPad) return false;
    if (dist(p, START) < 120) return false;
    return STATION_MAP.every((s) => dist(p, s) > stationPad);
}

function scatter(count: number, seed: number, ok: (p: Vec, placed: Vec[]) => boolean) {
    const r = rng(seed);
    const out: Vec[] = [];
    let guard = 0;
    while (out.length < count && guard++ < 5000) {
        const p = { x: 60 + r() * (WORLD.w - 120), y: 60 + r() * (WORLD.h - 120) };
        if (ok(p, out)) out.push(p);
    }
    return out;
}

export const TREES: Tree[] = scatter(46, 7, (p, placed) => {
    if (!clearOfLandmarks(p, 150, 340)) return false;
    // Keep the ring path and the spokes walkable.
    const dt = dist(p, TOWER);
    if (Math.abs(dt - RING_R) < 70) return false;
    return placed.every((q) => dist(p, q) > 95);
}).map((p, i) => {
    const r = rng(100 + i);
    return { x: p.x, y: p.y, r: 10, s: 30 + r() * 22 };
});

export const LAMPS: Lamp[] = [
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        return { x: TOWER.x + Math.cos(a) * (RING_R + 40), y: TOWER.y + Math.sin(a) * (RING_R + 40) };
    }),
    { x: 640, y: 380 },
    { x: 1560, y: 340 },
    { x: 1880, y: 880 },
    { x: 700, y: 1180 },
    { x: 1500, y: 1330 },
    { x: 320, y: 900 },
    { x: 940, y: 260 },
    { x: 1260, y: 260 },
];

export const COMMITS: Vec[] = scatter(20, 21, (p, placed) => {
    if (!clearOfLandmarks(p, 90, 230)) return false;
    if (TREES.some((t) => dist(p, t) < 50)) return false;
    if (LAMPS.some((l) => dist(p, l) < 30)) return false;
    return placed.every((q) => dist(p, q) > 140);
});

/** Node on the tower's trace that each light spot switches on. */
export const TOWER_NODE: Record<Exclude<StationId, "room">, number> = {
    board: 0,
    clock: 1,
    sign: 2,
    circle: 3,
    chat: 4,
    door: 5,
};
