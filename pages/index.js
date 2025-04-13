import React, { useState,useEffect } from 'react';
import { Rocket, Lightbulb, Search, ListChecks, Users, TrendingUp } from 'lucide-react';


export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8 ">
      
        <section className="max-w-4xl mx-auto space-y-6 mt-10">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                    SEO Keyword Miner
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
        </section>

        <section className="max-w-6xl mx-auto mt-20 bg-gradient-to-br from-gray-800/40 to-black/30 border border-purple-500/20 rounded-xl p-6 text-gray-300 space-y-8">
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
                  <p className="text-gray-400">Click "Find Keywords" to analyze the content.</p>
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

          <div className="space-y-4 mt-14">
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

          <div className="space-y-4 mt-14">
            <h2 className="text-xl font-bold text-white mb-2 text-center">🔍 Try These URLs</h2>
            <ul className="list-disc ml-5 space-y-1 text-purple-300 md:mx-auto md:w-3/12">
              <li><code>https://www.nytimes.com</code></li>
              <li><code>https://www.tesla.com</code></li>
              <li><code>https://www.wikipedia.org</code></li>
            </ul>
          </div>

          <div className='mt-14'>
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
          </div>
        </section>

        <footer className="text-center text-gray-500 text-sm mt-8">
          &copy; {new Date().getFullYear()} SEO Keyword Miner. All rights reserved.
        </footer>
    </div>
  );
}
