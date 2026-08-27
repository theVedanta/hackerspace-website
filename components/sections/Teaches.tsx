import { TEACHES } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

export function Teaches() {
    return (
        <section className="border-b border-rule/70 bg-paper">
            <div className="mx-auto max-w-shell px-5 py-20 sm:px-8 md:py-32">
                <Reveal>
                    <h2 className="max-w-[26ch] font-display text-4xl leading-[1.1] tracking-[-0.015em] text-ink sm:text-5xl">
                        Taught by students who did it eighteen months ago.
                    </h2>
                    <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-ink-soft">
                        Not a professor two decades from their last standup.
                        Upperclassmen with hackathon placements and finished
                        internships, in the same room, building alongside you.
                    </p>
                </Reveal>

                <div className="mt-14 grid gap-x-16 gap-y-9 sm:grid-cols-2">
                    {TEACHES.map((line, i) => (
                        <Reveal key={line} delay={i * 0.05}>
                            <div className="flex gap-5">
                                <span
                                    aria-hidden="true"
                                    className="mt-3 h-px w-8 shrink-0 bg-crimson"
                                />
                                <p className="text-lg leading-relaxed text-ink">
                                    {line}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
