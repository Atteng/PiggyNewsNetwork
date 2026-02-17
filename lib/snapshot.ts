const SNAPSHOT_GRAPHQL_URL = 'https://hub.snapshot.org/graphql';
const SPACE_ID = 'basedpiggy.eth';

export interface SnapshotProposal {
    id: string;
    title: string;
    body: string;
    choices: string[];
    start: number;
    end: number;
    snapshot: string;
    state: 'active' | 'pending' | 'closed';
    author: string;
    link: string;
    scores: number[];
    scores_total: number;
    votes: number;
}

export async function fetchProposals(): Promise<SnapshotProposal[]> {
    const query = `
    query Proposals {
        proposals(
            first: 20,
            skip: 0,
            where: {
                space_in: ["${SPACE_ID}"]
            },
            orderBy: "created",
            orderDirection: desc
        ) {
            id
            title
            body
            choices
            start
            end
            snapshot
            state
            author
            scores
            scores_total
            votes
            link
        }
    }
    `;

    try {
        const response = await fetch(SNAPSHOT_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
            next: { revalidate: 60 } // Cache for 1 minute
        });

        const json = await response.json();

        if (json.errors) {
            console.error('Snapshot GraphQL Errors:', json.errors);
            return [];
        }

        return json.data.proposals || [];
    } catch (error: any) {
        console.error('Failed to fetch proposals:', error);
        return [];
    }
}

export async function fetchProposal(id: string): Promise<SnapshotProposal | null> {
    const query = `
    query Proposal {
        proposal(id: "${id}") {
            id
            title
            body
            choices
            start
            end
            snapshot
            state
            author
            scores
            scores_total
            votes
            link
        }
    }
    `;

    try {
        const response = await fetch(SNAPSHOT_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
            next: { revalidate: 60 }
        });

        const json = await response.json();
        return json.data.proposal || null;
    } catch (error: any) {
        console.error(`Failed to fetch proposal ${id}:`, error);
        return null;
    }
}
