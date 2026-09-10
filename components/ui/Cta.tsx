import { Magnetic } from "@/components/motion/Magnetic";

type Variant = "crimson" | "bone" | "ghost";

const styles: Record<Variant, string> = {
    crimson:
        "bg-crimson text-paper hover:bg-crimson-bright",
    bone: "bg-bone text-ink hover:bg-paper",
    ghost: "border [border-color:color-mix(in_srgb,currentColor_30%,transparent)] hover:[border-color:color-mix(in_srgb,currentColor_70%,transparent)]",
};

/**
 * The one button on the site. Sharp corners, one line, magnetic on mouse.
 */
export function Cta({
    href,
    children,
    variant = "crimson",
    size = "md",
    external,
    magnetic = true,
    className = "",
}: {
    href: string;
    children: React.ReactNode;
    variant?: Variant;
    size?: "md" | "lg";
    external?: boolean;
    magnetic?: boolean;
    className?: string;
}) {
    const pad = size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-[15px]";
    const link = (
        <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className={`inline-flex items-center justify-center whitespace-nowrap font-medium tracking-[-0.01em] transition-colors duration-200 ease-brand active:translate-y-px ${pad} ${styles[variant]} ${className}`}
        >
            {children}
        </a>
    );
    return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
