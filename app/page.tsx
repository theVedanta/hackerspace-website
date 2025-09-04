import Navbar from "@/components/Navbar";
import { Boxes } from "@/components/ui/background-boxes";
import { Vortex } from "@/components/ui/vortex";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="h-screen relative w-full overflow-hidden bg-zinc-900">
            <Navbar />

            <div className="md:flex hidden w-screen h-screen absolute top-0 left-0">
                <Boxes />
            </div>
            <div className="md:hidden flex w-screen h-screen absolute top-0 left-0">
                <Vortex
                    backgroundColor="black"
                    rangeY={800}
                    particleCount={100}
                    baseHue={255}
                />
            </div>

            <div className="h-full flex flex-col items-center justify-center">
                <Image
                    src="/logo.png"
                    alt="logo"
                    width={200}
                    height={200}
                    className="relative z-20 mb-6"
                />

                <h1 className="md:text-4xl text-2xl text-white relative z-20">
                    Welcome to UA HackerSpace
                </h1>
                <p className="text-center mt-6 text-neutral-400 relative z-20 max-w-lg px-4 md:px-0 text-sm md:text-base">
                    Join a community of passionate developers, designers, and
                    innovators who turn ideas into reality. From attending to
                    organizing hackathons, we&apos;re here to{" "}
                    <span className="text-rose-300">build the future</span>.
                </p>
                <Link href="https://groupme.com/join_group/105495989/hs26yOC2">
                    <button className="mt-8 px-6 py-2 border-2 font-semibold border-rose-300/20 text-white bg-rose-400/40 hover:bg-rose-500/20 transition-colors rounded-md relative z-20">
                        Join Us →
                    </button>
                </Link>
            </div>
        </div>
    );
}
