import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import LinkCard from "@/components/link/LinkCard";
import AddLinkDialog from "@/components/link/AddLinkDialog";
import BookmarkButton from "@/components/collection/BookmarkButton";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface CollectionPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const t = await getTranslations("collection");
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
          order: "asc",
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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Collection Header */}
        <div className="bg-card border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between gap-6 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {collection.title}
              </h1>

              {collection.description && (
                <p className="text-muted-foreground mb-4">
                  {collection.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  {collection.user.image ? (
                    <img
                      src={collection.user.image}
                      alt={collection.user.name || "User"}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {(collection.user.name || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <span>
                    {t("by")}{" "}
                    <span className="font-medium text-foreground">
                      {collection.user.name || "Anonymous"}
                    </span>
                  </span>
                </div>

                <span className="text-muted-foreground/50">•</span>
                <span>
                  {collection.collectionLinks.length} {t("links")}
                </span>
                <span className="text-muted-foreground/50">•</span>
                <span>{collection._count.bookmarkedBy} bookmarks</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <BookmarkButton
                collectionId={collection.id}
                isBookmarked={isBookmarked}
                isAuthenticated={!!session?.user}
              />

              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
                {t("share")}
              </Button>
            </div>
          </div>
        </div>

        {/* Links List Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Links</h2>
          <AddLinkDialog collectionId={collection.id} />
        </div>

        {/* Links List */}
        <div className="space-y-3">
          {collection.collectionLinks.length === 0 ? (
            <div className="text-center py-12 bg-card border rounded-lg">
              <p className="text-muted-foreground mb-4">
                No links in this collection yet.
              </p>
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
      title: "Collection Not Found",
    };
  }

  return {
    title: collection.title,
    description:
      collection.description ||
      `Explore ${collection.title} - A curated collection of links`,
    openGraph: {
      title: collection.title,
      description:
        collection.description ||
        `Explore ${collection.title} - A curated collection of links`,
    },
  };
}
