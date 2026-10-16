import { CLOSES, OPENS, SCHEDULE, at, type Block } from "@/lib/hackbama1";

export const START = at(OPENS);
export const END = at(CLOSES);

export function end(b: Block) {
    return at(b.to ?? b.from);
}

/** Blocks with a span that contains `now`. Moments (no `to`) are never live. */
export function live(now: number) {
    return SCHEDULE.filter((b) => b.to && now >= at(b.from) && now < end(b));
}

/** The next block to start after `now`. */
export function next(now: number) {
    return SCHEDULE.find((b) => at(b.from) > now) ?? null;
}

export function past(b: Block, now: number) {
    return now >= (b.to ? end(b) : at(b.from));
}

/** 0..1 across the day, clamped. */
export function progress(ms: number) {
    return Math.min(1, Math.max(0, (ms - START) / (END - START)));
}

export type Phase = "soon" | "live" | "done";

export function phase(now: number): Phase {
    return now < START ? "soon" : now < END ? "live" : "done";
}

/** A countdown short enough for a chip: "1d 17h", "3h 12m", "12m". */
export function short(ms: number) {
    const m = Math.max(0, Math.floor(ms / 60_000));
    const d = Math.floor(m / 1440);
    const h = Math.floor((m % 1440) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m % 60}m`;
    return `${m % 60}m`;
}
