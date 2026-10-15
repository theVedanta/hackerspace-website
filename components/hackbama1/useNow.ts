"use client";

import { useEffect, useState } from "react";

/**
 * The current time, ticking once a second. Null on the server and on the
 * first client render so hydration always matches.
 *
 * `?now=2026-10-17T12:30` (read as Central time) fakes the clock for checking
 * the page mid-event; it keeps ticking from there.
 */
export function useNow() {
    const [now, setNow] = useState<number | null>(null);
    useEffect(() => {
        const fake = new URLSearchParams(window.location.search).get("now");
        const parsed = fake ? Date.parse(`${fake}${fake.length <= 16 ? ":00" : ""}-05:00`) : NaN;
        const skew = Number.isNaN(parsed) ? 0 : parsed - Date.now();
        const tick = () => setNow(Date.now() + skew);
        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, []);
    return now;
}

export function pad(n: number) {
    return String(n).padStart(2, "0");
}

/** ms to { d, h, m, s }. */
export function split(ms: number) {
    const t = Math.max(0, Math.floor(ms / 1000));
    return {
        d: Math.floor(t / 86400),
        h: Math.floor((t % 86400) / 3600),
        m: Math.floor((t % 3600) / 60),
        s: t % 60,
    };
}

/** Central wall-clock "h:mm AM" for an epoch ms. */
export function clock(ms: number) {
    return new Date(ms).toLocaleTimeString("en-US", {
        timeZone: "America/Chicago",
        hour: "numeric",
        minute: "2-digit",
    });
}
