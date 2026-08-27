"use client";

import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { GROUPME, NAV } from "@/lib/site";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <header className="sticky top-0 z-40 border-b border-rule/70 bg-bone/85 backdrop-blur-md">
            <nav className="mx-auto flex h-16 max-w-shell items-center justify-between gap-6 px-5 sm:px-8">
                <a
                    href="#top"
                    className="font-display text-lg font-700 tracking-[0.14em] text-ink transition-colors duration-300 ease-brand hover:text-crimson"
                    style={{ fontWeight: 700 }}
                >
                    HACKBAMA
                </a>

                <div className="hidden items-center gap-8 md:flex">
                    {NAV.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="text-sm text-ink-soft transition-colors duration-300 ease-brand hover:text-crimson"
                        >
                            {item.label}
                        </a>
                    ))}
                    <a
                        href={GROUPME}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-crimson px-4 py-2 text-sm font-medium text-paper transition-transform duration-200 ease-brand hover:bg-crimson-bright active:scale-[0.98]"
                    >
                        Join the GroupMe
                    </a>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-label={open ? "Close menu" : "Open menu"}
                    className="text-ink md:hidden"
                >
                    {open ? (
                        <X size={24} weight="light" />
                    ) : (
                        <List size={24} weight="light" />
                    )}
                </button>
            </nav>

            {open && (
                <div className="border-t border-rule/70 bg-bone md:hidden">
                    <div className="mx-auto flex max-w-shell flex-col px-5 py-4 sm:px-8">
                        {NAV.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="border-b border-rule/50 py-3 text-lg font-medium text-ink last:border-0"
                            >
                                {item.label}
                            </a>
                        ))}
                        <a
                            href={GROUPME}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 bg-crimson px-4 py-3 text-center text-sm font-medium text-paper"
                        >
                            Join the GroupMe
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
