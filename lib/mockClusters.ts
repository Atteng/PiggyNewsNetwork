import { Cluster } from './types';

export const mockClusters: Cluster[] = [
    {
        id: '1',
        name: 'Growth Strategy Cluster',
        memberCount: 12,
        proposalCount: 5,
        description: 'Driving user acquisition, brand awareness, and strategic partnerships for the DAO.',
        subCircles: ['Investor Circle', 'Ambassadorship Circle', 'Partnerships Circle'],
        radius: 80
    },
    {
        id: '2',
        name: 'Governance Strategy Cluster',
        memberCount: 8,
        proposalCount: 4,
        description: 'Setting the long-term vision, voting frameworks, and decentralized governance standards.',
        subCircles: ['Voting Circle', 'Constitution Circle', 'Treasury Circle'],
        radius: 80
    },
    {
        id: '3',
        name: 'Operations Cluster',
        memberCount: 6,
        proposalCount: 2,
        description: 'Managing day-to-day DAO logistics, community moderation, and internal processes.',
        subCircles: ['Moderation Circle', 'Logistics Circle', 'Legal Circle'],
        radius: 80
    },
    {
        id: '4',
        name: 'Product Strategy Cluster',
        memberCount: 24,
        proposalCount: 8,
        description: 'Overseeing the conceptualization, engineering, and management of PiggyDAO protocols and dApps.',
        subCircles: ['Research Circle', 'Piggyverse Support Circle', 'Engineering Circle', 'Backend Circle', 'Product Conceptualization Circle', 'Product Management Circle'],
        radius: 80
    },
    {
        id: '5',
        name: 'Community Cluster',
        memberCount: 156,
        proposalCount: 0,
        description: 'The heartbeat of PiggyDAO. Participating in discussions, voting, and events.',
        subCircles: ['General Members', 'Events Circle', 'Creative Circle'],
        radius: 80
    }
];
