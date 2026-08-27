"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll reveal. Motivated: it sequences a section's content so the eye lands
 * on the headline before the supporting copy.
 *
 * Content is visible by default and only hidden once JS has confirmed it can
 * animate it back in, so a failed hydration or an unsupported browser degrades
 * to a plain readable page instead of a blank one.
 */
export function Reveal({
    children,
    delay = 0,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<"static" | "hidden" | "shown">("static");

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reduce || typeof IntersectionObserver === "undefined") return;

        // Already on screen at mount: leave it alone, no flash.
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) return;

        setState("hidden");

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setState("shown");
                        observer.disconnect();
                    }
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={className}
            style={
                state === "static"
                    ? undefined
                    : {
                          opacity: state === "shown" ? 1 : 0,
                          transform:
                              state === "shown"
                                  ? "translateY(0)"
                                  : "translateY(20px)",
                          transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
                          willChange: "opacity, transform",
                      }
            }
        >
            {children}
        </div>
    );
}
