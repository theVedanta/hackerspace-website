"use client";

import { MotionConfig } from "motion/react";

/** Makes every transform animation instant when the OS asks for less motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
