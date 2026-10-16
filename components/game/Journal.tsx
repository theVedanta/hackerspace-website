"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Mark } from "@/components/hackbama1/Mark";
import { FORMATS, GROUPME, MEETING, PILLARS, RHYTHM, STATS, YEAR } from "@/lib/site";
import { STATIONS, type StationId } from "@/lib/stations";
import { Out } from "./Card";
import { EventCard } from "./Event";

const EASE = [0.16, 1, 0.3, 1] as const;
const SHELL = "mx-auto max-w-[1040px] px-5 sm:px-8";

function Head({ n, title, line }: { n: string; title: string; line?: string }) {
    return (
        <div>
            <p className="meta border-b border-rule pb-2 text-[10px] text-ink-soft sm:text-[11px]">{n}</p>
            <h3 className="display mt-5 text-[clamp(2rem,5.5vw,3.5rem)]">{title}</h3>
            {line && <p className="tagline mt-2 max-w-[48ch] text-[1.05rem] text-ink-soft sm:text-lg">{line}</p>}
        </div>
    );
}

/** "Oct 2026" is this month, before it, or after it. */
function when(month: string) {
    const d = new Date(`1 ${month}`);
    const now = new Date();
    const a = d.getFullYear() * 12 + d.getMonth();
    const b = now.getFullYear() * 12 + now.getMonth();
    return a < b ? "past" : a === b ? "now" : "next";
}

/**
 * The club on one page: what we found on the Quad, and everything that does
 * not need walking to (HackBama_01, the pillars, the weekly rhythm, the year).
 * This is also the page for anyone who cannot or would rather not play.
 */
export function Journal({
    found,
    onClose,
    onRevealAll,
    onReset,
}: {
    found: Set<StationId>;
    onClose: () => void;
    onRevealAll: () => void;
    onReset: () => void;
}) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Journal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto absolute inset-0 select-text overflow-y-auto bg-cream text-ink"
            style={{ touchAction: "pan-y" }}
        >
            <header className="sticky top-0 z-10 border-b-2 border-ink bg-cream/95 backdrop-blur-sm">
                <div className={`${SHELL} flex h-14 items-center justify-between`}>
                    <span className="flex items-center gap-2.5">
                        <Mark className="h-4 w-auto text-ink" />
                        <span className="display text-[15px]">HackBama</span>
                        <span className="meta hidden text-[10px] text-ink-soft sm:inline">· journal</span>
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="meta border-2 border-ink px-3 py-1.5 text-[10px] transition-colors hover:bg-ink hover:text-card"
                    >
                        Back to the Quad
                    </button>
                </div>
            </header>

            {/* Who we are */}
            <section className={`${SHELL} pt-12 sm:pt-16`}>
                <p className="meta text-[10px] text-ink-soft sm:text-[11px]">
                    <span className="text-crimson">{">"}_</span> university of alabama · hackathons · build-a-thons · AI · infra · open
                    source
                </p>
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="display mt-5 text-[clamp(3.2rem,12vw,7.5rem)] leading-[0.85]"
                >
                    HackBama
                </motion.h2>
                <p className="tagline mt-4 text-[clamp(1.15rem,2.4vw,1.6rem)]">Build things. Ship things. Roll Tide.</p>
                <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.6]">
                    A build, hackathon, pitch, and software-engineering club at The University of Alabama. We meet{" "}
                    <strong className="font-semibold">
                        {MEETING.when} in the {MEETING.room}, {MEETING.where}
                    </strong>
                    . No application, no experience bar, no dues.
                </p>
                <p className="mt-4 border-l-4 border-crimson pl-4 font-mono text-[13px] leading-relaxed text-ink-soft">
                    The goal is not to win anything. It is to normalize building under constraints.
                </p>

                <dl className="mt-10 grid grid-cols-2 border-2 border-ink bg-card md:grid-cols-4">
                    {STATS.map((s, i) => (
                        <div
                            key={s.l}
                            className={`flex flex-col px-4 py-4 ${i % 2 ? "border-l border-rule" : ""} ${i > 1 ? "border-t border-rule md:border-t-0" : ""} ${
                                i === 2 ? "md:border-l" : ""
                            }`}
                        >
                            <dt className="meta mt-1.5 text-[9px] text-ink-soft sm:text-[10px]">{s.l}</dt>
                            <dd className="display order-first text-[2.2rem] text-crimson">{s.v}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            {/* HackBama_01 */}
            <section className="mt-16 bg-ink py-12 text-bone sm:mt-20 sm:py-16">
                <div className={`${SHELL} grid items-center gap-10 lg:grid-cols-[1fr_400px]`}>
                    <div>
                        <p className="meta text-[10px] text-bone-dim sm:text-[11px]">Sat 10.17.2026 · HM Comer Hall</p>
                        <h3 className="display mt-4 text-[clamp(2.4rem,7vw,4.5rem)]">
                            HackBama<span className="cursor text-ember">_</span>01
                        </h3>
                        <p className="mt-4 max-w-[48ch] text-[16px] leading-[1.6] text-bone-dim">
                            Our first full hackathon. Twelve hours, two sponsor tracks from the College of Engineering and UA EcoCAR,
                            $1,800 in prizes. Teams of one to four, formed on site. Open to college students from anywhere, and the
                            only bar is a working demo by 8 PM.
                        </p>
                    </div>
                    <EventCard />
                </div>
            </section>

            {/* The Quad */}
            <section className={`${SHELL} pt-16 sm:pt-20`}>
                <Head
                    n="01 · the quad"
                    title="What the lights say"
                    line={
                        found.size === 0
                            ? "Nothing found yet. Walk toward a light, or read it all below."
                            : `${found.size} of ${STATIONS.length} found.`
                    }
                />
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {found.size < STATIONS.length && (
                        <button
                            type="button"
                            onClick={onRevealAll}
                            className="meta border-2 border-ink bg-card px-3 py-2 text-[10px] transition-colors hover:bg-ink hover:text-card"
                        >
                            Just show me everything
                        </button>
                    )}
                    {found.size > 0 && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="meta text-[10px] text-ink-soft underline underline-offset-4 hover:text-ink"
                        >
                            Start over
                        </button>
                    )}
                </div>

                <ol className="mt-8 grid gap-3 sm:grid-cols-2">
                    {STATIONS.map((s, i) => {
                        const known = found.has(s.id);
                        return (
                            <motion.li
                                key={s.id}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: EASE, delay: 0.05 + i * 0.04 }}
                                className={`flex flex-col border p-6 ${known ? "border-ink/80 bg-card" : "border-dashed border-rule bg-transparent"}`}
                            >
                                <span className="meta text-[10px] text-crimson">
                                    {String(i + 1).padStart(2, "0")} · {s.label}
                                </span>
                                {known ? (
                                    <>
                                        <h4 className="display mt-3 text-[1.35rem]">{s.title}</h4>
                                        {s.body.map((p) => (
                                            <p key={p} className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
                                                {p}
                                            </p>
                                        ))}
                                        {s.list && <p className="mt-3 text-[14px] leading-relaxed">{s.list.join(" · ")}</p>}
                                        {s.people && (
                                            <p className="mt-3 text-[14px] leading-relaxed">
                                                {s.people.map((p) => `${p.name}, ${p.role}`).join(" · ")}
                                            </p>
                                        )}
                                        {s.links && (
                                            <div className="mt-5 flex flex-wrap gap-2">
                                                {s.links.map((l, j) => (
                                                    <Out
                                                        key={l.href}
                                                        href={l.href}
                                                        className={
                                                            j === 0
                                                                ? "display inline-flex bg-crimson px-4 py-2.5 text-[13px] text-card hover:bg-crimson-deep"
                                                                : "meta inline-flex items-center border-2 border-ink px-3 py-2 text-[10px] hover:bg-ink hover:text-card"
                                                        }
                                                    >
                                                        {l.label}
                                                    </Out>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="tagline mt-3 text-[16px] text-ink-soft">{s.hint}</p>
                                )}
                            </motion.li>
                        );
                    })}
                </ol>
            </section>

            {/* Pillars */}
            <section className={`${SHELL} pt-16 sm:pt-20`}>
                <Head n="02 · what we do" title="Three pillars" />
                <ul className="mt-8 grid gap-4 md:grid-cols-3">
                    {PILLARS.map((p) => (
                        <li key={p.n} className="border-2 border-ink bg-card p-6 shadow-pop">
                            <p className="meta text-[10px] text-crimson">Pillar {p.n}</p>
                            <h4 className="display mt-3 text-[1.5rem]">{p.title}</h4>
                            <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">{p.body}</p>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Weekly rhythm and formats */}
            <section className={`${SHELL} pt-16 sm:pt-20`}>
                <Head
                    n="03 · the week"
                    title={`${MEETING.when.split(",")[0]}, ${MEETING.where}`}
                    line="One hour, same room, on a three-week rotation. Come once a month and you still get the full picture."
                />
                <ol className="mt-8 border-t border-rule">
                    {RHYTHM.map((r, i) => (
                        <li key={r.word} className="grid grid-cols-[2.5rem_6rem_1fr] items-baseline gap-3 border-b border-rule py-4 sm:grid-cols-[3rem_8rem_1fr]">
                            <span className="font-mono text-[12px] text-ink-soft">w{i + 1}</span>
                            <span className="display text-[1.3rem] text-crimson">{r.word}</span>
                            <span className="text-[15px] leading-snug">{r.body}</span>
                        </li>
                    ))}
                </ol>
                <p className="mt-4 text-[14px] text-ink-soft">
                    Every sprint runs in one of two modes: unassisted, or AI-permitted at half the time. Alternating them is the point.
                </p>

                <div className="mt-10 overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse text-left">
                        <thead>
                            <tr className="border-b-2 border-ink">
                                {["Format", "Length", "How often", "Where", "Builders"].map((h) => (
                                    <th key={h} className="meta py-2 pr-4 text-[10px] font-normal text-ink-soft">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {FORMATS.map((f) => (
                                <tr key={f.name} className="border-b border-rule">
                                    <td className="display py-3 pr-4 text-[1.05rem]">{f.name}</td>
                                    <td className="py-3 pr-4 font-mono text-[13px]">{f.length}</td>
                                    <td className="py-3 pr-4 text-[14px]">{f.cadence}</td>
                                    <td className="py-3 pr-4 text-[14px]">{f.where}</td>
                                    <td className="py-3 font-mono text-[13px] text-crimson">{f.scale}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* The year */}
            <section className={`${SHELL} pt-16 sm:pt-20`}>
                <Head n="04 · the year" title="September to May" line="What we are running in year one." />
                <ol className="mt-8 border-t border-rule">
                    {YEAR.map((y) => {
                        const w = when(y.month);
                        return (
                            <li
                                key={y.month}
                                className={`relative grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-1 border-b border-rule py-4 sm:grid-cols-[8.5rem_14rem_1fr] sm:items-baseline ${
                                    w === "now" ? "bg-card" : ""
                                }`}
                            >
                                {w === "now" && <span aria-hidden="true" className="absolute inset-y-0 -left-3 w-1.5 bg-crimson sm:-left-5" />}
                                <span className={`meta text-[10px] ${w === "past" ? "text-ink-soft" : "text-crimson"}`}>
                                    {y.month}
                                    {w === "now" && <span className="ml-2 bg-crimson px-1 text-card">now</span>}
                                </span>
                                <span className={`display text-[1.15rem] ${w === "past" ? "text-ink-soft" : ""}`}>
                                    {"href" in y ? (
                                        <Link href={y.href} className="underline decoration-crimson decoration-2 underline-offset-4 hover:text-crimson">
                                            {y.title}
                                        </Link>
                                    ) : (
                                        y.title
                                    )}
                                </span>
                                <span className="col-start-2 text-[14px] leading-snug text-ink-soft sm:col-start-auto">{y.body}</span>
                            </li>
                        );
                    })}
                </ol>
            </section>

            {/* Close */}
            <footer className="mt-20 bg-ink text-bone">
                <div className={`${SHELL} on-ink py-14`}>
                    <p className="display text-[clamp(2.4rem,8vw,5rem)]">
                        Come build<span className="text-ember">.</span>
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href={GROUPME}
                            target="_blank"
                            rel="noreferrer"
                            className="pop display inline-flex items-center gap-3 bg-crimson px-5 py-3 text-[14px] text-card"
                        >
                            Join the GroupMe <span className="font-mono text-xs normal-case">{">"}_</span>
                        </a>
                        <Link
                            href="/hackbama1"
                            className="meta inline-flex items-center border-2 border-bone px-4 py-2.5 text-[10px] transition-colors hover:bg-bone hover:text-ink"
                        >
                            HackBama_01
                        </Link>
                    </div>
                    <p className="mt-10 border-t border-rule-dark pt-6 text-sm leading-relaxed text-bone-dim">
                        HackBama is a registered student organization in the Department of Computer Science at The University of Alabama.
                        Questions? Email{" "}
                        <a href="mailto:vpsomnathe@crimson.ua.edu" className="text-bone underline underline-offset-4">
                            vpsomnathe@crimson.ua.edu
                        </a>
                        .
                    </p>
                </div>
            </footer>
        </motion.div>
    );
}
