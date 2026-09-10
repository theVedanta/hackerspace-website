"use client";

import { useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    type MotionValue,
} from "motion/react";
import { useReduce } from "@/lib/useReduce";
import { Reveal } from "@/components/motion/Reveal";

const STATEMENT = "Nobody is missing talent. They are missing a door.";

function Word({
    children,
    range,
    progress,
}: {
    children: string;
    range: [number, number];
    progress: MotionValue<number>;
}) {
    const opacity = useTransform(progress, range, [0.16, 1]);
    return (
        <motion.span style={{ opacity }} className="mr-[0.24em] inline-block">
            {children}
        </motion.span>
    );
}

/**
 * The manifesto. Each word resolves as it scrolls into the middle of the
 * viewport, so the sentence is read at the pace it was written to be.
 */
export function Why() {
    const ref = useRef<HTMLParagraphElement>(null);
    const reduce = useReduce();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.9", "end 0.5"],
    });
    const words = STATEMENT.split(" ");

    return (
        <section id="why" className="relative border-b border-rule-dark">
            <div className="mx-auto max-w-shell px-5 py-28 sm:px-8 md:py-44">
                <p
                    ref={ref}
                    className="max-w-[16ch] text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.035em] text-bone sm:text-6xl md:text-[5.5rem]"
                >
                    {words.map((word, i) =>
                        reduce ? (
                            <span key={i} className="mr-[0.24em] inline-block">
                                {word}
                            </span>
                        ) : (
                            <Word
                                key={i}
                                progress={scrollYProgress}
                                range={[i / words.length, (i + 1) / words.length]}
                            >
                                {word}
                            </Word>
                        )
                    )}
                </p>

                <div className="mt-20 grid gap-8 md:grid-cols-2 md:gap-16">
                    <Reveal>
                        <p className="max-w-[46ch] text-lg leading-relaxed text-bone-dim">
                            Every fall, students arrive curious. They hear about
                            hackathons, open source, the people shipping things
                            at 2am. Then they wait, because nobody told them
                            what the first step looks like.
                        </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="max-w-[46ch] text-lg leading-relaxed text-bone-dim">
                            So we made the first step small. One room, one
                            evening, one thing that runs by the end of it. The
                            students who have already shipped something are the
                            ones who show up to the real hackathon in spring.
                        </p>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
