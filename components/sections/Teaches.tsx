import { TEACHES } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

/**
 * What a semester covers. Two columns of three; each line carries a crimson
 * slab that sweeps in behind it on hover, so the list reads as a set of
 * switches rather than a syllabus.
 */
export function Teaches() {
    const left = TEACHES.slice(0, 3);
    const right = TEACHES.slice(3);

    return (
        <section className="border-b border-rule-dark bg-ink-2">
            <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 md:py-36">
                <Reveal>
                    <h2 className="max-w-[22ch] text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-bone sm:text-5xl md:text-[3.75rem]">
                        Taught by students who did it eighteen months ago.
                    </h2>
                    <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-bone-dim">
                        Not a professor two decades from their last standup.
                        Upperclassmen with hackathon placements and finished
                        internships, in the same room, building alongside you.
                    </p>
                </Reveal>

                <div className="mt-16 grid gap-x-10 md:grid-cols-2">
                    {[left, right].map((column, c) => (
                        <ul key={c} className="flex flex-col">
                            {column.map((line, i) => (
                                <Reveal key={line} delay={(c * 3 + i) * 0.05}>
                                    <li className="group relative -mx-4 overflow-hidden px-4 py-6 sm:py-7">
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 origin-left scale-x-0 bg-crimson transition-transform duration-500 ease-brand group-hover:scale-x-100"
                                        />
                                        <span className="relative block max-w-[34ch] text-xl font-medium leading-snug tracking-[-0.02em] text-bone transition-colors duration-300 group-hover:text-paper sm:text-2xl">
                                            {line}
                                        </span>
                                    </li>
                                </Reveal>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
        </section>
    );
}
