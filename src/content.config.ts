import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts', generateId: ({ entry }) => entry.replace(/\.md$/, '').normalize('NFC') }),
  schema: z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    legacySlugs: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).default([]),
    naverId: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    subcategory: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
    originalUrl: z.string().url().optional(),
  }).refine(data => data.draft || Boolean(data.slug), { message: 'Published posts require a permanent English slug', path: ['slug'] }),
});
export const collections = { posts };
