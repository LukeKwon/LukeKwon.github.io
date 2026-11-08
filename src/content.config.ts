import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['감각-운동', '스페셜포커스', '부상-질환']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
    originalUrl: z.string().url().optional(),
  }),
});
export const collections = { posts };
