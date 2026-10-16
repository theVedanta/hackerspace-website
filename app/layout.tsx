import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black, IBM_Plex_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "./globals.css";

/* The brand guide's one family, three voices: Archivo Black for display,
   Archivo for everything else, Plex Mono for the machine talking. */
const display = Archivo_Black({
    subsets: ["latin"],
    variable: "--font-display",
    display: "swap",
    weight: "400",
});

const sans = Archivo({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
    style: ["normal", "italic"],
});

const mono = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
    weight: ["400", "500"],
});

const SITE = "https://hackbama.org";
const DESCRIPTION =
    "The build, hackathon, and software club at The University of Alabama. HackBama_01, our first 12-hour hackathon, is Saturday, October 17.";

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
    themeColor: "#171310",
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
                <MotionProvider>{children}</MotionProvider>
                <div className="grain" aria-hidden="true" />
            </body>
        </html>
    );
}
