import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const navLinks = [
    { href: '/aiwriter', label: 'AI Writer', featured: true },
    { href: '/#how-it-works', label: 'How it Works' },
    { href: '/#features', label: 'Features' },
    { href: '/#about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    return (
        <header className="sticky top-0 z-50 px-4 sm:px-8 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-7xl items-center justify-between py-4 text-[var(--foreground)]">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--foreground)] text-[var(--background)] shadow-md transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:scale-105">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold leading-tight tracking-tight text-[var(--foreground)]">
                            SEO Miner
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] leading-tight font-medium">
                            Research workspace
                        </span>
                    </div>
                </Link>

                <div className="hidden items-center gap-0.5 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                                link.featured
                                    ? 'bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] shadow-sm'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] shadow-sm md:hidden hover:border-[var(--border-strong)] transition-colors"
                    aria-label="Open navigation menu"
                >
                    <Menu className="h-4 w-4" />
                </button>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            ref={mobileMenuRef}
                            initial={{ opacity: 0, scale: 0.95, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed right-4 top-4 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-xl)] md:hidden"
                        >
                            <div className="mb-3 flex items-center justify-between px-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                    Navigation
                                </span>
                                <button
                                    onClick={closeMobileMenu}
                                    className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors"
                                    aria-label="Close navigation menu"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <Link
                                    href="/"
                                    onClick={closeMobileMenu}
                                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors"
                                >
                                    Home
                                </Link>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={closeMobileMenu}
                                        className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                            link.featured
                                                ? 'bg-[var(--foreground)] text-[var(--background)]'
                                                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="my-1 border-t border-[var(--border)]" />
                                <Link
                                    href="/privacy"
                                    onClick={closeMobileMenu}
                                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                                <Link
                                    href="/terms"
                                    onClick={closeMobileMenu}
                                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
