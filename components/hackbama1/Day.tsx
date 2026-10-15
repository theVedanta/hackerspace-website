"use client";

import { SCHEDULE, at, type Block } from "@/lib/hackbama1";
import { END, START, live, past, progress } from "./timeline";
import { clock, useNow } from "./useNow";

const HOURS = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
const LANE = { up: 24, down: 70 } as const;

function x(ms: number) {
    return `${progress(ms) * 100}%`;
}

function span(b: Block) {
    const from = clock(at(b.from)).replace(" ", " ");
    return b.to ? `${from} – ${clock(at(b.to)).replace(" ", " ")}` : from;
}

/**
 * The brand's circuit motif, drawn to scale: the crimson band is the day,
 * 7:30 AM to 8:30 PM. Every block hangs off the trunk at its start time, and
 * on the day a cursor walks across it.
 */
export function Day() {
    const now = useNow();
    const on = now !== null && now >= START && now < END;
    const liveSet = new Set(now === null ? [] : live(now).map((b) => b.n));

    return (
        <div>
            <div className="overflow-x-auto border-y-2 border-ink bg-crimson" role="img" aria-label="The day as a circuit trace, 7:30 AM to 8:30 PM. The list below has every block.">
                <div className="relative mx-auto h-[210px] min-w-[820px] max-w-shell">
                    <div className="absolute inset-y-0 left-8 right-8">
                        {/* Trunk */}
                        <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 bg-cream" />
                        <div className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream" />
                        <div className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-cream" />

                        {/* Hour ticks */}
                        {HOURS.map((h) => (
                            <div key={h} className="absolute bottom-2.5 -translate-x-1/2" style={{ left: x(at(`${h}:00`)) }}>
                                <div className="mx-auto mb-1 h-1.5 w-px bg-cream/50" />
                                <span className="font-plex text-[10px] tracking-[0.12em] text-cream/75 tnum">{h}</span>
                            </div>
                        ))}

                        {SCHEDULE.map((b) => {
                            const y = LANE[b.lane];
                            const done = now !== null && past(b, now);
                            const hot = liveSet.has(b.n);
                            const left = x(at(b.from));
                            return (
                                <div key={b.n} className={done && !hot ? "opacity-40" : undefined}>
                                    {/* Stub from the trunk */}
                                    <div
                                        className="absolute w-[3px] -translate-x-1/2 bg-cream"
                                        style={{ left, top: `${Math.min(50, y)}%`, height: `${Math.abs(50 - y)}%` }}
                                    />
                                    {/* Span along its lane */}
                                    {b.to && (
                                        <>
                                            <div
                                                className="absolute h-[3px] -translate-y-1/2 bg-cream"
                                                style={{ left, width: `calc(${x(at(b.to))} - ${left})`, top: `${y}%` }}
                                            />
                                            <div
                                                className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream"
                                                style={{ left: x(at(b.to)), top: `${y}%` }}
                                            />
                                        </>
                                    )}
                                    {/* Node */}
                                    <div
                                        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-cream ${
                                            b.key || hot ? "h-[18px] w-[18px] bg-gold" : "h-3.5 w-3.5 bg-cream"
                                        } ${hot ? "cursor" : ""}`}
                                        style={{ left, top: `${y}%` }}
                                    />
                                    <span
                                        className="absolute -translate-x-1/2 whitespace-nowrap font-plex text-[11px] font-medium tracking-[0.14em] text-cream"
                                        style={{ left, top: b.lane === "up" ? `calc(${y}% - 30px)` : `calc(${y}% + 14px)` }}
                                    >
                                        {b.n}
                                        {b.key && <span className="ml-1.5 uppercase">{b.n === "05" ? "submit" : "build"}</span>}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Now */}
                        {on && (
                            <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-ink" style={{ left: x(now) }}>
                                <span className="meta absolute left-1.5 top-2 whitespace-nowrap bg-ink px-1.5 py-0.5 text-[10px] text-cream">
                                    now {clock(now)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <p className="meta mx-auto mt-2 max-w-shell px-4 text-[10px] text-ink-3 sm:px-6 md:hidden">
                {"<"} drag the trace {">"}
            </p>

            <ol className="mx-auto mt-10 max-w-shell px-4 sm:px-6 lg:px-8">
                {SCHEDULE.map((b) => {
                    const hot = liveSet.has(b.n);
                    const done = now !== null && past(b, now) && !hot;
                    return (
                        <li
                            key={b.n}
                            className={`relative grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-1 border-t border-rule py-5 md:grid-cols-[3rem_11rem_1fr_12rem] md:items-baseline ${
                                hot ? "bg-card" : ""
                            }`}
                        >
                            {hot && <span aria-hidden="true" className="absolute inset-y-0 -left-4 w-1.5 bg-crimson sm:-left-6" />}
                            <span className={`font-plex text-[13px] font-medium tnum ${b.key ? "text-crimson" : "text-ink-3"}`}>
                                {b.n}
                            </span>
                            <span className={`font-plex text-[13px] tnum md:order-none ${done ? "text-ink-3" : "text-crimson"}`}>
                                {span(b)}
                                {hot && <span className="meta ml-2 bg-crimson px-1.5 py-0.5 text-[10px] text-card">now</span>}
                            </span>
                            <div className="col-start-2 md:col-start-auto">
                                <h3 className={`display text-[1.35rem] sm:text-[1.6rem] ${done ? "text-ink-3" : ""}`}>{b.title}</h3>
                                <p className="mt-1.5 max-w-[52ch] text-[15px] text-ink-3">{b.note}</p>
                            </div>
                            <span className="meta col-start-2 mt-1 text-[11px] text-ink-3 md:col-start-auto md:mt-0 md:text-right">
                                <span className="text-gold" aria-hidden="true">
                                    ●{" "}
                                </span>
                                {b.where}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
