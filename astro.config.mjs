// @ts-check
import { defineConfig } from 'astro/config';
import { rehypeImageAlt } from './src/lib/rehype-image-alt.js';

// https://astro.build/config
export default defineConfig({
	output: 'static',
	// 统一 URL 规范：页面路径统一使用尾部斜杠，减少重复 URL 风险
	trailingSlash: 'always',
	markdown: {
		rehypePlugins: [rehypeImageAlt],
	},
});
