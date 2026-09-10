"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/useReduce";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]#$%&*+=";

/**
 * Swaps one phrase for another by resolving glyphs left to right.
 * Motivated: the hero's turn from "next semester" to "tonight" is the whole
 * pitch, and a crossfade would let the eye miss it.
 */
export function Scramble({
    text,
    className,
}: {
    text: string;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const prev = useRef(text);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const from = prev.current;
        prev.current = text;
        if (from === text || prefersReducedMotion()) {
            el.textContent = text;
            return;
        }

        const len = Math.max(from.length, text.length);
        const duration = 620;
        const start = performance.now();
        let raf = 0;

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            let out = "";
            for (let i = 0; i < len; i++) {
                const threshold = (i / len) * 0.65;
                const local = (t - threshold) / 0.35;
                const target = text[i] ?? "";
                if (local >= 1) out += target;
                else if (local <= 0) out += from[i] ?? "";
                else if (target === " " || target === "") out += local > 0.6 ? target : GLYPHS[(Math.random() * GLYPHS.length) | 0];
                else out += Math.random() < 0.45 ? target : GLYPHS[(Math.random() * GLYPHS.length) | 0];
            }
            el.textContent = out;
            if (t < 1) raf = requestAnimationFrame(tick);
            else el.textContent = text;
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [text]);

    return (
        <span ref={ref} className={className}>
            {text}
        </span>
    );
}
