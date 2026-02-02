import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import CollectionCard from '@/components/collection/CollectionCard';
import LinkCard from '@/components/link/LinkCard';

export default async function MyPage() {
  const session = await auth();
  const t = await getTranslations('myPage');

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Fetch user's collections
  const myCollections = await prisma.collection.findMany({
    where: {
      userId: session.user.id,
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
  });

  // Fetch bookmarked collections
  const bookmarkedCollections = await prisma.bookmarkedCollection.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      collection: {
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
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch bookmarked links
  const bookmarkedLinks = await prisma.bookmarkedLink.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      link: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* User Info */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
                {(session.user.name || 'U')[0].toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{session.user.name}</h1>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* My Collections */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">My Collections</h2>
          {myCollections.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 mb-4">You haven't created any collections yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCollections.map((collection) => (
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
          )}
        </section>

        {/* Bookmarked Collections */}
        {bookmarkedCollections.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Bookmarked Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedCollections.map((bookmark) => (
                <CollectionCard
                  key={bookmark.collection.id}
                  id={bookmark.collection.id}
                  title={bookmark.collection.title}
                  description={bookmark.collection.description}
                  slug={bookmark.collection.slug}
                  author={{
                    name: bookmark.collection.user.name,
                    image: bookmark.collection.user.image,
                  }}
                  linkCount={bookmark.collection._count.collectionLinks}
                  updatedAt={bookmark.collection.updatedAt}
                />
              ))}
            </div>
          </section>
        )}

        {/* Bookmarked Links */}
        {bookmarkedLinks.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Bookmarked Links</h2>
            <div className="space-y-4">
              {bookmarkedLinks.map((bookmark) => (
                <LinkCard
                  key={bookmark.link.id}
                  id={bookmark.link.id}
                  url={bookmark.link.url}
                  title={bookmark.link.title}
                  description={bookmark.link.description}
                  favicon={bookmark.link.favicon}
                  status={bookmark.status}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
