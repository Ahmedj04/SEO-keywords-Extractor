import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';


export default function Header() {
    // Mobile Menu State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);

    // Function to close the mobile menu
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Close menu when clicking outside 
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* fixed header    */}
            {/* <nav className="fixed top-0 left-0 w-full py-4 px-4 sm:px-8 text-white z-50 bg-gray-900/90 backdrop-blur-md">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between pt-4 sm:pt-8 ">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        SEO Keyword Miner
                    </h1>
                    <div className="hidden sm:flex space-x-6 text-sm sm:text-base">
                        <a href="#about" className="hover:text-purple-300 transition">About Us</a>
                        <a href="#contact" className="hover:text-purple-300 transition">Contact Us</a>
                    </div>
                    <div className="sm:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                            <Menu className="h-6 w-6" />
                        </button>
                        <AnimatePresence>
                            {isMobileMenuOpen && (
                                <motion.div
                                    ref={mobileMenuRef}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="fixed top-0 right-0 h-screen w-64 bg-gray-900/90 backdrop-blur-md border-l border-purple-500/20 shadow-2xl z-50 p-6 space-y-8"
                                >
                                    <div className="flex justify-end">
                                        <button onClick={closeMobileMenu} className="text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex flex-col space-y-6 text-sm sm:text-base">
                                        <a href="#" onClick={closeMobileMenu} className="hover:text-purple-300 transition">Home</a>
                                        <a href="#about" onClick={closeMobileMenu} className="hover:text-purple-300 transition">About Us</a>
                                        <a href="#contact" onClick={closeMobileMenu} className="hover:text-purple-300 transition">Contact Us</a>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav> */}

            <nav className="flex items-center justify-between max-w-6xl mx-auto py-4 text-white">
                <Link href='/'>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        SEO Keyword Miner
                    </h1>
                </Link>
                <div className="hidden sm:flex space-x-6 text-sm sm:text-base">
                    <Link href="/aiwriter" className="relative flex items-center gap-2 hover:text-purple-300 transition font-semibold">
                        <span>AI Writer</span>
                        <motion.span
                            initial={{ opacity: 0.6, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                            className=" bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full shadow-md"
                        >
                            New ✨
                        </motion.span>
                    </Link>
                    <Link href="/#how-it-works" className="hover:text-purple-300 transition">How it Works</Link>
                    <Link href="/#features" className="hover:text-purple-300 transition">Features</Link>
                    <Link href="/#about" className="hover:text-purple-300 transition">About Us</Link>
                    <Link href="/#contact" className="hover:text-purple-300 transition">Contact</Link>
                    {/* <Link href="/terms" className="hover:text-purple-300 transition">Terms of Service</Link> */}
                    {/* <Link href="/privacy" className="hover:text-purple-300 transition">Privacy Policy</Link> */}
                </div>
                <div className="sm:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                        <Menu className="h-6 w-6" />
                    </button>
                    {/* Mobile Menu Modal */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                ref={mobileMenuRef}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="fixed top-0 right-0 h-screen w-64 bg-gray-900/90 backdrop-blur-md border-l border-purple-500/20 shadow-2xl z-50 p-6 space-y-8"
                            >
                                <div className="flex justify-end">
                                    <button onClick={closeMobileMenu} className="text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex flex-col space-y-6 text-sm sm:text-base">
                                    <Link href="#" onClick={closeMobileMenu} className="hover:text-purple-300 transition">Home</Link>
                                    <Link href="/aiwriter" className="relative flex items-center gap-2 hover:text-purple-300 transition font-semibold">
                                        <span>AI Writer</span>
                                        <motion.span
                                            initial={{ opacity: 0.6, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                                            className=" bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full shadow-md"
                                        >
                                            New ✨
                                        </motion.span>
                                    </Link>
                                    <Link href="/#how-it-works" onClick={closeMobileMenu} className="hover:text-purple-300 transition">How it Works</Link>
                                    <Link href="/#features" onClick={closeMobileMenu} className="hover:text-purple-300 transition">Features</Link>
                                    <Link href="/#about" onClick={closeMobileMenu} className="hover:text-purple-300 transition">About Us</Link>
                                    <Link href="/#contact" onClick={closeMobileMenu} className="hover:text-purple-300 transition">Contact</Link>
                                    <Link href="/terms" onClick={closeMobileMenu} className="hover:text-purple-300 transition">Terms of Service</Link>
                                    <Link href="/privacy" onClick={closeMobileMenu} className="hover:text-purple-300 transition">Privacy Policy</Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
        </>
    )

}