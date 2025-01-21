"use client";

// import { useState } from "react";
// import { Menu } from "lucide-react";

const Navbar = () => {
    // const [isOpen, setIsOpen] = useState(false);

    // const toggleMenu = () => {
    //     setIsOpen(!isOpen);
    // };

    return (
        <nav className="absolute top-0 w-full p-4 flex justify-between items-center z-30">
            <div className="text-white font-semibold hover:text-red-300 transition-colors cursor-pointer">
                UA HackerSpace
            </div>
            {/* <div className="md:flex hidden gap-x-10">
                <a
                    href="#"
                    className="text-neutral-300 hover:text-red-200 transition-colors"
                >
                    About
                </a>
                <a
                    href="#"
                    className="text-neutral-300 hover:text-red-200 transition-colors"
                >
                    Projects
                </a>
                <a
                    href="#"
                    className="text-neutral-300 hover:text-red-200 transition-colors"
                >
                    Join Us
                </a>
            </div>
            <div className="md:hidden flex items-center">
                <button onClick={toggleMenu} className="text-white">
                    <Menu />
                </button>
                {isOpen && (
                    <div className="absolute top-12 right-0 bg-slate-950 p-6 gap-y-4 rounded-md shadow-lg">
                        <a
                            href="#"
                            className="block text-neutral-300 hover:text-red-200 transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="#"
                            className="block text-neutral-300 hover:text-red-200 transition-colors"
                        >
                            Projects
                        </a>
                        <a
                            href="#"
                            className="block text-neutral-300 hover:text-red-200 transition-colors"
                        >
                            Join Us
                        </a>
                    </div>
                )}
            </div> */}
        </nav>
    );
};

export default Navbar;
