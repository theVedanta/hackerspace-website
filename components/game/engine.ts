import type { SoundBank } from "./audio";

/**
 * Breakout, where the wall is made of excuses.
 *
 * Logical coordinates are CSS pixels; the canvas backing store is scaled by
 * devicePixelRatio. The loop only runs while something is moving, so an idle
 * board costs nothing.
 */

export type GameState = "idle" | "playing" | "paused" | "won" | "lost";

export type Snapshot = {
    state: GameState;
    timeLeft: number;
    bricksLeft: number;
    balls: number;
    elapsed: number;
};

export type Game = {
    start(): void;
    pause(): void;
    resume(): void;
    launch(): void;
    setPointerX(x: number): void;
    setKey(dir: -1 | 1, down: boolean): void;
    resize(): void;
    getState(): GameState;
    destroy(): void;
};

type Brick = {
    x: number;
    y: number;
    w: number;
    h: number;
    text: string;
    font: number;
    alive: boolean;
};

type Shard = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    w: number;
    h: number;
    rot: number;
    vr: number;
    life: number;
    max: number;
    color: string;
};

export const TIME_LIMIT = 120;
export const LIVES = 3;

const COLORS = {
    surface: "hsl(30, 7%, 12%)",
    grid: "hsla(30, 6%, 22%, 0.7)",
    bone: "hsl(42, 30%, 92%)",
    boneDim: "hsl(40, 12%, 66%)",
    boneFaint: "hsl(36, 8%, 46%)",
    ember: "hsl(349, 74%, 60%)",
    crimson: "hsl(349, 68%, 33%)",
    paper: "hsl(44, 40%, 96%)",
};

export function createGame(
    canvas: HTMLCanvasElement,
    opts: {
        excuses: readonly string[];
        sounds: SoundBank;
        onSnapshot: (s: Snapshot) => void;
        reduced: boolean;
    }
): Game | null {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const family =
        getComputedStyle(canvas).getPropertyValue("--font-mono").trim() ||
        "ui-monospace, monospace";

    let W = 1;
    let H = 1;
    let dpr = 1;
    let state: GameState = "idle";

    const paddle = { x: 0, y: 0, w: 120, h: 12, target: 0 };
    const ball = { x: 0, y: 0, vx: 0, vy: 0, size: 11, attached: true };
    let bricks: Brick[] = [];
    let shards: Shard[] = [];
    const trail: { x: number; y: number }[] = [];
    const shake = { mag: 0 };
    const keys = { left: false, right: false };

    let timeLeft = TIME_LIMIT;
    let elapsed = 0;
    let lives = LIVES;
    let bricksLeft = opts.excuses.length;
    let lastSecond = TIME_LIMIT;
    let speed = 0;
    let raf = 0;
    let last = 0;
    let destroyed = false;

    const snapshot = () =>
        opts.onSnapshot({ state, timeLeft, bricksLeft, balls: lives, elapsed });

    const baseSpeed = () => Math.max(300, Math.min(460, W * 0.52));

    const layoutBricks = () => {
        const cols = W < 560 ? 3 : 4;
        const margin = W * 0.05;
        const gap = Math.max(6, W * 0.01);
        const bw = (W - margin * 2 - gap * (cols - 1)) / cols;
        const bh = Math.max(36, Math.min(58, W * 0.058));
        const top = H * 0.1;
        const baseFont = Math.max(11, Math.min(15, W / 58));
        const prev = new Map(bricks.map((b) => [b.text, b.alive]));
        bricks = opts.excuses.map((text, i) => {
            const c = i % cols;
            const r = Math.floor(i / cols);
            ctx.font = `500 ${baseFont}px ${family}`;
            const tw = ctx.measureText(text).width;
            const font = tw > bw - 16 ? baseFont * ((bw - 16) / tw) : baseFont;
            return {
                x: margin + c * (bw + gap),
                y: top + r * (bh + gap),
                w: bw,
                h: bh,
                text,
                font,
                alive: prev.get(text) ?? true,
            };
        });
    };

    const attachBall = () => {
        ball.attached = true;
        ball.vx = 0;
        ball.vy = 0;
        ball.x = paddle.x - ball.size / 2;
        ball.y = paddle.y - ball.size - 1;
    };

    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const px = paddle.x / (W || 1);
        W = Math.max(1, rect.width);
        H = Math.max(1, rect.height);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        paddle.w = Math.max(72, Math.min(150, W * 0.15));
        paddle.h = Math.max(10, Math.min(14, W * 0.014));
        paddle.y = H - Math.max(34, H * 0.07);
        paddle.x = Math.min(W - paddle.w / 2, Math.max(paddle.w / 2, px * W || W / 2));
        paddle.target = paddle.x;
        ball.size = Math.max(9, Math.min(13, W * 0.012));
        layoutBricks();
        if (ball.attached) attachBall();
        draw();
    };

    const reset = () => {
        lives = LIVES;
        timeLeft = TIME_LIMIT;
        lastSecond = TIME_LIMIT;
        elapsed = 0;
        shards = [];
        trail.length = 0;
        shake.mag = 0;
        bricks.forEach((b) => (b.alive = true));
        bricksLeft = bricks.length;
        paddle.x = W / 2;
        paddle.target = W / 2;
        speed = baseSpeed();
        attachBall();
    };

    const burst = (x: number, y: number, w: number, h: number, count: number, colors: string[], power = 1) => {
        if (opts.reduced) return;
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const v = (120 + Math.random() * 260) * power;
            shards.push({
                x: x + Math.random() * w,
                y: y + Math.random() * h,
                vx: Math.cos(a) * v,
                vy: Math.sin(a) * v - 120 * power,
                w: 3 + Math.random() * 7,
                h: 3 + Math.random() * 7,
                rot: Math.random() * Math.PI,
                vr: (Math.random() - 0.5) * 14,
                life: 0.6 + Math.random() * 0.6,
                max: 1,
                color: colors[(Math.random() * colors.length) | 0],
            });
        }
        shards.forEach((s) => (s.max = Math.max(s.max, s.life)));
    };

    const finish = (next: "won" | "lost") => {
        state = next;
        ball.attached = true;
        if (next === "won") {
            opts.sounds.win();
            burst(0, H * 0.3, W, H * 0.3, 140, [COLORS.bone, COLORS.ember, COLORS.crimson, COLORS.paper], 1.4);
            shake.mag = 6;
        }
        snapshot();
        kick();
    };

    const loseBall = () => {
        lives -= 1;
        opts.sounds.lose();
        shake.mag = opts.reduced ? 0 : 10;
        if (lives <= 0) {
            finish("lost");
            return;
        }
        attachBall();
        snapshot();
    };

    const stepBall = (dt: number) => {
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        const s = ball.size;

        if (ball.x < 0) {
            ball.x = 0;
            ball.vx = Math.abs(ball.vx);
            opts.sounds.wall();
        } else if (ball.x + s > W) {
            ball.x = W - s;
            ball.vx = -Math.abs(ball.vx);
            opts.sounds.wall();
        }
        if (ball.y < 0) {
            ball.y = 0;
            ball.vy = Math.abs(ball.vy);
            opts.sounds.wall();
        }

        // Paddle.
        const px = paddle.x - paddle.w / 2;
        if (
            ball.vy > 0 &&
            ball.y + s >= paddle.y &&
            ball.y + s <= paddle.y + paddle.h + Math.abs(ball.vy) * dt + 2 &&
            ball.x + s > px &&
            ball.x < px + paddle.w
        ) {
            const rel = Math.max(-1, Math.min(1, (ball.x + s / 2 - paddle.x) / (paddle.w / 2)));
            const angle = rel * (Math.PI / 3);
            ball.vx = speed * Math.sin(angle);
            ball.vy = -speed * Math.cos(angle);
            ball.y = paddle.y - s - 0.5;
            opts.sounds.paddle();
            shake.mag = Math.max(shake.mag, opts.reduced ? 0 : 2);
            return true;
        }

        // Bricks.
        for (const b of bricks) {
            if (!b.alive) continue;
            if (ball.x < b.x + b.w && ball.x + s > b.x && ball.y < b.y + b.h && ball.y + s > b.y) {
                const overlapX = Math.min(ball.x + s - b.x, b.x + b.w - ball.x);
                const overlapY = Math.min(ball.y + s - b.y, b.y + b.h - ball.y);
                if (overlapX < overlapY) {
                    ball.vx = -ball.vx;
                    ball.x += ball.vx > 0 ? overlapX : -overlapX;
                } else {
                    ball.vy = -ball.vy;
                    ball.y += ball.vy > 0 ? overlapY : -overlapY;
                }
                b.alive = false;
                bricksLeft -= 1;
                speed = Math.min(baseSpeed() * 1.7, speed * 1.035);
                const mag = Math.hypot(ball.vx, ball.vy) || 1;
                ball.vx = (ball.vx / mag) * speed;
                ball.vy = (ball.vy / mag) * speed;
                burst(b.x, b.y, b.w, b.h, 22, [COLORS.bone, COLORS.ember, COLORS.crimson]);
                shake.mag = Math.max(shake.mag, opts.reduced ? 0 : 6);
                opts.sounds.brick();
                snapshot();
                if (bricksLeft <= 0) finish("won");
                return true;
            }
        }

        if (ball.y > H + s) {
            loseBall();
            return true;
        }
        return false;
    };

    const update = (dt: number) => {
        if (state === "playing") {
            timeLeft = Math.max(0, timeLeft - dt);
            elapsed += dt;
            if (Math.ceil(timeLeft) !== lastSecond) {
                lastSecond = Math.ceil(timeLeft);
                snapshot();
            }
            if (timeLeft <= 0) {
                finish("lost");
            }

            const kdir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
            if (kdir !== 0) paddle.target += kdir * Math.max(520, W * 0.9) * dt;
            paddle.target = Math.min(W - paddle.w / 2, Math.max(paddle.w / 2, paddle.target));
            paddle.x += (paddle.target - paddle.x) * (1 - Math.exp(-dt * 26));

            if (ball.attached) {
                attachBall();
            } else {
                const dist = Math.hypot(ball.vx, ball.vy) * dt;
                const steps = Math.max(1, Math.ceil(dist / (ball.size * 0.7)));
                for (let i = 0; i < steps; i++) {
                    if (stepBall(dt / steps)) break;
                    if (state !== "playing") break;
                }
                trail.push({ x: ball.x, y: ball.y });
                if (trail.length > 10) trail.shift();
            }
        }

        for (let i = shards.length - 1; i >= 0; i--) {
            const sh = shards[i];
            sh.vy += 1500 * dt;
            sh.x += sh.vx * dt;
            sh.y += sh.vy * dt;
            sh.rot += sh.vr * dt;
            sh.life -= dt;
            if (sh.life <= 0) shards.splice(i, 1);
        }
        shake.mag *= Math.exp(-dt * 8);
        if (shake.mag < 0.05) shake.mag = 0;
    };

    const draw = () => {
        ctx.save();
        if (shake.mag > 0) {
            ctx.translate((Math.random() - 0.5) * shake.mag * 2, (Math.random() - 0.5) * shake.mag * 2);
        }
        ctx.fillStyle = COLORS.surface;
        ctx.fillRect(-24, -24, W + 48, H + 48);

        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 1;
        const cell = W / 12;
        ctx.beginPath();
        for (let x = cell; x < W; x += cell) {
            ctx.moveTo(Math.round(x) + 0.5, 0);
            ctx.lineTo(Math.round(x) + 0.5, H);
        }
        for (let y = cell; y < H; y += cell) {
            ctx.moveTo(0, Math.round(y) + 0.5);
            ctx.lineTo(W, Math.round(y) + 0.5);
        }
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const b of bricks) {
            if (!b.alive) continue;
            ctx.strokeStyle = COLORS.boneFaint;
            ctx.strokeRect(Math.round(b.x) + 0.5, Math.round(b.y) + 0.5, Math.round(b.w), Math.round(b.h));
            ctx.fillStyle = COLORS.bone;
            ctx.font = `500 ${b.font}px ${family}`;
            ctx.fillText(b.text, b.x + b.w / 2, b.y + b.h / 2 + 1);
        }

        ctx.fillStyle = COLORS.bone;
        ctx.fillRect(paddle.x - paddle.w / 2, paddle.y, paddle.w, paddle.h);

        if (!ball.attached && !opts.reduced) {
            for (let i = 0; i < trail.length; i++) {
                const t = trail[i];
                const k = (i + 1) / trail.length;
                ctx.globalAlpha = k * 0.35;
                const sz = ball.size * (0.4 + k * 0.6);
                ctx.fillStyle = COLORS.ember;
                ctx.fillRect(t.x + (ball.size - sz) / 2, t.y + (ball.size - sz) / 2, sz, sz);
            }
            ctx.globalAlpha = 1;
        }
        if (state !== "won") {
            ctx.fillStyle = COLORS.ember;
            ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
        }

        for (const sh of shards) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, sh.life / sh.max);
            ctx.translate(sh.x, sh.y);
            ctx.rotate(sh.rot);
            ctx.fillStyle = sh.color;
            ctx.fillRect(-sh.w / 2, -sh.h / 2, sh.w, sh.h);
            ctx.restore();
        }
        ctx.restore();
    };

    const loop = (now: number) => {
        if (destroyed) return;
        raf = 0;
        const dt = Math.min(0.033, (now - last) / 1000);
        last = now;
        update(dt);
        draw();
        if (state === "playing" || shards.length > 0 || shake.mag > 0) {
            raf = requestAnimationFrame(loop);
        }
    };

    const kick = () => {
        if (destroyed || raf) return;
        last = performance.now();
        raf = requestAnimationFrame(loop);
    };

    resize();
    reset();
    draw();
    snapshot();

    return {
        start() {
            opts.sounds.unlock();
            reset();
            state = "playing";
            snapshot();
            kick();
        },
        pause() {
            if (state !== "playing") return;
            state = "paused";
            keys.left = false;
            keys.right = false;
            snapshot();
        },
        resume() {
            if (state !== "paused") return;
            opts.sounds.unlock();
            state = "playing";
            snapshot();
            kick();
        },
        launch() {
            if (state !== "playing" || !ball.attached) return;
            ball.attached = false;
            const angle = (Math.random() - 0.5) * 0.7;
            ball.vx = speed * Math.sin(angle);
            ball.vy = -speed * Math.cos(angle);
            opts.sounds.launch();
        },
        setPointerX(x) {
            paddle.target = Math.min(W - paddle.w / 2, Math.max(paddle.w / 2, x));
        },
        setKey(dir, down) {
            if (dir < 0) keys.left = down;
            else keys.right = down;
        },
        resize,
        getState: () => state,
        destroy() {
            destroyed = true;
            if (raf) cancelAnimationFrame(raf);
        },
    };
}
