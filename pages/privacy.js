import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function () {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8">

            <Header />

            <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
                    Privacy Policy
                </h1>

                <div className="bg-gradient-to-br from-gray-800/40 to-black/30 border border-purple-500/20 rounded-xl p-6 space-y-6">
                    <p>
                        SEO Keyword Miner is committed to respecting your privacy. As of now, this Service does not collect, store, or process any personal information from users.
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
                        By using SEO Keyword Miner, you acknowledge and agree to this data-minimal approach. If you have any concerns about privacy, you are encouraged to inspect the network traffic from your browser or review the open-source code (if applicable) to verify this privacy stance.
                    </p>
                </div>
            </div>


            <Footer />
        </div>
    )
}
