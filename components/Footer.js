import React from 'react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="text-center text-gray-500 text-sm mt-8">
            &copy; {new Date().getFullYear()} SEO Keyword Miner. All rights reserved.
            <div className="mt-2">
                <Link href="/privacy" className="hover:text-white transition-colors mr-4">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
        </footer>
    )
}
