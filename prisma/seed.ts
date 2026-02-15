// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import { prisma } from '../lib/prisma';

async function main() {
  const charLibContent = [
    {
      title: "About the DAO",
      content: `PiggyDAO is a decentralized autonomous organization focused on democratizing access to complex DeFi strategies. We believe that financial independence should be an art form, accessible to everyone through intuitive tools and community-driven governance.

Our mission is to build the infrastructure that allows users to navigate the crypto markets with the finesse of a seasoned trader, backed by the collective intelligence of the herd.`
    },
    {
      title: "Piggy Agents",
      content: `At the heart of our ecosystem lies the Piggy Agent—a personification of our AI-driven approach to DeFi. More than just a mascot, the Piggy Agent represents the fusion of meme culture and serious utility.

Equipped with advanced algorithms and a sharp sense of market timing, the Piggy Agent serves as your guide through the volatility of Web3, transforming complex data into seamless execution.`
    },
    {
      title: "History",
      content: `- **November 2024**
  Initial launch for the Superform community, establishing our foundational governance framework.
- **Zero Insider Allocation**
  Launched with a fair distribution model, ensuring no VC or team operational allocation to align incentives purely with the community.
- **$LOP Bucket Launch**
  Introduction of our premier staking pool, allowing users to earn yield while participating in governance.
- **AI Ecosystem Evolution**
  Deployment of the Piggy Agent & Bot, marking our transition into an AI-enhanced DeFi platform.
- **Global Brand Vision**
  Rebranding initiative to bridge the gap between digital finance utility and iconic meme culture.
- **February 5th Integration**
  Successful integration with Superform protocol, expanding our yield strategies and cross-chain capabilities.`
    }
  ];

  await prisma.staticPage.upsert({
    where: { slug: 'character-library' },
    update: {
      sections: charLibContent
    },
    create: {
      slug: 'character-library',
      title: 'Character Library',
      sections: charLibContent
    }
  });

  console.log('Static pages seeded.');

  // Seed Clusters
  const clusters = [
    {
      name: 'Growth Strategy Cluster',
      memberCount: 12,
      proposalCount: 5,
      description: 'Driving user acquisition, brand awareness, and strategic partnerships for the DAO.',
      subCircles: ['Investor Circle', 'Ambassadorship Circle', 'Partnerships Circle'],
      radius: 80
    },
    {
      name: 'Governance Strategy Cluster',
      memberCount: 8,
      proposalCount: 4,
      description: 'Setting the long-term vision, voting frameworks, and decentralized governance standards.',
      subCircles: ['Voting Circle', 'Constitution Circle', 'Treasury Circle'],
      radius: 80
    },
    {
      name: 'Operations Cluster',
      memberCount: 6,
      proposalCount: 2,
      description: 'Managing day-to-day DAO logistics, community moderation, and internal processes.',
      subCircles: ['Moderation Circle', 'Logistics Circle', 'Legal Circle'],
      radius: 80
    },
    {
      name: 'Product Strategy Cluster',
      memberCount: 24,
      proposalCount: 8,
      description: 'Overseeing the conceptualization, engineering, and management of PiggyDAO protocols and dApps.',
      subCircles: ['Research Circle', 'Piggyverse Support Circle', 'Engineering Circle', 'Backend Circle', 'Product Conceptualization Circle', 'Product Management Circle'],
      radius: 80
    },
    {
      name: 'Community Cluster',
      memberCount: 156,
      proposalCount: 0,
      description: 'The heartbeat of PiggyDAO. Participating in discussions, voting, and events.',
      subCircles: ['General Members', 'Events Circle', 'Creative Circle'],
      radius: 80
    }
  ];

  for (const c of clusters) {
    // Check if exists to avoid dupes if re-run (simple check by name)
    const existing = await prisma.cluster.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.cluster.create({
        data: {
          name: c.name,
          description: c.description,
          memberCount: c.memberCount,
          proposalCount: c.proposalCount,
          radius: c.radius,
          subCircles: {
            create: c.subCircles.map(name => ({ name }))
          }
        }
      });
    }
  }
  console.log('Clusters seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
