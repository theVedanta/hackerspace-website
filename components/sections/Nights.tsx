"use client";

import { useRef } from "react";
import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
    wrap,
} from "motion/react";
import { NIGHTS } from "@/lib/site";
import { useReduce } from "@/lib/useReduce";
import { Reveal } from "@/components/motion/Reveal";

function Row({
    items,
    baseVelocity,
    outline,
}: {
    items: readonly string[];
    baseVelocity: number;
    outline?: boolean;
}) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const velocity = useVelocity(scrollY);
    const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
    const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
    const skew = useTransform(smooth, [-1500, 1500], [6, -6], { clamp: true });
    const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
    const direction = useRef(baseVelocity > 0 ? 1 : -1);

    useAnimationFrame((_, delta) => {
        let moveBy = direction.current * Math.abs(baseVelocity) * (delta / 1000);
        const f = factor.get();
        if (f < 0) direction.current = baseVelocity > 0 ? -1 : 1;
        else if (f > 0) direction.current = baseVelocity > 0 ? 1 : -1;
        moveBy += moveBy * Math.abs(f);
        baseX.set(baseX.get() + moveBy);
    });

    const row = [...items, ...items];

    return (
        <div className="flex overflow-hidden whitespace-nowrap">
            <motion.div style={{ x, skewX: skew }} className="flex shrink-0">
                {row.map((n, i) => (
                    <span
                        key={`${n}-${i}`}
                        className={`flex shrink-0 items-center gap-6 pr-6 text-[clamp(2.25rem,6.5vw,6rem)] font-semibold leading-[1.1] tracking-[-0.035em] transition-colors duration-300 sm:gap-8 sm:pr-8 ${
                            outline
                                ? "text-transparent [-webkit-text-stroke:1px_hsl(var(--bone-dim))] hover:[-webkit-text-stroke-color:hsl(var(--ember))]"
                                : "text-bone hover:text-ember"
                        }`}
                    >
                        {n}
                        <span
                            aria-hidden="true"
                            className="inline-block h-[0.18em] w-[0.18em] shrink-0 bg-crimson"
                        />
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

/**
 * The single marquee on the page. Motivated: the point is breadth, that the
 * calendar keeps moving and no two nights repeat. It follows the scroll:
 * flick the page and the rows speed up, lean, and reverse with you.
 */
export function Nights() {
    const reduce = useReduce();
    const second = [...NIGHTS.slice(6), ...NIGHTS.slice(0, 6)];

    return (
        <section
            id="nights"
            className="overflow-hidden border-b border-rule-dark py-24 md:py-36"
        >
            <div className="mx-auto max-w-shell px-5 sm:px-8">
                <Reveal>
                    <h2 className="max-w-[20ch] text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-bone sm:text-5xl md:text-[3.75rem]">
                        The rest of the calendar is not a lecture.
                    </h2>
                    <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-bone-dim">
                        A rotating set of nights built so that showing up alone
                        is never awkward.
                    </p>
                </Reveal>
            </div>

            {reduce ? (
                <ul className="mx-auto mt-14 grid max-w-shell grid-cols-2 gap-x-8 gap-y-3 px-5 sm:px-8 md:grid-cols-3">
                    {NIGHTS.map((n) => (
                        <li
                            key={n}
                            className="text-lg font-medium tracking-[-0.015em] text-bone md:text-xl"
                        >
                            {n}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="mt-14 flex select-none flex-col gap-2 md:mt-20">
                    <Row items={NIGHTS} baseVelocity={-38} />
                    <Row items={second} baseVelocity={30} outline />
                </div>
            )}
        </section>
    );
}
