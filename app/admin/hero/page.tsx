"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Sparkles } from "lucide-react";

export default function AdminHeroPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState("");

    const [badgeText, setBadgeText] = useState("");
    const [headlineLine1, setHeadlineLine1] = useState("");
    const [headlineLine2, setHeadlineLine2] = useState("");
    const [headlineLine3, setHeadlineLine3] = useState("");
    const [tagline, setTagline] = useState("");

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch("/api/hero-content");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch");

                setBadgeText(data.badgeText || "");
                setHeadlineLine1(data.headlineLine1 || "");
                setHeadlineLine2(data.headlineLine2 || "");
                setHeadlineLine3(data.headlineLine3 || "");
                setTagline(data.tagline || "");
            } catch (err) {
                console.error(err);
                setMessage("Failed to load hero content.");
            } finally {
                setFetching(false);
            }
        };

        fetchContent();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/hero-content", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    badgeText,
                    headlineLine1,
                    headlineLine2,
                    headlineLine3,
                    tagline
                }),
            });

            if (!res.ok) throw new Error("Failed to update");

            setMessage("Hero content updated successfully!");
            router.refresh();
        } catch (err) {
            setMessage("Failed to update hero content.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-piggy-deep-pink" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Hero Content</h2>
                    <p className="text-white/60">Edit the text that appears on your landing page hero section.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-piggy-deep-pink text-white font-bold rounded-full hover:bg-pink-600 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </header>

            {message && (
                <div className={`p-4 rounded-lg border ${message.includes("success") ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Preview Card */}
                <div className="space-y-6">
                    <div className="p-8 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Sparkles className="w-5 h-5 text-piggy-deep-pink opacity-50" />
                        </div>

                        {/* Badge Preview */}
                        <div className="mb-4 inline-flex items-center rounded-full border border-piggy-deep-pink/40 bg-black/40 px-3 py-1 text-[10px] font-medium text-piggy-deep-pink">
                            {badgeText || "Badge Text"}
                        </div>

                        {/* Title Preview */}
                        <div className="space-y-1 mb-6">
                            <div className="text-xl font-bold text-white leading-tight">{headlineLine1 || "The Art of"}</div>
                            <div className="text-xl font-bold text-white leading-tight">{headlineLine2 || "Financial"}</div>
                            <div className="text-xl font-bold text-white leading-tight">{headlineLine3 || "Independence"}</div>
                        </div>

                        {/* Tagline Preview */}
                        <p className="text-[10px] text-white/50 uppercase tracking-widest leading-relaxed">
                            {tagline || "Tagline text goes here..."}
                        </p>
                    </div>

                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <h4 className="font-semibold text-white mb-4">Note</h4>
                        <p className="text-xs text-white/50 leading-relaxed">
                            Try to keep headlines short (1-3 words per line) for the best visual impact on the landing page. The tagline will be automatically converted to uppercase.
                        </p>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/40">Badge Text</label>
                        <input
                            type="text"
                            value={badgeText}
                            onChange={(e) => setBadgeText(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-piggy-deep-pink"
                            placeholder="e.g. Source of Truth"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/40">Main Headline</label>
                        <input
                            type="text"
                            value={headlineLine1}
                            onChange={(e) => setHeadlineLine1(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-piggy-deep-pink"
                            placeholder="Line 1"
                        />
                        <input
                            type="text"
                            value={headlineLine2}
                            onChange={(e) => setHeadlineLine2(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-piggy-deep-pink"
                            placeholder="Line 2"
                        />
                        <input
                            type="text"
                            value={headlineLine3}
                            onChange={(e) => setHeadlineLine3(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-piggy-deep-pink"
                            placeholder="Line 3"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/40">Tagline (Subtext)</label>
                        <textarea
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-piggy-deep-pink h-24 text-sm"
                            placeholder="Brief description..."
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
