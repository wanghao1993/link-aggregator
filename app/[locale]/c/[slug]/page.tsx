import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import LinkCard from '@/components/link/LinkCard';
import AddLinkDialog from '@/components/link/AddLinkDialog';
import BookmarkButton from '@/components/collection/BookmarkButton';
import { Share2 } from 'lucide-react';

interface CollectionPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const t = await getTranslations('collection');
  const session = await auth();

  // Fetch collection with links
  const collection = await prisma.collection.findUnique({
    where: {
      slug,
      isPublic: true,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      collectionLinks: {
        include: {
          link: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
      _count: {
        select: {
          bookmarkedBy: true,
        },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  // Check if user has bookmarked this collection
  const isBookmarked = session?.user
    ? await prisma.bookmarkedCollection
        .findUnique({
          where: {
            userId_collectionId: {
              userId: session.user.id!,
              collectionId: collection.id,
            },
          },
        })
        .then((bookmark) => !!bookmark)
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 py-8">
        {/* Collection Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {collection.title}
              </h1>
              
              {collection.description && (
                <p className="text-lg text-gray-600 mb-4">
                  {collection.description}
                </p>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  {collection.user.image ? (
                    <img
                      src={collection.user.image}
                      alt={collection.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-600">
                      {(collection.user.name || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span>
                    {t('by')} <span className="font-semibold">{collection.user.name || 'Anonymous'}</span>
                  </span>
                </div>
                
                <span>•</span>
                <span>{collection.collectionLinks.length} {t('links')}</span>
                <span>•</span>
                <span>{collection._count.bookmarkedBy} bookmarks</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-3 ml-6">
              <BookmarkButton
                collectionId={collection.id}
                isBookmarked={isBookmarked}
                isAuthenticated={!!session?.user}
              />
              
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>{t('share')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Links List Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Links</h2>
          <AddLinkDialog collectionId={collection.id} />
        </div>

        {/* Links List */}
        <div className="space-y-4">
          {collection.collectionLinks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 mb-4">No links in this collection yet.</p>
              <AddLinkDialog collectionId={collection.id} />
            </div>
          ) : (
            collection.collectionLinks.map((collectionLink) => (
              <LinkCard
                key={collectionLink.id}
                id={collectionLink.link.id}
                url={collectionLink.link.url}
                title={collectionLink.link.title}
                description={collectionLink.link.description}
                favicon={collectionLink.link.favicon}
                status={collectionLink.status}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CollectionPageProps) {
  const { slug } = await params;
  
  const collection = await prisma.collection.findUnique({
    where: {
      slug,
      isPublic: true,
    },
    select: {
      title: true,
      description: true,
    },
  });

  if (!collection) {
    return {
      title: 'Collection Not Found',
    };
  }

  return {
    title: collection.title,
    description: collection.description || `Explore ${collection.title} - A curated collection of links`,
    openGraph: {
      title: collection.title,
      description: collection.description || `Explore ${collection.title} - A curated collection of links`,
    },
  };
}
