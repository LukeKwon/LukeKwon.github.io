import { getCollection } from 'astro:content';
import { legacyPosts } from '../data/legacy';
import { href } from './site';
export async function getPosts() {
  const local = await getCollection('posts', ({ data }) => !data.draft);
  return [
    ...local.map(({ data }) => ({ ...data, url: href(`posts/${data.slug}/`), external: false })),
    ...legacyPosts.filter(post => !local.some(entry => entry.data.originalUrl?.endsWith(`/${post.id}`))).map(post => ({ ...post, date: new Date(`${post.date}T12:00:00+09:00`), description: '', url: `https://blog.naver.com/itsmekinesiologist/${post.id}`, external: true })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
}
