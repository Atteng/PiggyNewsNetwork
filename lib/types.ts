export type Category = 'Proposal' | 'Temp Check' | 'General' | 'Marketing' | 'Operations' | 'All';

export interface Article {
    id: string;
    title: string;
    category: Category;
    thumbnail: string;
    excerpt?: string;
    timeAgo: string;
    views: string;
    featured: boolean;
    author?: string;
    readTime?: string;
    content?: string;
}

export interface CategorySidebarProps {
    activeCategory: Category | 'All';
    onChange: (category: Category | 'All') => void;
}

export interface ArticleCardProps extends Article {
    variant?: 'standard' | 'featured';
    index?: number; // For stagger animation
}

export interface NewsGridProps {
    articles: Article[];
    loading?: boolean;
}

export interface FeaturedSidebarProps {
    articles: Article[];
    className?: string;
}

// --- Porktocracy Types ---

export interface Cluster {
    id: string;
    name: string;
    memberCount: number;
    proposalCount: number;
    description: string;
    subCircles: string[];
    radius?: number; // For D3 visualization
    x?: number;
    y?: number;
}

export interface ClusterMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
}

export interface ClusterProposal {
    id: string;
    title: string;
    status: 'Active' | 'Passed' | 'Failed';
    date: string;
}

// --- Documentation Types ---

export interface DocNavItem {
    id: string;
    label: string;
    icon?: string;
    href?: string;
    children?: DocNavItem[];
}

export interface DocPage {
    id: string;
    slug: string;
    category: string;
    title: string;
    description: string;
    content: string; // Markdown content
}
