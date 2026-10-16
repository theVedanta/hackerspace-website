"use client";

import { motion } from "motion/react";
import { Mark } from "@/components/hackbama1/Mark";
import { MEETING } from "@/lib/site";
import { EventCard } from "./Event";

const EASE = [0.16, 1, 0.3, 1] as const;
const CRIMSON_POP = { "--pop": "hsl(var(--crimson))" } as React.CSSProperties;

function rise(delay: number) {
    return {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: EASE, delay },
    };
}

export function Title({ onBegin, onJournal }: { onBegin: () => void; onJournal: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: EASE } }}
            className="on-ink pointer-events-auto absolute inset-0 flex flex-col justify-between gap-4 overflow-y-auto p-4 sm:p-6 lg:flex-row lg:items-end lg:p-10"
        >
            {/* HackBama_01 sits above the fold on phones and beside the title on desktop. */}
            <motion.div {...rise(0.15)} className="w-full lg:order-2 lg:max-w-[440px]">
                <div className="lg:hidden">
                    <EventCard compact />
                </div>
                <div className="hidden lg:block">
                    <EventCard />
                </div>
            </motion.div>

            <div className="w-full max-w-[640px] bg-ink/90 px-5 pb-7 pt-6 sm:px-8 lg:order-1">
                <motion.p {...rise(0.2)} className="meta flex items-center gap-2.5 text-[10px] text-bone-dim sm:text-[11px]">
                    <Mark className="h-3.5 w-auto text-bone" />
                    <span>HackBama · The University of Alabama</span>
                </motion.p>
                <motion.h1
                    {...rise(0.35)}
                    className="display mt-5 max-w-[13ch] text-balance text-[2.5rem] text-bone sm:text-6xl lg:text-[4.25rem]"
                >
                    Everybody says <span className="text-ember">next semester.</span>
                </motion.h1>
                <motion.p {...rise(0.5)} className="tagline mt-4 max-w-[42ch] text-base text-bone-dim sm:text-lg">
                    Build things. Ship things. Roll Tide. Walk the Quad tonight: six lights, one room, the build club that meets{" "}
                    {MEETING.when} in {MEETING.where}.
                </motion.p>
                <motion.div {...rise(0.65)} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <button
                        type="button"
                        onClick={onBegin}
                        style={CRIMSON_POP}
                        className="pop display inline-flex items-center gap-4 bg-bone px-7 py-3.5 text-[15px] text-ink"
                    >
                        Begin <span className="font-mono text-sm normal-case">{">"}_</span>
                    </button>
                    <button
                        type="button"
                        onClick={onJournal}
                        className="meta text-[11px] text-bone-dim underline decoration-bone/30 underline-offset-4 transition-colors hover:text-bone"
                    >
                        Prefer to read? The whole club on one page
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}
