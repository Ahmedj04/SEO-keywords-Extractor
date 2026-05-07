import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ClipboardCheck, Copy, FileText, Lightbulb, Loader2, PenTool, Sparkles } from 'lucide-react';
import { generateArticleContent } from '@/utils/seoUtils';

const wordCountOptions = [100, 300, 800, 1000];

const styleLabels = {
    100: 'Short',
    300: 'Concise',
    800: 'Detailed',
    1000: 'Comprehensive',
};

export default function AIWriter() {
    const [title, setTitle] = useState('');
    const [keywords, setKeywords] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copyStatus, setCopyStatus] = useState(false);
    const [wordCount, setWordCount] = useState(wordCountOptions[1]);

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
            setError('Oops! The service is currently down.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyContent = () => {
        const textArea = document.createElement('textarea');
        textArea.value = generatedContent;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            setCopyStatus(document.execCommand('copy'));
        } catch (err) {
            setCopyStatus(false);
        }
        document.body.removeChild(textArea);
        setTimeout(() => setCopyStatus(false), 2000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { delayChildren: 0.15, staggerChildren: 0.12 },
        },
    };

    const itemVariants = {
        hidden: { y: 18, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="relative min-h-screen overflow-x-clip" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
            <Header />

            <main className="px-4 sm:px-8">
                <section className="relative mx-auto grid max-w-7xl gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:py-24">
                    {/* Decorative elements */}
                    <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
                    <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #2ea870 0%, transparent 70%)' }} />

                    {/* Left: Info panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        className="relative space-y-8 lg:sticky lg:top-28"
                    >
                        <div
                            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold"
                            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--accent)' }}
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            AI content assistant
                        </div>

                        <div>
                            <h1
                                className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
                                style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--foreground)' }}
                            >
                                Turn keyword research into a draft{' '}
                                <span className="italic" style={{ color: 'var(--accent)' }}>faster.</span>
                            </h1>
                            <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                Add a topic, paste your target keywords, choose a length, and generate SEO-friendly content for your next article or landing page.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                            {[
                                ['Brief-ready', 'Start from a focused title and target terms.'],
                                ['Length control', 'Pick the depth that matches your content plan.'],
                                ['Easy copy', 'Move the generated content into your editor.'],
                            ].map(([featureTitle, description]) => (
                                <div
                                    key={featureTitle}
                                    className="rounded-2xl border p-4"
                                    style={{
                                        borderColor: 'var(--border)',
                                        background: 'var(--surface)',
                                        boxShadow: 'var(--shadow-sm)',
                                    }}
                                >
                                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{featureTitle}</h3>
                                    <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Writer workspace */}
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                        className="relative rounded-2xl border p-5 sm:p-7"
                        style={{
                            borderColor: 'var(--border)',
                            background: 'var(--surface)',
                            boxShadow: 'var(--shadow-xl)',
                        }}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                                    Writer workspace
                                </p>
                                <h2 className="mt-1 text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                                    Generate content
                                </h2>
                            </div>
                            <div
                                className="grid h-11 w-11 place-items-center rounded-xl"
                                style={{ background: 'var(--foreground)', color: 'var(--background)' }}
                            >
                                <FileText className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="content-title"
                                    className="mb-2 block text-sm font-medium"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Content title or topic
                                </label>
                                <input
                                    type="text"
                                    id="content-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="The future of AI in SEO"
                                    className="h-12 w-full rounded-xl border px-4 text-sm outline-none transition-all"
                                    style={{
                                        borderColor: 'var(--border)',
                                        background: 'var(--surface-2)',
                                        color: 'var(--foreground)',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--accent)';
                                        e.target.style.background = 'var(--surface)';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(26,122,82,0.12)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border)';
                                        e.target.style.background = 'var(--surface-2)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="content-keywords"
                                    className="mb-2 block text-sm font-medium"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Keywords
                                </label>
                                <textarea
                                    id="content-keywords"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    placeholder="AI, SEO, machine learning, content optimization"
                                    rows="4"
                                    className="w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none transition-all"
                                    style={{
                                        borderColor: 'var(--border)',
                                        background: 'var(--surface-2)',
                                        color: 'var(--foreground)',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--accent)';
                                        e.target.style.background = 'var(--surface)';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(26,122,82,0.12)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border)';
                                        e.target.style.background = 'var(--surface-2)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    Content length
                                </label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {wordCountOptions.map((count) => (
                                        <button
                                            key={count}
                                            onClick={() => setWordCount(count)}
                                            className="rounded-xl border py-3 px-3 text-sm font-medium transition-all duration-200"
                                            style={
                                                wordCount === count
                                                    ? {
                                                        borderColor: 'var(--accent)',
                                                        background: 'var(--foreground)',
                                                        color: 'var(--background)',
                                                        boxShadow: 'var(--shadow-md)',
                                                    }
                                                    : {
                                                        borderColor: 'var(--border)',
                                                        background: 'var(--surface-2)',
                                                        color: 'var(--text-secondary)',
                                                    }
                                            }
                                        >
                                            <span className="block font-semibold">{styleLabels[count]}</span>
                                            <span className="block text-xs opacity-60">{count}w</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerateContent}
                                disabled={loading}
                                className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
                                style={{ background: 'var(--foreground)', color: 'var(--background)' }}
                                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--accent)'; }}
                                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--foreground)'; }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        Generate Content
                                    </>
                                )}
                            </button>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="mt-4 rounded-xl border p-4 text-sm font-medium"
                                    style={{ borderColor: '#fca5a5', background: '#fef2f2', color: '#dc2626' }}
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {generatedContent && (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.25 }}
                                    className="mt-6 rounded-2xl border p-5"
                                    style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
                                >
                                    <div
                                        className="mb-4 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between"
                                        style={{ borderColor: 'var(--border)' }}
                                    >
                                        <h2
                                            className="min-w-0 text-xl font-bold capitalize"
                                            style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--foreground)' }}
                                        >
                                            {title}
                                        </h2>
                                        <button
                                            onClick={handleCopyContent}
                                            title="Copy to clipboard"
                                            className="inline-flex h-9 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium transition-all"
                                            style={{
                                                borderColor: 'var(--border)',
                                                background: 'var(--surface)',
                                                color: 'var(--text-secondary)',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                                        >
                                            {copyStatus ? (
                                                <>
                                                    <Check className="h-3.5 w-3.5" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3.5 w-3.5" />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div
                                        className="whitespace-pre-wrap text-sm leading-8"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        {generatedContent}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </section>

                {/* How it works */}
                <motion.section
                    id="ai-writer-how-it-works"
                    className="mx-auto max-w-7xl py-20"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                            Workflow
                        </p>
                        <h2
                            className="mt-2 text-4xl font-bold"
                            style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--foreground)' }}
                        >
                            How the AI Writer works
                        </h2>
                        <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            A simple three-step path from content idea to usable first draft.
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {[
                            [PenTool, '01', '1. Input your idea', 'Provide the content title or topic and the keywords you want to include.'],
                            [Sparkles, '02', '2. Generate a draft', 'The AI processes your inputs and writes a coherent piece around them.'],
                            [ClipboardCheck, '03', '3. Review and refine', 'Copy the output, edit it, and shape it for your audience.'],
                        ].map(([Icon, step, stepTitle, description]) => (
                            <motion.div
                                key={stepTitle}
                                className="rounded-2xl border p-6"
                                style={{
                                    borderColor: 'var(--border)',
                                    background: 'var(--surface)',
                                    boxShadow: 'var(--shadow-sm)',
                                }}
                                variants={itemVariants}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div
                                        className="grid h-10 w-10 place-items-center rounded-xl"
                                        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span
                                        className="text-3xl font-bold"
                                        style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--border-strong)' }}
                                    >
                                        {step}
                                    </span>
                                </div>
                                <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{stepTitle}</h3>
                                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="mx-auto mt-6 max-w-3xl rounded-2xl border p-5 text-center text-sm"
                        style={{
                            borderColor: 'var(--border)',
                            background: 'var(--surface)',
                            color: 'var(--text-muted)',
                            boxShadow: 'var(--shadow-sm)',
                        }}
                        variants={itemVariants}
                    >
                        <Lightbulb className="mx-auto mb-2 h-5 w-5" style={{ color: 'var(--accent)' }} />
                        Use the keyword miner first, then bring the strongest terms here to turn research into a draft.
                    </motion.div>
                </motion.section>
            </main>

            <Footer />
        </div>
    );
}
