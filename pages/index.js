import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Lightbulb, Search, ListChecks, Users, TrendingUp, Send, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function Home() {
    const [url, setUrl] = useState('');
    const [keywords, setKeywords] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [adLoaded, setAdLoaded] = useState(false); // State to track ad loading


    // Contact Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', null
  
     // Mobile Menu State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);

    // Function to close the mobile menu
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };


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


            // const response = await fetch('http://localhost:3001/getKeywords', { // Adjust the endpoint if needed
            const response = await fetch('/api/getKeywords', { // Adjust the endpoint if needed
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
            if(data && data.error){
                setError('Invalid or inaccessible URL');
            }
            else if (data && data.keywords && Array.isArray(data.keywords)) {
                setKeywords(data.keywords);
            }
            else {
                console.log(data)
                setError('No keywords found, or invalid response from the server.');
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
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

    useEffect(() => {
        if (submissionStatus === 'success') {
            const timer = setTimeout(() => {
            setSubmissionStatus(null);
            }, 3000); // 3 seconds
    
            return () => clearTimeout(timer); // Clear timeout if component unmounts or status changes
        }
    }, [submissionStatus]);
    

   
    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8 ">

         {/* Navigation Bar */}
        <nav className="flex items-center justify-between max-w-6xl mx-auto py-4 text-white">
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
                                    {/* */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-col space-y-6 text-sm sm:text-base">
                                <a href="#about" onClick={closeMobileMenu} className="hover:text-purple-300 transition">About Us</a>
                                <a href="#contact" onClick={closeMobileMenu} className="hover:text-purple-300 transition">Contact Us</a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
        
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
                        {loading ? 'Loading...' : 'Mine Keywords'}
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
                                            data-ad-slot="7861407634"     // Replace with your actual ad slot ID
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
        </section>

        <section className="max-w-6xl mx-auto mt-20 bg-gradient-to-br from-gray-800/40 to-black/30 border border-purple-500/20 rounded-xl p-6 text-gray-300 space-y-28">
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

            {/* <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-2 text-center">🔍 Try These URLs</h2>
                <ul className="list-disc ml-5 space-y-1 text-purple-300 md:mx-auto md:w-3/12">
                    <li><code>https://www.nytimes.com</code></li>
                    <li><code>https://www.tesla.com</code></li>
                    <li><code>https://www.wikipedia.org</code></li>
                </ul>
            </div>

            <div>
                <h2 className="text-xl font-bold text-white mb-2 text-center">❓ FAQs</h2>
                <ul className="space-y-10 md:mx-auto md:w-6/12 text-center">
                    <li>
                    <strong>🔗 Does it work for every website?</strong><br />
                    Most public pages are supported. Some may restrict bots or have minimal readable content.
                    </li>
                    <li>
                    <strong>💸 Is this tool free?</strong><br />
                    Absolutely! Enjoy full functionality with zero cost.
                    </li>
                    <li>
                    <strong>🧠 What keywords do I get?</strong><br />
                    We extract SEO-relevant terms directly from the content you provide.
                    </li>
                </ul>
            </div> */}

            <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">🔍 Try These URLs</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['https://www.nytimes.com', 'https://www.tesla.com', 'https://www.wikipedia.org'].map((url, index) => (
                <span
                  key={index}
                  className="bg-purple-700/20 text-purple-300 hover:text-purple-200 border border-purple-500/30 rounded-full px-6 py-3 transition-colors shadow-md hover:shadow-lg"
                >
                  {url}
                </span>
              ))}
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
        </section>

        {/* About Us Section */}
        <section id="about" className="max-w-4xl mx-auto mt-16 text-purple-200 text-center rounded-xl p-6 bg-gradient-to-br from-gray-800/40 to-black/30 border border-purple-500/20 shadow-lg">
        <h3 className="text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
            <Users className="w-6 h-6 text-purple-400" /> About Us
        </h3>
        <p className="mb-2 text-gray-300">
            At SEO Keyword Miner, we’re passionate about helping businesses discover the right keywords to drive their content strategy. Our mission is to empower content creators, marketers, and SEO professionals with quick access to relevant, trending, and long-tail keywords that make a real difference.
        </p>
        <p className="mb-2 text-gray-300">
            Whether you're a blogger looking to boost your site traffic or a digital agency managing multiple campaigns, our intuitive and lightning-fast tool offers the insights you need without the clutter or confusion.
        </p>
        <p className="text-gray-300">
            We believe in simplicity, transparency, and giving our users an experience that is both powerful and delightful. Join us on this journey and transform the way you research keywords!
        </p>
        </section>

        {/* Contact Us Section */}
        {/* <section id="contact" className="max-w-4xl mx-auto mt-16 text-purple-200 text-center rounded-xl p-6 bg-gradient-to-br from-gray-800/40 to-black/30 border border-purple-500/20 shadow-lg">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" /> Contact Us
            </h3>
            <p className="text-gray-300 mb-2">If you have any questions, feedback, or just want to say hi, email us at:</p>
            <a href="mailto:support@seokeywordminer.com" className="text-blue-400 hover:underline">support@seokeywordminer.com</a>
        </section> */}

        {/* Contact Us Section */}
        <section id="contact" className="max-w-4xl mx-auto mt-16 text-purple-200 text-center rounded-xl p-6 bg-black/50 border border-purple-500/20 shadow-lg">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" /> Contact Us
            </h3>
            <p className="text-gray-300 mb-4">
            Please fill out the form below to get in touch with us.
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

        <footer className="text-center text-gray-500 text-sm mt-8">
            &copy; {new Date().getFullYear()} SEO Keyword Miner. All rights reserved.
        </footer>
    </div>
    );
}
