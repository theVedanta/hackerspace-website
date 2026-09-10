"use client";

import { useEffect, useRef, useState } from "react";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { EXCUSES, GROUPME } from "@/lib/site";
import { SoundBank } from "./audio";
import { createGame, LIVES, TIME_LIMIT, type Game, type Snapshot } from "./engine";

const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const r = Math.ceil(s % 60) % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
};

const button =
    "inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-200 ease-brand active:translate-y-px";

/**
 * Host for the excuse wall. Owns the canvas, the sound bank, the HUD, and
 * the overlays for every non-playing state.
 */
export function Breakout({ startSignal = 0 }: { startSignal?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Game | null>(null);
    const soundsRef = useRef<SoundBank | null>(null);
    const [snap, setSnap] = useState<Snapshot>({
        state: "idle",
        timeLeft: TIME_LIMIT,
        bricksLeft: EXCUSES.length,
        balls: LIVES,
        elapsed: 0,
    });
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const sounds = new SoundBank();
        soundsRef.current = sounds;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const game = createGame(canvas, {
            excuses: EXCUSES,
            sounds,
            onSnapshot: setSnap,
            reduced,
        });
        if (!game) return;
        gameRef.current = game;

        const ro = new ResizeObserver(() => game.resize());
        ro.observe(canvas);
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) game.pause();
            },
            { threshold: 0.35 }
        );
        io.observe(canvas);

        const onBlur = () => game.pause();
        const onKey = (e: KeyboardEvent) => {
            if (game.getState() !== "playing") return;
            const down = e.type === "keydown";
            switch (e.key) {
                case "ArrowLeft":
                case "a":
                case "A":
                    game.setKey(-1, down);
                    e.preventDefault();
                    break;
                case "ArrowRight":
                case "d":
                case "D":
                    game.setKey(1, down);
                    e.preventDefault();
                    break;
                case " ":
                    if (down) game.launch();
                    e.preventDefault();
                    break;
                case "Escape":
                    if (down) game.pause();
                    break;
            }
        };
        const onMove = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            game.setPointerX(e.clientX - r.left);
        };
        const onDown = (e: PointerEvent) => {
            onMove(e);
            game.launch();
        };

        window.addEventListener("blur", onBlur);
        window.addEventListener("keydown", onKey);
        window.addEventListener("keyup", onKey);
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerdown", onDown);

        return () => {
            ro.disconnect();
            io.disconnect();
            window.removeEventListener("blur", onBlur);
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("keyup", onKey);
            canvas.removeEventListener("pointermove", onMove);
            canvas.removeEventListener("pointerdown", onDown);
            game.destroy();
            sounds.destroy();
            gameRef.current = null;
            soundsRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (startSignal > 0) gameRef.current?.start();
    }, [startSignal]);

    useEffect(() => {
        if (soundsRef.current) soundsRef.current.muted = muted;
    }, [muted]);

    const start = () => gameRef.current?.start();
    const resume = () => gameRef.current?.resume();

    return (
        <div className="w-full">
            <div className="flex items-center justify-between border border-b-0 border-rule-dark bg-ink px-4 py-2.5 font-mono text-xs text-bone-dim sm:px-5 sm:text-[13px]">
                <span className="tabular-nums">
                    <span className="text-bone-faint">TIME </span>
                    <span className={snap.timeLeft <= 15 && snap.state === "playing" ? "text-ember" : "text-bone"}>
                        {fmt(snap.timeLeft)}
                    </span>
                </span>
                <span className="tabular-nums">
                    <span className="text-bone-faint">WALL </span>
                    <span className="text-bone">{snap.bricksLeft}</span>
                </span>
                <span className="flex items-center gap-2">
                    <span className="text-bone-faint">BALLS</span>
                    <span className="flex gap-1" aria-label={`${snap.balls} balls left`}>
                        {Array.from({ length: LIVES }).map((_, i) => (
                            <span
                                key={i}
                                className={`inline-block h-2 w-2 ${i < snap.balls ? "bg-ember" : "bg-rule-dark"}`}
                            />
                        ))}
                    </span>
                </span>
            </div>

            <div className="relative aspect-[4/5] w-full overflow-hidden border border-rule-dark bg-ink-2 sm:aspect-[4/3] md:aspect-[16/10]">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 h-full w-full cursor-none touch-none"
                    aria-label="Break the wall of excuses"
                />

                {snap.state !== "playing" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/75 px-6 text-center backdrop-blur-[2px]">
                        {snap.state === "idle" && (
                            <>
                                <h3 className="text-4xl font-semibold tracking-[-0.03em] text-bone sm:text-5xl">
                                    Break the wall.
                                </h3>
                                <p className="mt-3 max-w-[30ch] text-base text-bone-dim">
                                    Two minutes. Twelve excuses. Three balls.
                                </p>
                                <button type="button" onClick={start} className={`${button} mt-8 bg-bone text-ink hover:bg-paper`}>
                                    Start
                                </button>
                                <p className="mt-6 font-mono text-xs text-bone-faint">
                                    Arrow keys or drag. Space or tap to launch.
                                </p>
                            </>
                        )}
                        {snap.state === "paused" && (
                            <>
                                <h3 className="text-4xl font-semibold tracking-[-0.03em] text-bone">
                                    Paused.
                                </h3>
                                <button type="button" onClick={resume} className={`${button} mt-8 bg-bone text-ink hover:bg-paper`}>
                                    Resume
                                </button>
                            </>
                        )}
                        {snap.state === "won" && (
                            <>
                                <h3 className="text-5xl font-semibold tracking-[-0.03em] text-bone sm:text-6xl">
                                    Shipped.
                                </h3>
                                <p className="mt-3 max-w-[30ch] text-base text-bone-dim">
                                    Wall cleared in {fmt(snap.elapsed)}. That is what a
                                    night here feels like.
                                </p>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <a
                                        href={GROUPME}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`${button} bg-crimson text-paper hover:bg-crimson-bright`}
                                    >
                                        Join the GroupMe
                                    </a>
                                    <button
                                        type="button"
                                        onClick={start}
                                        className={`${button} border border-bone/30 text-bone hover:border-bone/70`}
                                    >
                                        Play again
                                    </button>
                                </div>
                            </>
                        )}
                        {snap.state === "lost" && (
                            <>
                                <h3 className="text-4xl font-semibold tracking-[-0.03em] text-bone sm:text-5xl">
                                    {snap.timeLeft <= 0 ? "Out of time." : "Next semester, then?"}
                                </h3>
                                <p className="mt-3 max-w-[30ch] text-base text-bone-dim">
                                    {snap.bricksLeft} of {EXCUSES.length} still standing.
                                </p>
                                <button type="button" onClick={start} className={`${button} mt-8 bg-bone text-ink hover:bg-paper`}>
                                    Try again
                                </button>
                            </>
                        )}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    aria-label={muted ? "Unmute" : "Mute"}
                    aria-pressed={muted}
                    className="absolute right-3 top-3 p-2 text-bone-dim transition-colors hover:text-bone"
                >
                    {muted ? <SpeakerSlash size={20} weight="light" /> : <SpeakerHigh size={20} weight="light" />}
                </button>
            </div>
        </div>
    );
}
