"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";

/**
 * Inertial scrolling. Motivated: the hero sky, the cadence pan, and the
 * marquee are all scrubbed by scroll position, and a smoothed position keeps
 * those from stepping on trackpads and wheels.
 */
export function SmoothScroll() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }
        const lenis = new Lenis({
            autoRaf: true,
            lerp: 0.085,
            anchors: { offset: -64 },
        });
        setLenis(lenis);
        return () => {
            lenis.destroy();
            setLenis(null);
        };
    }, []);

    return null;
}
