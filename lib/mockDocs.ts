import { DocNavItem, DocPage } from './types';

export const docNavigation: DocNavItem[] = [
    {
        id: 'intro',
        label: 'Introduction',
        icon: 'Waves',
        children: [
            { id: 'welcome', label: 'Welcome to Piggy', href: '/documentation/intro/welcome' },
            { id: 'mission', label: 'Mission & Vision', href: '/documentation/intro/mission' },
        ]
    },
    {
        id: 'setup',
        label: 'Set Up',
        icon: 'Wrench',
        children: [
            { id: 'overview', label: 'Overview', href: '/documentation/setup/overview' },
            { id: 'customization', label: 'Customization', href: '/documentation/setup/customization' },
            { id: 'hostname', label: 'Hostname', href: '/documentation/setup/hostname' },
            { id: 'user-profiles', label: 'User Profiles', href: '/documentation/setup/user-profiles' },
        ]
    },
    {
        id: 'governance',
        label: 'Governance',
        icon: 'Scale',
        children: [
            { id: 'voting', label: 'Voting Process', href: '/documentation/governance/voting' },
            { id: 'proposals', label: 'Creating Proposals', href: '/documentation/governance/proposals' },
        ]
    },
    {
        id: 'resources',
        label: 'Resources',
        icon: 'Library',
        children: [
            { id: 'brand-assets', label: 'Brand Assets', href: '/documentation/resources/brand-assets' },
            { id: 'api', label: 'API Reference', href: '/documentation/resources/api' },
        ]
    }
];

export const docPages: DocPage[] = [
    {
        id: 'welcome',
        slug: 'welcome',
        category: 'intro',
        title: 'Welcome to Piggy Docs',
        description: 'Introduction to PiggyDAO and the ecosystem.',
        content: `
# Welcome to Piggy Docs

Piggy is the meme layer of **Superform**. It is designed to help protocols drive engagement, build culture, and reward participation through meme-native campaigns.

## What is PiggyDAO?

PiggyDAO is a decentralized collective focused on the intersection of finance, culture, and memes. We believe that memes are the most powerful communication tool in the modern era, and by harnessing them, we can drive adoption and understanding of complex DeFi protocols.

### Key Features

- **Meme-Native Campaigns**: Engage users with humor and culture.
- **Porktocracy Governance**: A unique governance model based on reputation and contribution.
- **Brand Assets**: Fully open-source brand kit for community remixing.

## Getting Started

To get started with Piggy, we recommend exploring the **Set Up** guide to configure your profile and understand the platform basics.

> [!NOTE]
> Piggy is currently in beta. Features and documentation are subject to change.

`
    },
    {
        id: 'overview',
        slug: 'overview',
        category: 'setup',
        title: 'Platform Overview',
        description: 'Understanding the core components of the Piggy platform.',
        content: `
# Platform Overview

The Piggy platform consists of several key components designed to work together seamlessly.

## Components

1. **News Network**: The central hub for all updates, announcements, and cultural news.
2. **Porktocracy**: The governance visualization tool showing the organizational structure.
3. **Values**: The core principles driving the DAO.

## System Requirements

Piggy is a web-based platform compatible with all modern browsers. For the best experience, we recommend:

- Google Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)

`
    },
    {
        id: 'customization',
        slug: 'customization',
        category: 'setup',
        title: 'Customization Options',
        description: 'How to personalize your Piggy experience.',
        content: `
# Customization

Piggy offers a range of customization options to make the platform your own.

## Theme Settings

You can toggle between **Light Mode** and **Dark Mode** using the sun/moon icon in the top navigation bar.

## Profile Customization

Users can update their profile information, including:
- Avatar
- Display Name
- Bio

> [!TIP]
> Use a high-resolution image for your avatar to look your best in the Porktocracy visualization.
`
    },
    {
        id: 'mission',
        slug: 'mission',
        category: 'intro',
        title: 'Mission & Vision',
        description: 'The driving force behind PiggyDAO.',
        content: `
# Mission & Vision

Our mission is to democratize financial independence through the power of memes and community.

## Vision

We envision a world where financial literacy is accessible to everyone, not just through textbooks, but through culture and engagement.

## Values

- **Transparency**: Open and honest communication.
- **Community**: Validating every voice.
- **Innovation**: Pushing boundaries of DeFi UX.
`
    }
];
