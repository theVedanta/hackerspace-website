"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { CADENCE } from "@/lib/site";
import { useReduce } from "@/lib/useReduce";
import { Reveal } from "@/components/motion/Reveal";
import { Clock } from "./Clock";

/**
 * The meeting cadence as a pinned horizontal pan. Vertical scroll slides the
 * three meeting types across the screen so the third one, the mini-hackathon,
 * arrives with a running clock. On phones and under reduced motion it is a
 * plain vertical stack.
 */
export function Cadence() {
    const ref = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const reduce = useReduce();
    const [travel, setTravel] = useState(0);
    const [pinned, setPinned] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 768px)");
        const measure = () => {
            const track = trackRef.current;
            const on = mq.matches && !reduce;
            setPinned(on);
            if (!track || !on) {
                setTravel(0);
                return;
            }
            setTravel(Math.max(0, track.scrollWidth - window.innerWidth));
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (trackRef.current) ro.observe(trackRef.current);
        mq.addEventListener("change", measure);
        window.addEventListener("resize", measure);
        return () => {
            ro.disconnect();
            mq.removeEventListener("change", measure);
            window.removeEventListener("resize", measure);
        };
    }, [reduce]);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });
    const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

    return (
        <section
            ref={ref}
            id="what"
            className="relative border-b border-rule-dark"
            style={pinned ? { height: `calc(100dvh + ${travel}px)` } : undefined}
        >
            <div
                className={
                    pinned
                        ? "sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden"
                        : "flex flex-col py-24"
                }
            >
                <div className="mx-auto w-full max-w-shell px-5 sm:px-8">
                    <Reveal>
                        <h2 className="max-w-[16ch] text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-bone sm:text-5xl md:text-[3.75rem]">
                            Twice a month. Every third one, a clock.
                        </h2>
                    </Reveal>
                </div>

                <motion.div
                    ref={trackRef}
                    style={pinned ? { x } : undefined}
                    className={
                        pinned
                            ? "mt-12 flex w-max items-stretch gap-4 pl-[max(1.25rem,calc((100vw-1240px)/2+2rem))] pr-[8vw]"
                            : "mx-auto mt-12 flex w-full max-w-shell flex-col gap-4 px-5 sm:px-8"
                    }
                >
                    {CADENCE.map((item) => (
                        <article
                            key={item.title}
                            className={`relative flex shrink-0 flex-col justify-between overflow-hidden border ${
                                item.featured
                                    ? "border-crimson bg-crimson text-paper"
                                    : "border-rule-dark bg-ink-2 text-bone"
                            } ${
                                pinned
                                    ? "h-[min(56vh,520px)] w-[min(72vw,760px)] p-10 md:p-12"
                                    : "min-h-[320px] p-7 sm:p-10"
                            }`}
                        >
                            {item.featured ? (
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 opacity-[0.14]"
                                    style={{
                                        background:
                                            "radial-gradient(circle at 80% 20%, hsl(var(--paper)), transparent 55%)",
                                    }}
                                />
                            ) : (
                                <div
                                    aria-hidden="true"
                                    className="brand-grid brand-grid-dark pointer-events-none absolute inset-0 opacity-70"
                                />
                            )}

                            <div className="relative">
                                <h3 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl md:text-5xl">
                                    {item.title}
                                </h3>
                                <p
                                    className={`mt-5 max-w-[38ch] text-base leading-relaxed sm:text-lg ${
                                        item.featured ? "text-paper/85" : "text-bone-dim"
                                    }`}
                                >
                                    {item.body}
                                </p>
                            </div>

                            <div className="relative mt-10">
                                <Clock
                                    dead={!item.featured}
                                    className={`text-[clamp(2.5rem,6.5vw,5.5rem)] tracking-[-0.04em] ${
                                        item.featured ? "text-paper" : "text-rule-dark"
                                    }`}
                                />
                            </div>
                        </article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
