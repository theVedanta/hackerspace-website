"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * Pulls its child a few pixels toward the pointer. Motivated: it makes the
 * page's two or three real buttons feel like the only physical objects on it.
 * Motion values only; nothing here touches React state.
 */
export function Magnetic({
    children,
    strength = 0.32,
    className,
}: {
    children: React.ReactNode;
    strength?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const spring = { stiffness: 260, damping: 20, mass: 0.5 };
    const sx = useSpring(x, spring);
    const sy = useSpring(y, spring);

    return (
        <motion.div
            ref={ref}
            className={className ?? "inline-block"}
            style={{ x: sx, y: sy }}
            onPointerMove={(e) => {
                if (reduce || e.pointerType !== "mouse" || !ref.current) return;
                const r = ref.current.getBoundingClientRect();
                x.set((e.clientX - (r.left + r.width / 2)) * strength);
                y.set((e.clientY - (r.top + r.height / 2)) * strength);
            }}
            onPointerLeave={() => {
                x.set(0);
                y.set(0);
            }}
        >
            {children}
        </motion.div>
    );
}
