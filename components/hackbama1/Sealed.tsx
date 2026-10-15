"use client";

import { PROMPTS, at } from "@/lib/hackbama1";
import { useNow } from "./useNow";

const BARS = ["w-[82%]", "w-[64%]", "w-[91%]", "w-[38%]"];

/** The track prompt, redacted until 9:30 AM on the day. */
export function Sealed() {
    const now = useNow();
    const open = now !== null && now >= at(PROMPTS);
    return (
        <div className="border border-cream/25 p-4">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <span className="meta whitespace-nowrap text-[11px] text-cream">
                    <span aria-hidden="true">{">"}_ </span>prompt
                </span>
                <span className={`meta text-[10px] ${open ? "text-cream" : "text-cream/70"}`}>
                    {open ? "released 9:30 AM · in your track room" : "sealed until 9:30 AM"}
                </span>
            </div>
            <div className="mt-3 space-y-2" aria-hidden="true">
                {BARS.map((w) => (
                    <div key={w} className={`redact h-3 ${w}`} />
                ))}
            </div>
        </div>
    );
}
