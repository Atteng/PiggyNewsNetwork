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
        <div className="flex min-h-screen bg-neutral-900 text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
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

                    <div className="pt-4 pb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">Governance</div>
                    <AdminLink href="/admin/clusters" label="Clusters" />
                    <AdminLink href="/admin/proposals" label="Proposals" />

                    <div className="pt-4 pb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">System</div>
                    <AdminLink href="/admin/hero" label="Hero Content" />
                    <AdminLink href="/admin/settings" label="Site Settings" />
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
            <main className="flex-1 p-8 overflow-y-auto">
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
