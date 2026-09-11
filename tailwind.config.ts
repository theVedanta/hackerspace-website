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
                    DEFAULT: "hsl(var(--bone) / <alpha-value>)",
                    deep: "hsl(var(--bone-deep) / <alpha-value>)",
                    dim: "hsl(var(--bone-dim) / <alpha-value>)",
                    faint: "hsl(var(--bone-faint) / <alpha-value>)",
                },
                paper: "hsl(var(--paper) / <alpha-value>)",
                ink: {
                    DEFAULT: "hsl(var(--ink) / <alpha-value>)",
                    2: "hsl(var(--ink-2) / <alpha-value>)",
                    3: "hsl(var(--ink-3) / <alpha-value>)",
                    soft: "hsl(var(--ink-soft) / <alpha-value>)",
                    faint: "hsl(var(--ink-faint) / <alpha-value>)",
                },
                crimson: {
                    DEFAULT: "hsl(var(--crimson) / <alpha-value>)",
                    bright: "hsl(var(--crimson-bright) / <alpha-value>)",
                },
                ember: "hsl(var(--ember) / <alpha-value>)",
                rule: {
                    DEFAULT: "hsl(var(--rule) / <alpha-value>)",
                    dark: "hsl(var(--rule-dark) / <alpha-value>)",
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
