"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import { createParticleField, type Layout } from "./field";

export type { Layout };

/**
 * Canvas host for the particle Chimes. Feeds it the hero's night value, the
 * pointer, and visibility, and reports back if WebGL is unavailable so the
 * hero can fall back to the printed mark.
 */
export function Particles({
    night,
    resolveLayout,
    onUnavailable,
    className,
}: {
    night: MotionValue<number>;
    /** Where the tower sits, as fractions of the canvas. Called on resize. */
    resolveLayout: (canvas: HTMLCanvasElement) => Layout;
    onUnavailable?: () => void;
    className?: string;
}) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [generation, setGeneration] = useState(0);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const field = createParticleField(canvas, { reduced });
        if (!field) {
            onUnavailable?.();
            return;
        }

        const applyLayout = () => field.setLayout(resolveLayout(canvas));
        applyLayout();
        field.setNight(night.get());

        const unsubscribe = night.on("change", (v) => field.setNight(v));
        const onMove = (e: PointerEvent) => {
            if (e.pointerType === "mouse") field.setPointer(e.clientX, e.clientY);
        };
        const onTouch = (e: TouchEvent) => {
            const t = e.touches[0];
            if (t) field.setPointer(t.clientX, t.clientY);
        };
        const onLeave = () => field.clearPointer();
        const onRebuild = () => setGeneration((g) => g + 1);

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("touchmove", onTouch, { passive: true });
        window.addEventListener("touchend", onLeave, { passive: true });
        document.documentElement.addEventListener("mouseleave", onLeave);
        canvas.addEventListener("particles:rebuild", onRebuild);

        const io = new IntersectionObserver(
            ([entry]) => field.setActive(entry.isIntersecting),
            { threshold: 0 }
        );
        io.observe(canvas);
        const ro = new ResizeObserver(applyLayout);
        ro.observe(canvas);

        return () => {
            unsubscribe();
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("touchmove", onTouch);
            window.removeEventListener("touchend", onLeave);
            document.documentElement.removeEventListener("mouseleave", onLeave);
            canvas.removeEventListener("particles:rebuild", onRebuild);
            io.disconnect();
            ro.disconnect();
            field.destroy();
        };
    }, [night, resolveLayout, onUnavailable, generation]);

    return <canvas ref={ref} className={className} aria-hidden="true" />;
}
