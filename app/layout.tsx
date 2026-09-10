import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

const display = Bodoni_Moda({
    subsets: ["latin"],
    variable: "--font-display",
    display: "swap",
    weight: ["500", "700"],
    style: ["normal", "italic"],
});

const sans = Inter_Tight({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const mono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
    weight: ["400", "500"],
});

const SITE = "https://hackbama.org";
const DESCRIPTION =
    "The build club at The University of Alabama. Twice a month we put students in a room and ship something before they leave it.";

export const metadata: Metadata = {
    metadataBase: new URL(SITE),
    title: {
        default: "HackBama",
        template: "%s | HackBama",
    },
    description: DESCRIPTION,
    openGraph: {
        title: "HackBama",
        description: DESCRIPTION,
        url: SITE,
        siteName: "HackBama",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "HackBama",
        description:
            "The build club at The University of Alabama. Build something real.",
    },
};

export const viewport: Viewport = {
    themeColor: "#191715",
    colorScheme: "dark",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body
                className={`${display.variable} ${sans.variable} ${mono.variable} font-sans`}
            >
                <SmoothScroll />
                {children}
                <div className="grain" aria-hidden="true" />
            </body>
        </html>
    );
}
