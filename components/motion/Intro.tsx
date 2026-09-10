"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getLenis } from "@/lib/lenis";
import { INTRO_DURATION, INTRO_KEY } from "@/lib/intro";

const LETTERS = "HACKBAMA".split("");
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * First-visit curtain. The wordmark sets itself letter by letter, a crimson
 * rule underlines it, and the curtain lifts. Once per session, never under
 * reduced motion.
 */
export function Intro() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let seen = true;
        try {
            seen = sessionStorage.getItem(INTRO_KEY) === "1";
        } catch {
            seen = true;
        }
        if (reduce || seen) return;
        setShow(true);
        getLenis()?.stop();
        window.scrollTo(0, 0);
        const t = window.setTimeout(() => {
            setShow(false);
            getLenis()?.start();
            try {
                sessionStorage.setItem(INTRO_KEY, "1");
            } catch {
                /* private mode */
            }
        }, INTRO_DURATION * 1000);
        return () => {
            window.clearTimeout(t);
            getLenis()?.start();
        };
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="intro"
                    aria-hidden="true"
                    className="fixed inset-0 z-intro flex items-center justify-center bg-ink text-bone"
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: EASE }}
                >
                    <div className="flex flex-col items-center">
                        <div className="flex overflow-hidden font-display text-[clamp(2rem,7vw,5rem)] font-bold tracking-[0.18em]">
                            {LETTERS.map((l, i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block"
                                    initial={{ y: "110%" }}
                                    animate={{ y: 0 }}
                                    transition={{
                                        duration: 0.7,
                                        delay: 0.05 + i * 0.045,
                                        ease: EASE,
                                    }}
                                >
                                    {l}
                                </motion.span>
                            ))}
                        </div>
                        <motion.span
                            className="mt-3 block h-[3px] w-full origin-left bg-crimson"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
