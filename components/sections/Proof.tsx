import { OFFICERS, FOUNDING } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

export function Proof() {
    return (
        <section className="border-b border-rule/70">
            <div className="mx-auto max-w-shell px-5 py-20 sm:px-8 md:py-32">
                <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
                    <Reveal>
                        <p className="font-display text-3xl leading-[1.3] tracking-[-0.01em] text-ink sm:text-4xl">
                            Seventy students joined the group chat before this
                            club was allowed to exist.
                        </p>
                        <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-ink-soft">
                            Six of them volunteered to mentor. Nobody asked
                            them to. That is the whole argument for why
                            HackBama should be here.
                        </p>
                    </Reveal>

                    <Reveal delay={0.12}>
                        <div className="border-t border-rule/70 pt-8">
                            {OFFICERS.map((o) => (
                                <div
                                    key={o.name}
                                    className="flex items-baseline justify-between gap-6 py-3.5"
                                >
                                    <span className="font-display text-xl text-ink">
                                        {o.name}
                                    </span>
                                    <span className="shrink-0 font-mono text-xs uppercase tracking-[0.12em] text-ink-faint">
                                        {o.role}
                                    </span>
                                </div>
                            ))}
                            <p className="mt-6 border-t border-rule/70 pt-6 text-sm leading-relaxed text-ink-soft">
                                With founding members {FOUNDING[0]},{" "}
                                {FOUNDING[1]}, and {FOUNDING[2]}.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
