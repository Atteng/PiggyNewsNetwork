# Piggy News Network (PNN)

Piggy News Network is a decentralized governance and news platform for PiggyDAO. It features a robust news feed, interactive governance map (The Porktocracy), and an integrated AI assistant.

## Features

- **The Porktocracy**: A D3.js powered interactive visualization of governance clusters.
- **News & Publications**: A modular news system with category filtering and featured stories.
- **AI Assistant**: A platform-aware assistant that helps users navigate DAO documentation and proposals.
- **Admin CMS**: Secure credentials-based admin area for content management.
- **Video Backgrounds**: High-performance, responsive video hero sections.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Prisma with Supabase (PostgreSQL)
- **Auth**: NextAuth.js
- **Visualization**: D3.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase (or any PostgreSQL) database

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd piggy-news-network
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your credentials.
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `app/`: Next.js pages and layouts
- `components/`: Reusable UI components
- `lib/`: Utility functions, types, and mock data
- `prisma/`: Database schema and migrations
- `public/`: Static assets (images, videos)

## License

MIT
