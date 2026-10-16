import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { SPONSORS, type Sponsor } from "@/lib/hackbama1";

const DIR = "hackbama1/sponsors";
const EXTS = ["svg", "png", "webp"];

/** The first logo file that exists for a sponsor, checked at build time. */
function logo(slug: string) {
    for (const ext of EXTS) {
        const rel = `${DIR}/${slug}.${ext}`;
        if (fs.existsSync(path.join(process.cwd(), "public", rel))) return `/${rel}`;
    }
    return null;
}

function Cell({ s, big }: { s: Sponsor; big?: boolean }) {
    const src = logo(s.slug);
    return (
        <li className={`flex min-w-0 flex-col border border-rule bg-card ${big ? "min-h-[220px]" : "min-h-[150px]"}`}>
            <div className="relative flex flex-1 items-center justify-center p-6">
                {src ? (
                    <div className={`relative ${big ? "h-28 w-[70%]" : "h-16 w-[72%]"}`}>
                        <Image src={src} alt={s.name} fill unoptimized className="object-contain" />
                    </div>
                ) : (
                    <span
                        className={`display text-balance text-center ${
                            big ? "text-[clamp(1.6rem,3.4vw,2.5rem)] text-crimson" : "text-[1.15rem]"
                        }`}
                    >
                        {s.name}
                    </span>
                )}
            </div>
            <div className="flex items-center justify-between border-t border-rule px-4 py-2">
                <span className="meta min-w-0 truncate text-[10px] text-ink-3">{s.name}</span>
                {s.track && <span className="meta shrink-0 pl-3 text-[10px] text-crimson">track</span>}
            </div>
        </li>
    );
}

export function Sponsors() {
    const track = SPONSORS.filter((s) => s.track);
    const rest = SPONSORS.filter((s) => !s.track);
    return (
        <>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {track.map((s) => (
                    <Cell key={s.slug} s={s} big />
                ))}
            </ul>
            <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                {rest.map((s) => (
                    <Cell key={s.slug} s={s} />
                ))}
            </ul>
        </>
    );
}
