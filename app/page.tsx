import Navbar from "@/components/Navbar";
import { Intro } from "@/components/motion/Intro";
import { Hero } from "@/components/hero/Hero";
import { Why } from "@/components/sections/Why";
import { Cadence } from "@/components/sections/Cadence";
import { Nights } from "@/components/sections/Nights";
import { Teaches } from "@/components/sections/Teaches";
import { Proof } from "@/components/sections/Proof";
import { Play } from "@/components/sections/Play";
import { Join } from "@/components/sections/Join";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
    return (
        <>
            <Intro />
            <Navbar />
            <main>
                <Hero />
                <Why />
                <Cadence />
                <Nights />
                <Teaches />
                <Proof />
                <Play />
                <Join />
            </main>
            <Footer />
        </>
    );
}
