"use client";

import { Book, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { GROUPME } from "@/lib/site";
import { LEVELS } from "@/lib/stations";
import { COMMITS } from "./world";

export function Hud({
    found,
    collected,
    muted,
    onJournal,
    onMute,
}: {
    found: number;
    collected: number;
    muted: boolean;
    onJournal: () => void;
    onMute: () => void;
}) {
    const level = Math.min(found, 6);
    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 sm:p-5">
            <div className="pointer-events-auto flex flex-col gap-2">
                <span className="font-display text-base font-bold tracking-[0.14em] text-bone">HACKBAMA</span>
                <div className="flex items-center gap-3 border border-rule-dark bg-ink/80 px-3 py-2 backdrop-blur">
                    <span className="whitespace-nowrap font-mono text-[11px] text-bone-faint">LEVEL {level}</span>
                    <span className="whitespace-nowrap text-sm font-medium text-bone">{LEVELS[level]}</span>
                    <span className="flex gap-1" aria-label={`${found} of 6 lights found`}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <span
                                key={i}
                                className={`inline-block h-2 w-2 ${i < found ? "bg-ember" : "bg-rule-dark"}`}
                            />
                        ))}
                    </span>
                </div>
                <span className="flex items-center gap-2 font-mono text-[11px] text-bone-faint">
                    <span aria-hidden="true" className="inline-block h-2 w-2 rotate-45 bg-ember" />
                    {collected} / {COMMITS.length} commits
                </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
                <button
                    type="button"
                    onClick={onMute}
                    aria-label={muted ? "Unmute" : "Mute"}
                    aria-pressed={muted}
                    className="border border-rule-dark bg-ink/80 p-2.5 text-bone-dim backdrop-blur transition-colors hover:text-bone"
                >
                    {muted ? <SpeakerSlash size={18} weight="light" /> : <SpeakerHigh size={18} weight="light" />}
                </button>
                <button
                    type="button"
                    onClick={onJournal}
                    className="flex items-center gap-2 border border-rule-dark bg-ink/80 px-3 py-2.5 text-sm text-bone-dim backdrop-blur transition-colors hover:text-bone"
                >
                    <Book size={18} weight="light" />
                    <span className="hidden sm:inline">Journal</span>
                </button>
                <a
                    href={GROUPME}
                    target="_blank"
                    rel="noreferrer"
                    className="whitespace-nowrap bg-crimson px-3.5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-crimson-bright active:translate-y-px"
                >
                    <span className="sm:hidden">Join</span>
                    <span className="hidden sm:inline">Join the GroupMe</span>
                </a>
            </div>
        </div>
    );
}
