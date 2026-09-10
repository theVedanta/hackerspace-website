"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { prefersReducedMotion } from "@/lib/useReduce";
import { OFFICERS, FOUNDING } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

function Count({ to }: { to: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        const el = ref.current;
        if (!el || !inView) return;
        if (prefersReducedMotion()) {
            el.textContent = String(to);
            return;
        }
        const controls = animate(0, to, {
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => {
                el.textContent = String(Math.round(v));
            },
        });
        return () => controls.stop();
    }, [inView, to]);

    return (
        <span ref={ref} className="tabular-nums">
            0
        </span>
    );
}

/**
 * The one number that matters, at the size it deserves, and the people
 * standing behind it.
 */
export function Proof() {
    return (
        <section className="border-b border-rule-dark">
            <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 md:py-36">
                <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-end md:gap-16">
                    <Reveal>
                        <p className="text-[clamp(7rem,24vw,17rem)] font-semibold leading-[0.85] tracking-[-0.06em] text-ember">
                            <Count to={70} />
                        </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="max-w-[24ch] text-3xl font-semibold leading-[1.15] tracking-[-0.025em] text-bone sm:text-4xl">
                            students joined the group chat before this club was
                            allowed to exist.
                        </p>
                        <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-bone-dim">
                            Six of them volunteered to mentor. Nobody asked
                            them to. That is the whole argument for why
                            HackBama should be here.
                        </p>
                    </Reveal>
                </div>

                <Reveal delay={0.15}>
                    <div className="mt-20 grid gap-10 border-t border-rule-dark pt-10 md:grid-cols-[1fr_1fr] md:gap-16">
                        <ul>
                            {OFFICERS.map((o) => (
                                <li
                                    key={o.name}
                                    className="flex items-baseline justify-between gap-6 py-3"
                                >
                                    <span className="text-lg font-medium tracking-[-0.01em] text-bone">
                                        {o.name}
                                    </span>
                                    <span className="shrink-0 font-mono text-sm text-bone-faint">
                                        {o.role}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p className="max-w-[40ch] text-base leading-relaxed text-bone-dim md:justify-self-end md:text-right">
                            With founding members {FOUNDING[0]}, {FOUNDING[1]},
                            and {FOUNDING[2]}.
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
