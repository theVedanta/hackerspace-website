import { LIGHT_IDS, type StationId } from "@/lib/stations";
import type { SoundBank } from "./audio";
import {
    BENCHES,
    BLOCKS,
    COMMITS,
    START,
    STATION_MAP,
    TOWER,
    TREES,
    LAMPS,
    WORLD,
} from "./world";
import {
    C,
    drawFireflies,
    drawEdgeMarkers,
    drawGround,
    drawLabels,
    drawObjects,
    drawParticles,
    type Player,
    type Scene,
} from "./render";

export type Mode = "title" | "intro" | "play";

export type QuadEvents = {
    onStation(id: StationId): void;
    onCollect(index: number, total: number): void;
    onComplete(): void;
    onMode(mode: Mode): void;
};

export type Quad = {
    begin(): void;
    setInput(x: number, y: number, sprint: boolean): void;
    setPaused(paused: boolean): void;
    /** Light a spot. With fx, celebrate it; without, just restore state. */
    find(id: StationId, fx: boolean): void;
    restore(found: StationId[], collected: number[]): void;
    resize(): void;
    destroy(): void;
};

type RectC = { x0: number; y0: number; x1: number; y1: number };
type CircC = { x: number; y: number; r: number };

const PLAYER_R = 8;
const WALK = 240;
const SPRINT = 380;

function buildColliders() {
    const rects: RectC[] = [];
    const circles: CircC[] = [];
    const rect = (x: number, y: number, w: number, d: number) =>
        rects.push({ x0: x - w / 2, y0: y - d / 2, x1: x + w / 2, y1: y + d / 2 });

    for (const b of BLOCKS) rect(b.x, b.y, b.w, b.d);
    for (const b of BENCHES) rect(b.x, b.y - 4, b.w, 12);
    rect(TOWER.x, TOWER.y, TOWER.w, TOWER.d);
    for (const t of TREES) circles.push({ x: t.x, y: t.y - 4, r: t.r });
    for (const l of LAMPS) circles.push({ x: l.x, y: l.y - 2, r: 5 });
    for (const st of STATION_MAP) {
        switch (st.id) {
            case "door":
                rect(st.x + 6, st.y - 2, 48, 8);
                break;
            case "board":
                rect(st.x, st.y - 3, 76, 8);
                break;
            case "sign":
                rect(st.x, st.y - 3, 168, 8);
                break;
            case "chat":
                rect(st.x, st.y - 3, 32, 8);
                break;
            case "clock":
                circles.push({ x: st.x, y: st.y - 2, r: 5 });
                break;
            case "circle":
                rect(st.x, st.y - 4, 18, 10);
                break;
        }
    }
    return { rects, circles };
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function createQuad(
    canvas: HTMLCanvasElement,
    opts: { sounds: SoundBank; events: QuadEvents; reduced: boolean }
): Quad | null {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return null;
    const { sounds, events, reduced } = opts;

    const style = getComputedStyle(canvas);
    const mono = style.getPropertyValue("--font-mono").trim() || "ui-monospace, monospace";
    const sans = style.getPropertyValue("--font-sans").trim() || "system-ui, sans-serif";

    const { rects, circles } = buildColliders();

    const player: Player = { x: START.x, y: START.y, vx: 0, vy: 0, face: 1, walk: 0 };
    const input = { x: 0, y: 0, sprint: false };
    const cam: { x: number; y: number; zoom: number } = { x: TOWER.x, y: TOWER.y - 150, zoom: 1 };
    let zoomBase = 1;
    let vw = 1;
    let vh = 1;
    let dpr = 1;
    let mode: Mode = "title";
    let paused = false;
    let introT = 0;
    let introFrom = { x: 0, y: 0, zoom: 1 };
    const inside = new Set<StationId>();
    let dustTimer = 0;
    let shake = 0;
    let time = 0;
    let last = 0;
    let raf = 0;
    let destroyed = false;

    const scene: Scene = {
        ctx,
        time: 0,
        clockStart: 0,
        player,
        found: new Set<StationId>(),
        complete: false,
        completeAt: 0,
        collected: new Set<number>(),
        particles: [],
        fireflies: [],
        view: { x0: 0, y0: 0, x1: 0, y1: 0 },
        mono,
        sans,
        reduced,
    };

    if (!reduced) {
        let seed = 91;
        const r = () => {
            seed = (seed * 16807) % 2147483647;
            return seed / 2147483647;
        };
        for (let i = 0; i < 80; i++) {
            scene.fireflies.push({
                bx: 80 + r() * (WORLD.w - 160),
                by: 80 + r() * (WORLD.h - 160),
                ox: 0,
                oy: 0,
                ph: r() * 6.283,
                sp: 0.35 + r() * 0.5,
            });
        }
    }

    const burst = (x: number, y: number, n: number, colors: string[], power = 1, spread = 12) => {
        if (reduced) return;
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const v = (60 + Math.random() * 200) * power;
            scene.particles.push({
                x: x + (Math.random() - 0.5) * spread,
                y: y + (Math.random() - 0.5) * spread,
                vx: Math.cos(a) * v,
                vy: Math.sin(a) * v * 0.7 - 40 * power,
                life: 0.5 + Math.random() * 0.7,
                max: 1.2,
                size: 2 + Math.random() * 4,
                color: colors[(Math.random() * colors.length) | 0],
                drag: 3,
            });
        }
    };

    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        vw = Math.max(1, rect.width);
        vh = Math.max(1, rect.height);
        canvas.width = Math.round(vw * dpr);
        canvas.height = Math.round(vh * dpr);
        // Close on the character. Phones see a little less of the world.
        zoomBase = vw < 640 ? Math.min(1.1, Math.max(0.9, vw / 400)) : Math.min(1.75, Math.max(1.2, vw / 860));
        if (mode === "title") cam.zoom = titleZoom();
    };

    // The title wants the whole tower in frame.
    const titleZoom = () => Math.min(zoomBase * 0.95, (vh * 0.66) / TOWER.h);

    const clampCam = () => {
        const hw = vw / 2 / cam.zoom;
        const hh = vh / 2 / cam.zoom;
        cam.x = WORLD.w > hw * 2 ? Math.min(WORLD.w - hw, Math.max(hw, cam.x)) : WORLD.w / 2;
        cam.y = WORLD.h > hh * 2 ? Math.min(WORLD.h - hh, Math.max(hh, cam.y)) : WORLD.h / 2;
    };

    const resolve = (axis: "x" | "y") => {
        for (const r of rects) {
            const x0 = r.x0 - PLAYER_R;
            const y0 = r.y0 - PLAYER_R;
            const x1 = r.x1 + PLAYER_R;
            const y1 = r.y1 + PLAYER_R;
            if (player.x <= x0 || player.x >= x1 || player.y <= y0 || player.y >= y1) continue;
            if (axis === "x") {
                const left = player.x - x0;
                const right = x1 - player.x;
                player.x += left < right ? -left : right;
                player.vx = 0;
            } else {
                const up = player.y - y0;
                const down = y1 - player.y;
                player.y += up < down ? -up : down;
                player.vy = 0;
            }
        }
        for (const c of circles) {
            const dx = player.x - c.x;
            const dy = player.y - c.y;
            const d = Math.hypot(dx, dy);
            const min = c.r + PLAYER_R;
            if (d >= min || d < 1e-4) continue;
            const push = min - d;
            player.x += (dx / d) * push;
            player.y += (dy / d) * push;
        }
        player.x = Math.min(WORLD.w - 48, Math.max(48, player.x));
        player.y = Math.min(WORLD.h - 48, Math.max(48, player.y));
    };

    const update = (dt: number) => {
        const max = input.sprint ? SPRINT : WALK;
        const len = Math.hypot(input.x, input.y);
        const ix = len > 1 ? input.x / len : input.x;
        const iy = len > 1 ? input.y / len : input.y;
        const k = 1 - Math.exp(-dt * 11);
        player.vx += (ix * max - player.vx) * k;
        player.vy += (iy * max - player.vy) * k;
        if (Math.abs(player.vx) < 2) player.vx = 0;
        if (Math.abs(player.vy) < 2) player.vy = 0;

        player.x += player.vx * dt;
        resolve("x");
        player.y += player.vy * dt;
        resolve("y");

        const speed = Math.hypot(player.vx, player.vy);
        if (Math.abs(player.vx) > 20) player.face = player.vx > 0 ? 1 : -1;
        player.walk += speed * dt * 0.075;

        dustTimer -= dt;
        if (speed > 60 && dustTimer <= 0 && !reduced) {
            dustTimer = 0.09;
            scene.particles.push({
                x: player.x + (Math.random() - 0.5) * 6,
                y: player.y + 1,
                vx: -player.vx * 0.15 + (Math.random() - 0.5) * 20,
                vy: -player.vy * 0.15 - 10,
                life: 0.45,
                max: 0.45,
                size: 2.5,
                color: C.boneFaint,
                drag: 4,
            });
        }

        for (const st of STATION_MAP) {
            const d = Math.hypot(st.x - player.x, st.y - player.y);
            if (d < st.r) {
                if (!inside.has(st.id)) {
                    inside.add(st.id);
                    events.onStation(st.id);
                }
            } else if (d > st.r + 40) {
                inside.delete(st.id);
            }
        }

        COMMITS.forEach((c, i) => {
            if (scene.collected.has(i)) return;
            if (Math.hypot(c.x - player.x, c.y - (player.y - 8)) < 22) {
                scene.collected.add(i);
                burst(c.x, c.y - 10, 14, [C.ember, C.paper, C.crimson], 0.7, 4);
                sounds.collect();
                events.onCollect(i, scene.collected.size);
            }
        });
    };

    const updateFx = (dt: number) => {
        const ps = scene.particles;
        for (let i = ps.length - 1; i >= 0; i--) {
            const p = ps[i];
            const drag = Math.exp(-dt * p.drag);
            p.vx *= drag;
            p.vy *= drag;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            if (p.life <= 0) ps.splice(i, 1);
        }
        for (const f of scene.fireflies) {
            const fx = f.bx + Math.sin(time * f.sp + f.ph) * 38 + f.ox;
            const fy = f.by + Math.cos(time * f.sp * 0.8 + f.ph * 1.3) * 26 + f.oy;
            const dx = fx - player.x;
            const dy = fy - (player.y - 12);
            const d = Math.hypot(dx, dy);
            if (d < 70 && d > 0.01) {
                const push = (70 - d) * 3.5 * dt;
                f.ox += (dx / d) * push;
                f.oy += (dy / d) * push;
            }
            const back = Math.exp(-dt * 0.9);
            f.ox *= back;
            f.oy *= back;
        }
        shake *= Math.exp(-dt * 6);
        if (shake < 0.05) shake = 0;
    };

    const updateCamera = (dt: number) => {
        if (mode === "title") {
            cam.x = TOWER.x + Math.sin(time * 0.25) * 30;
            cam.y = TOWER.y - 150 + Math.cos(time * 0.2) * 16;
            cam.zoom = titleZoom();
            return;
        }
        if (mode === "intro") {
            introT += dt;
            const t = easeInOut(Math.min(1, introT / 2.2));
            cam.x = introFrom.x + (player.x - introFrom.x) * t;
            cam.y = introFrom.y + (player.y - 30 - introFrom.y) * t;
            cam.zoom = introFrom.zoom + (zoomBase - introFrom.zoom) * t;
            clampCam();
            if (introT >= 2.2) {
                mode = "play";
                events.onMode(mode);
            }
            return;
        }
        const targetZoom = zoomBase * (input.sprint && Math.hypot(player.vx, player.vy) > 100 ? 0.94 : 1);
        cam.zoom += (targetZoom - cam.zoom) * (1 - Math.exp(-dt * 3));
        const tx = player.x + player.vx * 0.16;
        const ty = player.y - 30 + player.vy * 0.16;
        const k = 1 - Math.exp(-dt * 5.5);
        cam.x += (tx - cam.x) * k;
        cam.y += (ty - cam.y) * k;
        clampCam();
    };

    const draw = () => {
        const z = cam.zoom;
        const sx = vw / 2 - cam.x * z + (shake ? (Math.random() - 0.5) * shake * 2 : 0);
        const sy = vh / 2 - cam.y * z + (shake ? (Math.random() - 0.5) * shake * 2 : 0);
        ctx.setTransform(dpr * z, 0, 0, dpr * z, dpr * sx, dpr * sy);
        scene.time = time;
        scene.view = {
            x0: cam.x - vw / 2 / z - 20,
            y0: cam.y - vh / 2 / z - 20,
            x1: cam.x + vw / 2 / z + 20,
            y1: cam.y + vh / 2 / z + 20,
        };
        drawGround(scene);
        drawObjects(scene);
        drawParticles(scene);
        drawFireflies(scene);
        if (mode === "play") drawLabels(scene);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (mode === "play") drawEdgeMarkers(ctx, vw, vh, cam, scene.found, time);
    };

    const frame = (now: number) => {
        if (destroyed) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!(reduced && paused)) time += dt;
        if (mode === "play" && !paused) update(dt);
        updateFx(dt);
        updateCamera(dt);
        draw();
        raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
        if (document.hidden) {
            cancelAnimationFrame(raf);
            raf = 0;
        } else if (!raf && !destroyed) {
            last = performance.now();
            raf = requestAnimationFrame(frame);
        }
    };
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    scene.clockStart = 0;
    last = performance.now();
    raf = requestAnimationFrame(frame);

    if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __hbQuad?: unknown }).__hbQuad = {
            get player() {
                return { x: player.x, y: player.y, mode };
            },
            teleport(x: number, y: number) {
                player.x = x;
                player.y = y;
                cam.x = x;
                cam.y = y - 30;
            },
        };
    }

    const complete = (fx: boolean) => {
        scene.complete = true;
        scene.completeAt = fx ? time : time - 10;
        if (fx) {
            shake = reduced ? 0 : 7;
            sounds.chimes();
            burst(TOWER.x, TOWER.y - 160, 160, [C.ember, C.bone, C.crimson, C.paper], 2.2, 60);
            events.onComplete();
        }
    };

    return {
        begin() {
            if (mode !== "title") return;
            introFrom = { x: cam.x, y: cam.y, zoom: cam.zoom };
            introT = 0;
            mode = reduced ? "play" : "intro";
            if (reduced) {
                cam.x = player.x;
                cam.y = player.y - 30;
                cam.zoom = zoomBase;
                clampCam();
            }
            events.onMode(mode);
        },
        setInput(x, y, sprint) {
            input.x = x;
            input.y = y;
            input.sprint = sprint;
        },
        setPaused(p) {
            paused = p;
            if (p) {
                input.x = 0;
                input.y = 0;
            }
        },
        find(id, fx) {
            if (scene.found.has(id)) return;
            scene.found.add(id);
            if (fx) {
                const st = STATION_MAP.find((s) => s.id === id);
                if (st) burst(st.x, st.y - 30, 40, [C.ember, C.bone, C.crimson], 1.1, 30);
                sounds.discover();
                window.setTimeout(() => sounds.levelUp(), 350);
            }
            if (!scene.complete && LIGHT_IDS.every((l) => scene.found.has(l))) complete(fx);
        },
        restore(found, collected) {
            for (const id of found) scene.found.add(id);
            for (const i of collected) scene.collected.add(i);
            if (LIGHT_IDS.every((l) => scene.found.has(l))) complete(false);
        },
        resize,
        destroy() {
            destroyed = true;
            cancelAnimationFrame(raf);
            document.removeEventListener("visibilitychange", onVisibility);
        },
    };
}
