import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8">

            <Header />

            <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
                    Terms of Service
                </h1>

                <div className="bg-gradient-to-br from-gray-800/40 to-black/30 border border-purple-500/20 rounded-xl p-6 space-y-6">
                    <p>
                        These Terms of Service ("Terms") govern your access to and use of SEO Keyword Miner ("the Service"). By using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.
                    </p>

                    <p>
                        SEO Keyword Miner is a web-based tool designed to assist users with search engine optimization (SEO) tasks, including keyword extraction, keyword gap analysis, competitor research, and AI-generated content ideas. The Service is currently offered as a side project and is made available on an "as-is" basis without any warranties or guarantees of performance or uptime.
                    </p>

                    <p>
                        Users are expected to use the Service in good faith and for lawful purposes only. You agree not to misuse the platform in any way, including but not limited to attempting to interfere with its operation, reverse engineering any part of it, or using it to generate or distribute malicious or misleading content.
                    </p>

                    <p>
                        While there may be features that involve comparing data or extracting insights from third-party websites, the Service itself does not require user accounts and does not store or retain personal information. However, users are solely responsible for ensuring that their use of any content or data generated through the Service complies with applicable copyright, data usage, and privacy laws.
                    </p>

                    <p>
                        The Service may change over time. Features may be added, modified, or removed without prior notice. As this is a personal side project, there is no guarantee of support, maintenance, or continued availability.
                    </p>

                    <p>
                        Under no circumstances shall the creator of SEO Keyword Miner be liable for any damages or losses resulting from the use or inability to use the Service. You use the tool at your own risk, and any decisions or strategies based on the insights provided are your responsibility alone.
                    </p>

                    <p>
                        These Terms may be updated occasionally. Continued use of the Service after changes are made constitutes your acceptance of the revised Terms.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TermsOfService;
