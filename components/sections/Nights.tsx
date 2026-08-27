"use client";

import { motion, useReducedMotion } from "motion/react";
import { NIGHTS } from "@/lib/site";

/**
 * The single marquee on the page. Motivated: the point of this section is
 * breadth, that the calendar keeps moving and no two nights repeat. Reading
 * the list top to bottom would flatten exactly that.
 */
export function Nights() {
    const reduce = useReducedMotion();
    const row = [...NIGHTS, ...NIGHTS];

    return (
        <section
            id="nights"
            className="overflow-hidden border-b border-rule/70 py-20 md:py-28"
        >
            <div className="mx-auto max-w-shell px-5 sm:px-8">
                <h2 className="max-w-[22ch] font-display text-4xl leading-[1.1] tracking-[-0.015em] text-ink sm:text-5xl">
                    The rest of the calendar is not a lecture.
                </h2>
                <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
                    A rotating set of nights built so that showing up alone is
                    never awkward.
                </p>
            </div>

            {reduce ? (
                <ul className="mx-auto mt-12 grid max-w-shell grid-cols-2 gap-x-8 gap-y-3 px-5 sm:px-8 md:grid-cols-3">
                    {NIGHTS.map((n) => (
                        <li
                            key={n}
                            className="font-display text-xl text-ink md:text-2xl"
                        >
                            {n}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="relative mt-14 flex select-none">
                    <motion.div
                        className="flex shrink-0 items-center gap-8 pr-8 sm:gap-10 sm:pr-10"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            duration: 44,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    >
                        {row.map((n, i) => (
                            <span
                                key={`${n}-${i}`}
                                className="flex shrink-0 items-center gap-8 font-display text-2xl text-ink sm:gap-10 sm:text-4xl md:text-5xl"
                            >
                                {n}
                                <span
                                    aria-hidden="true"
                                    className="inline-block h-1.5 w-1.5 shrink-0 bg-crimson"
                                />
                            </span>
                        ))}
                    </motion.div>
                </div>
            )}
        </section>
    );
}
