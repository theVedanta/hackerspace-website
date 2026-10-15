import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black, IBM_Plex_Mono } from "next/font/google";
import "./hackbama1.css";

const black = Archivo_Black({
    subsets: ["latin"],
    variable: "--font-black",
    display: "swap",
    weight: "400",
});

const archivo = Archivo({
    subsets: ["latin"],
    variable: "--font-archivo",
    display: "swap",
    style: ["normal", "italic"],
});

const plex = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-plex",
    display: "swap",
    weight: ["400", "500"],
});

const DESCRIPTION =
    "HackBama_01. A twelve-hour hackathon at The University of Alabama. Saturday, October 17, 2026, HM Comer and NERC. Two tracks, $1,800 in prizes.";

export const metadata: Metadata = {
    title: "HackBama_01 · Oct 17",
    description: DESCRIPTION,
    alternates: { canonical: "/hackbama1" },
    openGraph: {
        title: "HackBama_01 · 12-hour hackathon",
        description: DESCRIPTION,
        url: "/hackbama1",
        siteName: "HackBama",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "HackBama_01 · Oct 17",
        description: "Twelve hours, two tracks, $1,800 in prizes. HM Comer, The University of Alabama.",
    },
};

export const viewport: Viewport = {
    themeColor: "#EFE9DC",
    colorScheme: "light",
};

export default function HackBama1Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`hb1 ${black.variable} ${archivo.variable} ${plex.variable} min-h-[100dvh]`}>
            {children}
        </div>
    );
}
