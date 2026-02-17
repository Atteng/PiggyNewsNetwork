import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    // Optional: Check for 'admin' or 'editor' role specifically
    // if (!['admin', 'editor'].includes((session.user as any).role)) {
    //   return <div>Unauthorized</div>;
    // }

    return (
        <div className="flex min-h-screen bg-transparent text-white font-sans">
            {/* Desktop Only Guard */}
            <div className="lg:hidden fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                    <svg className="w-8 h-8 text-piggy-deep-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Desktop Only Access</h2>
                <p className="text-white/50 max-w-xs">
                    The PNN Admin Panel is optimized for desktop management. Please use a larger screen to edit content.
                </p>
                <Link href="/" className="mt-8 text-piggy-deep-pink hover:underline font-medium">
                    &larr; Back to Landing Page
                </Link>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:flex w-64 border-r border-white/10 p-6 flex-col bg-black/20 backdrop-blur-md">
                <div className="mb-8">
                    <h1 className="text-xl font-bold tracking-tight text-white/90">PNN Admin</h1>
                    <p className="text-xs text-white/50 mt-1">Content Management</p>
                </div>

                <nav className="flex-1 space-y-1">
                    <AdminLink href="/admin" label="Dashboard" />
                    <div className="pt-4 pb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">Content</div>
                    <AdminLink href="/admin/articles" label="Articles" />
                    <AdminLink href="/admin/assets" label="Brand Assets" />
                    <AdminLink href="/admin/docs" label="Documentation" />
                    <AdminLink href="/admin/hero" label="Hero Content" />

                    <div className="pt-4 pb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">Governance</div>
                    <AdminLink href="/admin/clusters" label="Clusters" />
                </nav>

                <div className="mt-auto border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3 mb-4">
                        {session.user.image && (
                            <img src={session.user.image} alt={session.user.name || 'User'} className="w-8 h-8 rounded-full bg-white/10" />
                        )}
                        <div className="text-sm">
                            <div className="font-medium text-white/90">{session.user.name}</div>
                            <div className="text-xs text-white/50 truncate max-w-[120px]">{session.user.email}</div>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="text-sm text-red-400 hover:text-red-300 transition-colors">
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto hidden lg:block">
                {children}
            </main>
        </div>
    );
}

function AdminLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors"
        >
            {label}
        </Link>
    );
}
