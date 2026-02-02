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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* User Info */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold">
                {(session.user.name || 'U')[0].toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{session.user.name}</h1>
              <p className="text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* My Collections */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">My Collections</h2>
          {myCollections.length === 0 ? (
            <div className="text-center py-12 bg-card border rounded-lg">
              <p className="text-muted-foreground mb-4">You haven't created any collections yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <h2 className="text-xl font-semibold mb-4">Bookmarked Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <h2 className="text-xl font-semibold mb-4">Bookmarked Links</h2>
            <div className="space-y-3">
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
