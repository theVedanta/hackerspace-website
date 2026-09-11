"use client";

import { motion } from "motion/react";
import { Accent } from "@/components/brand/Accent";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Title({ onBegin, onJournal }: { onBegin: () => void; onJournal: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: EASE } }}
            className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-end px-4 pb-[8dvh] text-center"
        >
            <div className="flex w-full max-w-[640px] flex-col items-center bg-ink/90 px-6 pb-9 pt-8 sm:px-10">
            <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                className="font-display text-lg font-bold tracking-[0.18em] text-bone"
            >
                HACKBAMA
            </motion.p>
            <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
                className="mt-4 max-w-[14ch] text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] text-bone sm:text-6xl md:text-7xl"
            >
                Everybody says <Accent>next semester.</Accent>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
                className="mt-5 max-w-[40ch] text-base leading-relaxed text-bone-dim sm:text-lg"
            >
                Walk the Quad tonight. Six lights, one room, a club at The University of Alabama.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
                className="mt-8 flex flex-col items-center gap-4"
            >
                <button
                    type="button"
                    onClick={onBegin}
                    className="bg-bone px-9 py-4 text-base font-medium text-ink transition-colors hover:bg-paper active:translate-y-px"
                >
                    Begin
                </button>
                <button
                    type="button"
                    onClick={onJournal}
                    className="text-sm text-bone-faint underline decoration-bone/20 underline-offset-4 transition-colors hover:text-bone-dim"
                >
                    Prefer to read? Open the journal.
                </button>
            </motion.div>
            </div>
        </motion.div>
    );
}
