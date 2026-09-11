"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { X } from "@phosphor-icons/react";
import { STATIONS, type StationId } from "@/lib/stations";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Everything found so far, and a way to read all of it without walking.
 * This is also the page for anyone who cannot or would rather not play.
 */
export function Journal({
    found,
    onClose,
    onRevealAll,
    onReset,
}: {
    found: Set<StationId>;
    onClose: () => void;
    onRevealAll: () => void;
    onReset: () => void;
}) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Journal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto absolute inset-0 overflow-y-auto bg-ink/96 backdrop-blur-md"
        >
            <div className="mx-auto max-w-[900px] px-5 pb-16 pt-6 sm:px-8">
                <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold tracking-[0.14em] text-bone">HACKBAMA</span>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close journal"
                        className="p-2 text-bone-dim transition-colors hover:text-bone"
                    >
                        <X size={24} weight="light" />
                    </button>
                </div>

                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
                    className="mt-10 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-bone sm:text-5xl"
                >
                    Journal
                </motion.h2>
                <p className="mt-3 max-w-[48ch] text-base text-bone-dim">
                    {found.size === 0
                        ? "Nothing yet. Walk toward a light."
                        : `${found.size} of ${STATIONS.length} found.`}
                </p>

                <ol className="mt-10 grid gap-px bg-rule-dark sm:grid-cols-2">
                    {STATIONS.map((s, i) => {
                        const known = found.has(s.id);
                        return (
                            <motion.li
                                key={s.id}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: EASE, delay: 0.08 + i * 0.04 }}
                                className={`flex flex-col bg-ink p-6 ${known ? "" : "text-bone-faint"}`}
                            >
                                <span className="font-mono text-xs text-bone-faint">{s.label}</span>
                                {known ? (
                                    <>
                                        <h3 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.02em] text-bone">
                                            {s.title}
                                        </h3>
                                        {s.body.map((p) => (
                                            <p key={p} className="mt-3 text-[15px] leading-relaxed text-bone-dim">
                                                {p}
                                            </p>
                                        ))}
                                        {s.list && (
                                            <p className="mt-3 text-[14px] leading-relaxed text-bone">
                                                {s.list.join(". ")}.
                                            </p>
                                        )}
                                        {s.people && (
                                            <p className="mt-3 text-[14px] leading-relaxed text-bone">
                                                {s.people.map((p) => `${p.name}, ${p.role}`).join(". ")}.
                                            </p>
                                        )}
                                        {s.cta && (
                                            <a
                                                href={s.cta.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-5 inline-flex w-fit bg-crimson px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-crimson-bright"
                                            >
                                                {s.cta.label}
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <p className="mt-2 text-base leading-relaxed">{s.hint}</p>
                                )}
                            </motion.li>
                        );
                    })}
                </ol>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                    {found.size < STATIONS.length && (
                        <button
                            type="button"
                            onClick={onRevealAll}
                            className="text-bone underline decoration-bone/30 underline-offset-4 transition-colors hover:decoration-bone"
                        >
                            Just show me everything
                        </button>
                    )}
                    {found.size > 0 && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="text-bone-faint underline decoration-bone/20 underline-offset-4 transition-colors hover:text-bone-dim"
                        >
                            Start over
                        </button>
                    )}
                </div>

                <p className="mt-12 border-t border-rule-dark pt-6 text-sm leading-relaxed text-bone-faint">
                    HackBama is a proposed student organization of the Department of Computer Science at The University of Alabama. Questions? Reach Vedanta Somnathe or Faizan Khan.
                </p>
            </div>
        </motion.div>
    );
}
