import React, { useState, useEffect } from 'react';
import { Rocket, Lightbulb, Search, ListChecks, Users, TrendingUp, Send, Menu, Loader2, ChevronRight, FileText } from 'lucide-react';
import { extractKeywords, getMostImportantKeyword } from '@/utils/keywordUtils';
import { getTopRankingPages, getCompetitorsUrls, generateContentSuggestions } from '@/utils/seoUtils';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
    const [url, setUrl] = useState("");
    const [keywords, setKeywords] = useState(null);
    const [gaps, setGaps] = useState(null);  // New state for keyword gaps
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [adLoaded, setAdLoaded] = useState(false); // State to track ad loading
    const [contentSuggestions, setContentSuggestions] = useState(null); // State for content suggestions
    const [competitorUrls, setCompetitorUrls] = useState(null); // State to store competitor URLs

    const [btnStatus, setBtnStatus] = useState('Mine Keywords');

    // Contact Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', null

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

    const handleGetKeywords = async () => {
        if (!url) {
            setError('Please enter a URL.');
            return;
        }

        setLoading(true);
        setError(null);
        setKeywords(null);
        setGaps(null); // Clear previous results
        setCompetitorUrls(null)
        setContentSuggestions(null);
        setBtnStatus('Analyzing...')

        try {
            //  Basic URL validation
            //  try {
            //     new URL(url);

            // } catch (_) {
            //     setError('Invalid URL. Please enter a valid URL, including the protocol (http:// or https://).');
            //     setLoading(false);
            //     return;
            // }
            let formattedUrl = url.trim();

            // Add https:// if missing
            if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
                formattedUrl = 'https://' + formattedUrl;
            }

            const metadataResponse = await axios.get(`/api/getPageMetadata?url=${encodeURIComponent(formattedUrl)}`);

            if (metadataResponse.status !== 200) return;

            setBtnStatus('Extracting Keywords...')
            // Fetch keywords from the current page
            const currentPageKeywords = await extractKeywords(formattedUrl);

            setBtnStatus('Analyzing Competitors...')

            const topPageUrls = await getCompetitorsUrls(formattedUrl);

            setBtnStatus('Extracting Keywords...')
            // Extract keywords from the top 3 pages
            const topPageKeywords = await Promise.all(
                topPageUrls.map(async (pageUrl) => {
                    const res = await fetch(`/api/getPageMetadata?url=${encodeURIComponent(pageUrl)}`);
                    if (res.status === 200) {
                        const competitorKeywords = await extractKeywords(pageUrl);
                        if (competitorKeywords.keywords) {
                            return competitorKeywords
                        }
                        else {
                            return { keywords: [], topKeyword: "" }
                        }
                        // return await extractKeywords(pageUrl);
                    }
                    // return null; // Return empty array for invalid URLs
                    return { keywords: [], topKeyword: "" };
                })
            );

            // Combine all keywords from top pages into a single array
            // const allTopKeywords = topPageKeywords.flat();
            const allTopKeywords = topPageKeywords
                .filter(item => item !== null) // remove null entries
                .flatMap(item => item.keywords.map(keyword => keyword.toLowerCase()));

            // Calculate keyword gaps (keywords present in top pages but not in current page)
            const calculatedGaps = allTopKeywords.filter(
                keyword => !currentPageKeywords.keywords.includes(keyword)
            );

            setBtnStatus("Generating Suggestions...");
            const suggestions = await generateContentSuggestions(metadataResponse.data, calculatedGaps);

            setKeywords(currentPageKeywords.keywords);
            setGaps(calculatedGaps);
            setCompetitorUrls(topPageUrls);
            setContentSuggestions(suggestions);

        } catch (error) {
            if (error.response.data.error) {
                setError(error.response.data.error);
            }
            else if (error.message) {
                setError(error.message)

            }
            else {
                setError("An error occurred while extracting keywords. Please try again later.")
            }

        } finally {
            setLoading(false);
            setBtnStatus('Mine Keywords')
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send message');
            }

            const result = await response.json();
            console.log('Success:', result);

            setName('');
            setEmail('');
            setMessage('');
            setSubmissionStatus('success');
        } catch (error) {
            console.error('Submission error:', error);
            setSubmissionStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // to load adsense script 
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

    useEffect(() => {
        if (submissionStatus === 'success') {
            const timer = setTimeout(() => {
                setSubmissionStatus(null);
            }, 3000); // 3 seconds

            return () => clearTimeout(timer); // Clear timeout if component unmounts or status changes
        }
    }, [submissionStatus]);

    return (
        // <div id="#" className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8 ">
        <div id="#" className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8 ">

            <Header />

            {/* hero section */}
            <section className="max-w-4xl mx-auto space-y-6 mt-10 min-h-[20rem]  flex justify-center items-center">
                <div className='space-y-6 w-full'>
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl md:leading-16 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                            {/* SEO Keyword Miner */}
                            Discover High-Impact Keywords
                        </h1>
                        <p className="text-gray-400 text-base sm:text-lg">
                            {/* Enter a URL to extract relevant SEO keywords. */}
                            Instantly extract high-impact SEO keywords from any webpage. Just enter a URL to start mining!
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Enter website Url (e.g., example.com)"
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
                            className="bg-gradient-to-r flex items-center justify-center from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600
                        disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-md"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    {btnStatus}
                                </>
                            ) : (
                                btnStatus
                            )}

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

                    {(keywords || gaps || contentSuggestions) && (
                        <div className="opacity-0 animate-fadeIn delay-300">
                            <div className="bg-black/20 border-purple-500/30 rounded-md">
                                <div className="p-6">
                                    <h2 className="text-white text-2xl font-semibold mb-2">SEO Keywords</h2>
                                    <p className="text-gray-400 mb-4">
                                        Top {keywords?.length} keywords extracted from the URL.
                                    </p>
                                    {/* Google AdSense Ad Unit */}
                                    {adLoaded && (
                                        <div className="my-4">
                                            <ins
                                                className="adsbygoogle"
                                                style={{ display: "block" }}
                                                data-ad-client="ca-pub-8393566924928419" // Replace with your actual client ID
                                                data-ad-slot="7861407634"  // Replace with your actual ad slot ID
                                                data-ad-format="auto"
                                                data-full-width-responsive="true"
                                            ></ins>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {keywords && keywords.length > 0 ? (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                    <ListChecks className="w-5 h-5 text-green-400" />
                                                    Extracted Keywords
                                                </h3>
                                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/20 rounded-lg shadow-md p-4">
                                                    {keywords.map((keyword, index) => (
                                                        <div key={index} className="text-gray-300 py-2 border-b border-purple-500/20 last:border-none flex items-center gap-2">
                                                            <ChevronRight className="w-4 h-4 text-purple-400" />
                                                            <span className="font-medium">{keyword}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400">No keywords found.</div>
                                        )}
                                        {gaps && gaps.length > 0 && (
                                            <div className="space-y-2">
                                                {/* <h3 className="text-lg font-semibold text-red-400">Top {gaps.length>30?30:gaps.length} Keyword Gaps (Top Ranking Pages)</h3> */}
                                                <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                                                    <TrendingUp className="w-5 h-5" />
                                                    Keyword Gaps (Top Ranking Pages)
                                                </h3>
                                                <div className="bg-black/50 rounded-md p-4 space-y-2">
                                                    {gaps.slice(0, 30).map((gap, index) => (  // Limit to 30
                                                        <div key={index} className="text-red-300 py-1 border-b border-purple-500/20 last:border-none flex items-center gap-1.5">
                                                            <ChevronRight className="w-4 h-4 text-red-400" />
                                                            {gap}
                                                        </div>
                                                    ))}
                                                </div>

                                                {competitorUrls && competitorUrls.length > 0 && (
                                                    <div className="bg-black/50 border-purple-500/20 p-4 rounded-md">
                                                        <h3 className="text-base font-semibold text-blue-400 flex items-center gap-2">
                                                            <Users className="w-5 h-5" />
                                                            Competitor URLs
                                                        </h3>
                                                        <p className="text-gray-300 my-3 text-sm">
                                                            Top {competitorUrls.length} competing websites
                                                        </p>

                                                        <ul className="space-y-2">
                                                            {competitorUrls.map((competitorUrl, index) => (
                                                                <li key={index} className="text-blue-300 hover:text-blue-200 transition-colors text-xs">
                                                                    <a href={competitorUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                                        <ChevronRight className="w-4 h-4" />
                                                                        {competitorUrl}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {contentSuggestions ? (
                                        <div className="mt-8 space-y-4">
                                            <div className="bg-black/50 border-purple-500/20 rounded-md">
                                                {/* <div className="bg-black/20 border-purple-500/30 rounded-md"> */}
                                                <div className="p-4">
                                                    <h3 className="text-white text-lg flex items-center gap-2">
                                                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                                                        Content Optimization Suggestion
                                                    </h3>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-gray-300">{contentSuggestions.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works Section */}
            {/* <section id="how-it-works" className="max-w-6xl mx-auto mt-20 bg-gradient-to-br from-gray-800/40 to-black/30 border border-purple-500/20 rounded-xl p-6 text-gray-300 space-y-28"> */}
            <section id="how-it-works" className="max-w-6xl mx-auto mt-20  rounded-xl p-6 text-gray-300 space-y-28">
                <div className="mx-auto space-y-10">
                    <h2 className="text-2xl font-bold text-white text-center">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        <div className="bg-black/30  border-purple-500/10  hover:shadow-xl transition-shadow rounded-md">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Search className="h-6 w-6 text-blue-400" /> Analyze a URL
                                </h3>
                                <p className="text-gray-400 mt-2 text-sm">
                                    Enter the URL of any website to begin the analysis.
                                </p>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-300 text-sm">
                                    Our AI will crawl the website and extract relevant data.
                                </p>
                            </div>
                        </div>

                        <div className="bg-black/30  border-purple-500/10  hover:shadow-xl transition-shadow rounded-md">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Lightbulb className="h-6 w-6 text-yellow-400" />Get AI-Powered Insights
                                </h3>
                                <p className="text-gray-400 mt-2 text-sm">
                                    Receive a detailed report with keywords, gaps, and more.
                                </p>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-300 text-sm">
                                    Understand your SEO strengths and weaknesses.
                                </p>
                            </div>
                        </div>

                        <div className="bg-black/30  border-purple-500/10  hover:shadow-xl transition-shadow rounded-md">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Rocket className="h-6 w-6 text-purple-400" />Improve Your SEO
                                </h3>
                                <p className="text-gray-400 mt-2 text-sm">
                                    Use the insights to optimize your content and strategy.
                                </p>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-300 text-sm">
                                    Boost your search engine rankings and attract more traffic.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/*Expanded Explanation of How it Works */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-white">Deeper Dive into the Process</h3>
                        <p className="text-gray-400">
                            Our SEO Keyword Miner is designed to provide you with a comprehensive understanding of your website's SEO performance and help you identify opportunities for improvement. Here's a more detailed breakdown of how it works:
                        </p>

                        <h4 className="text-lg font-semibold text-purple-300 flex items-center gap-1"><FileText className='h-4 w-4' /> URL Analysis and Data Extraction</h4>
                        <ul className="text-sm sm:text-base list-disc list-inside space-y-2 text-gray-300">
                            <li>When you enter a URL, our system initiates a process to retrieve the website's content, including text, HTML structure, and metadata.</li>
                            <li>We then use Natural Language Processing (NLP) techniques to analyze the text and identify the most relevant keywords. This involves understanding the context, frequency, and importance of words and phrases on the page.</li>
                            <li>Our tool also examines the website's HTML structure to extract information such as title tags, meta descriptions, headings, and other elements that are important for SEO.</li>
                            <li>We analyze the links pointing to the website (backlinks) to assess its authority and credibility.</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-purple-300 flex items-center gap-1"><Lightbulb className='h-4 w-4' /> AI-Powered Insights and Reporting</h4>
                        <ul className="text-sm sm:text-base list-disc list-inside space-y-2 text-gray-300">
                            <li>The extracted data is then processed by our AI algorithms to generate actionable insights. This includes identifying the top keywords that the website is ranking for, as well as keywords that it is not ranking for but its competitors are (keyword gaps).</li>
                            <li>We provide you with a list of competitor websites that are ranking for similar keywords. This allows you to understand who your main competitors are and what they are doing to rank well.</li>
                            <li>Our tool also generates content ideas based on the keyword analysis. These ideas are designed to help
                                you create new content that is optimized for search engines and will attract more traffic to your
                                website.</li>
                            <li>All of this information is presented in a clear and easy-to-understand report, with visualizations
                                and explanations to help you make informed decisions.</li>
                        </ul>
                        <h4 className="text-lg font-semibold text-purple-300 flex items-center gap-1"><Rocket className='h-4 w-4' /> Continuous Improvement and Optimization</h4>
                        <ul className="text-sm sm:text-base list-disc list-inside space-y-2 text-gray-300">
                            <li>SEO is an ongoing process, and our tool is designed to help you continuously improve your website's
                                performance.</li>
                            <li>You can use our tool to track your keyword rankings over time, monitor your competitor's activities,
                                and identify new opportunities for content creation and optimization.</li>
                            <li>Our AI algorithms are constantly being updated to reflect the latest changes in search engine
                                algorithms, so you can be confident that you are getting the most up-to-date and accurate
                                information.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="max-w-6xl mx-auto mt-20  rounded-xl p-6 text-gray-300 space-y-28">
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-white text-center">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-black/30  border-purple-500/10  hover:shadow-xl transition-shadow rounded-md">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Search className="h-6 w-6 text-blue-400" /> Keyword Extraction
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Extract relevant keywords from any URL.
                                </p>
                            </div>
                            <div className="p-4">
                                <ul className="text-sm list-disc list-inside space-y-1 text-gray-300">
                                    <li>Identifies high-impact keywords</li>
                                    <li>Supports multiple languages</li>
                                    <li>Provides keyword variations</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-black/30  border-purple-500/10  hover:shadow-xl transition-shadow rounded-md">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <TrendingUp className="h-6 w-6 text-red-400" /> Keyword Gap Analysis
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Find keywords your competitors are ranking for.
                                </p>
                            </div>
                            <div className="p-4">
                                <ul className="text-sm list-disc list-inside space-y-1 text-gray-300">
                                    <li>Uncover missed opportunities</li>
                                    <li>Compare keyword profiles</li>
                                    <li>Prioritize high-value gaps</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-black/30  border-purple-500/10  hover:shadow-xl transition-shadow rounded-md">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Users className="h-6 w-6 text-green-400" /> Competitor Analysis
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Analyze your competitor's top-ranking pages.
                                </p>
                            </div>
                            <div className="p-4">
                                <ul className="text-sm list-disc list-inside space-y-1 text-gray-300">
                                    <li>Identify key competitors</li>
                                    <li>See their content strategy</li>
                                    <li>Discover their link-building efforts</li>
                                </ul>
                            </div>
                        </div>
                        <div className="bg-black/30  border-purple-500/10  hover:shadow-xl transition-shadow rounded-md">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Lightbulb className="h-6 w-6 text-yellow-400" /> AI Content Ideas
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Get AI-powered suggestions for new content.
                                </p>
                            </div>
                            <div className="p-4">
                                <ul className="text-sm list-disc list-inside space-y-1 text-gray-300">
                                    <li>Generate relevant topics</li>
                                    <li>Create engaging titles</li>
                                    <li>Optimize for target keywords</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="use-cases" className="max-w-6xl mx-auto mt-20  rounded-xl p-6 text-gray-300 space-y-28">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                        <Lightbulb className="w-6 h-6 text-yellow-400" /> Use Cases
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="bg-black/30 rounded-md p-4 border border-purple-500/10">
                                <Users className="w-8 h-8 text-pink-400 mb-2" />
                                <h3 className="font-semibold text-lg text-white">Competitor Analysis</h3>
                                <p className="text-gray-400 text-sm py-2">Analyze competitors' SEO strategy.</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="bg-black/30 rounded-md p-4 border border-purple-500/10">
                                <Search className="w-8 h-8 text-orange-400 mb-2" />
                                <h3 className="font-semibold text-lg text-white">Content Creation</h3>
                                <p className="text-gray-400 text-sm py-2">Research keywords for content writing.</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="bg-black/30 rounded-md p-4 border border-purple-500/10">
                                <TrendingUp className="w-8 h-8 text-cyan-400 mb-2" />
                                <h3 className="font-semibold text-lg text-white">Marketing Trends</h3>
                                <p className="text-gray-400 text-sm py-2">Discover trends for digital marketing.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="faqs" className="max-w-6xl mx-auto mt-20  rounded-xl p-6 text-gray-300 space-y-28">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white text-center">❓ FAQs</h2>
                    <div className="space-y-4">
                        <div className="bg-black/30 rounded-xl p-4 border border-purple-500/10 md:text-center">
                            <h3 className="font-semibold text-lg text-white">
                                🔗 Does it work for every website?
                            </h3>
                            <p className="text-gray-400">
                                Most public pages are supported. Some may restrict bots or have minimal readable content.
                            </p>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4 border border-purple-500/10 md:text-center">
                            <h3 className="font-semibold text-lg text-white">
                                💸 Is this tool free?
                            </h3>
                            <p className="text-gray-400">
                                Absolutely! Enjoy full functionality with zero cost.
                            </p>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4 border border-purple-500/10 md:text-center">
                            <h3 className="font-semibold text-lg text-white">
                                🧠 What keywords do I get?
                            </h3>
                            <p className="text-gray-400">
                                We extract SEO-relevant terms directly from the content you provide.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* content section */}
             {/* <section className="max-w-6xl mx-auto mt-20 bg-gradient-to-br from-gray-800/40 to-black/30 border border-purple-500/20 rounded-xl p-6 text-gray-300 space-y-28">
                <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <Rocket className="w-6 h-6 text-purple-400" /> How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="bg-black/30 rounded-md p-4 border border-purple-500/10">
                            <Search className="w-8 h-8 text-blue-400 mb-2" />
                            <h3 className="font-semibold text-lg text-white">Enter URL</h3>
                            <p className="text-gray-400">Paste a website URL into the input field.</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                    <div className="bg-black/30 rounded-md p-4 border border-purple-500/10">
                        <ListChecks className="w-8 h-8 text-green-400 mb-2" />
                        <h3 className="font-semibold text-lg text-white">Analyze</h3>
                        <p className="text-gray-400">Click "Mine Keywords" to analyze the content.</p>
                    </div>
                    </div>
                    <div className="space-y-2">
                    <div className="bg-black/30 rounded-md p-4 border border-purple-500/10">
                        <TrendingUp className="w-8 h-8 text-purple-400 mb-2" />
                        <h3 className="font-semibold text-lg text-white">Get Keywords</h3>
                        <p className="text-gray-400">View the extracted keywords.</p>
                    </div>
                    </div>
                </div>
                </div>

                <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-400" /> Use Cases
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="bg-black/30 rounded-md p-4 border border-purple-500/10">
                        <Users className="w-8 h-8 text-pink-400 mb-2" />
                        <h3 className="font-semibold text-lg text-white">Competitor Analysis</h3>
                        <p className="text-gray-400">Analyze competitors' SEO strategy.</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                    <div className="bg-black/30 rounded-md p-4 border border-purple-500/10">
                        <Search className="w-8 h-8 text-orange-400 mb-2" />
                        <h3 className="font-semibold text-lg text-white">Content Creation</h3>
                        <p className="text-gray-400">Research keywords for content writing.</p>
                    </div>
                    </div>
                    <div className="space-y-2">
                    <div className="bg-black/30 rounded-md p-4 border border-purple-500/10">
                        <TrendingUp className="w-8 h-8 text-cyan-400 mb-2" />
                        <h3 className="font-semibold text-lg text-white">Marketing Trends</h3>
                        <p className="text-gray-400">Discover trends for digital marketing.</p>
                    </div>
                    </div>
                </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white text-center">❓ FAQs</h2>
                    <div className="space-y-4">
                    <div className="bg-black/30 rounded-xl p-4 border border-purple-500/10 md:text-center">
                        <h3 className="font-semibold text-lg text-white">
                        🔗 Does it work for every website?
                        </h3>
                        <p className="text-gray-400">
                        Most public pages are supported. Some may restrict bots or have minimal readable content.
                        </p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4 border border-purple-500/10 md:text-center">
                        <h3 className="font-semibold text-lg text-white">
                        💸 Is this tool free?
                        </h3>
                        <p className="text-gray-400">
                        Absolutely! Enjoy full functionality with zero cost.
                        </p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4 border border-purple-500/10 md:text-center">
                        <h3 className="font-semibold text-lg text-white">
                        🧠 What keywords do I get?
                        </h3>
                        <p className="text-gray-400">
                        We extract SEO-relevant terms directly from the content you provide.
                        </p>
                    </div>
                    </div>
                </div>
            </section>  */}

            {/* About Us Section */}
            <section id="about" className="max-w-4xl mx-auto mt-16 text-purple-200 text-center rounded-xl p-6 bg-gradient-to-br from-gray-800/40 to-black/30 border border-purple-500/20 shadow-lg">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
                    <Users className="w-6 h-6 text-purple-400" /> About Us
                </h3>
                <p className="mb-2 text-gray-300">
                     At <strong>SEO Keyword Miner</strong>, we believe that great content starts with smart keyword research. Our platform was born out of a desire to cut through the noise and provide a streamlined, effective way to discover the search terms that actually matter.
                </p>
                <p className="mb-2 text-gray-300">
                    In a digital world flooded with data, most keyword tools either overwhelm users with complexity or limit access to critical insights. We set out to change that. SEO Keyword Miner is built for content creators, marketers, and SEO professionals who want fast, accurate, and practical keyword data — without the clutter.
                </p>
                <p className="mb-2 text-gray-300">
                    Whether you're a solo blogger trying to grow your audience, an e-commerce brand seeking better visibility, or a digital agency juggling multiple clients, our tool is designed to work for you. With features like keyword extraction from any URL, keyword gap analysis, AI-powered content ideas, and multilingual support, you’ll gain a clearer understanding of what’s driving search traffic in your niche.
                </p>
                <p className="mb-2 text-gray-300">
                    Our philosophy is grounded in three core values: <strong>simplicity</strong>, <strong>transparency</strong>, and <strong>usefulness</strong>. We don’t believe in upsells, feature bloat, or complicated dashboards. Instead, we focus on giving you the insights you need, as quickly and clearly as possible.
                </p>
                <p className="mb-2 text-gray-300">
                    SEO Keyword Miner is a side project — but one driven by passion, real-world SEO experience, and a deep respect for the creators and marketers who power the internet. We're constantly improving and refining the tool based on user feedback and evolving search trends.
                </p>
                <p className="text-gray-300">
                    Thank you for being a part of this journey. We’re excited to help you make smarter content decisions, uncover new opportunities, and ultimately grow with confidence in the world of search.
                </p>
            </section>

            {/* Contact Us Section */}
            <section id="contact" className="max-w-4xl mx-auto mt-16 text-purple-200 text-center rounded-xl p-6 bg-black/50 border border-purple-500/20 shadow-lg">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-400" /> Contact Us
                </h3>
                <p className="text-gray-300 mb-4 text-sm w-10/12 m-auto">

                    Please fill out the form below to get in touch with us for any questions or inquiries.  We're here to help you
                    maximize your SEO potential..
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="flex-1 bg-black/30 text-white border border-purple-500/30 placeholder:text-gray-500 rounded-md py-3 px-4 shadow-sm"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 bg-black/30 text-white border border-purple-500/30 placeholder:text-gray-500 rounded-md py-3 px-4 shadow-sm"
                        />
                    </div>
                    <textarea
                        placeholder="Your Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="bg-black/30 text-white border border-purple-500/30 placeholder:text-gray-500 rounded-md py-3 px-4 shadow-sm w-full"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mx-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Send className="w-4 h-4 animate-spin" /> Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" /> Send Message
                            </>
                        )}
                    </button>
                </form>
                {submissionStatus === 'success' && (
                    <div className="mt-4 text-green-400 bg-green-500/10 border border-green-500/30 p-3 rounded-md">
                        Thank you! Your message has been sent.
                    </div>
                )}
                {submissionStatus === 'error' && (
                    <div className="mt-4 text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-md">
                        Sorry, there was an error sending your message. Please try again.
                    </div>
                )}
            </section>

            {/* <section id="contact" className="py-16 bg-black/50 backdrop-blur-md border-b border-gray-800 px-4 sm:px-6 lg:px-8">
            <div className="w-full mx-auto space-y-8">
                <h2 className="text-3xl font-bold text-white text-center">Contact Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-gray-400">
                            Get in touch with us for any questions or inquiries.  We're here to help you
                            maximize your SEO potential.
                        </p>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Send className="h-5 w-5 text-purple-400" />
                                <span className="text-gray-300">Email:</span>
                                <a href="mailto:support@example.com" className="text-white hover:text-purple-300 transition-colors">support@example.com</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Send className="h-5 w-5 text-purple-400" />
                                <span className="text-gray-300">Phone:</span>
                                <span className="text-white">+1 (555) 123-4567</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <form className="space-y-6">
                            <input // Changed from <Input> to <input>
                                type="text"
                                placeholder="Your Name"
                                className="bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500 rounded-md px-4 py-2 w-full"  //Added inline
                            />
                            <input // Changed from <Input> to <input>
                                type="email"
                                placeholder="Your Email"
                                className="bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500 rounded-md px-4 py-2 w-full" //Added inline
                            />
                            <textarea
                                placeholder="Your Message"
                                className="bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500 w-full min-h-[120px] rounded-md p-4" //Added inline
                            ></textarea>
                            <button  // Changed from <Button> to <button>
                                type="submit"
                                className="w-full bg-purple-500 text-white hover:bg-purple-600 rounded-md px-4 py-2" //Added inline
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            </section> */}

            <Footer />
        </div>
    );
}
