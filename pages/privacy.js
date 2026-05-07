import React from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShieldCheck } from 'lucide-react'

export default function Privacy() {
    return (
        <div className="relative min-h-screen overflow-x-clip" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
            <Header />

            <main className="px-4 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mx-auto max-w-3xl py-20"
                >
                    <div className="mb-10 text-center">
                        <div
                            className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl"
                            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                        >
                            <ShieldCheck className="h-7 w-7" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                            Legal
                        </p>
                        <h1
                            className="mt-2 text-4xl font-bold sm:text-5xl"
                            style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--foreground)' }}
                        >
                            Privacy Policy
                        </h1>
                    </div>

                    <div
                        className="rounded-2xl border p-8 md:p-10"
                        style={{
                            borderColor: 'var(--border)',
                            background: 'var(--surface)',
                            boxShadow: 'var(--shadow-md)',
                        }}
                    >
                        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            <p>
                                SEO Miner is committed to respecting your privacy. As of now, this Service does not collect, store, or process any personal information from users.
                            </p>
                            <p>
                                No account creation is required to access or use the tool, and we do not ask for your name, email address, or any other identifiable information. We do not use cookies, local storage, or session storage to track user activity. The Service operates entirely without analytics scripts, trackers, or third-party integrations that would collect behavioral data.
                            </p>
                            <p>
                                All processing occurs on the client side or through external APIs for extracting publicly available SEO data from third-party URLs that users provide. The URLs you analyze are not stored or recorded by the Service.
                            </p>
                            <p>
                                In the event that user data collection becomes necessary in the future—for example, to save reports or personalize features—this policy will be updated clearly and transparently, and users will be informed before any changes go into effect.
                            </p>
                            <p>
                                By using SEO Miner, you acknowledge and agree to this data-minimal approach. If you have any concerns about privacy, you are encouraged to inspect the network traffic from your browser or review the open-source code (if applicable) to verify this privacy stance.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    )
}
