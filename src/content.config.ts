import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    subcategory: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
    originalUrl: z.string().url().optional(),
  }),
});
export const collections = { posts };
