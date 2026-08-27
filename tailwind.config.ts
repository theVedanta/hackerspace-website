import type { Config } from "tailwindcss";

export default {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bone: "hsl(var(--bone))",
                "bone-deep": "hsl(var(--bone-deep))",
                paper: "hsl(var(--paper))",
                ink: {
                    DEFAULT: "hsl(var(--ink))",
                    soft: "hsl(var(--ink-soft))",
                    faint: "hsl(var(--ink-faint))",
                },
                crimson: {
                    DEFAULT: "hsl(var(--crimson))",
                    bright: "hsl(var(--crimson-bright))",
                },
                rule: "hsl(var(--rule))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
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
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
