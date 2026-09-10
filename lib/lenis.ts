import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
    instance = lenis;
}

export function getLenis() {
    return instance;
}

/** Scroll to a selector or element, through Lenis when it is running. */
export function scrollTo(
    target: string | HTMLElement,
    opts: { offset?: number; duration?: number } = {}
) {
    const { offset = -64, duration = 1.4 } = opts;
    if (instance) {
        instance.scrollTo(target, { offset, duration });
        return;
    }
    const el =
        typeof target === "string"
            ? document.querySelector<HTMLElement>(target)
            : target;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
