"use client";

import { useEffect } from "react";

const CODE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

export function useKonami(onMatch: () => void) {
    useEffect(() => {
        let i = 0;
        const onKey = (e: KeyboardEvent) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === CODE[i]) {
                i += 1;
                if (i === CODE.length) {
                    i = 0;
                    onMatch();
                }
            } else {
                i = key === CODE[0] ? 1 : 0;
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onMatch]);
}
