import Navbar from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Why } from "@/components/sections/Why";
import { Cadence } from "@/components/sections/Cadence";
import { Nights } from "@/components/sections/Nights";
import { Teaches } from "@/components/sections/Teaches";
import { Proof } from "@/components/sections/Proof";
import { Join } from "@/components/sections/Join";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Why />
                <Cadence />
                <Nights />
                <Teaches />
                <Proof />
                <Join />
            </main>
            <Footer />
        </>
    );
}
