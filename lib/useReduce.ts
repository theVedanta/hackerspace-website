"use client";

import { useEffect, useState } from "react";

/**
 * prefers-reduced-motion, but false on the server and on the first client
 * render so hydration always matches. Components that swap markup for the
 * reduced case (a marquee for a grid, a pinned track for a stack) use this;
 * plain transition tuning can read the media query directly.
 */
export function useReduce() {
    const [reduce, setReduce] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const apply = () => setReduce(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);
    return reduce;
}

export function prefersReducedMotion() {
    return (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}
