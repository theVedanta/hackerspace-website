import {
    CHIMES_FILLS,
    CHIMES_KNOCKOUT_CIRCLES,
    CHIMES_KNOCKOUT_RECTS,
    CHIMES_KNOCKOUT_STROKES,
    CHIMES_VIEWBOX,
} from "@/lib/chimes";

/**
 * The Denny Chimes as a field of points.
 *
 * By day the tower is crimson and the circuit trace is an absence, exactly
 * like the printed mark. As --night rises the body dims to bone and the trace
 * lights up in ember and pulses upward, a slice of the body lifts off, and
 * the pointer pushes a wake through it.
 *
 * Simulation is stateless in the vertex shader (target + noise + pointer
 * trail), so it stays cheap on integrated GPUs and needs no float textures.
 */

const TRAIL = 12;
const RASTER_SCALE = 4;

export type Layout = {
    /** Tower center, as fractions of the canvas. */
    cx: number;
    cy: number;
    /** Tower height as a fraction of the canvas height. */
    height: number;
};

export type ParticleField = {
    setNight(v: number): void;
    setPointer(clientX: number, clientY: number): void;
    clearPointer(): void;
    setActive(on: boolean): void;
    setLayout(layout: Layout): void;
    resize(): void;
    destroy(): void;
};

const VERT = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
layout(location=1) in float aGroup;
layout(location=2) in float aSeed;
uniform vec2 uCenter;
uniform float uHeight;
uniform float uAspect;
uniform float uTime;
uniform float uNight;
uniform float uSize;
uniform float uMotion;
uniform vec2 uTrail[${TRAIL}];
uniform float uTrailAge[${TRAIL}];
out float vAlpha;
out float vGroup;
out float vGlow;
out float vSeed;
out float vY;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
    float s1 = hash(aSeed * 7.13);
    float s2 = hash(aSeed * 13.71);
    float s3 = hash(aSeed * 29.4);

    vec2 p = vec2(aPos.x * uHeight / uAspect, aPos.y * uHeight) + uCenter;

    vec2 jitter = vec2(
        sin(uTime * (0.5 + s1) + s3 * 6.2831),
        cos(uTime * (0.4 + s2) + s1 * 6.2831)
    ) * (0.0016 + 0.0024 * uNight) * uMotion;

    float ember = step(aSeed, 0.09) * (1.0 - aGroup);
    float rise = ember * smoothstep(0.35, 1.0, uNight) * uMotion;
    float cycle = fract(uTime * 0.026 * (0.6 + s1) + s2);
    vec2 lift = vec2(sin(cycle * 6.2831 + s1 * 10.0) * 0.05 * cycle, cycle * 0.85);
    p += lift * rise;
    p += jitter * (1.0 + 2.0 * rise);

    float glow = 0.0;
    for (int i = 0; i < ${TRAIL}; i++) {
        float age = uTrailAge[i];
        if (age >= 1.0) continue;
        vec2 d = p - uTrail[i];
        d.x *= uAspect;
        float dist = length(d);
        float radius = 0.17 * (1.0 - age * 0.45);
        float f = smoothstep(radius, 0.0, dist) * (1.0 - age);
        vec2 dir = dist > 1e-5 ? d / dist : vec2(0.0, 1.0);
        dir.x /= uAspect;
        p += dir * f * (0.045 + 0.04 * s2) * uMotion;
        glow = max(glow, f);
    }

    gl_Position = vec4(p, 0.0, 1.0);
    float size = uSize * (0.78 + 0.5 * s2);
    size *= mix(1.0, 1.75, aGroup * uNight);
    size *= 1.0 + glow * 0.9;
    size *= 1.0 - 0.6 * rise * cycle;
    gl_PointSize = size;
    vAlpha = 1.0 - rise * cycle * cycle;
    vGroup = aGroup;
    vGlow = glow;
    vSeed = aSeed;
    vY = aPos.y;
}`;

const FRAG = `#version 300 es
precision highp float;
in float vAlpha;
in float vGroup;
in float vGlow;
in float vSeed;
in float vY;
uniform float uNight;
uniform float uTime;
uniform float uHalo;
uniform vec3 uCrimson;
uniform vec3 uBone;
uniform vec3 uEmber;
out vec4 outColor;

void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float disc = uHalo > 0.5
        ? smoothstep(0.5, 0.0, d) * 0.3
        : smoothstep(0.5, 0.3, d);
    if (disc <= 0.002) discard;

    float pulse = 0.55 + 0.45 * sin(uTime * 1.7 + vY * 15.0 + vSeed * 0.9);

    vec3 body = mix(uCrimson, mix(uBone, uCrimson, 0.2), uNight);
    float bodyA = mix(1.0, 0.3, uNight);
    vec3 trace = mix(uEmber, uBone, 0.28 * pulse);
    float traceA = (0.5 + 0.5 * pulse) * uNight;

    vec3 col = mix(body, trace, vGroup);
    float a = mix(bodyA, traceA, vGroup);
    col = mix(col, uEmber, vGlow * 0.85);
    a = min(1.0, a + vGlow * 0.6);

    if (uHalo > 0.5) {
        col = uEmber;
        a = traceA;
    }
    float A = a * disc * vAlpha;
    outColor = vec4(col * A, A);
}`;

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return [r + m, g + m, b + m];
}

const COLORS = {
    crimson: hslToRgb(349, 0.68, 0.33),
    bone: hslToRgb(42, 0.3, 0.92),
    ember: hslToRgb(349, 0.74, 0.6),
};

/**
 * Rasterize the mark twice (silhouette, and silhouette with knockouts) and
 * walk a grid over it. A cell inside the silhouette but outside the knocked-
 * out shape is trace; a cell inside both is body.
 */
function sample(step: number) {
    const W = CHIMES_VIEWBOX.width * RASTER_SCALE;
    const H = CHIMES_VIEWBOX.height * RASTER_SCALE;

    const draw = (withKnockouts: boolean) => {
        const c = document.createElement("canvas");
        c.width = W;
        c.height = H;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        if (!ctx) return null;
        ctx.scale(RASTER_SCALE, RASTER_SCALE);
        ctx.fillStyle = "#fff";
        for (const [x, y, w, h] of CHIMES_FILLS) ctx.fillRect(x, y, w, h);
        if (withKnockouts) {
            ctx.strokeStyle = "#000";
            ctx.fillStyle = "#000";
            ctx.lineJoin = "round";
            for (const s of CHIMES_KNOCKOUT_STROKES) {
                ctx.lineWidth = s.width;
                ctx.lineCap = s.cap;
                ctx.stroke(new Path2D(s.d));
            }
            for (const [cx, cy, r] of CHIMES_KNOCKOUT_CIRCLES) {
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
            }
            for (const [x, y, w, h] of CHIMES_KNOCKOUT_RECTS) ctx.fillRect(x, y, w, h);
        }
        return ctx.getImageData(0, 0, W, H).data;
    };

    const silhouette = draw(false);
    const final = draw(true);
    if (!silhouette || !final) return null;

    const body: number[] = [];
    const trace: number[] = [];
    const jitter = step * 0.18;
    for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
            const i = (y * W + x) * 4;
            const inSil = silhouette[i] > 127;
            if (!inSil) continue;
            const inFinal = final[i] > 127;
            const px = x + (Math.random() - 0.5) * jitter;
            const py = y + (Math.random() - 0.5) * jitter;
            // Tower-local: x centered, y up, height normalized to 1.
            const lx = (px / RASTER_SCALE - CHIMES_VIEWBOX.width / 2) / CHIMES_VIEWBOX.height;
            const ly = -(py / RASTER_SCALE - CHIMES_VIEWBOX.height / 2) / CHIMES_VIEWBOX.height;
            (inFinal ? body : trace).push(lx, ly);
        }
    }
    return { body, trace };
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
    }
    return sh;
}

export function createParticleField(
    canvas: HTMLCanvasElement,
    opts: { reduced: boolean }
): ParticleField | null {
    const gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        premultipliedAlpha: true,
        powerPreference: "high-performance",
    });
    if (!gl) return null;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    if (!prog) return null;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(prog));
        return null;
    }
    gl.useProgram(prog);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
        center: u("uCenter"),
        height: u("uHeight"),
        aspect: u("uAspect"),
        time: u("uTime"),
        night: u("uNight"),
        size: u("uSize"),
        motion: u("uMotion"),
        trail: u("uTrail"),
        trailAge: u("uTrailAge"),
        halo: u("uHalo"),
        crimson: u("uCrimson"),
        bone: u("uBone"),
        ember: u("uEmber"),
    };
    gl.uniform3fv(U.crimson, COLORS.crimson);
    gl.uniform3fv(U.bone, COLORS.bone);
    gl.uniform3fv(U.ember, COLORS.ember);
    gl.uniform1f(U.motion, opts.reduced ? 0 : 1);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const STRIDE = 16;
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, STRIDE, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, STRIDE, 8);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, STRIDE, 12);

    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);

    let count = 0;
    let traceStart = 0;
    let traceCount = 0;
    let currentStep = 0;

    const upload = (step: number) => {
        const s = sample(step);
        if (!s) return;
        const n = (s.body.length + s.trace.length) / 2;
        const data = new Float32Array(n * 4);
        let k = 0;
        const put = (arr: number[], group: number) => {
            for (let i = 0; i < arr.length; i += 2) {
                data[k++] = arr[i];
                data[k++] = arr[i + 1];
                data[k++] = group;
                data[k++] = Math.random();
            }
        };
        put(s.body, 0);
        traceStart = s.body.length / 2;
        put(s.trace, 1);
        traceCount = s.trace.length / 2;
        count = n;
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        currentStep = step;
    };

    let layout: Layout = { cx: 0.7, cy: 0.5, height: 0.76 };
    let dpr = 1;
    let width = 1;
    let height = 1;

    const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        width = Math.max(1, Math.round(rect.width * dpr));
        height = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
        gl.viewport(0, 0, width, height);
        gl.uniform1f(U.aspect, width / height);
        gl.uniform2f(U.center, layout.cx * 2 - 1, 1 - layout.cy * 2);
        gl.uniform1f(U.height, layout.height * 2);

        // Density follows the tower's on-screen height: about one point per
        // 1.6 css px of height, capped so phones stay light.
        const towerPx = layout.height * rect.height;
        const rows = Math.min(640, Math.max(200, towerPx / 1.6));
        const step = Math.max(2, Math.round((CHIMES_VIEWBOX.height * RASTER_SCALE) / rows));
        if (step !== currentStep) upload(step);
        gl.uniform1f(U.size, Math.max(1.6, (towerPx / rows) * 1.05) * dpr);
        dirty = true;
    };

    // Pointer trail. Slot 0 is the live pointer, the rest are a ring of
    // recent positions that age out.
    const trail = new Float32Array(TRAIL * 2);
    const ages = new Float32Array(TRAIL).fill(1);
    let ring = 0;
    let pointerActive = false;
    let rawX = 0;
    let rawY = 0;
    let lastPushX = 0;
    let lastPushY = 0;
    let lastPushT = 0;

    const setPointer = (clientX: number, clientY: number) => {
        const rect = canvas.getBoundingClientRect();
        rawX = ((clientX - rect.left) / rect.width) * 2 - 1;
        rawY = 1 - ((clientY - rect.top) / rect.height) * 2;
        if (!pointerActive) {
            trail[0] = rawX;
            trail[1] = rawY;
            pointerActive = true;
        }
    };
    const clearPointer = () => {
        pointerActive = false;
    };

    let night = 0;
    let active = true;
    let dirty = true;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let destroyed = false;

    const draw = () => {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(U.time, time);
        gl.uniform1f(U.night, night);
        gl.uniform2fv(U.trail, trail);
        gl.uniform1fv(U.trailAge, ages);

        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.uniform1f(U.halo, 0);
        gl.drawArrays(gl.POINTS, 0, count);

        if (night > 0.02 && traceCount > 0) {
            gl.blendFunc(gl.ONE, gl.ONE);
            gl.uniform1f(U.halo, 1);
            gl.drawArrays(gl.POINTS, traceStart, traceCount);
        }
    };

    const frame = (now: number) => {
        if (destroyed) return;
        raf = 0;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        if (opts.reduced) {
            if (dirty) {
                draw();
                dirty = false;
            }
            return;
        }

        time += dt;

        // Live pointer eases toward the raw position; history ages out.
        const k = 1 - Math.exp(-dt * 16);
        trail[0] += (rawX - trail[0]) * k;
        trail[1] += (rawY - trail[1]) * k;
        ages[0] = pointerActive ? 0 : Math.min(1, ages[0] + dt / 0.5);
        for (let i = 1; i < TRAIL; i++) ages[i] = Math.min(1, ages[i] + dt / 0.85);

        if (pointerActive) {
            const dx = trail[0] - lastPushX;
            const dy = trail[1] - lastPushY;
            if (dx * dx + dy * dy > 0.0009 && now - lastPushT > 28) {
                const slot = 1 + (ring++ % (TRAIL - 1));
                trail[slot * 2] = trail[0];
                trail[slot * 2 + 1] = trail[1];
                ages[slot] = 0;
                lastPushX = trail[0];
                lastPushY = trail[1];
                lastPushT = now;
            }
        }

        draw();
        if (active) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
        if (destroyed || raf) return;
        last = performance.now();
        raf = requestAnimationFrame(frame);
    };

    const onLost = (e: Event) => {
        e.preventDefault();
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
    };
    const onRestored = () => {
        // Simplest correct behavior: let the owner rebuild us.
        canvas.dispatchEvent(new CustomEvent("particles:rebuild"));
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    resize();
    kick();

    return {
        setNight(v) {
            night = Math.min(1, Math.max(0, v));
            dirty = true;
            if (opts.reduced) kick();
        },
        setPointer,
        clearPointer,
        setActive(on) {
            active = on;
            if (on) kick();
        },
        setLayout(next) {
            layout = next;
            resize();
        },
        resize,
        destroy() {
            destroyed = true;
            if (raf) cancelAnimationFrame(raf);
            canvas.removeEventListener("webglcontextlost", onLost);
            canvas.removeEventListener("webglcontextrestored", onRestored);
            gl.deleteBuffer(buf);
            gl.deleteVertexArray(vao);
            gl.deleteProgram(prog);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        },
    };
}
