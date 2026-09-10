import {
    CHIMES_FILLS,
    CHIMES_KNOCKOUT_CIRCLES,
    CHIMES_KNOCKOUT_RECTS,
    CHIMES_KNOCKOUT_STROKES,
    CHIMES_VIEWBOX,
} from "@/lib/chimes";

/**
 * The Denny Chimes mark. Draws in currentColor; the knockouts take
 * --mark-knockout, which should match the surface behind the mark.
 */
export function Chimes({ className }: { className?: string }) {
    const knockout = "var(--mark-knockout, hsl(var(--ink)))";
    return (
        <svg
            viewBox={`0 0 ${CHIMES_VIEWBOX.width} ${CHIMES_VIEWBOX.height}`}
            fill="none"
            aria-hidden="true"
            className={className}
        >
            {CHIMES_FILLS.map(([x, y, w, h]) => (
                <rect
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="currentColor"
                />
            ))}
            {CHIMES_KNOCKOUT_STROKES.map((s) => (
                <path
                    key={s.d}
                    d={s.d}
                    stroke={knockout}
                    strokeWidth={s.width}
                    strokeLinecap={s.cap}
                    strokeLinejoin="round"
                />
            ))}
            {CHIMES_KNOCKOUT_CIRCLES.map(([cx, cy, r]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={knockout} />
            ))}
            {CHIMES_KNOCKOUT_RECTS.map(([x, y, w, h]) => (
                <rect
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill={knockout}
                />
            ))}
        </svg>
    );
}
