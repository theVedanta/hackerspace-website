import { GROUPME } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

export function Join() {
    return (
        <section id="join" className="bg-crimson text-paper">
            <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 md:py-36">
                <Reveal>
                    <h2 className="max-w-[16ch] text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl md:text-[4.5rem]">
                        Build something real.
                    </h2>
                    <p className="mt-7 max-w-[46ch] text-lg leading-relaxed text-paper/85">
                        No application, no experience bar, no dues. Freshmen
                        welcome. Come to one night and decide from there.
                    </p>
                    <a
                        href={GROUPME}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-10 inline-flex items-center justify-center bg-paper px-8 py-4 text-base font-medium text-crimson transition-all duration-200 ease-brand hover:bg-bone active:translate-y-px"
                    >
                        Join the GroupMe
                    </a>
                </Reveal>
            </div>
        </section>
    );
}
