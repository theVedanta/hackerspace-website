import type { Config } from "tailwindcss";

export default {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bone: {
                    DEFAULT: "hsl(var(--bone))",
                    deep: "hsl(var(--bone-deep))",
                    dim: "hsl(var(--bone-dim))",
                    faint: "hsl(var(--bone-faint))",
                },
                paper: "hsl(var(--paper))",
                ink: {
                    DEFAULT: "hsl(var(--ink))",
                    2: "hsl(var(--ink-2))",
                    3: "hsl(var(--ink-3))",
                    soft: "hsl(var(--ink-soft))",
                    faint: "hsl(var(--ink-faint))",
                },
                crimson: {
                    DEFAULT: "hsl(var(--crimson))",
                    bright: "hsl(var(--crimson-bright))",
                },
                ember: "hsl(var(--ember))",
                rule: {
                    DEFAULT: "hsl(var(--rule))",
                    dark: "hsl(var(--rule-dark))",
                },
            },
            fontFamily: {
                display: ["var(--font-display)", "Georgia", "serif"],
                sans: ["var(--font-sans)", "system-ui", "sans-serif"],
                mono: ["var(--font-mono)", "ui-monospace", "monospace"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "var(--radius)",
                sm: "var(--radius)",
            },
            maxWidth: {
                shell: "1240px",
            },
            transitionTimingFunction: {
                brand: "cubic-bezier(0.16, 1, 0.3, 1)",
            },
            zIndex: {
                nav: "var(--z-nav)",
                intro: "var(--z-intro)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
