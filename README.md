# Link Aggregator

A community-driven link aggregation platform built with Next.js 14, supporting internationalization.

## Features

- 🌍 **Internationalization**: Support for English and Chinese
- 📚 **Collections**: Create and browse curated link collections
- 🔖 **Bookmarking**: Save your favorite links and collections
- 🎨 **Modern UI**: Clean and responsive design with Tailwind CSS
- 📱 **Responsive**: Works seamlessly on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **i18n**: next-intl
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (or npm/yarn)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd link-aggregator
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/link_aggregator?schema=public"
```

4. Set up the database:
```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# (Optional) Seed the database
pnpm prisma db seed
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main models:

- **User**: User accounts
- **Collection**: Link collections created by users
- **Link**: Individual links with metadata
- **CollectionLink**: Many-to-many relationship between collections and links
- **BookmarkedLink**: User bookmarks for links
- **BookmarkedCollection**: User bookmarks for collections

## Project Structure

```
link-aggregator/
├── app/
│   └── [locale]/           # Internationalized routes
│       ├── page.tsx        # Home page
│       └── c/[slug]/       # Collection detail page
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── collection/         # Collection-related components
│   └── link/               # Link-related components
├── lib/
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Utility functions
├── messages/               # Translation files
│   ├── en.json
│   └── zh.json
├── prisma/
│   └── schema.prisma       # Database schema
└── public/                 # Static assets
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prisma studio` - Open Prisma Studio

## Internationalization

The app supports multiple languages:
- English (en) - Default
- Chinese (zh)

Switch languages using the language selector in the header.

## MVP Features Roadmap

### Week 1: Content Structure & Display ✅
- [x] Project initialization
- [x] Database structure
- [x] Collection page
- [x] Home page
- [ ] Website metadata fetching
- [ ] Create collection functionality
- [ ] Add links to collection

### Week 2: User Behavior & Sharing
- [ ] Authentication (Email Magic Link / OAuth)
- [ ] User profile page
- [ ] Bookmark functionality
- [ ] Sharing & SEO optimization
- [ ] Link status markers (used/later)
- [ ] Visual polish
- [ ] Deployment & seed content

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
