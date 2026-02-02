import { getTranslations } from 'next-intl/server';
import CollectionCard from '@/components/collection/CollectionCard';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  const t = await getTranslations('home');

  // Fetch featured collections (most bookmarked)
  const featuredCollections = await prisma.collection.findMany({
    where: {
      isPublic: true,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          collectionLinks: true,
        },
      },
    },
    orderBy: {
      bookmarkedBy: {
        _count: 'desc',
      },
    },
    take: 6,
  });

  // Fetch recently updated collections
  const recentCollections = await prisma.collection.findMany({
    where: {
      isPublic: true,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          collectionLinks: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 6,
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        
        {featuredCollections.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{t('featured')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredCollections.map((collection: any) => (
                <CollectionCard
                  key={collection.id}
                  id={collection.id}
                  title={collection.title}
                  description={collection.description}
                  slug={collection.slug}
                  author={{
                    name: collection.user.name,
                    image: collection.user.image,
                  }}
                  linkCount={collection._count.collectionLinks}
                  updatedAt={collection.updatedAt}
                />
              ))}
            </div>
          </section>
        )}

        {recentCollections.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">{t('recent')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCollections.map((collection: any) => (
                <CollectionCard
                  key={collection.id}
                  id={collection.id}
                  title={collection.title}
                  description={collection.description}
                  slug={collection.slug}
                  author={{
                    name: collection.user.name,
                    image: collection.user.image,
                  }}
                  linkCount={collection._count.collectionLinks}
                  updatedAt={collection.updatedAt}
                />
              ))}
            </div>
          </section>
        )}

        {featuredCollections.length === 0 && recentCollections.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <svg 
                className="w-8 h-8 text-muted-foreground" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                />
              </svg>
            </div>
            <p className="text-muted-foreground text-lg font-medium">
              No collections yet. Be the first to create one!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
