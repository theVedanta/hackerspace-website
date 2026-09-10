/**
 * Serif italic accent inside a sans headline. The one place Bodoni appears
 * outside the wordmark, used on the phrase a headline turns on.
 *
 * Bodoni's x-height runs smaller than Inter Tight's, so it needs a nudge up
 * in size to sit level with the surrounding text. The descender clearance and
 * inline-block keep the italic's overhang from clipping at tight leading.
 */
export function Accent({
    children,
    className = "text-ember",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={`inline-block pb-[0.08em] font-display text-[1.08em] font-medium italic leading-[1.1] tracking-[-0.005em] ${className}`}
        >
            {children}
        </span>
    );
}
