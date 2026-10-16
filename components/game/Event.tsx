"use client";

import Link from "next/link";
import { REGISTER } from "@/lib/hackbama1";
import { END, START, live, phase, short } from "@/components/hackbama1/timeline";
import { pad, split, useNow } from "@/components/hackbama1/useNow";

const CRIMSON_POP = { "--pop": "hsl(var(--crimson))" } as React.CSSProperties;

/**
 * HackBama_01 on the title screen. Counts down to check-in, says what is
 * happening while it runs, and points at the recap once it is over.
 */
export function EventCard({ compact = false }: { compact?: boolean }) {
    const now = useNow();
    const p = now === null ? "soon" : phase(now);
    const t = split(now === null ? 0 : START - now);
    const digits = [
        { v: now === null ? "--" : pad(t.d), u: "days" },
        { v: now === null ? "--" : pad(t.h), u: "hrs" },
        { v: now === null ? "--" : pad(t.m), u: "min" },
        { v: now === null ? "--" : pad(t.s), u: "sec" },
    ];
    const happening = now === null ? "" : live(now).map((b) => b.title).join(" + ") || "Between blocks";

    return (
        <section aria-label="HackBama_01" className="pop w-full bg-card text-ink" style={CRIMSON_POP}>
            <div className="flex items-center justify-between gap-3 bg-crimson px-4 py-2 text-card">
                <span className="meta text-[10px] sm:text-[11px]">
                    {p === "soon" ? "▪ Next up" : p === "live" ? "▪ Live now" : "▪ Shipped"}
                </span>
                <span className="meta text-[10px] sm:text-[11px]">Sat 10.17 · HM Comer</span>
            </div>

            <div className={compact ? "px-4 pb-4 pt-3" : "px-5 pb-5 pt-5"}>
                <div className="flex items-end justify-between gap-3">
                    <h2 className={`display whitespace-nowrap ${compact ? "text-[1.7rem]" : "text-[2.75rem]"}`}>
                        HackBama<span className="text-crimson">_</span>01
                    </h2>
                    {compact && p === "soon" && (
                        <span className="display tnum pb-0.5 text-[1.05rem] text-crimson">{now === null ? "--" : short(START - now)}</span>
                    )}
                </div>
                <p className="meta mt-1.5 text-[10px] text-ink-soft sm:text-[11px]">
                    12-hour hackathon · 2 tracks · $1,800 in prizes
                </p>

                {!compact && p === "soon" && (
                    <div className="mt-5 flex items-start gap-2" aria-label={`Starts in ${t.d} days, ${t.h} hours, ${t.m} minutes`}>
                        {digits.map((d, i) => (
                            <div key={d.u} className="flex items-start gap-2" aria-hidden="true">
                                {i > 0 && <span className="display text-[2rem] text-cream-3">:</span>}
                                <div>
                                    <div className="display tnum text-[2rem]">{d.v}</div>
                                    <div className="meta mt-1 text-[9px] text-ink-soft">{d.u}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!compact && p !== "soon" && (
                    <p className="mt-4 font-mono text-[13px]">
                        <span className="text-crimson">{">"} </span>
                        {p === "live" ? `Now: ${happening}. Ends 8:30 PM.` : "That was HackBama_01. HackBama II is in February."}
                    </p>
                )}

                <div className={`flex flex-wrap gap-2 ${compact ? "mt-3" : "mt-5"}`}>
                    {p !== "done" && (
                        <a
                            href={REGISTER}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="display inline-flex items-center gap-3 bg-crimson px-4 py-2.5 text-[13px] text-card transition-colors hover:bg-crimson-deep"
                        >
                            Register <span className="font-mono text-xs normal-case">{">"}_</span>
                        </a>
                    )}
                    <Link
                        href="/hackbama1"
                        className="meta inline-flex items-center border-2 border-ink px-3 py-2 text-[10px] transition-colors hover:bg-ink hover:text-card"
                    >
                        {p === "done" ? "See the recap" : "Schedule, tracks, rules"}
                    </Link>
                </div>
            </div>
        </section>
    );
}

/** The HUD's way back to the event, always one tap away. */
export function EventChip() {
    const now = useNow();
    const p = now === null ? "soon" : phase(now);
    const tail = now === null ? "" : p === "soon" ? short(START - now) : p === "live" ? `live · ${short(END - now)} left` : "recap";
    return (
        <Link
            href="/hackbama1"
            className="flex items-center gap-2 whitespace-nowrap bg-crimson px-3 py-2.5 text-card transition-colors hover:bg-crimson-bright"
        >
            <span className="display text-[13px]">
                <span className="sm:hidden">HB_01</span>
                <span className="hidden sm:inline">HackBama_01</span>
            </span>
            {tail && <span className="meta tnum text-[10px] text-card/85">{tail}</span>}
        </Link>
    );
}
