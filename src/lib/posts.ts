import { getCollection } from 'astro:content';
import { legacyPosts } from '../data/legacy';
import { href } from './site';
export async function getPosts() {
  const local = await getCollection('posts', ({ data }) => !data.draft);
  return [
    ...local.map(({ id, data }) => ({ ...data, url: href(`posts/${id}/`), external: false })),
    ...legacyPosts.map(post => ({ ...post, date: new Date(`${post.date}T12:00:00+09:00`), description: '', url: `https://blog.naver.com/itsmekinesiologist/${post.id}`, external: true })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
}
