import React, { useState,useEffect } from 'react';

const SeoKeywordFinder = () => {
    const [url, setUrl] = useState('');
    const [keywords, setKeywords] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [adLoaded, setAdLoaded] = useState(false); // State to track ad loading

     // Function to load Google AdSense script
     const loadAdSenseScript = () => {
        if (typeof window === 'undefined' || document.querySelector('#adsense-script')) {
            return; // Prevent running on server, and prevent multiple loads
        }
        const script = document.createElement('script');
        script.id = 'adsense-script';
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8393566924928419';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        script.onload = () => {
            setAdLoaded(true); // Set state when script loads
            console.log("Adsense script loaded")
        };

        script.onerror = () => {
            console.error("Failed to load AdSense script.");
        };
    };

    useEffect(() => {
        loadAdSenseScript(); // Load AdSense script on component mount

        // Cleanup function to remove the script when the component unmounts
        return () => {
            const script = document.querySelector('#adsense-script');
            if (script) {
                script.remove();
            }
            setAdLoaded(false);
        };
    }, []);

    const handleGetKeywords = async () => {
        if (!url) {
            setError('Please enter a URL.');
            return;
        }

        setLoading(true);
        setError(null);
        setKeywords(null); // Clear previous results

        try {
            // Basic URL validation
            try {
                new URL(url);
            } catch (_) {
                setError('Invalid URL. Please enter a valid URL, including the protocol (http:// or https://).');
                setLoading(false);
                return;
            }


            const response = await fetch('http://localhost:3001/getKeywords', { // Adjust the endpoint if needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch keywords.');
            }

            const data = await response.json();
            if (data && data.keywords && Array.isArray(data.keywords)) {
                setKeywords(data.keywords);
            }
            else {
                setError('No keywords found, or invalid response from the server.');
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                        SEO Keyword Finder
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg">
                        Enter a URL to extract relevant SEO keywords.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Enter URL (e.g., https://www.example.com)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500 rounded-md py-3 px-4"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleGetKeywords();
                            }
                        }}
                    />
                    <button
                        onClick={handleGetKeywords}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600
                        disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-md"
                    >
                        {loading ? 'Loading...' : 'Find Keywords'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-400 border-red-500/30 p-4 rounded-md flex items-start gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mt-1"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" x2="12" y1="8" y2="12"></line>
                            <line x1="12" x2="12.01" y1="16" y2="16"></line>
                        </svg>
                        <div>
                            <h2 className="text-lg font-semibold">Error</h2>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {keywords && (
                    <div className="opacity-0 animate-fadeIn delay-300">
                        <div className="bg-black/20 border-purple-500/30 rounded-md">
                            <div className="p-6">
                                <h2 className="text-white text-2xl font-semibold mb-2">SEO Keywords</h2>
                                <p className="text-gray-400 mb-4">
                                    Top {keywords.length} keywords extracted from the URL.
                                </p>
                                {/* Google AdSense Ad Unit */}
                                {adLoaded && (
                                    <div className="my-4">
                                        <ins
                                            className="adsbygoogle"
                                            style={{ display: "block" }}
                                            data-ad-client="ca-pub-8393566924928419" // Replace with your actual client ID
                                            data-ad-slot="4803905629"     // Replace with your actual ad slot ID
                                            data-ad-format="auto"
                                            data-full-width-responsive="true"
                                        ></ins>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {keywords.length > 0 ? (
                                        keywords.map((keyword, index) => (
                                            <div key={index} className="text-gray-300">
                                                <span className="mr-2">•</span>
                                                {keyword}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-400">No keywords found.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeoKeywordFinder;