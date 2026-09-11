"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LEVELS, LIGHT_IDS, STATIONS, stationById, type StationId } from "@/lib/stations";
import { prefersReducedMotion } from "@/lib/useReduce";
import { SoundBank } from "./audio";
import { createQuad, type Mode, type Quad } from "./engine";
import { Card } from "./Card";
import { Hud } from "./Hud";
import { Journal } from "./Journal";
import { Title } from "./Title";

const SAVE_KEY = "hb-quad-v1";
type Save = { found: StationId[]; collected: number[] };

function loadSave(): Save {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return { found: [], collected: [] };
        const s = JSON.parse(raw) as Save;
        return { found: s.found ?? [], collected: s.collected ?? [] };
    } catch {
        return { found: [], collected: [] };
    }
}
function writeSave(s: Save) {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    } catch {
        /* private mode */
    }
}

type Toast = { id: number; text: string };

/**
 * The whole site. A canvas, an engine, and the HTML that sits on top of it:
 * the title, the HUD, the cards, the journal, and a thumb joystick.
 */
export function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const quad = useRef<Quad | null>(null);
    const sounds = useRef<SoundBank | null>(null);
    const keys = useRef({ up: false, down: false, left: false, right: false, sprint: false });
    const stick = useRef<{ id: number; ox: number; oy: number; x: number; y: number } | null>(null);
    const [stickView, setStickView] = useState<{ ox: number; oy: number; x: number; y: number } | null>(null);

    const [mode, setMode] = useState<Mode>("title");
    const [found, setFound] = useState<Set<StationId>>(() => new Set());
    const [collected, setCollected] = useState(0);
    const [card, setCard] = useState<StationId | null>(null);
    const [journal, setJournal] = useState(false);
    const [muted, setMuted] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [hint, setHint] = useState(false);
    const foundRef = useRef(found);
    foundRef.current = found;
    const collectedRef = useRef<number[]>([]);

    const toast = useCallback((text: string) => {
        const id = Date.now() + Math.random();
        setToasts((t) => [...t, { id, text }]);
        window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
    }, []);

    const pushInput = useCallback(() => {
        const k = keys.current;
        let x = (k.right ? 1 : 0) - (k.left ? 1 : 0);
        let y = (k.down ? 1 : 0) - (k.up ? 1 : 0);
        const s = stick.current;
        if (s) {
            const dx = s.x - s.ox;
            const dy = s.y - s.oy;
            const d = Math.hypot(dx, dy);
            const max = 52;
            const dead = 6;
            if (d > dead) {
                const m = Math.min(1, (d - dead) / (max - dead));
                x = (dx / d) * m;
                y = (dy / d) * m;
            }
        }
        quad.current?.setInput(x, y, k.sprint || (s ? Math.hypot(s.x - s.ox, s.y - s.oy) > 46 : false));
    }, []);

    // Engine lifecycle.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const bank = new SoundBank();
        sounds.current = bank;
        const reduced = prefersReducedMotion();
        const q = createQuad(canvas, {
            sounds: bank,
            reduced,
            events: {
                onStation: (id) => setCard(id),
                onCollect: (index, total) => {
                    collectedRef.current = [...collectedRef.current, index];
                    setCollected(total);
                    writeSave({ found: [...foundRef.current], collected: collectedRef.current });
                    if (total === 20) toast("Every commit. Clean tree.");
                },
                onComplete: () => {
                    toast("The chimes are lit. The room is open.");
                },
                onMode: (m) => setMode(m),
            },
        });
        if (!q) return;
        quad.current = q;

        const save = loadSave();
        q.restore(save.found, save.collected);
        foundRef.current = new Set(save.found);
        setFound(foundRef.current);
        setCollected(save.collected.length);
        collectedRef.current = save.collected;

        const ro = new ResizeObserver(() => q.resize());
        ro.observe(canvas);
        return () => {
            ro.disconnect();
            q.destroy();
            bank.destroy();
            quad.current = null;
            sounds.current = null;
        };
    }, [toast]);

    // Keyboard.
    useEffect(() => {
        const map: Record<string, keyof typeof keys.current> = {
            ArrowUp: "up",
            w: "up",
            W: "up",
            ArrowDown: "down",
            s: "down",
            S: "down",
            ArrowLeft: "left",
            a: "left",
            A: "left",
            ArrowRight: "right",
            d: "right",
            D: "right",
            Shift: "sprint",
        };
        const onKey = (e: KeyboardEvent) => {
            const k = map[e.key];
            if (!k) return;
            if (e.type === "keydown" && !e.repeat && mode === "play" && !card && !journal) setHint(false);
            keys.current[k] = e.type === "keydown";
            if (mode === "play" && !card && !journal) e.preventDefault();
            pushInput();
        };
        const clear = () => {
            keys.current = { up: false, down: false, left: false, right: false, sprint: false };
            pushInput();
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("keyup", onKey);
        window.addEventListener("blur", clear);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("keyup", onKey);
            window.removeEventListener("blur", clear);
        };
    }, [mode, card, journal, pushInput]);

    // Pause the world while reading.
    useEffect(() => {
        quad.current?.setPaused(card !== null || journal);
    }, [card, journal]);

    useEffect(() => {
        if (sounds.current) sounds.current.muted = muted;
    }, [muted]);

    // Thumb stick.
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (mode !== "play" || card || journal) return;
        if (e.pointerType === "mouse") return;
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            /* synthetic or already-released pointer */
        }
        stick.current = { id: e.pointerId, ox: e.clientX, oy: e.clientY, x: e.clientX, y: e.clientY };
        setStickView({ ox: e.clientX, oy: e.clientY, x: e.clientX, y: e.clientY });
        setHint(false);
        pushInput();
    };
    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const s = stick.current;
        if (!s || s.id !== e.pointerId) return;
        const dx = e.clientX - s.ox;
        const dy = e.clientY - s.oy;
        const d = Math.hypot(dx, dy);
        const max = 52;
        s.x = d > max ? s.ox + (dx / d) * max : e.clientX;
        s.y = d > max ? s.oy + (dy / d) * max : e.clientY;
        setStickView({ ox: s.ox, oy: s.oy, x: s.x, y: s.y });
        pushInput();
    };
    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (stick.current?.id !== e.pointerId) return;
        stick.current = null;
        setStickView(null);
        pushInput();
    };

    const begin = () => {
        sounds.current?.unlock();
        sounds.current?.open();
        quad.current?.begin();
        setHint(true);
        window.setTimeout(() => setHint(false), 9000);
    };

    const closeCard = useCallback(() => {
        const id = card;
        setCard(null);
        if (!id) return;
        sounds.current?.ui();
        const prev = foundRef.current;
        if (prev.has(id)) return;
        const next = new Set(prev).add(id);
        foundRef.current = next;
        setFound(next);
        quad.current?.find(id, true);
        writeSave({ found: [...next], collected: collectedRef.current });
        const lights = LIGHT_IDS.filter((l) => next.has(l)).length;
        if (LIGHT_IDS.includes(id)) toast(`Level ${lights}: ${LEVELS[lights]}`);
    }, [card, toast]);

    const revealAll = () => {
        const all = STATIONS.map((s) => s.id);
        for (const id of all) quad.current?.find(id, false);
        foundRef.current = new Set(all);
        setFound(foundRef.current);
        writeSave({ found: all, collected: collectedRef.current });
    };
    const reset = () => {
        writeSave({ found: [], collected: [] });
        window.location.reload();
    };

    const lights = LIGHT_IDS.filter((l) => found.has(l)).length;

    return (
        <div
            className="relative h-[100dvh] w-full select-none overflow-hidden bg-ink"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ touchAction: "none" }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full"
                role="img"
                aria-label="The Quad at night. Walk to the lights to learn about HackBama."
            />

            {mode !== "title" && (
                <Hud
                    found={lights}
                    collected={collected}
                    muted={muted}
                    onJournal={() => {
                        sounds.current?.ui();
                        setJournal(true);
                    }}
                    onMute={() => setMuted((m) => !m)}
                />
            )}

            <AnimatePresence>
                {hint && mode === "play" && !card && (
                    <motion.p
                        key="hint"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="pointer-events-none absolute inset-x-0 bottom-8 text-center font-mono text-xs text-bone-dim"
                    >
                        <span className="hidden sm:inline">WASD or arrows to walk. Shift to run. Walk into a light.</span>
                        <span className="sm:hidden">Drag anywhere to walk. Walk into a light.</span>
                    </motion.p>
                )}
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-x-0 top-24 flex flex-col items-center gap-2 sm:top-20">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: -10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.4 }}
                            className="border border-ember/40 bg-ink/90 px-4 py-2 text-sm font-medium text-bone backdrop-blur"
                        >
                            {t.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {stickView && (
                <div className="pointer-events-none absolute inset-0">
                    <div
                        className="absolute h-[104px] w-[104px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-bone/25"
                        style={{ left: stickView.ox, top: stickView.oy }}
                    />
                    <div
                        className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone/80"
                        style={{ left: stickView.x, top: stickView.y }}
                    />
                </div>
            )}

            <div className="pointer-events-none absolute inset-0">
                <AnimatePresence>
                    {mode === "title" && !journal && (
                        <Title key="title" onBegin={begin} onJournal={() => setJournal(true)} />
                    )}
                    {card && <Card key={card} content={stationById(card)} onClose={closeCard} />}
                    {journal && (
                        <Journal
                            key="journal"
                            found={found}
                            onClose={() => setJournal(false)}
                            onRevealAll={revealAll}
                            onReset={reset}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* The same content as plain text, for readers and crawlers. */}
            <section className="sr-only" aria-label="About HackBama">
                {STATIONS.map((s) => (
                    <article key={s.id}>
                        <h2>{s.title}</h2>
                        {s.body.map((p) => (
                            <p key={p}>{p}</p>
                        ))}
                        {s.list && <p>{s.list.join(". ")}.</p>}
                        {s.cta && <a href={s.cta.href}>{s.cta.label}</a>}
                    </article>
                ))}
            </section>
        </div>
    );
}
