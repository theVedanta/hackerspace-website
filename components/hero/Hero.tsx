"use client";

import { useCallback, useRef, useState } from "react";
import {
    motion,
    useMotionValueEvent,
    useScroll,
    useTransform,
} from "motion/react";
import { prefersReducedMotion } from "@/lib/useReduce";
import { GROUPME } from "@/lib/site";
import { Accent } from "@/components/brand/Accent";
import { Chimes } from "@/components/brand/Chimes";
import { Cta } from "@/components/ui/Cta";
import { INTRO_DURATION, INTRO_KEY } from "@/lib/intro";
import { Particles, type Layout } from "./Particles";
import { Scramble } from "./Scramble";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Pinned hero. The section is tall; the viewport-sized inner stays put while
 * the first stretch of scroll turns the sky from bone to ink, lights up the
 * tower's circuit trace, and flips the headline from the excuse to the answer.
 */
export function Hero() {
    const ref = useRef<HTMLElement>(null);
    const [isNight, setIsNight] = useState(false);
    const [glOk, setGlOk] = useState(true);
    const wasNight = useRef(false);
    // Entrance timing. Client-only values that never reach the markup, so
    // reading them during hydration is safe. The entrance waits for the
    // first-visit curtain, and collapses under reduced motion.
    const [{ hold, reduce }] = useState(() => {
        if (typeof window === "undefined") return { hold: 0, reduce: false };
        const reduce = prefersReducedMotion();
        let seen = true;
        try {
            seen = sessionStorage.getItem(INTRO_KEY) === "1";
        } catch {
            seen = true;
        }
        return { reduce, hold: reduce || seen ? 0 : INTRO_DURATION * 0.8 };
    });

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });
    const night = useTransform(scrollYProgress, [0.06, 0.6], [0, 1], {
        clamp: true,
    });
    const drift = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);

    useMotionValueEvent(night, "change", (v) => {
        document.documentElement.style.setProperty("--night", v.toFixed(3));
        const n = v > 0.45;
        if (n !== wasNight.current) {
            wasNight.current = n;
            setIsNight(n);
        }
    });

    const onUnavailable = useCallback(() => setGlOk(false), []);
    const copyRef = useRef<HTMLDivElement>(null);

    // Desktop: tower to the right of the copy. Phones: fit it between the nav
    // and wherever the copy block starts, so they never overlap.
    const resolveLayout = useCallback((canvas: HTMLCanvasElement): Layout => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width >= 768) return { cx: 0.71, cy: 0.5, height: 0.78 };
        const copyTop = copyRef.current?.getBoundingClientRect().top ?? rect.height * 0.55;
        const top = 84;
        const bottom = Math.max(top + 120, copyTop - rect.top - 20);
        const height = (bottom - top) / rect.height;
        return { cx: 0.5, cy: (top + bottom) / 2 / rect.height, height };
    }, []);

    const enter = (delay: number) => ({
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
        transition: reduce
            ? { duration: 0.3, delay: 0 }
            : { duration: 0.9, delay: hold + delay, ease: EASE },
    });

    return (
        <section
            ref={ref}
            id="top"
            className="relative h-[190svh] md:h-[230vh]"
        >
            <div className="sky-bg sky-fg sticky top-0 isolate h-[100dvh] overflow-hidden">
                <div
                    aria-hidden="true"
                    className="brand-grid brand-grid-sky pointer-events-none absolute inset-0"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 hidden md:block"
                    style={{
                        opacity: "var(--night)",
                        background:
                            "radial-gradient(ellipse 34% 60% at 71% 50%, hsl(var(--crimson) / 0.28), transparent 70%)",
                    }}
                />

                {glOk ? (
                    <Particles
                        night={night}
                        resolveLayout={resolveLayout}
                        onUnavailable={onUnavailable}
                        className="absolute inset-0 h-full w-full"
                    />
                ) : (
                    <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-[12vh] md:items-center md:justify-end md:pr-[8vw] md:pt-0">
                        <Chimes
                            className="h-[46vh] w-auto text-crimson md:h-[76vh]"
                        />
                    </div>
                )}

                <motion.div
                    style={{ y: drift }}
                    className="relative mx-auto flex h-full max-w-shell flex-col justify-end px-5 pb-14 pt-24 sm:px-8 md:justify-center md:pb-0"
                >
                    <div ref={copyRef} className="md:max-w-[60%]">
                        <motion.h1
                            {...enter(0.15)}
                            className="text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[5.25rem]"
                        >
                            <Scramble text={isNight ? "HackBama says" : "Everybody says"} />
                            <br />
                            <Accent className="sky-accent">
                                <Scramble text={isNight ? "tonight." : "next semester."} />
                            </Accent>
                        </motion.h1>

                        <motion.p
                            {...enter(0.3)}
                            className="sky-fg-soft mt-6 max-w-[42ch] text-base leading-relaxed sm:text-lg"
                        >
                            The build club at The University of Alabama. Show up,
                            build something real, walk out with it running.
                        </motion.p>

                        <motion.div
                            {...enter(0.42)}
                            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
                        >
                            <Cta href={GROUPME} external size="lg">
                                Join the GroupMe
                            </Cta>
                            <Cta href="#play" variant="ghost" size="lg">
                                Break some excuses
                            </Cta>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
