"use client";

import { Mark } from "@/components/hackbama1/Mark";
import { GROUPME } from "@/lib/site";
import { LEVELS } from "@/lib/stations";
import { EventChip } from "./Event";
import { COMMITS } from "./world";

const BOX = "border border-rule-dark bg-ink/85 backdrop-blur";

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
        <div className="on-ink pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-5">
            <div className="pointer-events-auto flex flex-col gap-2">
                <span className="flex items-center gap-2 text-bone">
                    <Mark className="h-3.5 w-auto" />
                    <span className="display text-[15px]">HackBama</span>
                </span>
                <div className={`flex items-center gap-3 px-3 py-2 ${BOX}`}>
                    <span className="meta whitespace-nowrap text-[10px] text-bone-faint">Lvl {level}</span>
                    <span className="display whitespace-nowrap text-[13px] text-bone">{LEVELS[level]}</span>
                    <span className="flex gap-1" aria-label={`${found} of 6 lights found`}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <span key={i} className={`inline-block h-2 w-2 ${i < found ? "bg-ember" : "bg-rule-dark"}`} />
                        ))}
                    </span>
                </div>
                <span className="meta flex items-center gap-2 text-[10px] text-bone-faint">
                    <span aria-hidden="true" className="inline-block h-2 w-2 rotate-45 bg-ember" />
                    {collected}/{COMMITS.length} commits
                </span>
            </div>

            <div className="pointer-events-auto flex flex-wrap items-stretch justify-end gap-1.5 sm:gap-2">
                <button
                    type="button"
                    onClick={onMute}
                    aria-label={muted ? "Unmute" : "Mute"}
                    aria-pressed={muted}
                    className={`meta px-2.5 py-2.5 text-[10px] text-bone-dim transition-colors hover:text-bone ${BOX}`}
                >
                    <span aria-hidden="true">{muted ? "[×]" : "[♪]"}</span>
                </button>
                <button
                    type="button"
                    onClick={onJournal}
                    className={`meta px-3 py-2.5 text-[10px] text-bone-dim transition-colors hover:text-bone ${BOX}`}
                >
                    <span className="sm:hidden">[ ≡ ]</span>
                    <span className="hidden sm:inline">Journal</span>
                </button>
                <a
                    href={GROUPME}
                    target="_blank"
                    rel="noreferrer"
                    className={`meta hidden items-center px-3 py-2.5 text-[10px] text-bone transition-colors hover:bg-bone hover:text-ink md:flex ${BOX}`}
                >
                    Join the GroupMe
                </a>
                <EventChip />
            </div>
        </div>
    );
}
