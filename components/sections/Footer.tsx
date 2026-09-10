import { Chimes } from "@/components/brand/Chimes";

export function Footer() {
    return (
        <footer className="border-t border-rule-dark">
            <div className="mx-auto flex max-w-shell flex-col gap-10 px-5 py-14 sm:px-8 md:flex-row md:items-end md:justify-between">
                <div className="flex items-end gap-5">
                    <Chimes className="h-20 w-auto shrink-0 text-ember" />
                    <div>
                        <p className="font-display text-2xl font-bold tracking-[0.1em] text-bone">
                            HACKBAMA
                        </p>
                        <p className="mt-1 text-sm text-bone-dim">
                            The University of Alabama
                        </p>
                    </div>
                </div>

                <div className="text-sm leading-relaxed text-bone-dim md:text-right">
                    <p>
                        A proposed student organization of the Department of
                        Computer Science.
                    </p>
                    <p className="mt-1">
                        Questions? Reach Vedanta Somnathe or Faizan Khan.
                    </p>
                    <p
                        className="mt-5 font-mono text-xs text-bone-faint"
                        title="Try it anywhere on the page."
                    >
                        ↑ ↑ ↓ ↓ ← → ← → B A
                    </p>
                </div>
            </div>
        </footer>
    );
}
