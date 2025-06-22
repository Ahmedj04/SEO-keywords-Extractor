import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, FileText, Lightbulb, PenTool, ClipboardCheck, Copy, Check } from 'lucide-react';
import { generateArticleContent } from '@/utils/seoUtils';

export default function () {
    const [title, setTitle] = useState('');
    const [keywords, setKeywords] = useState(''); // Comma-separated keywords
    const [generatedContent, setGeneratedContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copyStatus, setCopyStatus] = useState(false); // State for copy feedback
    const wordCountOptions = [100, 300, 800, 1000];
    const [wordCount, setWordCount] = useState(wordCountOptions[1]); // New state for word count, default to 200

    const handleGenerateContent = async () => {
        if (!title || !keywords) {
            setError('Please provide both a title and keywords.');
            return;
        }

        setLoading(true);
        setError('');
        setGeneratedContent('');

        try {
            const articleContent = await generateArticleContent(title, keywords, wordCount);
            setGeneratedContent(articleContent);
        } catch (err) {
            console.error('Error generating content:', err);
            setError('Could not generate content: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyContent = () => {
        // Use document.execCommand('copy') as navigator.clipboard.writeText() may not work in iframes
        const textArea = document.createElement('textarea');
        textArea.value = generatedContent;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                setCopyStatus(true);
            } else {
                setCopyStatus(false);
            }
        } catch (err) {
            setCopyStatus(false);
            console.error('Copy command failed:', err);
        }
        document.body.removeChild(textArea);

        // Clear feedback after a short delay
        setTimeout(() => {
            setCopyStatus(false);
        }, 2000);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-8">

            <Header />

            <div className="max-w-4xl mx-auto py-16 pxs-4 sm:px-6 lg:px-8">
                <motion.div
                    className="bg-gradient-to-br from-gray-800/50 to-black/50 border border-purple-500/30 rounded-2xl shadow-xl py-6 px-3 md:px-6 space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6 flex items-center justify-center gap-3">
                        <Sparkles className="h-8 w-8 text-yellow-300" /> AI Writer
                    </h2>
                    <p className="text-gray-400 text-base text-center">
                        Create SEO-optimized content effortlessly. Share your topic and keywords, and our AI will simplify your content creation process.
                    </p>

                    {/* Input Fields */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="content-title" className="block text-gray-300 text-sm font-semibold mb-2">
                                Content Title/Topic:
                            </label>
                            <input
                                type="text"
                                id="content-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="E.g., The Future of AI in SEO"
                                className="w-full bg-black/30 text-white border-purple-500/20 placeholder:text-gray-500 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="content-keywords" className="block text-gray-300 text-sm font-semibold mb-2">
                                Keywords (comma-separated):
                            </label>
                            <textarea
                                id="content-keywords"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="E.g., AI, SEO, machine learning, content optimization"
                                rows="3"
                                className="w-full bg-black/30 text-white border-purple-500/20 placeholder:text-gray-500 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2">
                                Content Style:
                            </label>
                            <div className="flex justify-center flex-wrap gap-3 py-2">
                                {wordCountOptions.map((count) => (
                                    (<button
                                        key={count}
                                        onClick={() => setWordCount(count)}
                                        className={`
                                                    px-5 py-2 rounded-full border
                                                    text-sm font-medium
                                                    transition-all duration-200 ease-in-out
                                                    ${wordCount === count
                                                ? 'bg-purple-600 border-purple-600 text-white shadow-lg'
                                                : 'bg-black/20 border-purple-500/20 text-gray-300 hover:bg-purple-500/10 hover:border-purple-500/30'
                                            }
                                        `}
                                    >
                                        {count <= 200 ? 'Short & Sweet' :
                                            count <= 500 ? 'Concise & Clear' :
                                                count <= 800 ? 'In-Depth & Detailed' :
                                                    'Comprehensive & Thorough'}
                                    </button>
                                    )
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerateContent}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semiboldss py-3 rounded-md shadow-lg
                        hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5" /> Generating...
                                </>
                            ) : (
                                <>
                                    <FileText className="h-5 w-5" /> Generate Content
                                </>
                            )}
                        </button>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-500/10 text-red-400 border border-red-500/30 p-4 rounded-md mt-4"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Generated Content Display */}
                    <AnimatePresence mode="wait">
                        {generatedContent && (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                // className="bg-black/30 border border-gray-700 rounded-xl p-6 mt-6 space-y-4 shadow-inner"
                                className=" py-6 px-3 md:px-6 mt-6 space-y-4 shadow-inner"
                            >
                                <div className='flex items-center justify-between'>
                                    <h2 className='text-3xl capitalize'>{title}</h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleCopyContent}
                                            title="Copy to clipboard"
                                            className='cursor-pointer'
                                        >
                                            {copyStatus ? <div className='flex items-center gap-1'> <Check className="h-4 w-4" /> <span className='text-[12px]'>Copied</span> </div> : <Copy className="h-4 w-4" />}

                                        </button>
                                    </div>
                                </div>
                                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {generatedContent}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* How It Works Section */}
            <motion.section
                id="ai-writer-how-it-works"
                // className="max-w-6xl mx-auto bg-gradient-to-br from-gray-800/50 to-black/50 border border-purple-500/30 rounded-2xl shadow-xl p-6 space-y-6"
                className="max-w-6xl mx-auto  p-6 space-y-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <h2 className="text-2xl text-white font-bold text-center bg-clip-text bg-gradient-to-r mb-6 flex items-center justify-center gap-3 ">
                    <Lightbulb className="h-8 w-8 text-yellow-300" /> How Our AI Writer Works
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div className="space-y-3 p-4 bg-black/20 rounded-lg border border-gray-700" variants={itemVariants}>
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 text-purple-300 mx-auto mb-3">
                            <PenTool className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-white text-center">1. Input Your Idea</h3>
                        <p className="text-gray-300 text-center text-sm">
                            Start by providing your desired content title or topic and a list of relevant keywords you want to include.
                        </p>
                    </motion.div>

                    <motion.div className="space-y-3 p-4 bg-black/20 rounded-lg border border-gray-700" variants={itemVariants}>
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 text-blue-300 mx-auto mb-3">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-white text-center">2. AI Generates Content</h3>
                        <p className="text-gray-300 text-center text-sm">
                            Our advanced AI model processes your inputs to create a unique, optimized, and coherent piece of content.
                        </p>
                    </motion.div>

                    <motion.div className="space-y-3 p-4 bg-black/20 rounded-lg border border-gray-700" variants={itemVariants}>
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-300 mx-auto mb-3">
                            <ClipboardCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-white text-center">3. Review & Refine</h3>
                        <p className="text-gray-300 text-center text-sm">
                            Receive the generated content instantly. You can then review, edit, and refine it to perfectly match your needs.
                        </p>
                    </motion.div>
                </div>

                <motion.p className="text-gray-300 text-center pt-4" variants={itemVariants}>
                    Our AI ensures your content is not only relevant to your topic and keywords but also engaging and high-quality,
                    saving you time and effort in your content creation process.
                </motion.p>
            </motion.section>

            <Footer />
        </div>
    )
}
