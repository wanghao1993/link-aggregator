import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import 'dotenv/config';

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

async function main() {
  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  });

  console.log('Created user:', user);

  // Create collections
  const collections = [
    {
      title: 'AI & Machine Learning Resources',
      description: 'Curated collection of AI and ML tools, papers, and tutorials',
      slug: 'ai-ml-resources',
      userId: user.id,
    },
    {
      title: 'Web Development Tools',
      description: 'Essential tools and libraries for modern web development',
      slug: 'web-dev-tools',
      userId: user.id,
    },
    {
      title: 'Design Inspiration',
      description: 'Beautiful design examples and resources',
      slug: 'design-inspiration',
      userId: user.id,
    },
  ];

  for (const collection of collections) {
    const created = await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: {},
      create: collection,
    });
    console.log('Created collection:', created.title);
  }

  // Create some links
  const links = [
    {
      url: 'https://openai.com',
      title: 'OpenAI',
      description: 'Artificial intelligence research company',
      favicon: 'https://openai.com/favicon.ico',
    },
    {
      url: 'https://huggingface.co',
      title: 'Hugging Face',
      description: 'The AI community building the future',
      favicon: 'https://huggingface.co/favicon.ico',
    },
    {
      url: 'https://nextjs.org',
      title: 'Next.js',
      description: 'The React Framework for the Web',
      favicon: 'https://nextjs.org/favicon.ico',
    },
    {
      url: 'https://tailwindcss.com',
      title: 'Tailwind CSS',
      description: 'A utility-first CSS framework',
      favicon: 'https://tailwindcss.com/favicon.ico',
    },
  ];

  for (const link of links) {
    const created = await prisma.link.upsert({
      where: { id: link.url }, // Using URL as unique identifier
      update: {},
      create: link,
    });
    console.log('Created link:', created.title);
  }

  // Link collections with links
  const aiCollection = await prisma.collection.findUnique({
    where: { slug: 'ai-ml-resources' },
  });

  const webDevCollection = await prisma.collection.findUnique({
    where: { slug: 'web-dev-tools' },
  });

  if (aiCollection) {
    const aiLinks = await prisma.link.findMany({
      where: {
        OR: [
          { url: 'https://openai.com' },
          { url: 'https://huggingface.co' },
        ],
      },
    });

    for (const [index, link] of aiLinks.entries()) {
      await prisma.collectionLink.upsert({
        where: {
          collectionId_linkId: {
            collectionId: aiCollection.id,
            linkId: link.id,
          },
        },
        update: {},
        create: {
          collectionId: aiCollection.id,
          linkId: link.id,
          order: index,
        },
      });
    }
  }

  if (webDevCollection) {
    const webDevLinks = await prisma.link.findMany({
      where: {
        OR: [
          { url: 'https://nextjs.org' },
          { url: 'https://tailwindcss.com' },
        ],
      },
    });

    for (const [index, link] of webDevLinks.entries()) {
      await prisma.collectionLink.upsert({
        where: {
          collectionId_linkId: {
            collectionId: webDevCollection.id,
            linkId: link.id,
          },
        },
        update: {},
        create: {
          collectionId: webDevCollection.id,
          linkId: link.id,
          order: index,
        },
      });
    }
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
