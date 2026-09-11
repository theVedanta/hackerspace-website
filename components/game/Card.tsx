"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { StationContent } from "@/lib/stations";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * What a lit spot has to say. Slides up from the bottom on phones and in
 * from the right on wider screens. Continue (or Enter, Space, Escape) closes.
 */
export function Card({ content, onClose }: { content: StationContent; onClose: () => void }) {
    const btn = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        btn.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" || e.key === "Enter" || e.key === " " || e.key === "e" || e.key === "E") {
                e.preventDefault();
                onClose();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="pointer-events-auto absolute inset-x-0 bottom-0 max-h-[78dvh] overflow-y-auto border-t border-rule-dark bg-ink/95 backdrop-blur-md md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[440px] md:border-l md:border-t-0"
        >
            <div className="flex min-h-full flex-col px-6 pb-7 pt-7 sm:px-8 md:justify-center">
                <h2
                    id="card-title"
                    className="text-balance text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.03em] text-bone sm:text-[2rem]"
                >
                    {content.title}
                </h2>
                <div className="mt-5 flex flex-col gap-4">
                    {content.body.map((p) => (
                        <p key={p} className="text-[15px] leading-relaxed text-bone-dim sm:text-base">
                            {p}
                        </p>
                    ))}
                </div>
                {content.list && (
                    <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-2">
                        {content.list.map((item) => (
                            <li key={item} className="flex gap-2 text-[14px] leading-snug text-bone">
                                <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-crimson" />
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
                {content.people && (
                    <ul className="mt-6 border-t border-rule-dark pt-4">
                        {content.people.map((p) => (
                            <li key={p.name} className="flex items-baseline justify-between gap-4 py-1.5">
                                <span className="font-medium text-bone">{p.name}</span>
                                <span className="font-mono text-xs text-bone-faint">{p.role}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                    {content.cta && (
                        <a
                            href={content.cta.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-crimson px-6 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-crimson-bright active:translate-y-px"
                        >
                            {content.cta.label}
                            <ArrowUpRight size={16} weight="bold" />
                        </a>
                    )}
                    <button
                        ref={btn}
                        type="button"
                        onClick={onClose}
                        className={`inline-flex items-center px-6 py-3 text-[15px] font-medium transition-colors active:translate-y-px ${
                            content.cta
                                ? "border border-bone/30 text-bone hover:border-bone/70"
                                : "bg-bone text-ink hover:bg-paper"
                        }`}
                    >
                        {content.cta ? "Keep walking" : "Continue"}
                    </button>
                </div>
            </div>
        </motion.aside>
    );
}
