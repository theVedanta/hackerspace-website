/** The >▪ mark from the brand guide: an ink chevron and a crimson block. */
export function Mark({ className = "h-5 w-auto" }: { className?: string }) {
    return (
        <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
            <path d="M2 2 L11 10 L2 18" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" />
            <rect x="16" y="4" width="12" height="12" fill="hsl(var(--crimson))" />
        </svg>
    );
}
