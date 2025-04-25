import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import wenyanPre from './svelte.wenyan-preprocess.js';

const config = {
	preprocess: [
		vitePreprocess(),
		wenyanPre({ strict: true, romanizeIdentifiers: 'pinyin' })
	],
	kit: { adapter: adapter() }
};

export default config;
