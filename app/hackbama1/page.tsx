import Link from "next/link";
import { Clock } from "@/components/hackbama1/Clock";
import { Day } from "@/components/hackbama1/Day";
import { Mark } from "@/components/hackbama1/Mark";
import { Sealed } from "@/components/hackbama1/Sealed";
import { Sponsors } from "@/components/hackbama1/Sponsors";
import {
    CALENDAR,
    DEVPOST,
    FAQ,
    MANIFEST,
    MAPS,
    ORGANIZERS,
    PARKING,
    REGISTER,
    RULES,
    TRACKS,
    VENUE,
    type Track,
} from "@/lib/hackbama1";
import { GROUPME } from "@/lib/site";

const SHELL = "mx-auto max-w-shell px-4 sm:px-6 lg:px-8";
const NAV = [
    { label: "Schedule", href: "#schedule" },
    { label: "Tracks", href: "#tracks" },
    { label: "Rules", href: "#rules" },
    { label: "FAQ", href: "#faq" },
    { label: "Sponsors", href: "#sponsors" },
];
const STATS = [
    { v: "12 hrs", l: "single-day sprint" },
    { v: "2", l: "tracks, one choice" },
    { v: "$1,800", l: "in prizes" },
    { v: "1–4", l: "builders per team" },
];

function Primary({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="pop inline-flex items-center justify-between gap-6 border-2 border-ink bg-crimson px-5 py-3.5 text-card"
        >
            <span className="display text-[15px] tracking-[0.01em]">{children}</span>
            <span aria-hidden="true" className="font-plex text-sm">
                {">"}_
            </span>
        </a>
    );
}

function Secondary({ href, children, external = true }: { href: string; children: React.ReactNode; external?: boolean }) {
    return (
        <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="meta inline-flex items-center gap-2 border-2 border-ink bg-card px-4 py-3 text-[11px] text-ink transition-colors hover:bg-ink hover:text-card"
        >
            {children}
        </a>
    );
}

function Head({ n, id, title, line, dark }: { n: string; id: string; title: string; line: string; dark?: boolean }) {
    return (
        <div className={`${SHELL} scroll-mt-20`} id={id}>
            <div className={`flex items-center justify-between border-b pb-2 ${dark ? "border-cream/25" : "border-rule"}`}>
                <span className={`meta text-[11px] ${dark ? "text-cream/70" : "text-ink-3"}`}>
                    {n} · {id}
                </span>
                <span className={`meta text-[11px] ${dark ? "text-cream/70" : "text-ink-3"}`}>hackbama_01</span>
            </div>
            <h2 className={`display mt-6 text-balance text-[clamp(2.4rem,7.2vw,5.5rem)] ${dark ? "text-cream" : ""}`}>{title}</h2>
            <p className={`tagline mt-3 max-w-[46ch] text-[clamp(1.05rem,2vw,1.35rem)] ${dark ? "text-cream/80" : "text-ink-3"}`}>
                {line}
            </p>
        </div>
    );
}

const TONE = {
    crimson: ["bg-crimson", "bg-crimson-bright", "bg-crimson-deep"],
    forest: ["bg-forest", "bg-forest-bright", "bg-forest/60"],
} as const;

function Podium({ t }: { t: Track }) {
    // Drawn 2 · 1 · 3, like the posters.
    const order = [
        { place: "2", prize: t.prizes[1], h: "h-[62%]", bg: TONE[t.tone][0] },
        { place: "1", prize: t.prizes[0], h: "h-[86%]", bg: TONE[t.tone][1] },
        { place: "3", prize: t.prizes[2], h: "h-[40%]", bg: TONE[t.tone][2] },
    ];
    return (
        <ol className="flex h-[260px] items-end" aria-label={`Prizes: first ${t.prizes[0]}, second ${t.prizes[1]}, third ${t.prizes[2]}`}>
            {order.map((o) => (
                <li key={o.place} className={`flex flex-1 flex-col justify-end ${o.h}`} aria-hidden="true">
                    <span className="display mb-2 text-center text-[clamp(1.3rem,3vw,2rem)] text-cream">{o.prize}</span>
                    <div className={`flex flex-1 items-end justify-center pb-3 ${o.bg}`}>
                        <span className="display text-[clamp(2rem,4.5vw,3.25rem)] text-cream">{o.place}</span>
                    </div>
                </li>
            ))}
        </ol>
    );
}

export default function HackBama1() {
    return (
        <main>
            <a href="#schedule" className="meta sr-only z-50 bg-ink px-3 py-2 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
                Skip to schedule
            </a>

            {/* Nav */}
            <header className="sticky top-0 z-nav border-b-2 border-ink bg-cream/95 backdrop-blur-sm">
                <div className={`${SHELL} flex h-14 items-center justify-between gap-4`}>
                    <a href="#top" className="flex items-center gap-2.5" aria-label="HackBama_01, back to top">
                        <Mark className="h-4 w-auto text-ink" />
                        <span className="display text-[15px]">HackBama_01</span>
                    </a>
                    <nav aria-label="Sections" className="hidden md:block">
                        <ul className="flex gap-6">
                            {NAV.map((n) => (
                                <li key={n.href}>
                                    <a href={n.href} className="meta text-[11px] text-ink-3 transition-colors hover:text-crimson">
                                        {n.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <a
                        href={REGISTER}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meta border-2 border-ink bg-crimson px-3 py-1.5 text-[11px] text-card transition-colors hover:bg-ink"
                    >
                        [ register ]
                    </a>
                </div>
            </header>

            {/* Hero */}
            <section id="top" className="relative overflow-hidden pb-16 pt-10 sm:pt-14 lg:pb-24">
                <span aria-hidden="true" className="meta absolute bottom-10 left-3 hidden rotate-180 text-[10px] text-ink-3 [writing-mode:vertical-rl] 2xl:block">
                    hackbama · 10.17.2026
                </span>
                <span aria-hidden="true" className="meta absolute bottom-10 right-3 hidden rotate-180 text-[10px] text-ink-3 [writing-mode:vertical-rl] 2xl:block">
                    {">"}_ university of alabama · hackathons · build-a-thons · AI · infra · open source
                </span>

                <div className={SHELL}>
                    <p className="meta flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-3 sm:text-xs">
                        <span>
                            <span className="text-crimson">{">"}_</span> sat 10.17.2026
                        </span>
                        <span aria-hidden="true" className="text-gold">
                            ·
                        </span>
                        <span>7:30 AM – 8:30 PM CDT</span>
                        <span aria-hidden="true" className="text-gold">
                            ·
                        </span>
                        <span>HM Comer Hall</span>
                    </p>

                    <h1 className="display mt-6 text-[min(calc((100vw-2rem)/6.6),11rem)] leading-[0.82]" aria-label="HackBama_01">
                        <span aria-hidden="true" className="block whitespace-nowrap">
                            Hackbama
                        </span>
                        <span aria-hidden="true" className="mt-[0.06em] flex items-end gap-[0.06em] whitespace-nowrap">
                            <span className="cursor mb-[0.02em] inline-block h-[0.13em] w-[0.62em] bg-crimson" />
                            <span>01</span>
                            <span className="mb-[0.08em] ml-[0.12em] hidden flex-col gap-2 text-left sm:flex">
                                <span className="meta text-[clamp(11px,1.1vw,14px)] text-crimson">12 hour hackathon</span>
                                <span className="tagline whitespace-normal text-[clamp(1rem,2vw,1.6rem)] normal-case leading-tight tracking-[-0.01em] [font-family:var(--font-archivo)]">
                                    Build things. Ship things. Roll Tide.
                                </span>
                            </span>
                        </span>
                    </h1>
                    <div className="mt-4 sm:hidden">
                        <p className="meta text-[11px] text-crimson">12 hour hackathon</p>
                        <p className="tagline mt-1 text-lg">Build things. Ship things. Roll Tide.</p>
                    </div>

                    <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1fr_440px] lg:items-end">
                        <div>
                            <p className="max-w-[44ch] text-[17px] leading-[1.55] sm:text-lg">
                                One Saturday, twelve hours, two sponsor tracks. Show up with a laptop, leave with something that
                                runs and a demo you gave in front of a room. Prompts are sealed until 9:30 AM.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <Primary href={REGISTER}>Register</Primary>
                                <Secondary href={GROUPME}>Join the GroupMe</Secondary>
                                <Secondary href={CALENDAR}>+ Calendar</Secondary>
                            </div>
                        </div>
                        <Clock />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <div className={SHELL}>
                <dl className="grid grid-cols-2 border-2 border-ink bg-card md:grid-cols-4">
                    {STATS.map((s, i) => (
                        <div
                            key={s.l}
                            className={`flex flex-col px-4 py-5 sm:px-5 ${i % 2 ? "border-l border-rule" : ""} ${i > 1 ? "border-t border-rule md:border-t-0" : ""} ${
                                i === 2 ? "md:border-l" : ""
                            }`}
                        >
                            <dt className="meta mt-2 text-[10px] text-ink-3 sm:text-[11px]">{s.l}</dt>
                            <dd className="display order-first text-[clamp(1.9rem,4vw,2.75rem)] normal-case text-crimson">{s.v}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            {/* Schedule */}
            <section className="pt-24 sm:pt-32">
                <Head n="01" id="schedule" title="One day, one trace" line="Every block hangs off the day at the minute it starts. On the 17th, a cursor walks it in real time." />
                <div className="mt-12">
                    <Day />
                </div>
            </section>

            {/* Tracks */}
            <section className="on-ink mt-24 bg-ink py-20 text-cream sm:mt-32 sm:py-28">
                <Head n="02" id="tracks" title="Two tracks. One choice." line="$1,800 in prizes across two sponsor tracks. Your team builds for one of them." dark />
                <div className={`${SHELL} mt-14 grid gap-6 lg:grid-cols-2`}>
                    {TRACKS.map((t) => (
                        <article key={t.n} className="border border-cream/25 p-5 sm:p-7">
                            <div className="flex items-baseline justify-between gap-4">
                                <span className="meta text-[11px] text-cream/70">track_{t.n}</span>
                                <span className="meta text-[11px] text-cream">{t.total} in prizes</span>
                            </div>
                            <h3 className="display mt-4 text-[clamp(1.8rem,3.6vw,2.6rem)]">{t.sponsor}</h3>
                            <div className="mt-8">
                                <Podium t={t} />
                            </div>
                            <div className="mt-6">
                                <Sealed />
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Rules, manifest, getting there */}
            <section className="pt-24 sm:pt-32">
                <Head n="03" id="rules" title="Ship it by five" line="Small teams, one track, one hard deadline. Here is everything you need to walk in ready." />
                <div className={`${SHELL} mt-12 grid gap-4 lg:grid-cols-3`}>
                    <div className="border border-rule bg-card p-6">
                        <h3 className="meta text-[11px] text-crimson">The rules</h3>
                        <ul className="mt-5 space-y-4">
                            {RULES.map((r) => (
                                <li key={r} className="flex gap-3 text-[16px] leading-snug">
                                    <span aria-hidden="true" className="mt-[7px] h-2 w-2 shrink-0 bg-crimson" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 border-t border-rule pt-4 text-[14px] text-ink-3">
                            Full rules and judging criteria are posted at the opening. HackBama follows the{" "}
                            <a href="https://mlh.io/code-of-conduct" target="_blank" rel="noopener noreferrer" className="underline decoration-crimson underline-offset-4 hover:text-crimson">
                                MLH Code of Conduct
                            </a>
                            .
                        </p>
                    </div>

                    <div className="border-2 border-ink bg-card p-6 shadow-pop">
                        <div className="flex items-baseline justify-between">
                            <h3 className="meta text-[11px] text-crimson">The manifest</h3>
                            <span className="meta text-[11px] text-ink">due 5:00 PM</span>
                        </div>
                        <ul className="mt-5 space-y-2.5">
                            {MANIFEST.map((m) => (
                                <li key={m} className="flex gap-3 font-plex text-[14px]">
                                    <span aria-hidden="true" className="text-crimson">
                                        [ ]
                                    </span>
                                    {m}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 border-t border-rule pt-4">
                            {DEVPOST ? (
                                <a
                                    href={DEVPOST}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="display inline-flex items-center gap-3 text-[15px] text-crimson hover:underline"
                                >
                                    Submit on Devpost <span className="font-plex text-sm">{">"}_</span>
                                </a>
                            ) : (
                                <p className="text-[14px] text-ink-3">The submission link goes up here and on the screens at the opening ceremony.</p>
                            )}
                        </div>
                    </div>

                    <div className="border border-rule bg-card p-6">
                        <h3 className="meta text-[11px] text-crimson">Getting there</h3>
                        <a href={MAPS} target="_blank" rel="noopener noreferrer" className="group mt-5 block">
                            <span className="display block text-[1.5rem] group-hover:text-crimson">{VENUE.name}</span>
                            <span className="mt-1 block font-plex text-[13px] text-ink-3">
                                {VENUE.street}, {VENUE.city}
                            </span>
                            <span className="meta mt-2 block text-[10px] text-crimson">open in maps {">"}</span>
                        </a>
                        <h4 className="meta mt-6 border-t border-rule pt-4 text-[11px] text-ink-3">Parking</h4>
                        <ul className="mt-3 space-y-4">
                            {PARKING.map((p) => (
                                <li key={p.name}>
                                    <a href={p.maps} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-crimson">
                                        {p.name}
                                    </a>
                                    <p className="font-plex text-[13px] text-ink-3">{p.street}</p>
                                    <p className="font-plex text-[13px]">
                                        <span className="text-crimson" aria-hidden="true">
                                            ${" "}
                                        </span>
                                        {p.pay}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="pt-24 sm:pt-32">
                <Head n="04" id="faq" title="Ask first" line="The questions we keep getting. Anything else, ask in the GroupMe." />
                <div className={`${SHELL} mt-12`}>
                    <div className="border-b border-rule">
                        {FAQ.map((f) => (
                            <details key={f.q} className="group border-t border-rule">
                                <summary className="flex cursor-pointer items-baseline gap-4 py-5 [&::marker]:hidden">
                                    <span aria-hidden="true" className="faq-mark inline-block font-plex text-crimson transition-transform">
                                        {">"}
                                    </span>
                                    <span className="display text-[clamp(1.2rem,2.6vw,1.75rem)] group-hover:text-crimson">{f.q}</span>
                                </summary>
                                <p className="max-w-[60ch] pb-6 pl-8 text-[16px] text-ink-3">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sponsors */}
            <section className="pb-24 pt-24 sm:pb-32 sm:pt-32">
                <Head n="05" id="sponsors" title="Built with" line="The track sponsors, the food, the swag, and the people who said yes to a room full of students." />
                <div className={`${SHELL} mt-12`}>
                    <Sponsors />
                </div>
            </section>

            {/* Close */}
            <footer className="on-ink bg-ink text-cream">
                <div className={`${SHELL} py-20 sm:py-28`}>
                    <p className="meta text-[11px] text-cream/70">
                        <span className="text-cream">{">"}_</span> sat 10.17 · 7:30 AM · HM Comer Hall
                    </p>
                    <p className="display mt-6 text-[clamp(3rem,11vw,9rem)]">
                        See you
                        <br />
                        Saturday<span className="text-crimson-bright">.</span>
                    </p>
                    <div className="mt-10 flex flex-wrap gap-3">
                        <a
                            href={REGISTER}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pop inline-flex items-center gap-6 border-2 border-cream bg-crimson px-5 py-3.5 text-card"
                        >
                            <span className="display text-[15px]">Register</span>
                            <span aria-hidden="true" className="font-plex text-sm">
                                {">"}_
                            </span>
                        </a>
                        <a
                            href={GROUPME}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="meta inline-flex items-center border-2 border-cream px-4 py-3 text-[11px] transition-colors hover:bg-cream hover:text-ink"
                        >
                            Join the GroupMe
                        </a>
                    </div>

                    <div className="mt-20 grid border border-cream/25 sm:grid-cols-3">
                        {ORGANIZERS.map((o, i) => (
                            <div key={o.email} className={`p-5 ${i ? "border-t border-cream/25 sm:border-l sm:border-t-0" : ""}`}>
                                <p className="meta text-[10px] text-cream/70">{o.role}</p>
                                <p className="display mt-2 text-[1.2rem]">{o.name}</p>
                                <a href={`mailto:${o.email}`} className="mt-1 block break-all font-plex text-[13px] text-cream/80 hover:text-cream hover:underline">
                                    {o.email}
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-col gap-3 border-t border-cream/25 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="meta text-[10px] text-cream/70">
                            After the 17th: Mondays, 5–6 PM · Cyber Lab, Tom Bevill 1066
                        </p>
                        <Link href="/" className="meta text-[10px] text-cream hover:underline">
                            hackbama.org {">"}
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}
