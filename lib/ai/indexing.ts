import { prisma } from '@/lib/prisma';
import { docPages } from '@/lib/mockDocs';

export interface IndexEntry {
    id: string;
    type: 'article' | 'proposal' | 'doc' | 'cluster';
    title: string;
    content: string;
    url: string;
}

let cachedIndex: IndexEntry[] | null = null;
let lastFetch = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

export async function getPlatformIndex(): Promise<IndexEntry[]> {
    const now = Date.now();
    if (cachedIndex && (now - lastFetch < CACHE_TTL)) {
        return cachedIndex;
    }

    const index: IndexEntry[] = [];

    try {
        const [articles, proposals, clusters] = await Promise.all([
            prisma.article.findMany({ where: { status: 'published' } }),
            prisma.proposal.findMany({ include: { article: true } }),
            prisma.cluster.findMany()
        ]);

        // index Articles
        articles.forEach((a: any) => {
            index.push({
                id: a.id,
                type: 'article',
                title: a.title,
                content: a.excerpt || a.content?.substring(0, 500) || '',
                url: `/news/${a.slug}`
            });
        });

        // index Proposals
        proposals.forEach((p: any) => {
            index.push({
                id: p.id,
                type: 'proposal',
                title: p.article.title,
                content: `Status: ${p.status}. Start: ${p.startDate}. End: ${p.endDate}. This is a governance proposal.`,
                url: `/governance/${p.article.slug}`
            });
        });

        // index Clusters
        clusters.forEach((c: any) => {
            index.push({
                id: c.id,
                type: 'cluster',
                title: c.name,
                content: `${c.description || ''} Stats: ${c.memberCount} members, ${c.proposalCount} proposals. Radius: ${c.radius}.`,
                url: `/porktocracy`
            });
        });

        cachedIndex = index;
        lastFetch = now;

    } catch (e: any) {
        console.error('Indexing failed:', e);
    }

    // 4. Add Documentation (Mock)
    docPages.forEach((p: any) => {
        index.push({
            id: p.id,
            type: 'doc',
            title: p.title,
            content: p.content,
            url: `/documentation/${p.category}/${p.slug}`
        });
    });

    return index;
}

export function searchIndex(query: string, index: IndexEntry[]): IndexEntry[] {
    const q = query.toLowerCase();
    return index.filter(entry =>
        entry.title.toLowerCase().includes(q) ||
        entry.content.toLowerCase().includes(q)
    ).slice(0, 5); // Limit to top 5 results for context
}
