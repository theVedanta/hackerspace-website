"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A two-hour clock that starts the first time it is seen and counts down in
 * real time. Motivated: the mini-hackathon's entire rule is the clock, so the
 * panel should have one that is actually running. `dead` renders the same
 * face switched off, for the meetings that do not have one.
 */
export function Clock({
    dead = false,
    className = "",
}: {
    dead?: boolean;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.4 });

    useEffect(() => {
        if (dead || !inView) return;
        const started = performance.now();
        const total = 2 * 60 * 60;
        let raf = 0;
        let shown = -1;
        const tick = (now: number) => {
            const left = Math.max(0, total - Math.floor((now - started) / 1000));
            if (left !== shown && ref.current) {
                shown = left;
                const cells = ref.current.querySelectorAll<HTMLElement>("[data-cell]");
                cells[0].textContent = pad(Math.floor(left / 3600));
                cells[1].textContent = pad(Math.floor((left % 3600) / 60));
                cells[2].textContent = pad(left % 60);
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, dead]);

    const colon = (
        <span className={dead ? "" : "animate-[blink_1s_steps(2,start)_infinite]"}>:</span>
    );

    return (
        <span
            ref={ref}
            className={`font-mono font-medium leading-none tabular-nums ${className}`}
            aria-label={dead ? "No clock" : "Two hour countdown"}
        >
            <span data-cell>{dead ? "--" : "02"}</span>
            {colon}
            <span data-cell>{dead ? "--" : "00"}</span>
            {colon}
            <span data-cell>{dead ? "--" : "00"}</span>
        </span>
    );
}
