import { CADENCE } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

export function Cadence() {
    return (
        <section id="what" className="border-b border-rule/70 bg-paper">
            <div className="mx-auto max-w-shell px-5 py-20 sm:px-8 md:py-32">
                <Reveal>
                    <h2 className="max-w-[20ch] text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl md:text-[3.5rem]">
                        Twice a month. Every third one, a clock.
                    </h2>
                </Reveal>

                <div className="mt-14 grid gap-px bg-rule/70 md:grid-cols-3">
                    {CADENCE.map((item, i) => (
                        <Reveal key={item.title} delay={i * 0.08}>
                            <article
                                className={`flex h-full flex-col gap-4 p-8 md:p-10 ${
                                    item.featured
                                        ? "bg-crimson text-paper"
                                        : "bg-paper"
                                }`}
                            >
                                <h3
                                    className={`text-xl font-semibold tracking-[-0.02em] md:text-2xl ${
                                        item.featured ? "text-paper" : "text-ink"
                                    }`}
                                >
                                    {item.title}
                                </h3>
                                <p
                                    className={`text-base leading-relaxed ${
                                        item.featured
                                            ? "text-paper/85"
                                            : "text-ink-soft"
                                    }`}
                                >
                                    {item.body}
                                </p>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
