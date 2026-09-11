import {
    CHIMES_FILLS,
    CHIMES_KNOCKOUT_CIRCLES,
    CHIMES_KNOCKOUT_RECTS,
    CHIMES_KNOCKOUT_STROKES,
    CHIMES_VIEWBOX,
} from "@/lib/chimes";
import { NIGHTS } from "@/lib/site";
import { stationById, type StationId } from "@/lib/stations";
import {
    BENCHES,
    BLOCKS,
    COMMITS,
    LAMPS,
    PLAZA_R,
    RING_R,
    ROOM,
    START,
    STATION_MAP,
    TOWER,
    TREES,
    WORLD,
    type Block,
    type Station,
    type Vec,
} from "./world";

export const C = {
    ink: "hsl(30, 10%, 16%)",
    lawn: "hsl(96, 16%, 31%)",
    plaza: "hsl(40, 20%, 48%)",
    path: "hsla(42, 32%, 82%, 0.26)",
    grid: "hsla(96, 22%, 44%, 0.22)",
    top: "hsl(32, 18%, 50%)",
    roof: "hsl(34, 20%, 56%)",
    front: "hsl(28, 15%, 38%)",
    edge: "hsla(36, 24%, 76%, 0.35)",
    window: "hsl(28, 14%, 30%)",
    windowLit: "hsl(44, 72%, 86%)",
    canopy: "hsl(108, 20%, 34%)",
    canopyLit: "hsl(102, 24%, 44%)",
    canopyDark: "hsl(112, 20%, 27%)",
    trunk: "hsl(26, 24%, 30%)",
    post: "hsl(35, 12%, 64%)",
    bone: "hsl(42, 30%, 92%)",
    boneDeep: "hsl(40, 22%, 84%)",
    boneDim: "hsl(40, 12%, 70%)",
    boneFaint: "hsl(36, 8%, 52%)",
    ruleDark: "hsl(30, 8%, 40%)",
    crimson: "hsl(349, 58%, 42%)",
    crimsonDim: "hsl(349, 45%, 36%)",
    ember: "hsl(350, 55%, 64%)",
    paper: "hsl(44, 40%, 96%)",
    lamp: "hsl(42, 66%, 80%)",
    rose: "hsl(350, 50%, 72%)",
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
    ctx.fill();
}

export type Player = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    face: 1 | -1;
    walk: number;
};

export type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    max: number;
    size: number;
    color: string;
    drag: number;
};

export type Firefly = {
    bx: number;
    by: number;
    ox: number;
    oy: number;
    ph: number;
    sp: number;
};

export type Scene = {
    ctx: CanvasRenderingContext2D;
    time: number;
    clockStart: number;
    player: Player;
    found: Set<StationId>;
    complete: boolean;
    completeAt: number;
    collected: Set<number>;
    particles: Particle[];
    fireflies: Firefly[];
    view: { x0: number; y0: number; x1: number; y1: number };
    mono: string;
    sans: string;
    reduced: boolean;
};

type Drawable = { key: number; draw: () => void };

const TAU = Math.PI * 2;
const pad2 = (n: number) => String(n).padStart(2, "0");

// ---------------------------------------------------------------- ground

export function drawGround(s: Scene) {
    const { ctx, view } = s;
    ctx.fillStyle = C.ink;
    ctx.fillRect(view.x0, view.y0, view.x1 - view.x0, view.y1 - view.y0);

    ctx.fillStyle = C.lawn;
    ctx.fillRect(40, 40, WORLD.w - 80, WORLD.h - 80);

    // Surveyor's grid, only the visible part.
    ctx.strokeStyle = C.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const step = 100;
    for (let x = Math.floor(view.x0 / step) * step; x < view.x1; x += step) {
        ctx.moveTo(x, view.y0);
        ctx.lineTo(x, view.y1);
    }
    for (let y = Math.floor(view.y0 / step) * step; y < view.y1; y += step) {
        ctx.moveTo(view.x0, y);
        ctx.lineTo(view.x1, y);
    }
    ctx.stroke();

    // Plaza under the tower, the ring path, and a spoke to every spot.
    ctx.fillStyle = C.plaza;
    ctx.beginPath();
    ctx.arc(TOWER.x, TOWER.y + 30, PLAZA_R, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = C.path;
    ctx.lineCap = "round";
    ctx.lineWidth = 46;
    ctx.beginPath();
    ctx.arc(TOWER.x, TOWER.y + 30, RING_R, 0, TAU);
    ctx.stroke();

    ctx.lineWidth = 36;
    ctx.beginPath();
    const targets: Vec[] = [...STATION_MAP, START, { x: ROOM.x, y: ROOM.y + ROOM.d / 2 + 20 }];
    for (const t of targets) {
        const a = Math.atan2(t.y - (TOWER.y + 30), t.x - TOWER.x);
        ctx.moveTo(TOWER.x + Math.cos(a) * RING_R, TOWER.y + 30 + Math.sin(a) * RING_R);
        ctx.lineTo(t.x, t.y);
    }
    ctx.stroke();
}

// ---------------------------------------------------------------- objects

function shadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, a = 0.35) {
    ctx.fillStyle = `rgba(20,30,16,${a * 0.5})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
    ctx.fill();
}

function drawBlock(s: Scene, b: Block, litFraction: number, doorOpen: boolean) {
    const { ctx } = s;
    const x0 = b.x - b.w / 2;
    const yFront = b.y + b.d / 2;
    const yBack = b.y - b.d / 2;

    shadow(ctx, b.x, yFront + 6, b.w / 2 + 10, 14, 0.3);

    ctx.fillStyle = C.front;
    ctx.fillRect(x0, yFront - b.h, b.w, b.h);
    ctx.fillStyle = C.top;
    ctx.fillRect(x0, yBack - b.h, b.w, b.d);
    ctx.fillStyle = C.roof;
    ctx.fillRect(x0 + 10, yBack - b.h + 10, b.w - 20, b.d - 20);
    ctx.strokeStyle = C.edge;
    ctx.lineWidth = 1;
    ctx.strokeRect(x0 + 0.5, yBack - b.h + 0.5, b.w - 1, b.d - 1);
    // A lit cornice line where the roof meets the front.
    ctx.fillStyle = "hsla(40, 30%, 85%, 0.25)";
    ctx.fillRect(x0, yFront - b.h - 1, b.w, 2);

    if (b.windows) {
        const [cols, rows] = b.windows;
        const cw = 14;
        const ch = 18;
        const gapX = (b.w - cols * cw) / (cols + 1);
        const gapY = (b.h - 20 - rows * ch) / (rows + 1);
        const total = cols * rows;
        const lit = Math.round(total * litFraction);
        let k = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const wx = x0 + gapX + c * (cw + gapX);
                const wy = yFront - b.h + gapY + r * (ch + gapY);
                // Lit windows are dealt out in a fixed shuffle so it looks lived in.
                const on = ((k * 7 + 3) % total) < lit;
                ctx.fillStyle = "hsla(30, 14%, 22%, 0.6)";
                ctx.fillRect(wx - 1, wy - 1, cw + 2, ch + 2);
                ctx.fillStyle = on ? C.windowLit : C.window;
                ctx.fillRect(wx, wy, cw, ch);
                k++;
            }
        }
    }

    if (b === ROOM) {
        const dw = 22;
        const dh = 34;
        ctx.fillStyle = doorOpen ? C.windowLit : C.ink;
        ctx.fillRect(b.x - dw / 2, yFront - dh, dw, dh);
        ctx.strokeStyle = doorOpen ? C.ember : C.edge;
        ctx.strokeRect(b.x - dw / 2 + 0.5, yFront - dh + 0.5, dw - 1, dh - 1);
    }
}

function drawTree(s: Scene, t: { x: number; y: number; r: number; s: number }) {
    const { ctx } = s;
    const sway = s.reduced ? 0 : Math.sin(s.time * 0.8 + t.x * 0.01) * 1.5;
    shadow(ctx, t.x + 6, t.y + 4, t.s * 0.95, t.s * 0.38, 0.4);
    ctx.fillStyle = C.trunk;
    ctx.fillRect(t.x - 3, t.y - 24, 6, 26);
    const cx = t.x + sway;
    const cy = t.y - 24 - t.s * 0.6;
    // Three lobes in shade, three in light, no outline.
    ctx.fillStyle = C.canopyDark;
    ctx.beginPath();
    ctx.arc(cx + t.s * 0.1, cy + t.s * 0.12, t.s, 0, TAU);
    ctx.arc(cx - t.s * 0.45, cy + t.s * 0.3, t.s * 0.6, 0, TAU);
    ctx.arc(cx + t.s * 0.5, cy + t.s * 0.28, t.s * 0.56, 0, TAU);
    ctx.fill();
    ctx.fillStyle = C.canopy;
    ctx.beginPath();
    ctx.arc(cx, cy - t.s * 0.02, t.s * 0.9, 0, TAU);
    ctx.arc(cx - t.s * 0.48, cy + t.s * 0.16, t.s * 0.52, 0, TAU);
    ctx.arc(cx + t.s * 0.46, cy + t.s * 0.14, t.s * 0.5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = C.canopyLit;
    ctx.beginPath();
    ctx.arc(cx - t.s * 0.22, cy - t.s * 0.3, t.s * 0.46, 0, TAU);
    ctx.arc(cx + t.s * 0.18, cy - t.s * 0.36, t.s * 0.3, 0, TAU);
    ctx.fill();
}

function drawLamp(s: Scene, l: Vec) {
    const { ctx } = s;
    shadow(ctx, l.x + 3, l.y + 2, 7, 3, 0.4);
    ctx.fillStyle = C.post;
    ctx.fillRect(l.x - 1.5, l.y - 60, 3, 60);
    ctx.fillStyle = C.trunk;
    ctx.fillRect(l.x - 4, l.y - 4, 8, 4);
    ctx.fillStyle = C.paper;
    ctx.beginPath();
    ctx.arc(l.x, l.y - 66, 6.5, 0, TAU);
    ctx.fill();
}

function drawBench(s: Scene, b: { x: number; y: number; w: number }) {
    const { ctx } = s;
    shadow(ctx, b.x, b.y + 4, b.w / 2 + 2, 4, 0.25);
    ctx.fillStyle = C.post;
    ctx.fillRect(b.x - b.w / 2 + 3, b.y - 6, 3, 10);
    ctx.fillRect(b.x + b.w / 2 - 6, b.y - 6, 3, 10);
    ctx.fillStyle = C.roof;
    ctx.fillRect(b.x - b.w / 2, b.y - 12, b.w, 7);
    ctx.fillStyle = C.top;
    ctx.fillRect(b.x - b.w / 2, b.y - 7, b.w, 2);
}

function drawTower(s: Scene) {
    const { ctx } = s;
    const sc = TOWER.h / CHIMES_VIEWBOX.height;
    const baseY = TOWER.y + TOWER.d / 2;
    const ox = TOWER.x - (CHIMES_VIEWBOX.width / 2) * sc;
    const oy = baseY - CHIMES_VIEWBOX.height * sc;

    shadow(ctx, TOWER.x, baseY + 6, 52, 16, 0.4);

    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(sc, sc);

    ctx.fillStyle = s.complete ? C.crimson : C.crimsonDim;
    for (const [x, y, w, h] of CHIMES_FILLS) ctx.fillRect(x, y, w, h);

    // Knockouts read as the plaza behind the tower. Once every light is on,
    // the trace itself burns ember.
    ctx.strokeStyle = s.complete ? C.paper : C.plaza;
    ctx.lineJoin = "round";
    for (const k of CHIMES_KNOCKOUT_STROKES) {
        ctx.lineWidth = k.width;
        ctx.lineCap = k.cap;
        ctx.stroke(new Path2D(k.d));
    }
    const nodes: Vec[] = [...CHIMES_KNOCKOUT_CIRCLES.map(([cx, cy]) => ({ x: cx, y: cy }))];
    CHIMES_KNOCKOUT_CIRCLES.forEach(([cx, cy, r], i) => {
        ctx.fillStyle = litNode(s, i) ? C.paper : C.plaza;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, TAU);
        ctx.fill();
    });
    for (const [x, y, w, h] of CHIMES_KNOCKOUT_RECTS) {
        ctx.fillStyle = litNode(s, 5) ? C.windowLit : C.plaza;
        ctx.fillRect(x, y, w, h);
        nodes.push({ x: x + w / 2, y: y + h / 2 });
    }
    ctx.restore();
}

function litNode(s: Scene, i: number) {
    const ids: StationId[] = ["board", "clock", "sign", "circle", "chat", "door"];
    return s.found.has(ids[i]);
}

/** World position of a tower node, for the light pass. */
export function towerNodePos(i: number): Vec {
    const sc = TOWER.h / CHIMES_VIEWBOX.height;
    const baseY = TOWER.y + TOWER.d / 2;
    const ox = TOWER.x - (CHIMES_VIEWBOX.width / 2) * sc;
    const oy = baseY - CHIMES_VIEWBOX.height * sc;
    if (i < 5) {
        const [cx, cy] = CHIMES_KNOCKOUT_CIRCLES[i];
        return { x: ox + cx * sc, y: oy + cy * sc };
    }
    const [x, y, w, h] = CHIMES_KNOCKOUT_RECTS[0];
    return { x: ox + (x + w / 2) * sc, y: oy + (y + h / 2) * sc };
}

function figure(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, bob = 0, scale = 1) {
    const h = 15 * scale;
    const w = 11 * scale;
    ctx.fillStyle = color;
    roundRect(ctx, x - w / 2, y - h + bob, w, h, 4 * scale);
    ctx.beginPath();
    ctx.arc(x, y - h - 4.5 * scale + bob, 5 * scale, 0, TAU);
    ctx.fill();
}

function drawStation(s: Scene, st: Station) {
    const { ctx, time } = s;
    const { x, y } = st;
    switch (st.id) {
        case "door": {
            shadow(ctx, x, y + 2, 20, 5, 0.3);
            ctx.fillStyle = C.top;
            ctx.fillRect(x - 18, y - 64, 36, 64);
            ctx.strokeStyle = C.edge;
            ctx.strokeRect(x - 18 + 0.5, y - 64 + 0.5, 35, 63);
            const g = ctx.createLinearGradient(0, y - 60, 0, y);
            g.addColorStop(0, C.paper);
            g.addColorStop(1, "hsla(44, 40%, 96%, 0.55)");
            ctx.fillStyle = g;
            ctx.fillRect(x - 14, y - 60, 28, 60);
            // The leaf, swung open toward you.
            ctx.fillStyle = C.crimson;
            ctx.beginPath();
            ctx.moveTo(x + 14, y - 60);
            ctx.lineTo(x + 30, y - 50);
            ctx.lineTo(x + 30, y + 6);
            ctx.lineTo(x + 14, y);
            ctx.closePath();
            ctx.fill();
            break;
        }
        case "board": {
            shadow(ctx, x, y + 2, 38, 5, 0.3);
            ctx.fillStyle = C.post;
            ctx.fillRect(x - 30, y - 34, 3, 34);
            ctx.fillRect(x + 27, y - 34, 3, 34);
            ctx.fillStyle = C.paper;
            ctx.fillRect(x - 38, y - 80, 76, 48);
            ctx.strokeStyle = C.edge;
            ctx.strokeRect(x - 38 + 0.5, y - 80 + 0.5, 75, 47);
            ctx.strokeStyle = C.crimson;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x - 30, y - 72, 18, 12);
            ctx.strokeRect(x - 2, y - 72, 18, 12);
            ctx.strokeRect(x + 14, y - 52, 18, 12);
            ctx.beginPath();
            ctx.moveTo(x - 12, y - 66);
            ctx.lineTo(x - 2, y - 66);
            ctx.moveTo(x + 7, y - 60);
            ctx.lineTo(x + 7, y - 52);
            ctx.lineTo(x + 14, y - 46);
            ctx.stroke();
            ctx.strokeStyle = C.ruleDark;
            ctx.beginPath();
            ctx.moveTo(x - 30, y - 48);
            ctx.lineTo(x - 6, y - 48);
            ctx.moveTo(x - 30, y - 42);
            ctx.lineTo(x - 12, y - 42);
            ctx.stroke();
            ctx.lineWidth = 1;
            break;
        }
        case "clock": {
            shadow(ctx, x, y + 2, 8, 3, 0.3);
            ctx.fillStyle = C.post;
            ctx.fillRect(x - 2, y - 70, 4, 70);
            ctx.fillStyle = C.ink;
            ctx.fillRect(x - 36, y - 96, 72, 28);
            ctx.strokeStyle = C.ember;
            ctx.strokeRect(x - 36 + 0.5, y - 96 + 0.5, 71, 27);
            const left = Math.max(0, 7200 - Math.floor(time - s.clockStart));
            const text = `${pad2(Math.floor(left / 3600))}:${pad2(Math.floor((left % 3600) / 60))}:${pad2(left % 60)}`;
            ctx.fillStyle = C.ember;
            ctx.font = `500 15px ${s.mono}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, x, y - 82);
            break;
        }
        case "sign": {
            shadow(ctx, x, y + 2, 84, 5, 0.3);
            ctx.fillStyle = C.post;
            ctx.fillRect(x - 70, y - 36, 3, 36);
            ctx.fillRect(x + 67, y - 36, 3, 36);
            ctx.fillStyle = C.ink;
            ctx.fillRect(x - 84, y - 68, 168, 32);
            ctx.strokeStyle = C.edge;
            ctx.strokeRect(x - 84 + 0.5, y - 68 + 0.5, 167, 31);
            ctx.save();
            ctx.beginPath();
            ctx.rect(x - 80, y - 66, 160, 28);
            ctx.clip();
            ctx.font = `500 14px ${s.mono}`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillStyle = C.ember;
            const text = NIGHTS.join("     /     ") + "     /     ";
            const w = ctx.measureText(text).width;
            const off = s.reduced ? 0 : (time * 42) % w;
            ctx.fillText(text, x - 80 - off, y - 52);
            ctx.fillText(text, x - 80 - off + w, y - 52);
            ctx.restore();
            break;
        }
        case "circle": {
            shadow(ctx, x, y + 2, 40, 12, 0.22);
            ctx.fillStyle = C.boneDeep;
            ctx.fillRect(x - 8, y - 6, 16, 9);
            ctx.fillStyle = C.ember;
            ctx.fillRect(x - 7, y - 16, 14, 10);
            for (let i = 0; i < 5; i++) {
                const a = -Math.PI / 2 + (i / 5) * TAU + 0.35;
                const px = x + Math.cos(a) * 36;
                const py = y + Math.sin(a) * 20 + 8;
                const bob = s.reduced ? 0 : Math.sin(time * 1.6 + i) * 1.2;
                figure(ctx, px, py, i % 2 ? C.boneDim : C.boneFaint, bob, 0.95);
            }
            break;
        }
        case "chat": {
            shadow(ctx, x, y + 2, 18, 5, 0.3);
            ctx.fillStyle = C.top;
            ctx.fillRect(x - 16, y - 64, 32, 64);
            ctx.strokeStyle = C.edge;
            ctx.strokeRect(x - 16 + 0.5, y - 64 + 0.5, 31, 63);
            ctx.fillStyle = "hsla(42, 30%, 92%, 0.14)";
            ctx.fillRect(x - 12, y - 58, 24, 34);
            ctx.fillStyle = C.ember;
            ctx.fillRect(x - 9, y - 54, 14, 5);
            ctx.fillStyle = C.bone;
            ctx.fillRect(x - 5, y - 46, 14, 5);
            ctx.fillStyle = C.ember;
            ctx.fillRect(x - 9, y - 38, 10, 5);
            // Seventy of them.
            for (let i = 0; i < 70; i++) {
                const a = (s.reduced ? 0 : time * 0.35 * (1 + (i % 5) * 0.12)) + i * 2.399;
                const r = 30 + 16 * Math.sin((s.reduced ? 0 : time * 0.7) + i * 0.9);
                const px = x + Math.cos(a) * r;
                const py = y - 30 + Math.sin(a) * r * 0.55;
                ctx.fillStyle = i % 9 === 0 ? C.ember : C.boneDim;
                ctx.globalAlpha = 0.55 + 0.4 * Math.sin(i + (s.reduced ? 0 : time * 2));
                ctx.fillRect(px - 1.2, py - 1.2, 2.4, 2.4);
            }
            ctx.globalAlpha = 1;
            break;
        }
        case "room":
            break;
    }
}

function drawPlayer(s: Scene) {
    const { ctx, player: p, time } = s;
    const speed = Math.hypot(p.vx, p.vy);
    const moving = speed > 12;
    const bob = moving ? Math.abs(Math.sin(p.walk)) * 2.2 : Math.sin(time * 2.2) * 0.6;
    const squash = 1 + Math.min(0.08, speed / 5000);

    shadow(ctx, p.x + 2, p.y + 1, 9, 3.5, 0.5);

    // Legs.
    ctx.fillStyle = C.trunk;
    const stride = moving ? Math.sin(p.walk) * 3 : 0;
    roundRect(ctx, p.x - 4.5 + stride, p.y - 7, 3.5, 7, 1.5);
    roundRect(ctx, p.x + 1 - stride, p.y - 7, 3.5, 7, 1.5);

    // Body and head.
    ctx.fillStyle = C.bone;
    roundRect(ctx, p.x - 7 * squash, p.y - 22 - bob, 14 * squash, 17, 5);
    ctx.fillStyle = C.boneDeep;
    ctx.beginPath();
    ctx.arc(p.x, p.y - 28 - bob, 6, 0, TAU);
    ctx.fill();
    // Hair.
    ctx.fillStyle = C.trunk;
    ctx.beginPath();
    ctx.arc(p.x, p.y - 29.5 - bob, 6, Math.PI * 1.05, Math.PI * 1.95);
    ctx.fill();

    // The laptop, held out in front.
    const lx = p.x + p.face * 8;
    ctx.fillStyle = C.trunk;
    roundRect(ctx, lx - 4.5, p.y - 13 - bob, 9, 3, 1);
    ctx.fillStyle = C.crimson;
    roundRect(ctx, lx - 4, p.y - 20 - bob, 8, 7, 1.5);
    ctx.fillStyle = C.rose;
    ctx.fillRect(lx - 2.5, p.y - 18.5 - bob, 5, 4);
}

function drawCommit(s: Scene, c: Vec, i: number) {
    const { ctx, time } = s;
    const bob = s.reduced ? 0 : Math.sin(time * 2.4 + i) * 3;
    shadow(ctx, c.x, c.y + 2, 5, 2, 0.3);
    ctx.save();
    ctx.translate(c.x, c.y - 10 - bob);
    ctx.rotate(s.reduced ? 0 : time * 1.2 + i);
    ctx.fillStyle = C.ember;
    ctx.fillRect(-4.5, -4.5, 9, 9);
    ctx.fillStyle = C.paper;
    ctx.fillRect(-1.5, -1.5, 3, 3);
    ctx.restore();
}

export function drawObjects(s: Scene) {
    const { ctx, view } = s;
    const items: Drawable[] = [];
    const visible = (x: number, y: number, m: number) =>
        x > view.x0 - m && x < view.x1 + m && y > view.y0 - m && y < view.y1 + m;

    const litFraction = s.found.size / 6;
    for (const b of BLOCKS) {
        if (!visible(b.x, b.y, 400)) continue;
        items.push({ key: b.y + b.d / 2, draw: () => drawBlock(s, b, b === ROOM ? litFraction : 0.35, s.complete) });
    }
    for (const t of TREES) {
        if (!visible(t.x, t.y, 120)) continue;
        items.push({ key: t.y, draw: () => drawTree(s, t) });
    }
    for (const l of LAMPS) {
        if (!visible(l.x, l.y, 120)) continue;
        items.push({ key: l.y, draw: () => drawLamp(s, l) });
    }
    for (const b of BENCHES) {
        if (!visible(b.x, b.y, 80)) continue;
        items.push({ key: b.y + 2, draw: () => drawBench(s, b) });
    }
    for (const st of STATION_MAP) {
        if (!visible(st.x, st.y, 200)) continue;
        items.push({ key: st.y + 4, draw: () => drawStation(s, st) });
    }
    if (visible(TOWER.x, TOWER.y, 500)) {
        items.push({ key: TOWER.y + TOWER.d / 2, draw: () => drawTower(s) });
    }
    COMMITS.forEach((c, i) => {
        if (s.collected.has(i) || !visible(c.x, c.y, 60)) return;
        items.push({ key: c.y, draw: () => drawCommit(s, c, i) });
    });
    items.push({ key: s.player.y, draw: () => drawPlayer(s) });

    items.sort((a, b) => a.key - b.key);
    for (const it of items) it.draw();
    ctx.lineWidth = 1;
}

// ---------------------------------------------------------------- lights

const gradientCache = new Map<string, CanvasGradient>();
function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha: number, squash = 1) {
    if (alpha <= 0.003) return;
    const key = `${r}|${color}`;
    let g = gradientCache.get(key);
    if (!g) {
        g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, color);
        g.addColorStop(0.45, color.replace(")", ", 0.35)").replace("hsl(", "hsla("));
        g.addColorStop(1, color.replace(")", ", 0)").replace("hsl(", "hsla("));
        gradientCache.set(key, g);
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, squash);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.restore();
}

export function drawLights(s: Scene) {
    const { ctx, view, time } = s;
    const visible = (x: number, y: number, m: number) =>
        x > view.x0 - m && x < view.x1 + m && y > view.y0 - m && y < view.y1 + m;
    ctx.globalCompositeOperation = "lighter";

    const warm = "hsl(42, 66%, 80%)";
    const rose = "hsl(350, 55%, 70%)";

    for (const l of LAMPS) {
        if (!visible(l.x, l.y, 240)) continue;
        const flicker = s.reduced ? 1 : 0.95 + 0.05 * Math.sin(time * 6 + l.x);
        glow(ctx, l.x, l.y - 20, 200, warm, 0.11 * flicker, 0.65);
    }

    for (const st of STATION_MAP) {
        if (!visible(st.x, st.y, 260)) continue;
        const found = s.found.has(st.id);
        const isRoom = st.id === "room";
        const pulse = s.reduced ? 0.5 : 0.5 + 0.5 * Math.sin(time * 1.8 + st.x);
        const base = isRoom ? (s.complete ? 0.22 : 0.08) : found ? 0.1 : 0.1 + 0.08 * pulse;
        glow(ctx, st.x, st.y - 20, isRoom ? 220 : 160, warm, base, 0.65);
        if (st.id === "door") glow(ctx, st.x, st.y + 4, 90, warm, 0.22, 0.45);
        if (st.id === "circle") glow(ctx, st.x, st.y - 10, 60, rose, 0.22, 0.6);
        if (!found && !isRoom && !s.reduced) {
            // A beacon ring so the unfound spots are visible from far off.
            const t = (time * 0.5 + st.x * 0.01) % 1;
            ctx.globalAlpha = (1 - t) * 0.28;
            ctx.strokeStyle = C.paper;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(st.x, st.y, st.r * (0.4 + t * 1.6), st.r * (0.4 + t * 1.6) * 0.55, 0, 0, TAU);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }

    for (let i = 0; i < 6; i++) {
        if (!litNode(s, i)) continue;
        const n = towerNodePos(i);
        glow(ctx, n.x, n.y, 30, warm, 0.5);
    }
    if (s.complete) {
        const age = Math.min(1, (time - s.completeAt) / 3);
        const breathe = s.reduced ? 1 : 0.85 + 0.15 * Math.sin(time * 1.4);
        glow(ctx, TOWER.x, TOWER.y - 120, 400, warm, 0.16 * age * breathe);
        glow(ctx, ROOM.x, ROOM.y + ROOM.d / 2 + 10, 170, warm, 0.24 * age, 0.5);
    }

    COMMITS.forEach((c, i) => {
        if (s.collected.has(i) || !visible(c.x, c.y, 60)) return;
        glow(ctx, c.x, c.y - 10, 26, rose, 0.28);
    });

    glow(ctx, s.player.x + s.player.face * 8, s.player.y - 10, 80, warm, 0.1, 0.7);

    ctx.globalCompositeOperation = "source-over";
}

// ---------------------------------------------------------------- fx

export function drawParticles(s: Scene) {
    const { ctx } = s;
    for (const p of s.particles) {
        ctx.globalAlpha = Math.max(0, p.life / p.max);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
}

export function drawFireflies(s: Scene) {
    const { ctx, time, view } = s;
    for (const f of s.fireflies) {
        const x = f.bx + Math.sin(time * f.sp + f.ph) * 38 + f.ox;
        const y = f.by + Math.cos(time * f.sp * 0.8 + f.ph * 1.3) * 26 + f.oy;
        if (x < view.x0 || x > view.x1 || y < view.y0 || y > view.y1) continue;
        const a = Math.pow(Math.sin(time * 2.6 + f.ph), 2);
        ctx.globalAlpha = 0.15 + 0.7 * a;
        ctx.fillStyle = f.ph % 2 > 1 ? C.rose : C.paper;
        ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
    }
    ctx.globalAlpha = 1;
}

export function drawLabels(s: Scene) {
    const { ctx, player } = s;
    ctx.font = `500 13px ${s.sans}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    for (const st of STATION_MAP) {
        const d = Math.hypot(st.x - player.x, st.y - player.y);
        if (d > 210) continue;
        const a = Math.min(1, (210 - d) / 70);
        const content = stationById(st.id);
        const lift = st.id === "board" ? 92 : st.id === "clock" ? 108 : st.id === "sign" ? 80 : st.id === "room" ? 30 : 78;
        ctx.globalAlpha = a;
        ctx.fillStyle = "hsla(30, 12%, 14%, 0.85)";
        const w = ctx.measureText(content.label).width + 16;
        roundRect(ctx, st.x - w / 2, st.y - lift - 14, w, 20, 3);
        ctx.fillStyle = s.found.has(st.id) ? C.boneDim : C.bone;
        ctx.fillText(content.label, st.x, st.y - lift);
    }
    ctx.globalAlpha = 1;
}

const vignetteCache = new Map<string, CanvasGradient>();
export function drawVignette(ctx: CanvasRenderingContext2D, vw: number, vh: number) {
    const key = `${vw}x${vh}`;
    let g = vignetteCache.get(key);
    if (!g) {
        g = ctx.createRadialGradient(vw / 2, vh / 2, Math.min(vw, vh) * 0.3, vw / 2, vh / 2, Math.max(vw, vh) * 0.75);
        g.addColorStop(0, "rgba(40,34,26,0)");
        g.addColorStop(1, "rgba(40,34,26,0.38)");
        vignetteCache.set(key, g);
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, vw, vh);
}

/**
 * Screen-space arrows at the edge of the view, one per unfound light that is
 * off screen. The beacons are visible from far away on a laptop; on a phone
 * the view is small enough that a nudge helps.
 */
export function drawEdgeMarkers(
    ctx: CanvasRenderingContext2D,
    vw: number,
    vh: number,
    cam: { x: number; y: number; zoom: number },
    found: Set<StationId>,
    time: number
) {
    const inset = 26;
    for (const st of STATION_MAP) {
        if (st.id === "room" || found.has(st.id)) continue;
        const sx = (st.x - cam.x) * cam.zoom + vw / 2;
        const sy = (st.y - 40 - cam.y) * cam.zoom + vh / 2;
        if (sx > -10 && sx < vw + 10 && sy > -10 && sy < vh + 10) continue;
        const dx = sx - vw / 2;
        const dy = sy - vh / 2;
        const scale = Math.min((vw / 2 - inset) / Math.abs(dx || 1e-6), (vh / 2 - inset) / Math.abs(dy || 1e-6));
        const mx = vw / 2 + dx * scale;
        const my = vh / 2 + dy * scale;
        const a = Math.atan2(dy, dx);
        const pulse = 0.55 + 0.45 * Math.sin(time * 3 + st.x);
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(a);
        ctx.globalAlpha = 0.35 + 0.5 * pulse;
        ctx.fillStyle = C.paper;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-6, -6);
        ctx.lineTo(-3, 0);
        ctx.lineTo(-6, 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}
