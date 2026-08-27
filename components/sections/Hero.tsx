import { GROUPME } from "@/lib/site";
import { Chimes } from "@/components/brand/Chimes";
import { Reveal } from "@/components/motion/Reveal";

export function Hero() {
    return (
        <section
            id="top"
            className="relative isolate overflow-hidden border-b border-rule/70"
        >
            <div
                aria-hidden="true"
                className="brand-grid pointer-events-none absolute inset-0 -z-10 opacity-60"
            />

            <div className="mx-auto grid max-w-shell gap-10 px-5 pb-16 pt-12 sm:px-8 md:min-h-[calc(100dvh-4rem)] md:grid-cols-[1fr_auto] md:items-center md:gap-20 md:pb-20 md:pt-16">
                <div>
                    <Reveal>
                        <h1 className="text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[5rem]">
                            Everybody says
                            <br />
                            <span className="italic leading-[1.1] text-crimson">
                                next semester.
                            </span>
                        </h1>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-ink-soft sm:text-lg">
                            HackBama is the room where it becomes tonight. Show
                            up, build something real, walk out with it running.
                        </p>
                    </Reveal>

                    <Reveal delay={0.18}>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <a
                                href={GROUPME}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center bg-crimson px-7 py-3.5 text-base font-medium text-paper transition-all duration-200 ease-brand hover:bg-crimson-bright active:translate-y-px"
                            >
                                Join the GroupMe
                            </a>
                            <a
                                href="#what"
                                className="inline-flex items-center justify-center border border-ink/25 px-7 py-3.5 text-base font-medium text-ink transition-colors duration-200 ease-brand hover:border-ink/60 active:translate-y-px"
                            >
                                See what a night looks like
                            </a>
                        </div>
                    </Reveal>
                </div>

                <Reveal delay={0.24}>
                    <Chimes className="mx-auto h-[190px] w-auto text-crimson sm:h-[300px] md:h-[min(560px,62vh)]" />
                </Reveal>
            </div>
        </section>
    );
}
