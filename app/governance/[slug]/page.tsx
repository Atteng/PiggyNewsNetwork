import { FeaturedSidebar } from '@/app/components/news/FeaturedSidebar';
import { mockArticles } from '@/lib/mockArticles';
import { Article } from '@/lib/types';
import { Clock, ExternalLink, Calendar, CheckCircle2, XCircle, AlignLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchProposal } from '@/lib/snapshot';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export default async function ProposalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch real proposal
    const proposal = await fetchProposal(slug);

    if (!proposal) {
        notFound();
    }

    // Map to Article type for display compatibility
    const article: Article = {
        id: proposal.id,
        title: proposal.title,
        category: 'Proposal',
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=2965',
        timeAgo: new Date(proposal.start * 1000).toLocaleDateString(),
        // Use votes as "views" proxy or just show votes
        views: proposal.votes.toString(),
        featured: false,
        excerpt: proposal.body, // Use full body or excerpt
        content: proposal.body,
        author: proposal.author
    };

    // Sidebar content (exclude current)
    // Ideally fetch these too, but for now using mocks is okay or fetch valid ones
    // We'll keep using mockArticles for the sidebar to ensure it populates things for now,
    // or we could fetch recent proposals.
    const sidebarArticles = mockArticles
        .filter(a => a.category === 'Proposal')
        .slice(0, 3);

    // Calculate voting percentages
    const votesFor = proposal.scores[0] || 0;
    const votesAgainst = proposal.scores[1] || 0;
    const totalScore = proposal.scores_total || (votesFor + votesAgainst) || 1; // avoid div by 0

    const votes = {
        for: Math.round((votesFor / totalScore) * 100),
        against: Math.round((votesAgainst / totalScore) * 100),
        abstain: 0, // Snapshot strategies vary, assuming basic 2-choice for now or use 3rd score
        quorum: 0, // Snapshot might provide this or we calculate
        status: proposal.state.charAt(0).toUpperCase() + proposal.state.slice(1)
    };

    // If there is a 3rd choice (Abstain)
    if (proposal.scores[2]) {
        votes.abstain = Math.round((proposal.scores[2] / totalScore) * 100);
    }

    const startDate = new Date(proposal.start * 1000).toLocaleString();
    const endDate = new Date(proposal.end * 1000).toLocaleString();
    const createdDate = startDate; // approx

    return (
        <div className="min-h-screen relative">
            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/bg-2.jpg" // Using bg-1 for variation or consistency
                    alt="Background"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="container mx-auto px-4 pt-28 pb-20 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-8">

                    {/* LEFT COLUMN: Navigation / TOC */}
                    <div className="hidden lg:block space-y-6">
                        <div className="sticky top-28">
                            <h3 className="flex items-center gap-2 font-bold text-white mb-6">
                                <AlignLeft className="w-5 h-5" /> Categories
                            </h3>

                            <div className="flex flex-col gap-1 p-4 bg-black/20 backdrop-blur-md rounded-xl border border-white/10">
                                <button className="text-left px-4 py-3 bg-[#ff2f7a]/10 text-[#ff2f7a] border-l-2 border-[#ff2f7a] font-medium text-sm rounded-r-lg">
                                    Overview
                                </button>
                                <button className="text-left px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm rounded-lg flex justify-between items-center group">
                                    Votes <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full group-hover:bg-[#ff2f7a] group-hover:text-white transition-colors">{proposal.votes}</span>
                                </button>
                                <a href={proposal.link} target="_blank" rel="noopener noreferrer" className="text-left px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm rounded-lg flex items-center justify-between group">
                                    Discussion <ExternalLink className="w-3 h-3 group-hover:text-[#ff2f7a] transition-colors" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* CENTER COLUMN: Proposal Content */}
                    <article className="min-w-0">
                        {/* Header Box */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden group">

                            <div className="absolute top-0 right-0 p-6 md:p-8">
                                <span className="px-3 py-1 rounded-full text-xs font-bold border border-white/20 text-white/60 uppercase tracking-widest bg-black/40 backdrop-blur-sm">
                                    {article.timeAgo}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-white/40 mb-4 font-mono uppercase tracking-wider">
                                <span>PROP {article.id.substring(0, 6)}...</span>
                                <span>•</span>
                                <span>{article.author ? `${article.author.slice(0, 6)}...${article.author.slice(-4)}` : 'Unknown'}</span>
                            </div>

                            <h1 className="text-2xl md:text-4xl font-bold text-white mb-8 leading-tight max-w-2xl">
                                {article.title}
                            </h1>

                            <div className="space-y-8 max-w-none text-gray-300">
                                <ReactMarkdown
                                    components={{
                                        // Headings: Same size as text, bold, white, tighter spacing to content
                                        h1: ({ node, ...props }) => <h1 className="font-bold text-white mt-8 mb-1" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="font-bold text-white mt-8 mb-1" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="font-bold text-white mt-6 mb-1" {...props} />,
                                        p: ({ node, ...props }) => <p className="leading-relaxed mb-4 text-base" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                                        li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                                        a: ({ node, ...props }) => <a className="text-[#ff2f7a] hover:underline" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                    }}
                                >
                                    {article.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </article>

                    {/* RIGHT COLUMN: Voting & Stats */}
                    <div className="space-y-6">

                        {/* Vote Action Box */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 sticky top-28">
                            <div className="flex items-center gap-2 text-white font-bold mb-6">
                                <AlignLeft className="w-5 h-5" /> Votes
                            </div>

                            <a
                                href={proposal.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center py-3 px-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors mb-6 flex items-center justify-center gap-2 group"
                            >
                                Vote on Snapshot <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>

                            {/* Votes: For */}
                            <div className="bg-[#1a3825] border border-green-500/30 rounded-xl p-4 mb-3 relative overflow-hidden group">
                                <div className="relative z-10 flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500/20" />
                                        <span className="font-bold text-white">For</span>
                                    </div>
                                    <span className="font-bold text-white">{votes.for}%</span>
                                </div>
                                <div className="absolute inset-0 bg-green-500/10" />
                                <div className="absolute bottom-0 left-0 h-1 bg-green-500" style={{ width: `${votes.for}%` }} />
                            </div>

                            {/* Votes: Against */}
                            <div className="bg-[#381a20] border border-red-500/30 rounded-xl p-4 mb-3 relative overflow-hidden group">
                                <div className="relative z-10 flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-5 h-5 text-red-500 fill-red-500/20" />
                                        <span className="font-bold text-white">Against</span>
                                    </div>
                                    <span className="font-bold text-white">{votes.against}%</span>
                                </div>
                                <div className="absolute inset-0 bg-red-500/10" />
                                <div className="absolute bottom-0 left-0 h-1 bg-red-500" style={{ width: `${votes.against}%` }} />
                            </div>

                            {/* Votes: Abstain */}
                            <div className="bg-[#2a2a2a] border border-white/10 rounded-xl p-4 mb-6 relative overflow-hidden group">
                                <div className="relative z-10 flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full border-2 border-white/20 flex items-center justify-center">
                                            <div className="w-2 h-0.5 bg-white/40" />
                                        </div>
                                        <span className="font-bold text-white/80">Abstain</span>
                                    </div>
                                    <span className="font-bold text-white/80">{votes.abstain}%</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <div className="flex gap-3">
                                    <Clock className="w-4 h-4 text-white/40 mt-0.5" />
                                    <div>
                                        <div className="text-white font-bold text-xs mb-0.5">Status</div>
                                        <div className={`text-xs ${votes.status === 'Active' ? 'text-green-400' : 'text-white/40'}`}>
                                            {votes.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Calendar className="w-4 h-4 text-white/40 mt-0.5" />
                                    <div>
                                        <div className="text-white font-bold text-xs mb-0.5">Start</div>
                                        <div className="text-white/40 text-xs">{startDate}</div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Calendar className="w-4 h-4 text-white/40 mt-0.5" />
                                    <div>
                                        <div className="text-white font-bold text-xs mb-0.5">End</div>
                                        <div className="text-white/40 text-xs">{endDate}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
