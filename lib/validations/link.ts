import { z } from 'zod';

export const addLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().max(1000).optional(),
  favicon: z.string().url().optional(),
  status: z.enum(['used', 'later']).optional(),
});

export type AddLinkInput = z.infer<typeof addLinkSchema>;
