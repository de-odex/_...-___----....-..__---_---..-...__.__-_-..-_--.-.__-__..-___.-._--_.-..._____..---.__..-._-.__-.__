import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wenyan from './wenyan-vite-plugin.ts'

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), wenyan({
		// Passed straight to Wenyan's compile()
		strict: true,
		romanizeIdentifiers: 'pinyin'
	})]
});
