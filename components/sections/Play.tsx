"use client";

import { useCallback, useState } from "react";
import { useKonami } from "@/lib/konami";
import { scrollTo } from "@/lib/lenis";
import { Reveal } from "@/components/motion/Reveal";
import { Breakout } from "@/components/game/Breakout";

/**
 * The excuse wall. The Konami code from anywhere on the page scrolls here and
 * starts a round.
 */
export function Play() {
    const [signal, setSignal] = useState(0);

    const onKonami = useCallback(() => {
        scrollTo("#play", { offset: -32 });
        window.setTimeout(() => setSignal((s) => s + 1), 1000);
    }, []);
    useKonami(onKonami);

    return (
        <section id="play" className="border-b border-rule-dark">
            <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 md:py-36">
                <Reveal>
                    <h2 className="max-w-[18ch] text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-bone sm:text-5xl md:text-[3.75rem]">
                        Every excuse you have heard, in one wall.
                    </h2>
                    <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-bone-dim">
                        Two minutes on the clock. Clear it.
                    </p>
                </Reveal>
                <Reveal delay={0.1} className="mt-12 md:mt-16">
                    <div className="mx-auto max-w-[1000px]">
                        <Breakout startSignal={signal} />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
