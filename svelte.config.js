import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import wenyanPre from './svelte.wenyan-preprocess.js';

const config = {
	preprocess: [
		vitePreprocess(),
		wenyanPre({
			strict: false,
			romanizeIdentifiers: 'none',
			importPaths: [process.cwd() + "/藏書樓"]
		})
	],
	kit: {
		adapter: adapter(),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/_...-___----....-..__---_---..-...__.__-_-..-_--.-.__-__..-___.-._--_.-..._____..---.__..-._-.__-.__' : '',
		}
	}
};

export default config;
