import { FileText, Image as ImageIcon, Book } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                <p className="text-white/60">Welcome to the Piggy News Network CMS.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Articles"
                    description="Manage news, op-eds, and proposals"
                    href="/admin/articles"
                    action="View All"
                    icon={<FileText className="w-6 h-6 text-[var(--neon-pink)]" />}
                />
                <DashboardCard
                    title="Assets"
                    description="Upload and organize brand materials"
                    href="/admin/assets"
                    action="Manage Library"
                    icon={<ImageIcon className="w-6 h-6 text-[var(--neon-pink)]" />}
                />
                <DashboardCard
                    title="Documentation"
                    description="Edit the PiggyDAO docs"
                    href="/admin/docs"
                    action="Edit Docs"
                    icon={<Book className="w-6 h-6 text-[var(--neon-pink)]" />}
                />
            </div>
        </div>
    );
}

function DashboardCard({ title, description, href, action, icon }: { title: string, description: string, href: string, action: string, icon: React.ReactNode }) {
    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
            <div className="mb-4 bg-white/5 p-3 rounded-lg inline-block border border-white/5">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
            <p className="text-sm text-white/50 mb-4">{description}</p>
            <a href={href} className="inline-flex items-center text-sm font-medium text-[var(--neon-pink)] hover:text-pink-300">
                {action} &rarr;
            </a>
        </div>
    )
}
