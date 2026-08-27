import { Reveal } from "@/components/motion/Reveal";

export function Why() {
    return (
        <section id="why" className="border-b border-rule/70">
            <div className="mx-auto max-w-shell px-5 py-20 sm:px-8 md:py-32">
                <Reveal>
                    <p className="max-w-[24ch] text-3xl font-semibold leading-[1.2] tracking-[-0.025em] text-ink sm:text-4xl md:text-[2.6rem]">
                        Nobody is missing talent. They are missing a door.
                    </p>
                </Reveal>

                <Reveal delay={0.1}>
                    <div className="mt-12 grid gap-8 border-t border-rule/70 pt-10 md:grid-cols-2 md:gap-16">
                        <p className="text-lg leading-relaxed text-ink-soft">
                            Every fall, students arrive curious. They hear about
                            hackathons, open source, the people shipping things
                            at 2am. Then they wait, because nobody told them
                            what the first step looks like.
                        </p>
                        <p className="text-lg leading-relaxed text-ink-soft">
                            So we made the first step small. One room, one
                            evening, one thing that runs by the end of it. The
                            students who have already shipped something are the
                            ones who show up to the real hackathon in spring.
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
