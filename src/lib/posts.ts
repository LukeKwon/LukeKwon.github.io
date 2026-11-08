import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { legacyPosts } from '../data/legacy';
import { href } from './site';
const images = import.meta.glob<{ default: ImageMetadata }>('/public/images/**/*.{png,jpg,jpeg,webp,gif,svg}', { eager: true });

async function thumbnailFor(post: { data: { thumbnail?: string }; body?: string }) {
  // Prefer an explicit cover; otherwise use the first local Markdown image.
  const path = post.data.thumbnail ?? post.body?.match(/!\[[^\]]*\]\(\s*(\/images\/[^\s)]+)(?:\s+["'][^\n]*["'])?\s*\)/)?.[1];
  if (!path) return undefined;
  const source = images[`/public${path}`]?.default;
  if (!source) throw new Error(`Thumbnail image not found: ${path}`);
  return getImage({ src: source, width: 256, height: 192, fit: 'contain', format: source.format === 'svg' ? 'svg' : 'webp' });
}
export async function getPosts() {
  const local = await getCollection('posts', ({ data }) => !data.draft);
  return [
    ...await Promise.all(local.map(async post => ({ ...post.data, thumbnail: await thumbnailFor(post), url: href(`posts/${post.data.slug}/`), external: false }))),
    ...legacyPosts.filter(post => !local.some(entry => entry.data.originalUrl?.endsWith(`/${post.id}`))).map(post => ({ ...post, date: new Date(`${post.date}T12:00:00+09:00`), description: '', url: `https://blog.naver.com/itsmekinesiologist/${post.id}`, external: true })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
}
