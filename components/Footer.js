import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-24 border-t border-[var(--border)] bg-[var(--surface-2)] px-4 sm:px-8">
            <div className="mx-auto max-w-7xl py-10">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--background)]">
                            <Sparkles className="h-3.5 w-3.5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[var(--foreground)]">SEO Miner</p>
                            <p className="text-xs text-[var(--text-muted)]">Free SEO research workspace</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                        <div className="flex gap-4">
                            <Link
                                href="/privacy"
                                className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--foreground)]"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--foreground)]"
                            >
                                Terms of Service
                            </Link>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                            &copy; {new Date().getFullYear()} SEO Miner. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
