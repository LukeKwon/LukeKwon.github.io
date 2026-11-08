import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// GitHub Actions supplies the repository name; local previews use the root URL.
const repository = process.env.GITHUB_REPOSITORY;
const [owner, name] = repository?.split('/') ?? [];
const userSite = name?.toLowerCase() === `${owner?.toLowerCase()}.github.io`;
const base = process.env.BASE_PATH || (name && !userSite ? `/${name}` : '/');
// Public images must use URL paths, not relative source imports.
const publicImagePaths = () => tree => {
  const visit = node => {
    if (node.tagName === 'img' && typeof node.properties?.src === 'string' && node.properties.src.startsWith('/images/')) {
      node.properties.src = `${base.replace(/\/$/, '')}${node.properties.src}`;
      node.properties.loading = 'lazy';
      node.properties.decoding = 'async';
    }
    node.children?.forEach(visit);
  };
  visit(tree);
};
export default defineConfig({
  site: process.env.SITE_URL || (owner ? `https://${owner}.github.io` : undefined),
  base,
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex, publicImagePaths] }),
    shikiConfig: { theme: 'github-light' },
  },
});
