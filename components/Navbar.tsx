"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { GROUPME, NAV } from "@/lib/site";
import { getLenis } from "@/lib/lenis";
import { useReduce } from "@/lib/useReduce";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Fixed nav that reads the hero's --night so it stays legible while the sky
 * turns, then sits as ink glass over the rest of the page.
 */
export default function Navbar() {
    const [open, setOpen] = useState(false);
    const reduce = useReduce();

    useEffect(() => {
        const lenis = getLenis();
        if (open) lenis?.stop();
        else lenis?.start();
        document.body.style.overflow = open && !lenis ? "hidden" : "";
        return () => {
            lenis?.start();
            document.body.style.overflow = "";
        };
    }, [open]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <header
            className="fixed inset-x-0 top-0 z-nav"
            style={open ? ({ ["--night" as string]: 1 } as React.CSSProperties) : undefined}
        >
            <div className="sky-glass sky-rule sky-fg border-b backdrop-blur-md">
                <nav className="mx-auto flex h-16 max-w-shell items-center justify-between gap-6 px-5 sm:px-8">
                    <a
                        href="#top"
                        className="font-display text-lg font-bold tracking-[0.14em] transition-colors duration-300 ease-brand hover:text-ember"
                    >
                        HACKBAMA
                    </a>

                    <div className="hidden items-center gap-8 md:flex">
                        {NAV.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="sky-fg-soft text-sm transition-colors duration-300 ease-brand hover:!text-ember"
                            >
                                {item.label}
                            </a>
                        ))}
                        <a
                            href={GROUPME}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-crimson px-4 py-2 text-sm font-medium text-paper transition-colors duration-200 ease-brand hover:bg-crimson-bright active:translate-y-px"
                        >
                            Join the GroupMe
                        </a>
                    </div>

                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-label={open ? "Close menu" : "Open menu"}
                        className="relative z-10 md:hidden"
                    >
                        {open ? (
                            <X size={26} weight="light" />
                        ) : (
                            <List size={26} weight="light" />
                        )}
                    </button>
                </nav>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="menu"
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 -z-10 flex flex-col justify-end bg-ink px-5 pb-10 pt-24 text-bone md:hidden"
                    >
                        <div
                            aria-hidden="true"
                            className="brand-grid brand-grid-dark absolute inset-0 opacity-60"
                        />
                        <ul className="relative">
                            {[...NAV, { label: "Join", href: "#join" }].map((item, i) => (
                                <motion.li
                                    key={item.href}
                                    initial={reduce ? false : { opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.05 + i * 0.05,
                                        ease: EASE,
                                    }}
                                >
                                    <a
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="block py-3 text-[2.6rem] font-semibold leading-none tracking-[-0.035em] transition-colors hover:text-ember"
                                    >
                                        {item.label}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                        <motion.a
                            initial={reduce ? false : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                            href={GROUPME}
                            target="_blank"
                            rel="noreferrer"
                            className="relative mt-8 inline-flex items-center justify-center bg-crimson px-6 py-4 text-base font-medium text-paper"
                        >
                            Join the GroupMe
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
