/** The >▪ mark from the brand guide: an ink chevron and a crimson block. */
export function Mark({ className = "h-5 w-auto" }: { className?: string }) {
    return (
        <svg viewBox="170 250 600 500" className={className} aria-hidden="true">
            <polygon points="237,257 507,500 237,743 177,677 372,500 177,323" fill="currentColor" />
            <rect x="560" y="360" width="200" height="280" fill="hsl(var(--crimson))" />
        </svg>
    );
}
