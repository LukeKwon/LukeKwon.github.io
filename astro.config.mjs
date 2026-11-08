import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// GitHub Actions supplies the repository name; local previews use the root URL.
const repository = process.env.GITHUB_REPOSITORY;
const [owner, name] = repository?.split('/') ?? [];
const userSite = name?.toLowerCase() === `${owner?.toLowerCase()}.github.io`;
export default defineConfig({
  site: process.env.SITE_URL || (owner ? `https://${owner}.github.io` : undefined),
  base: process.env.BASE_PATH || (name && !userSite ? `/${name}` : '/'),
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }),
    shikiConfig: { theme: 'github-light' },
  },
});
