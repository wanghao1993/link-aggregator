import { z } from 'zod';

export const createCollectionSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  isPublic: z.boolean().default(true),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
