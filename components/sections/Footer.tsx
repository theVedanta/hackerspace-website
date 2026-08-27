import { Chimes } from "@/components/brand/Chimes";

export function Footer() {
    return (
        <footer className="border-t border-rule/70">
            <div className="mx-auto flex max-w-shell flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
                <div className="flex items-end gap-5">
                    <Chimes className="h-20 w-auto shrink-0 text-crimson" />
                    <div>
                        <p className="font-display text-2xl tracking-[0.1em] text-ink">
                            HACKBAMA
                        </p>
                        <p className="mt-1 text-sm text-ink-soft">
                            The University of Alabama
                        </p>
                    </div>
                </div>

                <div className="text-sm leading-relaxed text-ink-soft md:text-right">
                    <p>
                        A proposed student organization of the Department of
                        Computer Science.
                    </p>
                    <p className="mt-1">
                        Questions? Reach Vedanta Somnathe or Faizan Khan.
                    </p>
                </div>
            </div>
        </footer>
    );
}
