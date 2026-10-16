"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { StationContent } from "@/lib/stations";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Internal links open in place; everything else in a new tab. */
export function Out({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
    if (href.startsWith("/")) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        );
    }
    return (
        <a href={href} target="_blank" rel="noreferrer" className={className}>
            {children}
        </a>
    );
}

/**
 * What a lit spot has to say, on a sheet of brand paper. Slides up from the
 * bottom on phones and in from the right on wider screens. Continue (or
 * Enter, Space, Escape) closes.
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

    const [primary, ...rest] = content.links ?? [];

    return (
        <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="pointer-events-auto absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto border-t-4 border-crimson bg-card text-ink md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[460px] md:border-l-4 md:border-t-0"
        >
            <div className="flex min-h-full flex-col px-6 pb-7 pt-6 sm:px-8 md:justify-center">
                <p className="meta text-[10px] text-crimson sm:text-[11px]">
                    <span aria-hidden="true">{">"}_ </span>
                    {content.label}
                </p>
                <h2 id="card-title" className="display mt-3 text-balance text-[1.7rem] sm:text-[2rem]">
                    {content.title}
                </h2>
                <div className="mt-5 flex flex-col gap-4">
                    {content.body.map((p) => (
                        <p key={p} className="text-[15px] leading-[1.6] text-ink-soft sm:text-base">
                            {p}
                        </p>
                    ))}
                </div>
                {content.list && (
                    <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-2 border-t border-rule pt-4">
                        {content.list.map((item) => (
                            <li key={item} className="flex gap-2 text-[14px] leading-snug">
                                <span aria-hidden="true" className="mt-[6px] h-1.5 w-1.5 shrink-0 bg-crimson" />
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
                {content.people && (
                    <ul className="mt-6 border-t border-rule pt-3">
                        {content.people.map((p) => (
                            <li key={p.name} className="flex items-baseline justify-between gap-4 py-1.5">
                                <span className="font-semibold">{p.name}</span>
                                <span className="meta text-[10px] text-ink-soft">{p.role}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                    {primary && (
                        <Out
                            href={primary.href}
                            className="pop display inline-flex items-center gap-3 bg-crimson px-5 py-3 text-[14px] text-card"
                        >
                            {primary.label} <span className="font-mono text-xs normal-case">{">"}_</span>
                        </Out>
                    )}
                    {rest.map((l) => (
                        <Out
                            key={l.href}
                            href={l.href}
                            className="meta inline-flex items-center border-2 border-ink px-4 py-2.5 text-[10px] transition-colors hover:bg-ink hover:text-card"
                        >
                            {l.label}
                        </Out>
                    ))}
                    <button
                        ref={btn}
                        type="button"
                        onClick={onClose}
                        className={
                            primary
                                ? "meta inline-flex items-center px-2 py-2.5 text-[10px] text-ink-soft underline underline-offset-4 hover:text-ink"
                                : "pop display inline-flex items-center gap-3 bg-ink px-6 py-3 text-[14px] text-card"
                        }
                    >
                        {primary ? "Keep walking" : "Continue"}
                    </button>
                </div>
            </div>
        </motion.aside>
    );
}
