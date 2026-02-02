import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// For Prisma Postgres, use accelerateUrl with the DATABASE_URL
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
