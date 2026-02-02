import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCollectionSchema } from '@/lib/validations/collection';
import { generateUniqueSlug } from '@/lib/slug';

// Create a new collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createCollectionSchema.parse(body);

    // TODO: Get user ID from session (for now, using a mock user)
    // In a real app, you'd get this from NextAuth session
    const userId = body.userId || 'demo-user-id';

    // Check if user exists, if not create a demo user
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: 'demo@example.com',
          name: 'Demo User',
        },
      });
    }

    // Generate unique slug
    const slug = generateUniqueSlug(validatedData.title);

    // Create collection
    const collection = await prisma.collection.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        slug,
        isPublic: validatedData.isPublic,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}

// Get all collections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const collections = await prisma.collection.findMany({
      where: userId
        ? { userId, isPublic: true }
        : { isPublic: true },
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
            bookmarkedBy: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}
