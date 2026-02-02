import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Bookmark a collection
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { collectionId } = await request.json();

    if (!collectionId) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      );
    }

    // Check if already bookmarked
    const existing = await prisma.bookmarkedCollection.findUnique({
      where: {
        userId_collectionId: {
          userId: session.user.id!,
          collectionId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already bookmarked' },
        { status: 409 }
      );
    }

    // Create bookmark
    const bookmark = await prisma.bookmarkedCollection.create({
      data: {
        userId: session.user.id!,
        collectionId,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error('Error bookmarking collection:', error);
    return NextResponse.json(
      { error: 'Failed to bookmark collection' },
      { status: 500 }
    );
  }
}

// Remove bookmark from collection
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('collectionId');

    if (!collectionId) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      );
    }

    await prisma.bookmarkedCollection.delete({
      where: {
        userId_collectionId: {
          userId: session.user.id!,
          collectionId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to remove bookmark' },
      { status: 500 }
    );
  }
}
