"use client";

import { PROMPTS, SUBMIT, at } from "@/lib/hackbama1";
import { END, START, live, next, progress } from "./timeline";
import { clock, pad, split, useNow } from "./useNow";

type Face = {
    cmd: string;
    digits: { v: string; u: string }[];
    lines: string[];
};

function face(now: number | null): Face | null {
    if (now === null) return null;
    const hms = (ms: number) => {
        const { d, h, m, s } = split(ms);
        return [
            { v: pad(d * 24 + h), u: "hrs" },
            { v: pad(m), u: "min" },
            { v: pad(s), u: "sec" },
        ];
    };

    if (now < START) {
        const { d, h, m, s } = split(START - now);
        return {
            cmd: "until --check-in",
            digits: [
                { v: pad(d), u: "days" },
                { v: pad(h), u: "hrs" },
                { v: pad(m), u: "min" },
                { v: pad(s), u: "sec" },
            ],
            lines: ["Sat 10.17 · 7:30 AM CDT", "HM Comer Hall · front desk"],
        };
    }
    if (now >= END) {
        return {
            cmd: "status",
            digits: [],
            lines: ["That was HackBama_01.", "See you Monday, 5 PM, Tom Bevill 1066."],
        };
    }

    const nowLine = live(now)
        .map((b) => b.title)
        .join(" + ");
    const upcoming = next(now);
    const lines = [
        nowLine ? `Now: ${nowLine}` : `Now: between blocks`,
        upcoming ? `Next: ${upcoming.title} at ${clock(at(upcoming.from))}` : "Last block of the day",
    ];

    if (now < at(PROMPTS)) return { cmd: "until --hacking", digits: hms(at(PROMPTS) - now), lines };
    if (now < at(SUBMIT)) return { cmd: "until --submit", digits: hms(at(SUBMIT) - now), lines };
    return { cmd: "until --wrap", digits: hms(END - now), lines };
}

/** The hero's countdown. Knows what part of the day it is. */
export function Clock() {
    const now = useNow();
    const f = face(now);
    const p = now === null ? 0 : progress(now);
    const hour = now === null || now < START || now >= END ? 0 : Math.min(13, Math.floor((now - START) / 3_600_000) + 1);

    return (
        <div className="border-2 border-ink bg-card">
            <div className="flex items-center justify-between border-b border-ink/15 px-4 py-2.5">
                <span className="meta text-ink-3">
                    <span className="text-crimson">$</span> {f?.cmd ?? "until --check-in"}
                </span>
                {hour > 0 && (
                    <span className="meta text-ink-3 tnum" aria-hidden="true">
                        hr {pad(hour)}
                    </span>
                )}
            </div>

            <div className="px-4 pb-4 pt-5" aria-live="off">
                {f && f.digits.length === 0 ? (
                    <p className="display text-[clamp(2.25rem,6vw,3.5rem)] text-crimson">Shipped.</p>
                ) : (
                    <div className="flex items-start gap-2 sm:gap-3">
                        {(f?.digits ?? [
                            { v: "--", u: "days" },
                            { v: "--", u: "hrs" },
                            { v: "--", u: "min" },
                            { v: "--", u: "sec" },
                        ]).map((d, i) => (
                            <div key={d.u} className="flex items-start gap-2 sm:gap-3">
                                {i > 0 && (
                                    <span aria-hidden="true" className="display text-[clamp(2.25rem,6vw,3.5rem)] text-cream-3">
                                        :
                                    </span>
                                )}
                                <div>
                                    <div className="display tnum text-[clamp(2.25rem,6vw,3.5rem)]">{d.v}</div>
                                    <div className="meta mt-1.5 text-[10px] text-ink-3">{d.u}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <ul className="mt-4 space-y-0.5">
                    {(f?.lines ?? ["Sat 10.17 · 7:30 AM CDT", "HM Comer Hall · front desk"]).map((l) => (
                        <li key={l} className="font-plex text-[13px] text-ink">
                            <span className="text-crimson" aria-hidden="true">
                                {">"}{" "}
                            </span>
                            {l}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="relative h-2 border-t border-ink/15 bg-cream-2" aria-hidden="true">
                <div className="absolute inset-y-0 left-0 bg-crimson" style={{ width: `${p * 100}%` }} />
            </div>
        </div>
    );
}
