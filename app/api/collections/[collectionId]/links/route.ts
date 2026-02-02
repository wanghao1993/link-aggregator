import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addLinkSchema } from '@/lib/validations/link';

interface RouteParams {
  params: Promise<{
    collectionId: string;
  }>;
}

// Add a link to a collection
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { collectionId } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = addLinkSchema.parse(body);

    // Check if collection exists
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Check if link already exists, if not create it
    let link = await prisma.link.findFirst({
      where: { url: validatedData.url },
    });

    if (!link) {
      link = await prisma.link.create({
        data: {
          url: validatedData.url,
          title: validatedData.title,
          description: validatedData.description,
          favicon: validatedData.favicon,
        },
      });
    }

    // Check if link is already in collection
    const existingCollectionLink = await prisma.collectionLink.findUnique({
      where: {
        collectionId_linkId: {
          collectionId,
          linkId: link.id,
        },
      },
    });

    if (existingCollectionLink) {
      return NextResponse.json(
        { error: 'Link already exists in this collection' },
        { status: 409 }
      );
    }

    // Get the current max order
    const maxOrder = await prisma.collectionLink.findFirst({
      where: { collectionId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    // Add link to collection
    const collectionLink = await prisma.collectionLink.create({
      data: {
        collectionId,
        linkId: link.id,
        order: (maxOrder?.order ?? -1) + 1,
        status: validatedData.status,
      },
      include: {
        link: true,
      },
    });

    // Update collection's updatedAt
    await prisma.collection.update({
      where: { id: collectionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(collectionLink, { status: 201 });
  } catch (error) {
    console.error('Error adding link to collection:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add link to collection' },
      { status: 500 }
    );
  }
}

// Get all links in a collection
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { collectionId } = await params;

    const collectionLinks = await prisma.collectionLink.findMany({
      where: { collectionId },
      include: {
        link: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(collectionLinks);
  } catch (error) {
    console.error('Error fetching collection links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collection links' },
      { status: 500 }
    );
  }
}
