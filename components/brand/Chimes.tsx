/**
 * Denny Chimes with a circuit trace running up the shaft.
 * Redrawn from the HackBama brand card.
 *
 * The tower draws in currentColor. The columns, circuit trace, and door are
 * knocked out in the surface color behind the mark, which defaults to bone.
 * On any other background, set --mark-knockout to that background color.
 */
export function Chimes({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 120 440"
            fill="none"
            aria-hidden="true"
            className={className}
        >
            {/* crown */}
            <rect x="26" y="0" width="68" height="12" fill="currentColor" />
            <rect x="33" y="14" width="54" height="9" fill="currentColor" />
            {/* belfry columns */}
            <rect x="33" y="27" width="54" height="46" fill="currentColor" />
            <g stroke="var(--mark-knockout, hsl(var(--bone)))" strokeWidth="4">
                <path d="M43 27v46M52 27v46M60 27v46M68 27v46M77 27v46" />
            </g>
            <rect x="30" y="75" width="60" height="10" fill="currentColor" />
            <rect x="36" y="87" width="48" height="8" fill="currentColor" />

            {/* shaft */}
            <rect x="41" y="97" width="38" height="252" fill="currentColor" />

            {/* circuit trace, knocked out of the shaft */}
            <g
                stroke="var(--mark-knockout, hsl(var(--bone)))"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            >
                <path d="M60 128v42l-11 11v30" />
                <path d="M60 196l11 11v34" />
                <path d="M60 236v34l-11 11v28" />
                <path d="M71 262v46" />
            </g>
            <g fill="var(--mark-knockout, hsl(var(--bone)))">
                <circle cx="60" cy="126" r="6" />
                <circle cx="49" cy="212" r="6" />
                <circle cx="71" cy="242" r="6" />
                <circle cx="49" cy="310" r="6" />
                <circle cx="71" cy="308" r="6" />
            </g>

            {/* base */}
            <rect x="28" y="351" width="64" height="14" fill="currentColor" />
            <rect x="22" y="367" width="76" height="73" fill="currentColor" />
            <rect x="49" y="399" width="22" height="41" fill="var(--mark-knockout, hsl(var(--bone)))" />
        </svg>
    );
}
