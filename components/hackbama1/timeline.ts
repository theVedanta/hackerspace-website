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
