import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Bookmark a link
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { linkId, status } = await request.json();

    if (!linkId) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }

    // Check if already bookmarked
    const existing = await prisma.bookmarkedLink.findUnique({
      where: {
        userId_linkId: {
          userId: session.user.id!,
          linkId,
        },
      },
    });

    if (existing) {
      // Update status if already bookmarked
      const updated = await prisma.bookmarkedLink.update({
        where: {
          userId_linkId: {
            userId: session.user.id!,
            linkId,
          },
        },
        data: {
          status,
        },
      });
      return NextResponse.json(updated);
    }

    // Create bookmark
    const bookmark = await prisma.bookmarkedLink.create({
      data: {
        userId: session.user.id!,
        linkId,
        status,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error('Error bookmarking link:', error);
    return NextResponse.json(
      { error: 'Failed to bookmark link' },
      { status: 500 }
    );
  }
}

// Remove bookmark from link
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get('linkId');

    if (!linkId) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }

    await prisma.bookmarkedLink.delete({
      where: {
        userId_linkId: {
          userId: session.user.id!,
          linkId,
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
