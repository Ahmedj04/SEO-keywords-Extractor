import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    BarChart3,
    CheckCircle2,
    ChevronRight,
    Download,
    FileJson,
    Lightbulb,
    ListChecks,
    Loader2,
    Search,
    Send,
    ShieldCheck,
    Sparkles,
    Target,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import { extractKeywords } from '@/utils/keywordUtils';
import { getCompetitorsUrls } from '@/utils/seoUtils';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const featureCards = [
    {
        icon: Search,
        title: 'Keyword Extraction',
        description: 'Pull practical keyword signals from any public page in seconds.',
        points: ['High-impact terms', 'Clean keyword lists', 'Simple exports'],
    },
    {
        icon: TrendingUp,
        title: 'Gap Analysis',
        description: 'Compare your page against ranking competitors and spot missing opportunities.',
        points: ['Find missed phrases', 'Compare profiles', 'Prioritize content ideas'],
    },
    {
        icon: Users,
        title: 'Competitor Discovery',
        description: 'Surface pages that matter for your topic and use them as research inputs.',
        points: ['Top page lookup', 'Fast crawl checks', 'Actionable URLs'],
    },
    {
        icon: Lightbulb,
        title: 'Content Direction',
        description: 'Turn extracted keywords into smarter briefs, outlines, and article ideas.',
        points: ['Topic inspiration', 'Brief planning', 'SEO-friendly writing'],
    },
];

const useCases = [
    ['Competitor Analysis', 'Analyze what competing pages are emphasizing before you publish.'],
    ['Content Creation', 'Build better briefs with real terms from pages already in the market.'],
    ['Marketing Trends', 'See repeated language patterns and emerging topic angles faster.'],
];

const faqs = [
    ['Does it work for every website?', 'Most public pages are supported. Some sites may block automated requests or expose very little readable content.'],
    ['Is this tool free?', 'Yes. The core keyword extraction workflow is free to use.'],
    ['What keywords do I get?', 'You get SEO-relevant terms extracted directly from the page content and competitor pages.'],
];

export default function Home() {
    const [url, setUrl] = useState('');
    const [keywords, setKeywords] = useState(null);
    const [gaps, setGaps] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [adLoaded, setAdLoaded] = useState(false);
    const [contentSuggestions, setContentSuggestions] = useState(null);
    const [competitorUrls, setCompetitorUrls] = useState(null);
    const [btnStatus, setBtnStatus] = useState('Mine Keywords');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const reportSectionRef = useRef(null);

    const loadAdSenseScript = () => {
        if (typeof window === 'undefined' || document.querySelector('#adsense-script')) return;
        const script = document.createElement('script');
        script.id = 'adsense-script';
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8393566924928419';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        script.onload = () => setAdLoaded(true);
        script.onerror = () => console.error('Failed to load AdSense script.');
    };

    const handleGetKeywords = async () => {
        if (!url) {
            setError('Please enter a URL.');
            setTimeout(() => setError(null), 2000);
            return;
        }
        setLoading(true);
        setError(null);
        setKeywords(null);
        setGaps(null);
        setCompetitorUrls(null);
        setContentSuggestions(null);
        setBtnStatus('Analyzing...');

        try {
            let formattedUrl = url.trim();
            if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
                formattedUrl = 'https://' + formattedUrl;
            }
            const metadataResponse = await axios.get(`/api/getPageMetadata?url=${encodeURIComponent(formattedUrl)}`);
            if (metadataResponse.status !== 200) return;

            setBtnStatus('Extracting Keywords...');
            const currentPageKeywords = await extractKeywords(formattedUrl);

            setBtnStatus('Analyzing Competitors...');
            const topPageUrls = await getCompetitorsUrls(formattedUrl);

            setBtnStatus('Extracting Keywords...');
            const topPageKeywords = await Promise.all(
                topPageUrls.map(async (pageUrl) => {
                    const res = await fetch(`/api/getPageMetadata?url=${encodeURIComponent(pageUrl)}`);
                    if (res.status === 200) {
                        const competitorKeywords = await extractKeywords(pageUrl);
                        return competitorKeywords.keywords ? competitorKeywords : { keywords: [], topKeyword: '' };
                    }
                    return { keywords: [], topKeyword: '' };
                })
            );

            const allTopKeywords = topPageKeywords
                .filter(Boolean)
                .flatMap((item) => item.keywords.map((keyword) => keyword.toLowerCase()));
            const calculatedGaps = allTopKeywords.filter(
                (keyword) => !currentPageKeywords.keywords.includes(keyword)
            );

            setKeywords(currentPageKeywords.keywords);
            setGaps(calculatedGaps);
            setCompetitorUrls(topPageUrls);
        } catch (error) {
            let errorMessage;
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            } else {
                errorMessage = 'An error occurred while extracting keywords. Please try again later.';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
            setBtnStatus('Mine Keywords');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus(null);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send message');
            }
            await response.json();
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

    const downloadFile = (filename, content, mimeType) => {
        const blob = new Blob([content], { type: mimeType || 'text/plain;charset=utf-8;' });
        const urlObj = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = urlObj;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(urlObj);
    };

    const escapeCsv = (value) => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (/[",\n,]/.test(str)) return '"' + str.replace(/"/g, '""') + '"';
        return str;
    };

    const buildCsvReport = () => {
        const timestamp = new Date().toISOString();
        const suggestionText = typeof contentSuggestions === 'object' && contentSuggestions?.text
            ? contentSuggestions.text
            : (contentSuggestions || '');
        const rows = [
            ['Report For URL', url || ''],
            ['Generated At', timestamp],
            ['Keywords Count', keywords?.length || 0],
            ['Keywords', keywords?.length ? keywords.join(' | ') : ''],
            ['Keyword Gaps Count', gaps?.length || 0],
            ['Top 30 Keyword Gaps', gaps?.length ? gaps.slice(0, 30).join(' | ') : ''],
            ['Competitor URLs', competitorUrls?.length ? competitorUrls.join(' | ') : ''],
            ['Content Suggestion', suggestionText],
        ];
        const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
        return 'Section,Data\n' + csv + '\n';
    };

    const exportReportAsCSV = () => {
        const csv = buildCsvReport();
        const filename = `seo-report-${(url || 'report').replace(/[^a-z0-9\-\.]/gi, '_')}.csv`;
        downloadFile(filename, csv, 'text/csv;charset=utf-8;');
    };

    const exportReportAsJSON = () => {
        const timestamp = new Date().toISOString();
        const report = {
            url,
            generatedAt: timestamp,
            keywords: keywords || [],
            keywordGaps: gaps || [],
            competitorUrls: competitorUrls || [],
            contentSuggestions: contentSuggestions || null,
        };
        const filename = `seo-report-${(url || 'report').replace(/[^a-z0-9\-\.]/gi, '_')}.json`;
        downloadFile(filename, JSON.stringify(report, null, 2), 'application/json;charset=utf-8;');
    };

    useEffect(() => {
        loadAdSenseScript();
        return () => {
            const script = document.querySelector('#adsense-script');
            if (script) script.remove();
            setAdLoaded(false);
        };
    }, []);

    useEffect(() => {
        if (submissionStatus === 'success') {
            const timer = setTimeout(() => setSubmissionStatus(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [submissionStatus]);

    useEffect(() => {
        if (!loading && (keywords || gaps) && reportSectionRef.current) {
            reportSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [keywords, gaps, loading]);

    return (
        <div className="relative min-h-screen overflow-x-clip" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
            <Header />

            <main className="px-4 sm:px-8">
                {/* Hero */}
                <section className="relative mx-auto grid max-w-7xl gap-10 pb-16 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-24">
                    {/* Decorative grid */}
                    <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
                    {/* Decorative blob */}
                    <div className="pointer-events-none absolute -right-40 -top-20 h-[500px] w-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #2ea870 0%, transparent 70%)' }} />
                    <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #1a7a52 0%, transparent 70%)' }} />

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        className="relative space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--accent)' }}>
                            <Sparkles className="h-3.5 w-3.5" />
                            Free SEO research workspace
                        </div>

                        <div className="space-y-5">
                            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-[var(--foreground)] sm:text-6xl lg:text-7xl" style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}>
                                Discover keywords your next page should{' '}
                                <span className="italic" style={{ color: 'var(--accent)' }}>own.</span>
                            </h1>
                            <p className="max-w-xl text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                Enter a URL to extract page keywords, compare competitor language, and export a tidy report for content planning.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {[
                                ['Fast crawl', Zap],
                                ['Keyword gaps', Target],
                                ['Export ready', Download],
                            ].map(([label, Icon]) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium"
                                    style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)' }}
                                >
                                    <Icon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Tool card */}
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
                        {/* Card header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                                    Analyze URL
                                </p>
                                <h2 className="mt-1 text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                                    Keyword miner
                                </h2>
                            </div>
                            <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
                                <Search className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="example.com/blog/article"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="h-14 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-all duration-200"
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
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleGetKeywords(); }}
                                />
                            </div>
                            <button
                                onClick={handleGetKeywords}
                                disabled={loading}
                                className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
                                style={{ background: 'var(--foreground)', color: 'var(--background)' }}
                                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--accent)'; }}
                                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--foreground)'; }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {btnStatus}
                                    </>
                                ) : (
                                    <>
                                        <Zap className="h-4 w-4" />
                                        {btnStatus}
                                    </>
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 rounded-xl border p-4 text-sm font-medium" style={{ borderColor: '#fca5a5', background: '#fef2f2', color: '#dc2626' }}>
                                {error}
                            </div>
                        )}

                        {adLoaded && (
                            <div className="my-4">
                                <ins
                                    className="adsbygoogle"
                                    style={{ display: 'block' }}
                                    data-ad-client="ca-pub-8393566924928419"
                                    data-ad-slot="7861407634"
                                    data-ad-format="auto"
                                    data-full-width-responsive="true"
                                />
                            </div>
                        )}

                        <div className="mt-6 grid grid-cols-3 gap-3 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
                            {[
                                [keywords?.length || 0, 'Keywords'],
                                [gaps?.length || 0, 'Gaps'],
                                [competitorUrls?.length || 0, 'Competitors'],
                            ].map(([value, label]) => (
                                <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'var(--surface-2)' }}>
                                    <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
                                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Results */}
                {(keywords || gaps || contentSuggestions) && (
                    <section ref={reportSectionRef} className="mx-auto max-w-7xl scroll-mt-24 pb-16">
                        <div className="animate-fadeIn rounded-2xl border p-5 sm:p-7" style={{ borderColor: 'var(--border)', background: 'var(--surface)', boxShadow: 'var(--shadow-lg)' }}>
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Generated report</p>
                                    <h2 className="mt-1 text-2xl font-bold" style={{ color: 'var(--foreground)' }}>SEO keyword results</h2>
                                    <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                                        {keywords?.length || 0} keywords extracted from the URL.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={exportReportAsCSV}
                                        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
                                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--surface-2)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                                    >
                                        <Download className="h-4 w-4" />
                                        Export CSV
                                    </button>
                                    <button
                                        onClick={exportReportAsJSON}
                                        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
                                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--surface-2)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                                    >
                                        <FileJson className="h-4 w-4" />
                                        Export JSON
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <ResultList
                                    title="Extracted Keywords"
                                    icon={ListChecks}
                                    empty="No keywords found."
                                    items={keywords}
                                    tone="emerald"
                                />
                                <ResultList
                                    title="Keyword Gaps"
                                    icon={Target}
                                    empty="No keyword gaps found."
                                    items={gaps}
                                    tone="sky"
                                />
                            </div>

                            {competitorUrls?.length > 0 && (
                                <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                        <Users className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                                        Competitor pages analyzed
                                    </h3>
                                    <div className="grid gap-2">
                                        {competitorUrls.map((pageUrl, index) => (
                                            <a
                                                key={pageUrl}
                                                href={pageUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-between gap-3 rounded-lg border px-3.5 py-3 text-sm font-medium transition-all"
                                                style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                                            >
                                                <span className="min-w-0 truncate">{index + 1}. {pageUrl}</span>
                                                <ArrowUpRight className="h-4 w-4 shrink-0" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* How it works */}
                <section id="how-it-works" className="mx-auto max-w-7xl py-20">
                    <SectionHeading
                        eyebrow="Workflow"
                        title="From page URL to useful SEO direction"
                        description="A focused research loop: crawl, compare, export, and plan the next content move."
                    />
                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {[
                            ['01', 'Paste a page', 'Add any public URL and the app normalizes the address for analysis.'],
                            ['02', 'Compare the market', 'Competitor pages are checked for related keyword language and gaps.'],
                            ['03', 'Export the report', 'Download CSV or JSON for briefs, docs, or your internal workflow.'],
                        ].map(([step, title, description], i) => (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="rounded-2xl border p-6"
                                style={{ borderColor: 'var(--border)', background: 'var(--surface)', boxShadow: 'var(--shadow-sm)' }}
                            >
                                <div className="mb-5 text-4xl font-bold" style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--border-strong)' }}>
                                    {step}
                                </div>
                                <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="mx-auto max-w-7xl py-20">
                    <SectionHeading
                        eyebrow="Features"
                        title="Research tools without dashboard clutter"
                        description="A cleaner surface for content creators, SEO specialists, and small teams that need answers quickly."
                    />
                    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {featureCards.map(({ icon: Icon, title, description, points }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                className="group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
                                style={{
                                    borderColor: 'var(--border)',
                                    background: 'var(--surface)',
                                    boxShadow: 'var(--shadow-sm)',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                            >
                                <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl" style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
                                <div className="mt-4 space-y-1.5">
                                    {points.map((point) => (
                                        <p key={point} className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: 'var(--accent)' }} />
                                            {point}
                                        </p>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Use cases — dark band */}
                <section id="use-cases" className="mx-auto max-w-7xl py-20">
                    <div
                        className="grid gap-8 rounded-2xl p-8 md:grid-cols-[0.9fr_1.1fr] md:p-12"
                        style={{ background: 'var(--foreground)', color: 'var(--background)' }}
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-mid)' }}>Use cases</p>
                            <h2 className="mt-3 text-3xl font-bold leading-tight" style={{ fontFamily: 'Instrument Serif, serif' }}>
                                Built for practical content decisions.
                            </h2>
                        </div>
                        <div className="grid gap-3">
                            {useCases.map(([title, description]) => (
                                <div
                                    key={title}
                                    className="rounded-xl border p-4"
                                    style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}
                                >
                                    <h3 className="font-semibold">{title}</h3>
                                    <p className="mt-1 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faqs" className="mx-auto max-w-5xl py-20">
                    <SectionHeading eyebrow="FAQ" title="Straight answers" />
                    <div className="mt-10 grid gap-3">
                        {faqs.map(([question, answer], i) => (
                            <motion.div
                                key={question}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                className="rounded-2xl border p-6"
                                style={{ borderColor: 'var(--border)', background: 'var(--surface)', boxShadow: 'var(--shadow-sm)' }}
                            >
                                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{question}</h3>
                                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* About */}
                <section id="about" className="mx-auto max-w-5xl py-20">
                    <div className="rounded-2xl border p-8 md:p-10" style={{ borderColor: 'var(--border)', background: 'var(--surface)', boxShadow: 'var(--shadow-sm)' }}>
                        <div className="mb-6 flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>About</p>
                                <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Simple keyword research for creators and marketers</h2>
                            </div>
                        </div>
                        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            <p>
                                SEO Keyword Miner is built for people who want useful keyword data without a complicated dashboard. It helps you inspect pages, compare competitor language, and move from research to content planning quickly.
                            </p>
                            <p>
                                The product focuses on simplicity, transparency, and usefulness: fewer distractions, clearer outputs, and reports that can be used in briefs, documents, and SEO workflows.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className="mx-auto max-w-5xl py-20">
                    <div className="grid gap-8 rounded-2xl border p-8 md:grid-cols-[0.85fr_1.15fr] md:p-10" style={{ borderColor: 'var(--border)', background: 'var(--surface)', boxShadow: 'var(--shadow-lg)' }}>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Contact</p>
                            <h2 className="mt-2 text-3xl font-bold leading-tight" style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--foreground)' }}>
                                Need help or have feedback?
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                Send a quick note about the tool, a bug, or a feature you would like to see next.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="h-12 rounded-xl border px-4 text-sm outline-none transition-all"
                                    style={{ borderColor: 'var(--border)', background: 'var(--surface-2)', color: 'var(--foreground)' }}
                                    onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,122,82,0.12)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                                />
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 rounded-xl border px-4 text-sm outline-none transition-all"
                                    style={{ borderColor: 'var(--border)', background: 'var(--surface-2)', color: 'var(--foreground)' }}
                                    onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,122,82,0.12)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <textarea
                                placeholder="Your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={5}
                                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all resize-none"
                                style={{ borderColor: 'var(--border)', background: 'var(--surface-2)', color: 'var(--foreground)' }}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,122,82,0.12)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60"
                                style={{ background: 'var(--foreground)', color: 'var(--background)' }}
                                onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = 'var(--accent)'; }}
                                onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.background = 'var(--foreground)'; }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Send Message
                                    </>
                                )}
                            </button>
                            {submissionStatus === 'success' && (
                                <div className="rounded-xl border p-3 text-sm font-medium" style={{ borderColor: '#6ee7b7', background: '#ecfdf5', color: '#065f46' }}>
                                    Thank you. Your message has been sent.
                                </div>
                            )}
                            {submissionStatus === 'error' && (
                                <div className="rounded-xl border p-3 text-sm font-medium" style={{ borderColor: '#fca5a5', background: '#fef2f2', color: '#dc2626' }}>
                                    Sorry, there was an error sending your message. Please try again.
                                </div>
                            )}
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function SectionHeading({ eyebrow, title, description }) {
    return (
        <div className="mx-auto max-w-2xl text-center">
            {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                    {eyebrow}
                </p>
            )}
            <h2 className="mt-2 text-4xl font-bold tracking-tight" style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--foreground)' }}>
                {title}
            </h2>
            {description && (
                <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {description}
                </p>
            )}
        </div>
    );
}

function ResultList({ title, icon: Icon, empty, items, tone }) {
    const isEmerald = tone === 'emerald';
    return (
        <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
            <h3 className="mb-4 flex items-center gap-2.5 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                <span
                    className="grid h-8 w-8 place-items-center rounded-lg"
                    style={{
                        background: isEmerald ? 'var(--accent-light)' : '#e0f2fe',
                        color: isEmerald ? 'var(--accent)' : '#0369a1',
                    }}
                >
                    <Icon className="h-4 w-4" />
                </span>
                {title}
            </h3>
            {items?.length > 0 ? (
                <div className="max-h-96 overflow-auto rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                    {items.map((keyword, index) => (
                        <div
                            key={`${keyword}-${index}`}
                            className="flex items-center gap-2 border-b px-4 py-2.5 text-sm last:border-b-0"
                            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                        >
                            <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--border-strong)' }} />
                            <span className="font-medium">{keyword}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                    {empty}
                </div>
            )}
        </div>
    );
}
