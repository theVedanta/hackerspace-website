import { GROUPME } from "@/lib/site";
import { Accent } from "@/components/brand/Accent";
import { Chimes } from "@/components/brand/Chimes";
import { Cta } from "@/components/ui/Cta";
import { Reveal } from "@/components/motion/Reveal";

export function Join() {
    return (
        <section
            id="join"
            className="relative isolate overflow-hidden bg-crimson text-paper"
            style={{ ["--mark-knockout" as string]: "hsl(var(--crimson))" }}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-[6vw] top-1/2 hidden -translate-y-1/2 opacity-[0.12] md:block"
            >
                <Chimes className="h-[130vh] w-auto text-paper" />
            </div>

            <div className="mx-auto max-w-shell px-5 py-28 sm:px-8 md:py-44">
                <Reveal>
                    <h2 className="text-[3.25rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl md:text-[6rem]">
                        Build <Accent className="text-paper">something.</Accent>
                    </h2>
                    <p className="mt-7 max-w-[44ch] text-lg leading-relaxed text-paper/85">
                        No application, no experience bar, no dues. Freshmen
                        welcome. Come to one night and decide from there.
                    </p>
                    <div className="mt-10">
                        <Cta href={GROUPME} external variant="bone" size="lg">
                            Join the GroupMe
                        </Cta>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
